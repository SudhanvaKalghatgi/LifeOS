import { Router } from "express";
import { requireAuth } from "../../middlewares/requireAuth.js";

import {
  createTaskController,
  listTasksController,
  getTaskByIdController,
  updateTaskController,
  toggleTaskController,
  archiveTaskController,
} from "./task.controller.js";

const router = Router();


router.use(requireAuth);

router.post("/", createTaskController);
router.get("/", listTasksController);
router.get("/:id", getTaskByIdController);
router.patch("/:id", updateTaskController);
router.patch("/:id/toggle", toggleTaskController);
router.patch("/:id/archive", archiveTaskController);

export default router;
