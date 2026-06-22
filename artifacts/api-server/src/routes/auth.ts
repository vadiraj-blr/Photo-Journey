import { Router } from "express";

const router = Router();

router.post("/login", (req, res) => {
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
