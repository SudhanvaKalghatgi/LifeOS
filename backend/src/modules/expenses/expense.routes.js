import { Router } from "express";
import { requireAuth } from "../../middlewares/requireAuth.js";

import {
  createExpenseController,
  listExpensesController,
  getExpenseByIdController,
  updateExpenseController,
  archiveExpenseController,
} from "./expense.controller.js";

const router = Router();


router.use(requireAuth);

router.post("/", createExpenseController);
router.get("/", listExpensesController);
router.get("/:id", getExpenseByIdController);
router.patch("/:id", updateExpenseController);
router.patch("/:id/archive", archiveExpenseController);

export default router;
