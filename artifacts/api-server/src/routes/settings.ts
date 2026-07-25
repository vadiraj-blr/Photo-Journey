import { Router } from "express";
import { db } from "@workspace/db";
import { sql } from "drizzle-orm";

const router = Router();

async function getSettings() {
  const result = await db.execute(
    sql`SELECT hero_image_url, hero_image_source_trip_id, trips_on_homepage, hero_tagline, hero_album_url, highlight_album_url, highlight_photo_urls, about_title, about_portrait_url, about_bio, about_album_url, about_photo_height, contact_email, contact_phone, contact_location, contact_instagram, contact_facebook FROM landing_settings WHERE id = 1`
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
    aboutPhotoHeight: (r?.about_photo_height as number) ?? 480,
    contactEmail: (r?.contact_email as string) ?? "",
    contactPhone: (r?.contact_phone as string) ?? "",
    contactLocation: (r?.contact_location as string) ?? "",
    contactInstagram: (r?.contact_instagram as string) ?? "",
    contactFacebook: (r?.contact_facebook as string) ?? "",
  };
}

// Only allow Google Photos-specific origins. Generic redirector domains
// (goo.gl) are excluded because they forward to arbitrary destinations.
const ALLOWED_ALBUM_HOSTNAMES = new Set([
  "photos.google.com",
  "photos.app.goo.gl",
]);

const FETCH_TIMEOUT_MS = 10_000;
const MAX_RESPONSE_BYTES = 5 * 1024 * 1024; // 5 MB
const MAX_REDIRECTS = 5;

function validateAlbumUrl(raw: string): URL {
  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    throw new Error("Invalid album URL");
  }
  if (parsed.protocol !== "https:") {
    throw new Error("Album URL must use HTTPS");
  }
  if (!ALLOWED_ALBUM_HOSTNAMES.has(parsed.hostname)) {
    throw new Error(`Album URL hostname not allowed: ${parsed.hostname}`);
  }
  return parsed;
}

async function fetchPhotosFromUrl(albumUrl: string): Promise<string[]> {
  const controller = new AbortController();
  // The timer stays active through the entire operation (redirects + body
  // reading) so a slow-drip response cannot keep a worker occupied indefinitely.
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    let resp: Response;
    let currentUrl = albumUrl;
    let redirectsFollowed = 0;

    while (true) {
      // eslint-disable-next-line no-await-in-loop
      resp = await fetch(currentUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml",
        },
        redirect: "manual",
        signal: controller.signal,
      });

      if (resp.status >= 300 && resp.status < 400) {
        if (redirectsFollowed >= MAX_REDIRECTS) {
          throw new Error("Too many redirects");
        }
        const location = resp.headers.get("location");
        if (!location) throw new Error("Redirect response missing Location header");
        // Resolve relative redirects and re-validate the destination host
        const nextUrl = new URL(location, currentUrl);
        validateAlbumUrl(nextUrl.toString()); // throws if destination is not allowed
        currentUrl = nextUrl.toString();
        redirectsFollowed++;
        continue;
      }

      break;
    }

    if (!resp.ok) throw new Error(`Fetch returned ${resp.status}`);
    const reader = resp.body?.getReader();
    if (!reader) throw new Error("No response body");
    const chunks: Uint8Array[] = [];
    let totalBytes = 0;
    while (true) {
      // eslint-disable-next-line no-await-in-loop
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.byteLength;
      if (totalBytes > MAX_RESPONSE_BYTES) {
        await reader.cancel();
        throw new Error("Album response exceeded size limit");
      }
      chunks.push(value);
    }
    const html = new TextDecoder().decode(
      chunks.reduce((acc, c) => {
        const merged = new Uint8Array(acc.byteLength + c.byteLength);
        merged.set(acc);
        merged.set(c, acc.byteLength);
        return merged;
      }, new Uint8Array(0))
    );
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
  } finally {
    clearTimeout(timer);
  }
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
    if (!settings.heroAlbumUrl) { res.json({ photos: [] }); return; }
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
    if (!settings.highlightAlbumUrl) { res.json({ photos: [] }); return; }
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
    const raw = (req.query.url as string)?.trim();
    if (!raw) { res.json({ photos: [] }); return; }
    let validated: URL;
    try {
      validated = validateAlbumUrl(raw);
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
      return;
    }
    const photos = await fetchPhotosFromUrl(validated.toString());
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
    if ("aboutPhotoHeight" in body) {
      const v = parseInt(body.aboutPhotoHeight as string, 10) || 480;
      await db.execute(sql`UPDATE landing_settings SET about_photo_height = ${v} WHERE id = 1`);
    }
    if ("contactEmail" in body) {
      await db.execute(sql`UPDATE landing_settings SET contact_email = ${(body.contactEmail as string)?.trim() || ""} WHERE id = 1`);
    }
    if ("contactPhone" in body) {
      await db.execute(sql`UPDATE landing_settings SET contact_phone = ${(body.contactPhone as string)?.trim() || ""} WHERE id = 1`);
    }
    if ("contactLocation" in body) {
      await db.execute(sql`UPDATE landing_settings SET contact_location = ${(body.contactLocation as string)?.trim() || ""} WHERE id = 1`);
    }
    if ("contactInstagram" in body) {
      await db.execute(sql`UPDATE landing_settings SET contact_instagram = ${(body.contactInstagram as string)?.trim() || ""} WHERE id = 1`);
    }
    if ("contactFacebook" in body) {
      await db.execute(sql`UPDATE landing_settings SET contact_facebook = ${(body.contactFacebook as string)?.trim() || ""} WHERE id = 1`);
    }

    res.json(await getSettings());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update settings" });
  }
});

export default router;
