import {
  listConversationsService,
  getConversationDetailService
} from "./conversations.service.js";

export async function listConversationsController(req, res, next) {
  try {
    const items = await listConversationsService();

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

export async function getConversationDetailController(req, res, next) {
  try {
    const data = await getConversationDetailService(req.params.id);

    return res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
}