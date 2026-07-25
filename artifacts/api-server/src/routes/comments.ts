import { Router } from "express";
import { db, tripCommentsTable, tripReactionsTable } from "@workspace/db";
import { eq, desc, sql } from "drizzle-orm";
import { moderateText, moderateName } from "../lib/moderation";

const router = Router({ mergeParams: true });

// ── In-memory rate limiter ─────────────────────────────────────────────────
// Allows MAX_COMMENTS per WINDOW_MS per IP address.
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_COMMENTS = 5;

interface RateEntry { count: number; windowStart: number }
const rateLimitMap = new Map<string, RateEntry>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now - entry.windowStart > WINDOW_MS) {
    // New window
    rateLimitMap.set(ip, { count: 1, windowStart: now });
    return false;
  }

  if (entry.count >= MAX_COMMENTS) {
    return true;
  }

  entry.count += 1;
  return false;
}

// Periodically evict stale entries to avoid memory growth
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap) {
    if (now - entry.windowStart > WINDOW_MS) rateLimitMap.delete(key);
  }
}, WINDOW_MS);

// ── Routes ─────────────────────────────────────────────────────────────────

// GET /api/trips/:tripId/comments
router.get<{ tripId: string }>("/comments", async (req, res) => {
  const tripId = parseInt(req.params.tripId, 10);
  if (isNaN(tripId)) { res.status(400).json({ error: "Invalid tripId" }); return; }

  const comments = await db
    .select()
    .from(tripCommentsTable)
    .where(eq(tripCommentsTable.tripId, tripId))
    .orderBy(desc(tripCommentsTable.createdAt));

  res.json(comments.map(c => ({
    id: c.id,
    name: c.name,
    body: c.body,
    createdAt: c.createdAt,
  })));
});

// POST /api/trips/:tripId/comments
router.post<{ tripId: string }>("/comments", async (req, res) => {
  const tripId = parseInt(req.params.tripId, 10);
  if (isNaN(tripId)) { res.status(400).json({ error: "Invalid tripId" }); return; }

  // Rate limiting — use req.ip which Express normalises via trust proxy setting.
  // This means the Replit reverse-proxy hop is trusted and counted, but a
  // client cannot spoof the key by injecting extra X-Forwarded-For values.
  const ip = req.ip ?? req.socket.remoteAddress ?? "unknown";

  if (isRateLimited(ip)) {
    res.status(429).json({
      error: "Too many comments — please wait a few minutes before posting again.",
      type: "rate_limited",
    });
    return;
  }

  const { name, body } = req.body ?? {};

  const nameCheck = moderateName(String(name ?? ""));
  if (!nameCheck.ok) {
    res.status(422).json({ error: nameCheck.reason, type: nameCheck.type ?? "validation" });
    return;
  }

  const bodyCheck = moderateText(String(body ?? ""));
  if (!bodyCheck.ok) {
    res.status(422).json({ error: bodyCheck.reason, type: bodyCheck.type ?? "validation" });
    return;
  }

  const [created] = await db
    .insert(tripCommentsTable)
    .values({ tripId, name: name.trim(), body: body.trim() })
    .returning();

  res.status(201).json({
    id: created.id,
    name: created.name,
    body: created.body,
    createdAt: created.createdAt,
  });
});

// GET /api/trips/:tripId/reactions
router.get<{ tripId: string }>("/reactions", async (req, res) => {
  const tripId = parseInt(req.params.tripId, 10);
  if (isNaN(tripId)) { res.status(400).json({ error: "Invalid tripId" }); return; }

  const [row] = await db
    .select()
    .from(tripReactionsTable)
    .where(eq(tripReactionsTable.tripId, tripId));

  res.json({ likes: row?.likes ?? 0, dislikes: row?.dislikes ?? 0 });
});

// POST /api/trips/:tripId/reactions  { type: "like" | "dislike" | "unlike" | "undislike" }
router.post<{ tripId: string }>("/reactions", async (req, res) => {
  const tripId = parseInt(req.params.tripId, 10);
  if (isNaN(tripId)) { res.status(400).json({ error: "Invalid tripId" }); return; }

  const type = req.body?.type;
  if (!["like", "dislike", "unlike", "undislike"].includes(type)) {
    res.status(400).json({ error: "type must be like | dislike | unlike | undislike" });
    return;
  }

  const delta = type === "like"
    ? { likes: sql`likes + 1`, dislikes: sql`dislikes` }
    : type === "dislike"
    ? { likes: sql`likes`, dislikes: sql`dislikes + 1` }
    : type === "unlike"
    ? { likes: sql`GREATEST(likes - 1, 0)`, dislikes: sql`dislikes` }
    : { likes: sql`likes`, dislikes: sql`GREATEST(dislikes - 1, 0)` };

  const [row] = await db
    .insert(tripReactionsTable)
    .values({ tripId, likes: type === "like" ? 1 : 0, dislikes: type === "dislike" ? 1 : 0 })
    .onConflictDoUpdate({
      target: tripReactionsTable.tripId,
      set: delta,
    })
    .returning();

  res.json({ likes: row.likes, dislikes: row.dislikes });
});

export default router;
