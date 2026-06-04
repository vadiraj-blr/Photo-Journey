import { Router, type IRouter } from "express";
import healthRouter from "./health";
import tripsRouter from "./trips";
import photosRouter from "./photos";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/trips", tripsRouter);
router.use("/photos", photosRouter);

export default router;
