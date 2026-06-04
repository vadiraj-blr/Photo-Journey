import { Router, type IRouter } from "express";
import healthRouter from "./health";
import tripsRouter from "./trips";
import photosRouter from "./photos";
import settingsRouter from "./settings";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/trips", tripsRouter);
router.use("/photos", photosRouter);
router.use("/settings", settingsRouter);

export default router;
