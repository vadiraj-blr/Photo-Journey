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
    travelTips: (trip as typeof trip & { travelTips?: string | null }).travelTips ?? null,
    coverImageUrl: trip.coverImageUrl,
    photoCount: trip.photoCount,
    tags: JSON.parse(trip.tags || "[]"),
    featured: trip.featured,
    googlePhotosUrl: trip.googlePhotosUrl ?? null,
    galleryPhotoUrls: JSON.parse(trip.galleryPhotoUrls || "[]") as string[],
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
  const dbPhotos = await db.select().from(photosTable);
  const countries = new Set(trips.map((t) => t.country));
  const places = new Set(trips.map((t) => t.location));

  // Count photos from all sources per trip: Google cache > pinned gallery > DB photos
  const dbPhotosByTrip = new Map<number, number>();
  for (const p of dbPhotos) {
    dbPhotosByTrip.set(p.tripId, (dbPhotosByTrip.get(p.tripId) ?? 0) + 1);
  }

  let photoCount = 0;
  for (const trip of trips) {
    const t = trip as typeof trip & { cachedGooglePhotoUrls?: string };
    const cached: string[] = (() => { try { return JSON.parse(t.cachedGooglePhotoUrls ?? "[]"); } catch { return []; } })();
    const pinned: string[] = (() => { try { return JSON.parse(trip.galleryPhotoUrls ?? "[]"); } catch { return []; } })();
    if (cached.length > 0) photoCount += cached.length;
    else if (pinned.length > 0) photoCount += pinned.length;
    else photoCount += dbPhotosByTrip.get(trip.id) ?? 0;
  }

  res.json({
    tripCount: trips.length,
    countryCount: countries.size,
    placeCount: places.size,
    photoCount,
  });
});

router.get("/:id/google-photos", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

  const [trip] = await db.select().from(tripsTable).where(eq(tripsTable.id, id));
  if (!trip) return res.status(404).json({ error: "Not found" });
  if (!trip.googlePhotosUrl) return res.json({ photos: [] });

  // Helper: parse cached URLs from DB column (may not exist on old rows)
  const getCached = (): string[] => {
    try {
      const raw = (trip as typeof trip & { cachedGooglePhotoUrls?: string }).cachedGooglePhotoUrls ?? "[]";
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch { return []; }
  };

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
      // Google blocked the scrape — serve whatever we cached last time
      const cached = getCached();
      console.warn(`Google Photos returned ${resp.status} for trip ${id}; serving ${cached.length} cached photos`);
      return res.json({ photos: cached, albumUrl: trip.googlePhotosUrl, fromCache: true });
    }

    const html = await resp.text();

    // Extract /pw/ photo URLs — these are actual album photos (not icons/avatars)
    const urlPattern = /https:\/\/lh3\.googleusercontent\.com\/pw\/[A-Za-z0-9_\-/]*/g;
    const rawMatches = html.match(urlPattern) ?? [];

    // Deduplicate
    const seen = new Set<string>();
    const photos: string[] = [];
    for (const url of rawMatches) {
      if (seen.has(url)) continue;
      seen.add(url);
      photos.push(`${url}=w1200`);
    }

    // Persist to cache and sync photo_count so future scrape failures fall back to these
    if (photos.length > 0) {
      await db
        .update(tripsTable)
        .set({
          cachedGooglePhotoUrls: JSON.stringify(photos),
          photoCount: photos.length,
        } as Partial<typeof tripsTable.$inferInsert>)
        .where(eq(tripsTable.id, id));
    }

    res.json({ photos, albumUrl: trip.googlePhotosUrl });
  } catch (err) {
    console.error("Google Photos fetch error:", err);
    const cached = getCached();
    return res.json({ photos: cached, albumUrl: trip.googlePhotosUrl, fromCache: true });
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

router.post("/", async (req, res) => {
  const { title, location, country, month, year, story, coverImageUrl, tags, featured, googlePhotosUrl } = req.body;
  if (!title || !location || !country || !month || !year) {
    return res.status(400).json({ error: "title, location, country, month and year are required" });
  }
  const [created] = await db
    .insert(tripsTable)
    .values({
      title,
      location,
      country,
      month,
      year: parseInt(year, 10),
      story: story ?? null,
      coverImageUrl: coverImageUrl || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      photoCount: 0,
      tags: JSON.stringify(tags ?? []),
      featured: featured ?? false,
      googlePhotosUrl: googlePhotosUrl ?? null,
    })
    .returning();
  res.status(201).json(parseTrip(created));
});

router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });
  await db.delete(photosTable).where(eq(photosTable.tripId, id));
  const [deleted] = await db.delete(tripsTable).where(eq(tripsTable.id, id)).returning();
  if (!deleted) return res.status(404).json({ error: "Not found" });
  res.json({ success: true });
});

router.patch("/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

  const allowed = ["title", "location", "country", "month", "year", "story", "travelTips", "coverImageUrl", "featured", "tags", "googlePhotosUrl", "galleryPhotoUrls"];
  const updates: Record<string, unknown> = {};

  for (const key of allowed) {
    if (key in req.body) {
      if (key === "tags" || key === "galleryPhotoUrls") {
        updates[key === "tags" ? "tags" : "galleryPhotoUrls"] = JSON.stringify(req.body[key]);
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
