import { Router } from "express";
import { testConnection } from "../config/db.js";
import authRoutes from "../modules/auth/auth.routes.js";
import businessRoutes from "../modules/business/business.routes.js";
import agentSettingsRoutes from "../modules/agent-settings/agent-settings.routes.js";
import faqsRoutes from "../modules/faqs/faqs.routes.js";
import servicesRoutes from "../modules/services/services.routes.js";
import publicChatRoutes from "../modules/public-chat/public-chat.routes.js";
import conversationsRoutes from "../modules/conversations/conversations.routes.js";
import leadsRoutes from "../modules/leads/leads.routes.js";
import commercialRequestsRoutes from "../modules/commercial-requests/commercial-requests.routes.js";
import dashboardRoutes from "../modules/dashboard/dashboard.routes.js";
import notificationsRoutes from "../modules/notifications/notifications.routes.js";

const router = Router();

router.get("/health", async (req, res, next) => {
  try {
    const db = await testConnection();

    return res.status(200).json({
      success: true,
      data: {
        api: "ok",
        database: "ok",
        server_time: db.current_time
      },
      message: "ReplyOS backend is running"
    });
  } catch (error) {
    next(error);
  }
});

router.use("/admin/auth", authRoutes);
router.use("/admin/business-profile", businessRoutes);
router.use("/admin/agent-settings", agentSettingsRoutes);
router.use("/admin/faqs", faqsRoutes);
router.use("/admin/services", servicesRoutes);
router.use("/admin/conversations", conversationsRoutes);
router.use("/admin/leads", leadsRoutes);
router.use("/admin/commercial-requests", commercialRequestsRoutes);
router.use("/admin/dashboard", dashboardRoutes);
router.use("/admin/notifications", notificationsRoutes);

router.use("/public", publicChatRoutes);





export default router;