import { Router } from "express";
import nodemailer from "nodemailer";
import { db } from "@workspace/db";
import { sql } from "drizzle-orm";

const router = Router();

// ── In-memory rate limiter ─────────────────────────────────────────────────
// Allows MAX_SUBMISSIONS per WINDOW_MS per IP address.
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_SUBMISSIONS = 3;

interface RateEntry { count: number; windowStart: number }
const rateLimitMap = new Map<string, RateEntry>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now - entry.windowStart > WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, windowStart: now });
    return false;
  }

  if (entry.count >= MAX_SUBMISSIONS) {
    return true;
  }

  entry.count += 1;
  return false;
}

// Periodically evict stale entries to avoid memory growth
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap) {
    if (now - entry.windowStart > WINDOW_MS) rateLimitMap.delete(key);
  }
}, WINDOW_MS);

async function getContactEmail(): Promise<string> {
  const result = await db.execute(
    sql`SELECT contact_email FROM landing_settings WHERE id = 1`
  );
  const r = result.rows[0] as Record<string, unknown> | undefined;
  return (r?.contact_email as string) ?? "";
}

async function sendEmail(to: string, fromName: string, fromEmail: string, subject: string, message: string) {
  const user = process.env["GMAIL_USER"];
  const pass = process.env["GMAIL_APP_PASSWORD"];

  if (!user || !pass) {
    console.warn("Email credentials not set — skipping send (GMAIL_USER / GMAIL_APP_PASSWORD)");
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  await transporter.sendMail({
    from: `"Wildpixels Contact" <${user}>`,
    to,
    replyTo: `"${fromName}" <${fromEmail}>`,
    subject: `[Wildpixels] ${subject || "New message from " + fromName}`,
    text: `Name: ${fromName}\nEmail: ${fromEmail}\n\n${message}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; color: #1a1a1a;">
        <div style="background:#0d0d0d; padding: 24px 32px; border-bottom: 2px solid #f59e0b;">
          <span style="font-size:20px; font-weight:700; color:#f5f5f4; letter-spacing:-0.5px;">Wildpixels</span>
          <span style="font-size:11px; color:#a8a29e; margin-left:12px; text-transform:uppercase; letter-spacing:2px;">Contact Form</span>
        </div>
        <div style="padding: 32px;">
          <table style="width:100%; margin-bottom:20px; border-collapse:collapse;">
            <tr><td style="padding:6px 0; color:#78716c; font-size:12px; text-transform:uppercase; letter-spacing:1px; width:80px;">From</td><td style="padding:6px 0; font-weight:600;">${fromName}</td></tr>
            <tr><td style="padding:6px 0; color:#78716c; font-size:12px; text-transform:uppercase; letter-spacing:1px;">Email</td><td style="padding:6px 0;"><a href="mailto:${fromEmail}" style="color:#f59e0b;">${fromEmail}</a></td></tr>
            ${subject ? `<tr><td style="padding:6px 0; color:#78716c; font-size:12px; text-transform:uppercase; letter-spacing:1px;">Subject</td><td style="padding:6px 0;">${subject}</td></tr>` : ""}
          </table>
          <div style="background:#f5f5f4; border-radius:8px; padding:20px; white-space:pre-wrap; font-size:15px; line-height:1.7; color:#292524;">${message}</div>
          <p style="margin-top:24px; font-size:12px; color:#a8a29e;">Reply directly to this email to respond to ${fromName}.</p>
        </div>
      </div>
    `,
  });
}

router.post("/", async (req, res) => {
  try {
    const ip = req.ip ?? req.socket.remoteAddress ?? "unknown";
    if (isRateLimited(ip)) {
      return res.status(429).json({ error: "Too many submissions. Please wait before trying again." });
    }

    const { name, email, subject, message } = req.body as Record<string, string>;

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return res.status(400).json({ error: "Name, email, and message are required." });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({ error: "Please enter a valid email address." });
    }
    if (message.trim().length > 2000) {
      return res.status(400).json({ error: "Message is too long (max 2000 chars)." });
    }

    // Save to DB
    await db.execute(
      sql`INSERT INTO contact_submissions (name, email, subject, message) VALUES (${name.trim()}, ${email.trim()}, ${(subject ?? "").trim()}, ${message.trim()})`
    );

    // Try to send email
    const to = process.env["CONTACT_TO_EMAIL"] || await getContactEmail();
    if (to) {
      await sendEmail(to, name.trim(), email.trim(), (subject ?? "").trim(), message.trim());
    }

    res.json({ ok: true });
  } catch (err) {
    console.error("Contact form error:", err);
    res.status(500).json({ error: "Failed to send message. Please try again." });
  }
});

export default router;
