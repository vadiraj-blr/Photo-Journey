import { Router } from "express";
import { db, photosTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  const tripIdParam = req.query.tripId;
  if (tripIdParam) {
    const tripId = parseInt(String(tripIdParam), 10);
    if (isNaN(tripId)) return res.status(400).json({ error: "Invalid tripId" });
    const photos = await db.select().from(photosTable).where(eq(photosTable.tripId, tripId));
    return res.json(
      photos.map((p) => ({
        id: p.id,
        tripId: p.tripId,
        imageUrl: p.imageUrl,
        caption: p.caption ?? null,
        isHighlight: p.isHighlight,
      }))
    );
  }
  const photos = await db.select().from(photosTable);
  res.json(
    photos.map((p) => ({
      id: p.id,
      tripId: p.tripId,
      imageUrl: p.imageUrl,
      caption: p.caption ?? null,
      isHighlight: p.isHighlight,
    }))
  );
});

router.get("/highlights", async (_req, res) => {
  const photos = await db
    .select()
    .from(photosTable)
    .where(eq(photosTable.isHighlight, true));
  res.json(
    photos.map((p) => ({
      id: p.id,
      tripId: p.tripId,
      imageUrl: p.imageUrl,
      caption: p.caption ?? null,
      isHighlight: p.isHighlight,
    }))
  );
});

export default router;
