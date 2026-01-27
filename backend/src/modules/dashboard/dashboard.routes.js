import { Router } from "express";
import { mockAuth } from "../../middlewares/mockAuth.js";

import { dashboardSummaryController } from "./dashboard.controller.js";

const router = Router();

// DEV auth (replace with Clerk later)
router.use(mockAuth);

router.get("/summary", dashboardSummaryController);

export default router;
