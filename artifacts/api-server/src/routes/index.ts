import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import healthRouter from "./health";
import tripsRouter from "./trips";
import photosRouter from "./photos";
import settingsRouter from "./settings";
import commentsRouter from "./comments";
import contactRouter from "./contact";
import articlesRouter from "./articles";
import subscribeRouter from "./subscribe";
import authRouter from "./auth";
import slidesRouter from "./slides";
import { requireAuth } from "../middlewares/requireAuth";

const router: IRouter = Router();

// Guard that only requires auth on state-changing requests
function authForMutations(req: Request, res: Response, next: NextFunction) {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return next();
  requireAuth(req, res, next);
}

router.use(healthRouter);

// Auth routes (always public)
router.use("/auth", authRouter);

// Comments & reactions are public (spam/profanity guard handles protection)
// Must be registered BEFORE the auth-guarded trips mount so the more-specific
// path "/trips/:tripId/comments" resolves without hitting requireAuth.
router.use("/trips/:tripId", commentsRouter);

// All other trip mutations require auth
router.use("/trips", authForMutations, tripsRouter);
router.use("/photos", photosRouter);
router.use("/settings", authForMutations, settingsRouter);
router.use("/contact", contactRouter);
router.use("/articles", authForMutations, articlesRouter);
router.use("/subscribe", subscribeRouter);
router.use("/unsubscribe", subscribeRouter);
router.use("/subscribers", authForMutations, subscribeRouter);
router.use("/slides", slidesRouter);

export default router;
