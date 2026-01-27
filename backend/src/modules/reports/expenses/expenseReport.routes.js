import { Router } from "express";
import { mockAuth } from "../../../middlewares/mockAuth.js";

import {
  expenseSummaryController,
  expenseCategoryController,
  expenseTrendController,
} from "./expenseReport.controller.js";

const router = Router();

// DEV AUTH (replace with Clerk later)
router.use(mockAuth);

router.get("/summary", expenseSummaryController);
router.get("/categories", expenseCategoryController);
router.get("/trend", expenseTrendController);

export default router;
