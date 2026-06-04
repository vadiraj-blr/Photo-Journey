import { Router } from "express";
import { db, tripsTable, photosTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

function parseTrip(trip: typeof tripsTable.$inferSelect) {
  return {
    id: trip.id,
    title: trip.title,
    location: trip.location,
    country: trip.country,
    month: trip.month,
    year: trip.year,
    story: trip.story ?? null,
    coverImageUrl: trip.coverImageUrl,
    photoCount: trip.photoCount,
    tags: JSON.parse(trip.tags || "[]"),
    featured: trip.featured,
    googlePhotosUrl: trip.googlePhotosUrl ?? null,
  };
}

router.get("/", async (_req, res) => {
  const trips = await db.select().from(tripsTable).orderBy(tripsTable.year, tripsTable.id);
  res.json(trips.map(parseTrip));
});

router.get("/featured", async (_req, res) => {
  const trips = await db.select().from(tripsTable).where(eq(tripsTable.featured, true));
  res.json(trips.map(parseTrip));
});

router.get("/stats", async (_req, res) => {
  const trips = await db.select().from(tripsTable);
  const photos = await db.select().from(photosTable);
  const countries = new Set(trips.map((t) => t.country));
  res.json({
    tripCount: trips.length,
    countryCount: countries.size,
    photoCount: photos.length,
  });
});

router.get("/:id/google-photos", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

  const [trip] = await db.select().from(tripsTable).where(eq(tripsTable.id, id));
  if (!trip) return res.status(404).json({ error: "Not found" });
  if (!trip.googlePhotosUrl) return res.json({ photos: [] });

  try {
    const resp = await fetch(trip.googlePhotosUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
    });

    if (!resp.ok) {
      return res.status(502).json({ error: `Google Photos returned ${resp.status}` });
    }

    const html = await resp.text();

    // Extract /pw/ photo URLs — these are actual album photos (not icons/avatars)
    // Must include / in character class to capture the full /pw/<hash> path
    const urlPattern = /https:\/\/lh3\.googleusercontent\.com\/pw\/[A-Za-z0-9_\-/]*/g;
    const rawMatches = html.match(urlPattern) ?? [];

    // Deduplicate
    const seen = new Set<string>();
    const photos: string[] = [];
    for (const url of rawMatches) {
      if (seen.has(url)) continue;
      seen.add(url);
      // Request a consistent 1200px wide version
      photos.push(`${url}=w1200`);
      if (photos.length >= 15) break;
    }

    res.json({ photos, albumUrl: trip.googlePhotosUrl });
  } catch (err) {
    console.error("Google Photos fetch error:", err);
    res.status(502).json({ error: "Failed to fetch Google Photos album" });
  }
});

router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

  const [trip] = await db.select().from(tripsTable).where(eq(tripsTable.id, id));
  if (!trip) return res.status(404).json({ error: "Not found" });

  const photos = await db.select().from(photosTable).where(eq(photosTable.tripId, id));

  res.json({
    ...parseTrip(trip),
    story: trip.story ?? "",
    photos: photos.map((p) => ({
      id: p.id,
      tripId: p.tripId,
      imageUrl: p.imageUrl,
      caption: p.caption ?? null,
      isHighlight: p.isHighlight,
    })),
  });
});

router.patch("/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

  const allowed = ["title", "location", "country", "month", "year", "story", "coverImageUrl", "featured", "tags", "googlePhotosUrl"];
  const updates: Record<string, unknown> = {};

  for (const key of allowed) {
    if (key in req.body) {
      if (key === "tags") {
        updates.tags = JSON.stringify(req.body.tags);
      } else if (key === "year") {
        updates.year = parseInt(req.body.year, 10);
      } else {
        updates[key] = req.body[key];
      }
    }
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: "No valid fields to update" });
  }

  const [updated] = await db
    .update(tripsTable)
    .set(updates as Parameters<typeof db.update>[0] extends { set: (v: infer V) => unknown } ? V : never)
    .where(eq(tripsTable.id, id))
    .returning();

  if (!updated) return res.status(404).json({ error: "Not found" });
  res.json(parseTrip(updated));
});

export default router;
