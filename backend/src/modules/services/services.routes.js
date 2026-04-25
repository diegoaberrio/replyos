import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import {
  listServicesController,
  getServiceByIdController,
  createServiceController,
  updateServiceController,
  deleteServiceController
} from "./services.controller.js";

const router = Router();

router.use(authMiddleware);

router.get("/", listServicesController);
router.get("/:id", getServiceByIdController);
router.post("/", createServiceController);
router.put("/:id", updateServiceController);
router.delete("/:id", deleteServiceController);

export default router;