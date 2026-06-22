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

// Routes with mutation-guard applied
router.use("/trips", authForMutations, tripsRouter);
router.use("/trips/:tripId", commentsRouter); // comments POST is public (spam guard is enough)
router.use("/photos", photosRouter);
router.use("/settings", authForMutations, settingsRouter);
router.use("/contact", contactRouter);
router.use("/articles", authForMutations, articlesRouter);
router.use("/subscribe", subscribeRouter);
router.use("/unsubscribe", subscribeRouter);
router.use("/subscribers", authForMutations, subscribeRouter);

export default router;
