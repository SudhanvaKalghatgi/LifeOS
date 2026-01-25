import { Router } from "express";
import { mockAuth } from "../../middlewares/mockAuth.js";

import {
  createTaskController,
  listTasksController,
  getTaskByIdController,
  updateTaskController,
  toggleTaskController,
  archiveTaskController,
} from "./task.controller.js";

const router = Router();

// DEV AUTH (replace with Clerk later)
router.use(mockAuth);

router.post("/", createTaskController);
router.get("/", listTasksController);
router.get("/:id", getTaskByIdController);
router.patch("/:id", updateTaskController);
router.patch("/:id/toggle", toggleTaskController);
router.patch("/:id/archive", archiveTaskController);

export default router;
