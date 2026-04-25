import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import {
  createLeadFromConversationController,
  listLeadsController,
  getLeadByIdController
} from "./leads.controller.js";

const router = Router();

router.get("/", authMiddleware, listLeadsController);
router.get("/:id", authMiddleware, getLeadByIdController);

export default router;