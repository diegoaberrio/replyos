import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import {
  getAgentSettingsController,
  upsertAgentSettingsController
} from "./agent-settings.controller.js";

const router = Router();

router.get("/", authMiddleware, getAgentSettingsController);
router.put("/", authMiddleware, upsertAgentSettingsController);

export default router;