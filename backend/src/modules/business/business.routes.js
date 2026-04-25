import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import {
  getBusinessProfileController,
  upsertBusinessProfileController
} from "./business.controller.js";

const router = Router();

router.get("/", authMiddleware, getBusinessProfileController);
router.put("/", authMiddleware, upsertBusinessProfileController);

export default router;