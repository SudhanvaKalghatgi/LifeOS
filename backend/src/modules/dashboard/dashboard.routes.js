import { Router } from "express";
import { requireAuth } from "../../middlewares/requireAuth.js";

import { dashboardSummaryController } from "./dashboard.controller.js";

const router = Router();


router.use(requireAuth);

router.get("/summary", dashboardSummaryController);

export default router;
