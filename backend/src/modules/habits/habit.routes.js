import { Router } from "express";
import { mockAuth } from "../../middlewares/mockAuth.js";

import {
  createHabitController,
  listHabitsController,
  updateHabitController,
  archiveHabitController,
  habitCheckinController,
  habitStatsController,
} from "./habit.controller.js";

const router = Router();

// ✅ DEV AUTH (replace with Clerk later)
router.use(mockAuth);

router.post("/", createHabitController);
router.get("/", listHabitsController);

router.patch("/:id", updateHabitController);
router.patch("/:id/archive", archiveHabitController);

router.post("/:id/checkin", habitCheckinController);
router.get("/:id/stats", habitStatsController);

export default router;
