import { Router, type IRouter } from "express";
import healthRouter from "./health";
import tripsRouter from "./trips";
import photosRouter from "./photos";
import settingsRouter from "./settings";
import commentsRouter from "./comments";
import contactRouter from "./contact";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/trips", tripsRouter);
router.use("/trips/:tripId", commentsRouter);
router.use("/photos", photosRouter);
router.use("/settings", settingsRouter);
router.use("/contact", contactRouter);

export default router;
