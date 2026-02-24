import express from "express";

import {
  getLatestReport,
  getReportHistory,
} from "./weeklyReport.controller.js";

import { mockAuth } from "../../../middlewares/mockAuth.js";

const router = express.Router();

/**
 * Protect all routes
 */
router.use(mockAuth);

/**
 * Routes
 */
router.get("/latest", getLatestReport);

router.get("/history", getReportHistory);

export default router;