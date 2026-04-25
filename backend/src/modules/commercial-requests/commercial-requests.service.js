import { AppError } from "../../common/errors/app-error.js";
import { formatDateOnly } from "../../common/utils/date.js";
import {
  getConversationByPublicIdentifierForRequest,
  getLeadByConversationIdForRequest,
  createCommercialRequestRepository,
  updateConversationAfterCommercialRequestRepository,
  updateLeadAfterCommercialRequestRepository,
  listCommercialRequestsRepository,
  getCommercialRequestByIdRepository
} from "./commercial-requests.repository.js";
import { sendCommercialRequestNotificationsService } from "../notifications/notifications.service.js";

function normalizeCommercialRequest(item) {
  if (!item) return item;

  return {
    ...item,
    preferred_date: formatDateOnly(item.preferred_date)
  };
}

export async function createCommercialRequestFromConversationService(publicIdentifier, payload) {
  const conversation = await getConversationByPublicIdentifierForRequest(publicIdentifier);

  if (!conversation) {
    throw new AppError("Conversación no encontrada", 404, "CONVERSATION_NOT_FOUND");
  }

  const lead = await getLeadByConversationIdForRequest(conversation.id);

  if (!lead) {
    throw new AppError("Debes capturar primero el lead de esta conversación", 400, "LEAD_REQUIRED");
  }

  const item = await createCommercialRequestRepository({
    business_profile_id: conversation.business_profile_id,
    conversation_id: conversation.id,
    lead_id: lead.id,
    request_type: payload.request_type,
    request_status: "pending",
    preferred_date: payload.preferred_date || null,
    preferred_time: payload.preferred_time || null,
    preferred_time_range: payload.preferred_time_range || null,
    details: payload.details || null
  });

  await updateConversationAfterCommercialRequestRepository(conversation.id);
  await updateLeadAfterCommercialRequestRepository(lead.id);
  await sendCommercialRequestNotificationsService(item.id);

  return normalizeCommercialRequest(item);
}

export async function listCommercialRequestsService() {
  const items = await listCommercialRequestsRepository();
  return items.map(normalizeCommercialRequest);
}

export async function getCommercialRequestByIdService(id) {
  const item = await getCommercialRequestByIdRepository(id);

  if (!item) {
    throw new AppError("Solicitud comercial no encontrada", 404, "COMMERCIAL_REQUEST_NOT_FOUND");
  }

  return normalizeCommercialRequest(item);
}