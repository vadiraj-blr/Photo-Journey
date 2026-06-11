import { Router } from "express";
import { db } from "@workspace/db";
import { sql } from "drizzle-orm";
import crypto from "crypto";

const router = Router();

function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

// POST /api/subscribe
router.post("/", async (req, res) => {
  try {
    const { email } = req.body as Record<string, string>;

    if (!email?.trim()) {
      return res.status(400).json({ error: "Email is required." });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({ error: "Please enter a valid email address." });
    }

    const token = generateToken();

    await db.execute(
      sql`INSERT INTO subscribers (email, unsubscribe_token)
          VALUES (${email.trim().toLowerCase()}, ${token})
          ON CONFLICT (email) DO NOTHING`
    );

    res.json({ ok: true });
  } catch (err) {
    console.error("Subscribe error:", err);
    res.status(500).json({ error: "Failed to subscribe. Please try again." });
  }
});

// GET /api/unsubscribe?token=...
router.get("/unsubscribe", async (req, res) => {
  try {
    const token = req.query.token as string | undefined;

    if (!token) {
      return res.status(400).send(unsubscribePage("Invalid link", "This unsubscribe link is invalid or has already been used."));
    }

    const result = await db.execute(
      sql`DELETE FROM subscribers WHERE unsubscribe_token = ${token} RETURNING email`
    );

    if (result.rows.length === 0) {
      return res.send(unsubscribePage("Already unsubscribed", "This email address is no longer on our mailing list."));
    }

    const { email } = result.rows[0] as { email: string };
    res.send(unsubscribePage("Unsubscribed", `<strong>${email}</strong> has been removed from the Wildpixels mailing list. You won't receive any more notifications.`));
  } catch (err) {
    console.error("Unsubscribe error:", err);
    res.status(500).send(unsubscribePage("Error", "Something went wrong. Please try again."));
  }
});

// GET /api/subscribers/count — for admin info
router.get("/count", async (_req, res) => {
  try {
    const result = await db.execute(sql`SELECT COUNT(*) as count FROM subscribers`);
    const count = Number((result.rows[0] as { count: string }).count);
    res.json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed" });
  }
});

function unsubscribePage(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} — Wildpixels</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: system-ui, -apple-system, sans-serif; background: #f5f5f4; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; }
    .card { background: #fff; border-radius: 16px; padding: 48px 40px; max-width: 440px; width: 100%; text-align: center; box-shadow: 0 4px 24px rgba(0,0,0,0.07); }
    .logo { font-size: 24px; font-weight: 700; color: #1c1917; letter-spacing: -0.5px; margin-bottom: 32px; }
    .logo span { color: #d97706; }
    h1 { font-size: 22px; font-weight: 700; color: #1c1917; margin-bottom: 12px; }
    p { font-size: 15px; color: #57534e; line-height: 1.6; }
    a { display: inline-block; margin-top: 28px; color: #d97706; font-size: 14px; text-decoration: none; font-weight: 600; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">Wild<span>pixels</span></div>
    <h1>${title}</h1>
    <p>${body}</p>
    <a href="/">← Back to Wildpixels</a>
  </div>
</body>
</html>`;
}

export default router;
