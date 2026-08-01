// Vercel serverless entry — wraps the Express app.
// All /api/* requests are rewritten here (see vercel.json); Express receives
// the original URL, so its existing app.use("/api", router) mounting works.
import app from "../artifacts/api-server/src/app";

export default app;
