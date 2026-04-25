import { listNotificationsService } from "./notifications.service.js";

export async function listNotificationsController(req, res, next) {
  try {
    const items = await listNotificationsService();

    return res.status(200).json({
      success: true,
      data: {
        items,
        meta: {
          total: items.length
        }
      }
    });
  } catch (error) {
    next(error);
  }
}