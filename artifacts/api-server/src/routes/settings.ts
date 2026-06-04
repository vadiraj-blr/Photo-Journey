import { Router } from "express";
import { db } from "@workspace/db";
import { sql } from "drizzle-orm";

const router = Router();

async function getSettings() {
  const result = await db.execute(
    sql`SELECT hero_image_url, hero_image_source_trip_id, trips_on_homepage, hero_tagline FROM landing_settings WHERE id = 1`
  );
  const r = result.rows[0] as Record<string, unknown> | undefined;
  return {
    heroImageUrl: (r?.hero_image_url as string) ?? "",
    heroImageSourceTripId: (r?.hero_image_source_trip_id as number | null) ?? null,
    tripsOnHomepage: (r?.trips_on_homepage as number) ?? 0,
    heroTagline: (r?.hero_tagline as string) ?? "Enter the Wild.",
  };
}

router.get("/", async (_req, res) => {
  try {
    res.json(await getSettings());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load settings" });
  }
});

router.patch("/", async (req, res) => {
  try {
    const body = req.body as Record<string, unknown>;

    if ("heroImageUrl" in body) {
      await db.execute(sql`UPDATE landing_settings SET hero_image_url = ${body.heroImageUrl as string} WHERE id = 1`);
    }
    if ("heroImageSourceTripId" in body) {
      const v = body.heroImageSourceTripId ? Number(body.heroImageSourceTripId) : null;
      await db.execute(sql`UPDATE landing_settings SET hero_image_source_trip_id = ${v} WHERE id = 1`);
    }
    if ("tripsOnHomepage" in body) {
      const v = parseInt(body.tripsOnHomepage as string, 10) || 0;
      await db.execute(sql`UPDATE landing_settings SET trips_on_homepage = ${v} WHERE id = 1`);
    }
    if ("heroTagline" in body) {
      await db.execute(sql`UPDATE landing_settings SET hero_tagline = ${body.heroTagline as string} WHERE id = 1`);
    }

    res.json(await getSettings());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update settings" });
  }
});

export default router;
