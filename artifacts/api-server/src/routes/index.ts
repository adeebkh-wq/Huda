import { Router, type IRouter } from "express";
import healthRouter from "./health";
import deviceRouter from "./device";
import couponRouter from "./coupon";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/device", deviceRouter);
router.use("/coupon", couponRouter);

export default router;
