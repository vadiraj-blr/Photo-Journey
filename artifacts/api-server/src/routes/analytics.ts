import { Router } from "express";
import { db } from "@workspace/db";
import { sql } from "drizzle-orm";

const router = Router();

// Ensure page_views table exists (runs once at startup via module load)
async function ensureTable() {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS page_views (
      id         SERIAL PRIMARY KEY,
      trip_id    INTEGER,
      path       TEXT NOT NULL,
      seconds_on_page NUMERIC NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}
ensureTable().catch(console.error);

// POST /api/analytics/pageview  { tripId?, path, seconds }
// Public endpoint — no auth required. Called via navigator.sendBeacon.
router.post("/pageview", async (req, res) => {
  try {
    const { tripId, path, seconds } = req.body as {
      tripId?: number | null;
      path?: string;
      seconds?: number;
    };

    const safePath = typeof path === "string" ? path.slice(0, 200) : "/";
    const safeSeconds = typeof seconds === "number" && isFinite(seconds) && seconds >= 0
      ? Math.min(seconds, 3600)
      : 0;
    const safeTripId = typeof tripId === "number" && isFinite(tripId) ? tripId : null;

    await db.execute(
      sql`INSERT INTO page_views (trip_id, path, seconds_on_page)
          VALUES (${safeTripId}, ${safePath}, ${safeSeconds})`
    );

    res.status(204).end();
  } catch (err) {
    console.error("Analytics error:", err);
    res.status(204).end(); // always 204 — never break the client
  }
});

export default router;
