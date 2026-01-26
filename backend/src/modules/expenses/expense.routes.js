import { Router } from "express";
import { mockAuth } from "../../middlewares/mockAuth.js";

import {
  createExpenseController,
  listExpensesController,
  getExpenseByIdController,
  updateExpenseController,
  archiveExpenseController,
} from "./expense.controller.js";

const router = Router();

// DEV AUTH (replace with Clerk later)
router.use(mockAuth);

router.post("/", createExpenseController);
router.get("/", listExpensesController);
router.get("/:id", getExpenseByIdController);
router.patch("/:id", updateExpenseController);
router.patch("/:id/archive", archiveExpenseController);

export default router;
