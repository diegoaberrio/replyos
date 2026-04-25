import { AppError } from "../../common/errors/app-error.js";
import { createConversationSchema, sendMessageSchema } from "./public-chat.schemas.js";
import {
  createConversationService,
  sendMessageService,
  getConversationPublicService,
  getConversationMessagesPublicService
} from "./public-chat.service.js";

function formatZodError(error) {
  return error.issues.map(issue => ({
    field: issue.path.join("."),
    message: issue.message
  }));
}

export async function createConversationController(req, res, next) {
  try {
    const parsed = createConversationSchema.safeParse(req.body);

    if (!parsed.success) {
      throw new AppError(
        "Datos inválidos para iniciar conversación",
        400,
        "VALIDATION_ERROR",
        formatZodError(parsed.error)
      );
    }

    const data = await createConversationService(parsed.data);

    return res.status(201).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
}

export async function sendMessageController(req, res, next) {
  try {
    const parsed = sendMessageSchema.safeParse(req.body);

    if (!parsed.success) {
      throw new AppError(
        "Datos inválidos para enviar mensaje",
        400,
        "VALIDATION_ERROR",
        formatZodError(parsed.error)
      );
    }

    const data = await sendMessageService(req.params.publicIdentifier, parsed.data);

    return res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
}

export async function getConversationController(req, res, next) {
  try {
    const data = await getConversationPublicService(req.params.publicIdentifier);

    return res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
}

export async function getConversationMessagesController(req, res, next) {
  try {
    const data = await getConversationMessagesPublicService(req.params.publicIdentifier);

    return res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
}