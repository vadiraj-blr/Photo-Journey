import { Router } from "express";
import { db } from "@workspace/db";
import { sql } from "drizzle-orm";
import { notifySubscribers } from "../lib/notify";

const router = Router();

function toSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

async function getSiteUrl(): Promise<string> {
  const domain = process.env["REPLIT_DEV_DOMAIN"];
  return domain ? `https://${domain}` : "https://thewildpixels.com";
}

function isAdminSession(req: import("express").Request): boolean {
  return req.signedCookies?.["admin_session"] === "authenticated";
}

// GET /api/articles — list articles; authenticated admins see all, public sees published only
router.get("/", async (req, res) => {
  try {
    const admin = isAdminSession(req);
    const result = await db.execute(
      admin
        ? sql`SELECT id, title, slug, excerpt, cover_image_url, published, created_at, updated_at FROM articles ORDER BY created_at DESC`
        : sql`SELECT id, title, slug, excerpt, cover_image_url, published, created_at, updated_at FROM articles WHERE published = true ORDER BY created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch articles" });
  }
});

// GET /api/articles/:slug — single article by slug; drafts are 404 for unauthenticated callers
router.get("/:slug", async (req, res) => {
  try {
    const admin = isAdminSession(req);
    const result = await db.execute(
      sql`SELECT id, title, slug, excerpt, body, cover_image_url, published, created_at, updated_at FROM articles WHERE slug = ${req.params.slug}`
    );
    const row = result.rows[0] as Record<string, unknown> | undefined;
    if (!row) { res.status(404).json({ error: "Not found" }); return; }
    if (!admin && !row.published) { res.status(404).json({ error: "Not found" }); return; }
    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch article" });
  }
});

// POST /api/articles — create
router.post("/", async (req, res) => {
  try {
    const { title, excerpt, body, coverImageUrl, published } = req.body as Record<string, unknown>;
    if (!title || typeof title !== "string" || !title.trim()) {
      res.status(400).json({ error: "Title is required." });
      return;
    }
    const rawSlug = toSlug(title.trim());
    const existing = await db.execute(
      sql`SELECT slug FROM articles WHERE slug LIKE ${rawSlug + "%"} ORDER BY created_at DESC`
    );
    let slug = rawSlug;
    if (existing.rows.length > 0) {
      slug = `${rawSlug}-${Date.now()}`;
    }

    const isPublished = !!(published);
    const result = await db.execute(
      sql`INSERT INTO articles (title, slug, excerpt, body, cover_image_url, published)
          VALUES (${title.trim()}, ${slug}, ${(excerpt as string)?.trim() ?? ""}, ${(body as string) ?? ""}, ${(coverImageUrl as string)?.trim() ?? ""}, ${isPublished})
          RETURNING *`
    );
    const article = result.rows[0] as Record<string, unknown>;
    res.status(201).json(article);

    // Notify subscribers if published immediately on creation
    if (isPublished) {
      const siteUrl = await getSiteUrl();
      notifySubscribers("article", {
        title: title.trim(),
        url: `${siteUrl}/field-notes/${slug}`,
        excerpt: (excerpt as string)?.trim() ?? undefined,
        coverImageUrl: (coverImageUrl as string)?.trim() || undefined,
      }).catch(console.error);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create article" });
  }
});

// PATCH /api/articles/:id — update
router.patch("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
    const body = req.body as Record<string, unknown>;

    // Fetch current state before update (for publish-flip detection)
    const before = await db.execute(sql`SELECT published, title, slug, excerpt, cover_image_url FROM articles WHERE id = ${id}`);
    const current = before.rows[0] as Record<string, unknown> | undefined;

    if ("title" in body && typeof body.title === "string") {
      await db.execute(sql`UPDATE articles SET title = ${body.title.trim()}, updated_at = now() WHERE id = ${id}`);
    }
    if ("slug" in body && typeof body.slug === "string") {
      await db.execute(sql`UPDATE articles SET slug = ${body.slug.trim()}, updated_at = now() WHERE id = ${id}`);
    }
    if ("excerpt" in body) {
      await db.execute(sql`UPDATE articles SET excerpt = ${(body.excerpt as string)?.trim() ?? ""}, updated_at = now() WHERE id = ${id}`);
    }
    if ("body" in body) {
      await db.execute(sql`UPDATE articles SET body = ${(body.body as string) ?? ""}, updated_at = now() WHERE id = ${id}`);
    }
    if ("coverImageUrl" in body) {
      await db.execute(sql`UPDATE articles SET cover_image_url = ${(body.coverImageUrl as string)?.trim() ?? ""}, updated_at = now() WHERE id = ${id}`);
    }
    if ("published" in body) {
      await db.execute(sql`UPDATE articles SET published = ${!!(body.published)}, updated_at = now() WHERE id = ${id}`);
    }

    const result = await db.execute(sql`SELECT * FROM articles WHERE id = ${id}`);
    const updated = result.rows[0] as Record<string, unknown>;
    res.json(updated);

    // Notify subscribers when article flips from draft → published
    const wasPublished = !!(current?.published);
    const nowPublished = "published" in body ? !!(body.published) : wasPublished;
    if (!wasPublished && nowPublished && current) {
      const siteUrl = await getSiteUrl();
      const title = (("title" in body && typeof body.title === "string") ? body.title.trim() : current.title) as string;
      const slug = (("slug" in body && typeof body.slug === "string") ? body.slug.trim() : current.slug) as string;
      const excerpt = (("excerpt" in body ? body.excerpt : current.excerpt) as string) ?? "";
      const cover = (("coverImageUrl" in body ? body.coverImageUrl : current.cover_image_url) as string) ?? "";
      notifySubscribers("article", {
        title,
        url: `${siteUrl}/field-notes/${slug}`,
        excerpt: excerpt || undefined,
        coverImageUrl: cover || undefined,
      }).catch(console.error);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update article" });
  }
});

// DELETE /api/articles/:id
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
    await db.execute(sql`DELETE FROM articles WHERE id = ${id}`);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete article" });
  }
});

export default router;
