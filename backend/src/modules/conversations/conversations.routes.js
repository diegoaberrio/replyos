import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import {
  listConversationsController,
  getConversationDetailController
} from "./conversations.controller.js";

const router = Router();

router.use(authMiddleware);

router.get("/", listConversationsController);
router.get("/:id", getConversationDetailController);

export default router;