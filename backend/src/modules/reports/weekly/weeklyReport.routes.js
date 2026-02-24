import express from "express";

import {
  getLatestReport,
  getReportHistory,
} from "./weeklyReport.controller.js";

import { requireAuth } from "../../../middlewares/requireAuth.js";

const router = express.Router();

/**
 * Protect all routes
 */
router.use(requireAuth);

/**
 * Routes
 */
router.get("/latest", getLatestReport);

router.get("/history", getReportHistory);

export default router;