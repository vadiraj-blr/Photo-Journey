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

export default router;
