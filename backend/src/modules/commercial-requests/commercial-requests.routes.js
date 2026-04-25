import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import {
  createCommercialRequestFromConversationController,
  listCommercialRequestsController,
  getCommercialRequestByIdController
} from "./commercial-requests.controller.js";

const router = Router();

router.get("/", authMiddleware, listCommercialRequestsController);
router.get("/:id", authMiddleware, getCommercialRequestByIdController);

export default router;