import { AppError } from "../../common/errors/app-error.js";
import {
  listConversationsRepository,
  getConversationDetailRepository
} from "./conversations.repository.js";

export async function listConversationsService() {
  return listConversationsRepository();
}

export async function getConversationDetailService(id) {
  const data = await getConversationDetailRepository(id);

  if (!data) {
    throw new AppError("Conversación no encontrada", 404, "CONVERSATION_NOT_FOUND");
  }

  return data;
}