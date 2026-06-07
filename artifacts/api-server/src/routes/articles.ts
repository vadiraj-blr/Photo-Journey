import { Router } from "express";
import { db } from "@workspace/db";
import { sql } from "drizzle-orm";

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

// GET /api/articles — list published articles (public)
router.get("/", async (_req, res) => {
  try {
    const result = await db.execute(
      sql`SELECT id, title, slug, excerpt, cover_image_url, published, created_at, updated_at FROM articles ORDER BY created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch articles" });
  }
});

// GET /api/articles/:slug — single article by slug
router.get("/:slug", async (req, res) => {
  try {
    const result = await db.execute(
      sql`SELECT id, title, slug, excerpt, body, cover_image_url, published, created_at, updated_at FROM articles WHERE slug = ${req.params.slug}`
    );
    const row = result.rows[0];
    if (!row) return res.status(404).json({ error: "Not found" });
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
      return res.status(400).json({ error: "Title is required." });
    }
    const rawSlug = toSlug(title.trim());
    // Ensure unique slug
    const existing = await db.execute(
      sql`SELECT slug FROM articles WHERE slug LIKE ${rawSlug + "%"} ORDER BY created_at DESC`
    );
    let slug = rawSlug;
    if (existing.rows.length > 0) {
      slug = `${rawSlug}-${Date.now()}`;
    }

    const result = await db.execute(
      sql`INSERT INTO articles (title, slug, excerpt, body, cover_image_url, published)
          VALUES (${title.trim()}, ${slug}, ${(excerpt as string)?.trim() ?? ""}, ${(body as string) ?? ""}, ${(coverImageUrl as string)?.trim() ?? ""}, ${!!(published)})
          RETURNING *`
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create article" });
  }
});

// PATCH /api/articles/:id — update
router.patch("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });
    const body = req.body as Record<string, unknown>;

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
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update article" });
  }
});

// DELETE /api/articles/:id
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });
    await db.execute(sql`DELETE FROM articles WHERE id = ${id}`);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete article" });
  }
});

export default router;
