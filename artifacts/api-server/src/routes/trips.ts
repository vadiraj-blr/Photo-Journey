import { Router } from "express";
import { db, tripsTable, photosTable } from "@workspace/db";
import { eq, ne } from "drizzle-orm";
import { notifySubscribers } from "../lib/notify";

const router = Router();

async function getSiteUrl(): Promise<string> {
  const domain = process.env["REPLIT_DEV_DOMAIN"];
  return domain ? `https://${domain}` : "https://wildpixels.replit.app";
}

function parseTrip(trip: typeof tripsTable.$inferSelect) {
  return {
    id: trip.id,
    title: trip.title,
    location: trip.location,
    country: trip.country,
    month: trip.month,
    year: trip.year,
    story: trip.story ?? null,
    storySummary: (trip as typeof trip & { storySummary?: string | null }).storySummary ?? null,
    travelTips: (trip as typeof trip & { travelTips?: string | null }).travelTips ?? null,
    coverImageUrl: trip.coverImageUrl,
    focalX: trip.focalX ?? 0.5,
    focalY: trip.focalY ?? 0.5,
    photoCount: trip.photoCount,
    tags: JSON.parse(trip.tags || "[]"),
    featured: trip.featured,
    googlePhotosUrl: trip.googlePhotosUrl ?? null,
    galleryPhotoUrls: (() => {
      const raw = JSON.parse(trip.galleryPhotoUrls || "[]") as unknown[];
      return raw.map((item) =>
        typeof item === "string" ? { url: item, caption: "" } : { url: (item as { url: string }).url, caption: (item as { caption?: string }).caption ?? "" }
      ) as { url: string; caption: string }[];
    })(),
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

  const dbPhotosByTrip = new Map<number, number>();
  for (const p of dbPhotos) {
    dbPhotosByTrip.set(p.tripId, (dbPhotosByTrip.get(p.tripId) ?? 0) + 1);
  }

  let photoCount = 0;
  for (const trip of trips) {
    const t = trip as typeof trip & { cachedGooglePhotoUrls?: string };
    const cached: string[] = (() => { try { return JSON.parse(t.cachedGooglePhotoUrls ?? "[]"); } catch { return []; } })();
    const rawPinned = (() => { try { return JSON.parse(trip.galleryPhotoUrls ?? "[]") as unknown[]; } catch { return [] as unknown[]; } })();
    const pinned: string[] = rawPinned.map((item) => typeof item === "string" ? item : (item as { url: string }).url);
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
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const [trip] = await db.select().from(tripsTable).where(eq(tripsTable.id, id));
  if (!trip) { res.status(404).json({ error: "Not found" }); return; }
  if (!trip.googlePhotosUrl) { res.json({ photos: [] }); return; }

  const forceRefresh = req.query.refresh === "true";
  if (forceRefresh) {
    await db
      .update(tripsTable)
      .set({ cachedGooglePhotoUrls: "[]" } as Partial<typeof tripsTable.$inferInsert>)
      .where(eq(tripsTable.id, id));
  }

  const getCached = (): string[] => {
    if (forceRefresh) return [];
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
      const cached = getCached();
      console.warn(`Google Photos returned ${resp.status} for trip ${id}; serving ${cached.length} cached photos`);
      res.json({ photos: cached, albumUrl: trip.googlePhotosUrl, fromCache: true });
      return;
    }

    const html = await resp.text();
    const urlPattern = /https:\/\/lh3\.googleusercontent\.com\/pw\/[A-Za-z0-9_\-/]*/g;
    const rawMatches = html.match(urlPattern) ?? [];

    const seen = new Set<string>();
    const photos: string[] = [];
    for (const url of rawMatches) {
      if (seen.has(url)) continue;
      seen.add(url);
      photos.push(`${url}=w1200`);
    }

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
    res.json({ photos: cached, albumUrl: trip.googlePhotosUrl, fromCache: true });
    return;
  }
});

router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const [trip] = await db.select().from(tripsTable).where(eq(tripsTable.id, id));
  if (!trip) { res.status(404).json({ error: "Not found" }); return; }

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
  const { title, location, country, month, year, story, storySummary, coverImageUrl, tags, featured, googlePhotosUrl } = req.body;
  if (!title || !location || !country || !month || !year) {
    res.status(400).json({ error: "title, location, country, month and year are required" });
    return;
  }
  // Enforce single-featured: clear all others before inserting a featured trip
  if (featured) {
    await db.update(tripsTable).set({ featured: false });
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
    } as typeof tripsTable.$inferInsert)
    .returning();

  // Save storySummary if provided (raw SQL since it may not be in drizzle schema yet)
  if (storySummary?.trim()) {
    const { sql } = await import("drizzle-orm");
    await db.execute(sql`UPDATE trips SET story_summary = ${storySummary.trim()} WHERE id = ${created.id}`);
  }

  res.status(201).json({ ...parseTrip(created), storySummary: storySummary?.trim() ?? null });

  getSiteUrl().then((siteUrl) => {
    notifySubscribers("trip", {
      title: created.title,
      url: `${siteUrl}/trips/${created.id}`,
      excerpt: created.story?.slice(0, 200) || undefined,
      coverImageUrl: created.coverImageUrl || undefined,
    });
  }).catch(console.error);
});

router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(photosTable).where(eq(photosTable.tripId, id));
  const [deleted] = await db.delete(tripsTable).where(eq(tripsTable.id, id)).returning();
  if (!deleted) { res.status(404).json({ error: "Not found" }); return; }
  res.json({ success: true });
});

router.patch("/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const { sql } = await import("drizzle-orm");

  // Handle storySummary separately via raw SQL (column may not be in drizzle schema)
  if ("storySummary" in req.body) {
    const val = req.body.storySummary ?? null;
    await db.execute(sql`UPDATE trips SET story_summary = ${val} WHERE id = ${id}`);
  }

  // Handle focalX/focalY via raw SQL
  if ("focalX" in req.body) {
    const val = parseFloat(req.body.focalX);
    if (!isNaN(val)) await db.execute(sql`UPDATE trips SET focal_x = ${val} WHERE id = ${id}`);
  }
  if ("focalY" in req.body) {
    const val = parseFloat(req.body.focalY);
    if (!isNaN(val)) await db.execute(sql`UPDATE trips SET focal_y = ${val} WHERE id = ${id}`);
  }

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

  // Enforce single-featured: if this trip is being set to featured, clear all others first
  if (updates.featured === true) {
    await db.update(tripsTable).set({ featured: false }).where(ne(tripsTable.id, id));
  }

  if (Object.keys(updates).length > 0) {
    await db
      .update(tripsTable)
      .set(updates as Parameters<typeof db.update>[0] extends { set: (v: infer V) => unknown } ? V : never)
      .where(eq(tripsTable.id, id));
  }

  // Re-fetch with storySummary
  const [updated] = await db.select().from(tripsTable).where(eq(tripsTable.id, id));
  if (!updated) { res.status(404).json({ error: "Not found" }); return; }

  const summaryResult = await db.execute(sql`SELECT story_summary FROM trips WHERE id = ${id}`);
  const storySummary = (summaryResult.rows[0] as Record<string, unknown>)?.story_summary as string | null ?? null;

  res.json({ ...parseTrip(updated), storySummary });
});

export default router;
