import { Router } from "express";
import { db, tripCommentsTable, tripReactionsTable } from "@workspace/db";
import { eq, desc, sql } from "drizzle-orm";
import { moderateText, moderateName } from "../lib/moderation";

const router = Router({ mergeParams: true });

// GET /api/trips/:tripId/comments
router.get("/comments", async (req, res) => {
  const tripId = parseInt(req.params.tripId, 10);
  if (isNaN(tripId)) return res.status(400).json({ error: "Invalid tripId" });

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
router.post("/comments", async (req, res) => {
  const tripId = parseInt(req.params.tripId, 10);
  if (isNaN(tripId)) return res.status(400).json({ error: "Invalid tripId" });

  const { name, body } = req.body ?? {};

  const nameCheck = moderateName(String(name ?? ""));
  if (!nameCheck.ok) return res.status(422).json({ error: nameCheck.reason });

  const bodyCheck = moderateText(String(body ?? ""));
  if (!bodyCheck.ok) return res.status(422).json({ error: bodyCheck.reason });

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
router.get("/reactions", async (req, res) => {
  const tripId = parseInt(req.params.tripId, 10);
  if (isNaN(tripId)) return res.status(400).json({ error: "Invalid tripId" });

  const [row] = await db
    .select()
    .from(tripReactionsTable)
    .where(eq(tripReactionsTable.tripId, tripId));

  res.json({ likes: row?.likes ?? 0, dislikes: row?.dislikes ?? 0 });
});

// POST /api/trips/:tripId/reactions  { type: "like" | "dislike" | "unlike" | "undislike" }
router.post("/reactions", async (req, res) => {
  const tripId = parseInt(req.params.tripId, 10);
  if (isNaN(tripId)) return res.status(400).json({ error: "Invalid tripId" });

  const type = req.body?.type;
  if (!["like", "dislike", "unlike", "undislike"].includes(type)) {
    return res.status(400).json({ error: "type must be like | dislike | unlike | undislike" });
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
