import { Router } from "express";
import { db, tripsTable, tripCommentsTable, tripReactionsTable, photosTable } from "@workspace/db";
import { sql } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";

const router = Router();

// GET /api/admin/dashboard  — auth-guarded
router.get("/", requireAuth, async (_req, res) => {
  try {
    // ── Trips ────────────────────────────────────────────────────────────────
    const trips = await db.select().from(tripsTable);
    const dbPhotos = await db.select().from(photosTable);
    const countries = new Set(trips.map((t) => t.country));

    let photoCount = 0;
    const dbPhotosByTrip = new Map<number, number>();
    for (const p of dbPhotos) {
      dbPhotosByTrip.set(p.tripId, (dbPhotosByTrip.get(p.tripId) ?? 0) + 1);
    }
    for (const trip of trips) {
      const t = trip as typeof trip & { cachedGooglePhotoUrls?: string };
      const cached: string[] = (() => { try { return JSON.parse(t.cachedGooglePhotoUrls ?? "[]"); } catch { return []; } })();
      const rawPinned = (() => { try { return JSON.parse(trip.galleryPhotoUrls ?? "[]") as unknown[]; } catch { return [] as unknown[]; } })();
      const pinned = rawPinned.map((item) => typeof item === "string" ? item : (item as { url: string }).url);
      if (cached.length > 0) photoCount += cached.length;
      else if (pinned.length > 0) photoCount += pinned.length;
      else photoCount += dbPhotosByTrip.get(trip.id) ?? 0;
    }

    // ── Subscribers ──────────────────────────────────────────────────────────
    const subResult = await db.execute(sql`SELECT COUNT(*) AS total FROM subscribers`);
    const totalSubscribers = Number((subResult.rows[0] as { total: string }).total);

    const newSubResult = await db.execute(
      sql`SELECT COUNT(*) AS total FROM subscribers WHERE created_at >= NOW() - INTERVAL '30 days'`
    ).catch(() => ({ rows: [{ total: "0" }] }));
    const newSubscribers30d = Number((newSubResult.rows[0] as { total: string }).total);

    // ── Comments ─────────────────────────────────────────────────────────────
    const commentCountResult = await db.execute(sql`SELECT COUNT(*) AS total FROM trip_comments`);
    const totalComments = Number((commentCountResult.rows[0] as { total: string }).total);

    const recentCommentsResult = await db.execute(
      sql`SELECT c.id, c.name, c.body, c.created_at, c.trip_id, t.title AS trip_title
          FROM trip_comments c
          LEFT JOIN trips t ON t.id = c.trip_id
          ORDER BY c.created_at DESC
          LIMIT 8`
    );
    const recentComments = recentCommentsResult.rows as {
      id: number; name: string; body: string; created_at: string; trip_id: number; trip_title: string;
    }[];

    // ── Reactions / Likes ────────────────────────────────────────────────────
    const likesResult = await db.execute(sql`SELECT COALESCE(SUM(likes), 0) AS total FROM trip_reactions`);
    const totalLikes = Number((likesResult.rows[0] as { total: string }).total);

    // ── Per-trip engagement ──────────────────────────────────────────────────
    const engagementResult = await db.execute(
      sql`SELECT
            t.id, t.title, t.location, t.country, t.month, t.year,
            COALESCE(r.likes, 0)    AS likes,
            COALESCE(r.dislikes, 0) AS dislikes,
            COUNT(c.id)             AS comments
          FROM trips t
          LEFT JOIN trip_reactions r ON r.trip_id = t.id
          LEFT JOIN trip_comments  c ON c.trip_id = t.id
          GROUP BY t.id, t.title, t.location, t.country, t.month, t.year, r.likes, r.dislikes
          ORDER BY (COALESCE(r.likes, 0) + COUNT(c.id)) DESC`
    );
    const perTripEngagement = (engagementResult.rows as {
      id: number; title: string; location: string; country: string;
      month: string; year: number; likes: string; dislikes: string; comments: string;
    }[]).map((r) => ({
      id: r.id,
      title: r.title,
      location: r.location,
      country: r.country,
      month: r.month,
      year: r.year,
      likes: Number(r.likes),
      dislikes: Number(r.dislikes),
      comments: Number(r.comments),
      engagement: Number(r.likes) + Number(r.comments),
    }));

    // ── Page views / time on page ────────────────────────────────────────────
    const pageViewStats = await db.execute(
      sql`SELECT
            pv.trip_id,
            t.title AS trip_title,
            COUNT(*)                                AS view_count,
            ROUND(AVG(pv.seconds_on_page)::numeric, 0) AS avg_seconds
          FROM page_views pv
          LEFT JOIN trips t ON t.id = pv.trip_id
          WHERE pv.trip_id IS NOT NULL
          GROUP BY pv.trip_id, t.title
          ORDER BY view_count DESC`
    ).catch(() => ({ rows: [] }));

    const totalPageViews = await db.execute(
      sql`SELECT COUNT(*) AS total FROM page_views`
    ).catch(() => ({ rows: [{ total: "0" }] }));

    res.json({
      totalTrips: trips.length,
      totalPhotos: photoCount,
      totalCountries: countries.size,
      totalSubscribers,
      newSubscribers30d,
      totalComments,
      totalLikes,
      recentComments,
      perTripEngagement,
      pageViewStats: pageViewStats.rows,
      totalPageViews: Number((totalPageViews.rows[0] as { total: string }).total),
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ error: "Failed to load dashboard data" });
  }
});

export default router;
