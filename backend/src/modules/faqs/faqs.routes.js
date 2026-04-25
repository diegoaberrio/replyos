import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import {
  listFaqsController,
  getFaqByIdController,
  createFaqController,
  updateFaqController,
  deleteFaqController
} from "./faqs.controller.js";

const router = Router();

router.use(authMiddleware);

router.get("/", listFaqsController);
router.get("/:id", getFaqByIdController);
router.post("/", createFaqController);
router.put("/:id", updateFaqController);
router.delete("/:id", deleteFaqController);

export default router;