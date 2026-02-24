import { Router } from "express";
import { requireAuth } from "../../../middlewares/requireAuth.js";

import {
  expenseSummaryController,
  expenseCategoryController,
  expenseTrendController,
} from "./expenseReport.controller.js";

const router = Router();


router.use(requireAuth);

router.get("/summary", expenseSummaryController);
router.get("/categories", expenseCategoryController);
router.get("/trend", expenseTrendController);

export default router;
