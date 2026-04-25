import { Router } from "express";
import {
  createConversationController,
  sendMessageController,
  getConversationController,
  getConversationMessagesController
} from "./public-chat.controller.js";
import { createLeadFromConversationController } from "../leads/leads.controller.js";
import { createCommercialRequestFromConversationController } from "../commercial-requests/commercial-requests.controller.js";

const router = Router();

router.post("/conversations", createConversationController);
router.get("/conversations/:publicIdentifier", getConversationController);
router.get("/conversations/:publicIdentifier/messages", getConversationMessagesController);
router.post("/conversations/:publicIdentifier/messages", sendMessageController);

router.post("/conversations/:publicIdentifier/lead", createLeadFromConversationController);
router.post("/conversations/:publicIdentifier/commercial-requests", createCommercialRequestFromConversationController);

export default router;