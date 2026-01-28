import { Router } from "express";
import { mockAuth } from "../middlewares/mockAuth.js";

import { triggerWeeklyReport } from "./automation.controller.js";

const router = Router();

// DEV auth only
router.use(mockAuth);

router.post("/weekly-report", triggerWeeklyReport);

export default router;
