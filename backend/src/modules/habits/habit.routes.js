import { Router } from "express";
import { requireAuth } from "../../middlewares/requireAuth.js";

import {
  createHabitController,
  listHabitsController,
  updateHabitController,
  archiveHabitController,
  habitCheckinController,
  habitStatsController,
} from "./habit.controller.js";

const router = Router();


router.use(requireAuth);

router.post("/", createHabitController);
router.get("/", listHabitsController);

router.patch("/:id", updateHabitController);
router.patch("/:id/archive", archiveHabitController);

router.post("/:id/checkin", habitCheckinController);
router.get("/:id/stats", habitStatsController);

export default router;
