import { Router } from "express";

const router = Router();

// ── In-memory rate limiter for login attempts ──────────────────────────────
// Allows MAX_ATTEMPTS per WINDOW_MS per IP before returning 429.
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;

interface RateEntry { count: number; windowStart: number }
const loginLimitMap = new Map<string, RateEntry>();

function isLoginRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = loginLimitMap.get(ip);

  if (!entry || now - entry.windowStart > WINDOW_MS) {
    loginLimitMap.set(ip, { count: 1, windowStart: now });
    return false;
  }

  if (entry.count >= MAX_ATTEMPTS) {
    return true;
  }

  entry.count += 1;
  return false;
}

// Periodically evict stale entries to avoid memory growth
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of loginLimitMap) {
    if (now - entry.windowStart > WINDOW_MS) loginLimitMap.delete(key);
  }
}, WINDOW_MS);

router.post("/login", (req, res) => {
  const ip = req.ip ?? req.socket.remoteAddress ?? "unknown";
  if (isLoginRateLimited(ip)) {
    return res.status(429).json({ error: "Too many login attempts. Please try again later." });
  }

  const { email, password } = req.body as { email?: string; password?: string };

  const adminEmail = process.env["ADMIN_EMAIL"];
  const adminPassword = process.env["ADMIN_PASSWORD"];

  if (!adminEmail || !adminPassword) {
    return res.status(503).json({ error: "Admin credentials not configured. Set ADMIN_EMAIL and ADMIN_PASSWORD secrets." });
  }

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    email.trim().toLowerCase() !== adminEmail.trim().toLowerCase() ||
    password !== adminPassword
  ) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  res.cookie("admin_session", "authenticated", {
    signed: true,
    httpOnly: true,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    secure: process.env["NODE_ENV"] === "production",
  });

  res.json({ ok: true });
});

router.post("/logout", (_req, res) => {
  res.clearCookie("admin_session", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env["NODE_ENV"] === "production",
  });
  res.json({ ok: true });
});

router.get("/me", (req, res) => {
  const session = req.signedCookies?.["admin_session"];
  if (session === "authenticated") {
    return res.json({ authenticated: true });
  }
  res.status(401).json({ authenticated: false });
});

export default router;
