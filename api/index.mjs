// Vercel serverless entry — imports the pre-bundled Express app.
   // All /api/* requests are rewritten here (see vercel.json).
   import app from "../artifacts/api-server/dist/app.mjs";
   export default app;
