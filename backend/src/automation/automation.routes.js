import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth.js";

import { triggerWeeklyReport } from "./automation.controller.js";

const router = Router();


router.use(requireAuth);

router.post("/weekly-report", triggerWeeklyReport);

export default router;
