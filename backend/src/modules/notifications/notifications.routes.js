import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { listNotificationsController } from "./notifications.controller.js";

const router = Router();

router.use(authMiddleware);

router.get("/", listNotificationsController);

export default router;