import { Router } from "express";
import { mockAuth } from "../../middlewares/mockAuth.js";

import { syncUser, getMe, updateMe } from "./user.controller.js";

const router = Router();

// DEV AUTH (replace with Clerk later)
router.use(mockAuth);

router.post("/sync", syncUser);
router.get("/me", getMe);
router.patch("/me", updateMe);

export default router;
