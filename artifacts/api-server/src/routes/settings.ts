import { Router } from "express";
import { db } from "@workspace/db";
import { sql } from "drizzle-orm";

const router = Router();

async function getSettings() {
  const result = await db.execute(
    sql`SELECT hero_image_url, hero_image_source_trip_id, trips_on_homepage, hero_tagline, hero_album_url, highlight_album_url, highlight_photo_urls, about_title, about_portrait_url, about_bio, about_album_url FROM landing_settings WHERE id = 1`
  );
  const r = result.rows[0] as Record<string, unknown> | undefined;
  return {
    heroImageUrl: (r?.hero_image_url as string) ?? "",
    heroImageSourceTripId: (r?.hero_image_source_trip_id as number | null) ?? null,
    tripsOnHomepage: (r?.trips_on_homepage as number) ?? 0,
    heroTagline: (r?.hero_tagline as string) ?? "Enter the Wild.",
    heroAlbumUrl: (r?.hero_album_url as string | null) ?? null,
    highlightAlbumUrl: (r?.highlight_album_url as string | null) ?? null,
    highlightPhotoUrls: JSON.parse((r?.highlight_photo_urls as string) || "[]") as string[],
    aboutTitle: (r?.about_title as string) ?? "The Lens.",
    aboutPortraitUrl: (r?.about_portrait_url as string) ?? "/images/about-portrait.png",
    aboutBio: (r?.about_bio as string) ?? "",
    aboutAlbumUrl: (r?.about_album_url as string) ?? "",
  };
}

async function fetchPhotosFromUrl(albumUrl: string): Promise<string[]> {
  const resp = await fetch(albumUrl, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml",
    },
    redirect: "follow",
  });
  if (!resp.ok) throw new Error(`Fetch returned ${resp.status}`);
  const html = await resp.text();
  const urlPattern = /https:\/\/lh3\.googleusercontent\.com\/pw\/[A-Za-z0-9_\-/]*/g;
  const rawMatches = html.match(urlPattern) ?? [];
  const seen = new Set<string>();
  const photos: string[] = [];
  for (const url of rawMatches) {
    if (seen.has(url)) continue;
    seen.add(url);
    photos.push(`${url}=w1920`);
  }
  return photos;
}

router.get("/", async (_req, res) => {
  try {
    res.json(await getSettings());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load settings" });
  }
});

router.get("/hero-photos", async (_req, res) => {
  try {
    const settings = await getSettings();
    if (!settings.heroAlbumUrl) return res.json({ photos: [] });
    const photos = await fetchPhotosFromUrl(settings.heroAlbumUrl);
    res.set("Cache-Control", "public, max-age=300");
    res.json({ photos });
  } catch (err) {
    console.error("Hero photos fetch error:", err);
    res.status(502).json({ error: "Failed to fetch hero album" });
  }
});

router.get("/highlight-photos", async (_req, res) => {
  try {
    const settings = await getSettings();
    if (!settings.highlightAlbumUrl) return res.json({ photos: [] });
    const photos = await fetchPhotosFromUrl(settings.highlightAlbumUrl);
    res.set("Cache-Control", "public, max-age=300");
    res.json({ photos });
  } catch (err) {
    console.error("Highlight photos fetch error:", err);
    res.status(502).json({ error: "Failed to fetch highlight album" });
  }
});

router.get("/album-photos", async (req, res) => {
  try {
    const url = (req.query.url as string)?.trim();
    if (!url) return res.json({ photos: [] });
    const photos = await fetchPhotosFromUrl(url);
    res.set("Cache-Control", "public, max-age=300");
    res.json({ photos });
  } catch (err) {
    console.error("Album photos fetch error:", err);
    res.status(502).json({ error: "Failed to fetch album" });
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
    if ("heroAlbumUrl" in body) {
      const v = (body.heroAlbumUrl as string)?.trim() || null;
      await db.execute(sql`UPDATE landing_settings SET hero_album_url = ${v} WHERE id = 1`);
    }
    if ("highlightAlbumUrl" in body) {
      const v = (body.highlightAlbumUrl as string)?.trim() || null;
      await db.execute(sql`UPDATE landing_settings SET highlight_album_url = ${v} WHERE id = 1`);
    }
    if ("highlightPhotoUrls" in body) {
      const v = JSON.stringify(body.highlightPhotoUrls ?? []);
      await db.execute(sql`UPDATE landing_settings SET highlight_photo_urls = ${v} WHERE id = 1`);
    }
    if ("aboutTitle" in body) {
      await db.execute(sql`UPDATE landing_settings SET about_title = ${body.aboutTitle as string} WHERE id = 1`);
    }
    if ("aboutPortraitUrl" in body) {
      await db.execute(sql`UPDATE landing_settings SET about_portrait_url = ${body.aboutPortraitUrl as string} WHERE id = 1`);
    }
    if ("aboutBio" in body) {
      await db.execute(sql`UPDATE landing_settings SET about_bio = ${body.aboutBio as string} WHERE id = 1`);
    }
    if ("aboutAlbumUrl" in body) {
      const v = (body.aboutAlbumUrl as string)?.trim() || "";
      await db.execute(sql`UPDATE landing_settings SET about_album_url = ${v} WHERE id = 1`);
    }

    res.json(await getSettings());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update settings" });
  }
});

export default router;
