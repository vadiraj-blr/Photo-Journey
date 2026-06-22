import type { Request, Response, NextFunction } from "express";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const session = req.signedCookies?.["admin_session"];
  if (session === "authenticated") {
    return next();
  }
  res.status(401).json({ error: "Unauthorized. Please log in." });
}
