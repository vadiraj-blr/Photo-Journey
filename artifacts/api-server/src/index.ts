import path from "node:path";
import fs from "node:fs";
import express from "express";
import app from "./app";
import { logger } from "./lib/logger";

const rawPort = process.env["PORT"];
if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}
const port = Number(rawPort);
if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

// --- Serve the built frontend (production) ---
const frontendDist = path.resolve(process.cwd(), "../wildpixels/dist/public");

if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));

  // SPA fallback: any GET request that isn't an API call gets index.html,
  // so page refreshes on routes like /trips/bandhavgarh work correctly.
  app.use((req, res, next) => {
    if (req.method !== "GET" || req.path.startsWith("/api")) {
      return next();
    }
    res.sendFile(path.join(frontendDist, "index.html"));
  });

  logger.info({ frontendDist }, "Serving frontend from dist");
} else {
  logger.warn({ frontendDist }, "Frontend dist not found; API-only mode");
}
// ---------------------------------------------

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }
  logger.info({ port }, "Server listening");
});