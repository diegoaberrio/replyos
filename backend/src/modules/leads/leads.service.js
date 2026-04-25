import { AppError } from "../../common/errors/app-error.js";
import {
  getConversationByPublicIdentifierForLead,
  getLeadByConversationIdRepository,
  createLeadRepository,
  updateConversationAfterLeadRepository,
  listLeadsRepository,
  getLeadByIdRepository
} from "./leads.repository.js";

export async function createLeadFromConversationService(publicIdentifier, payload) {
  const conversation = await getConversationByPublicIdentifierForLead(publicIdentifier);

  if (!conversation) {
    throw new AppError("Conversación no encontrada", 404, "CONVERSATION_NOT_FOUND");
  }

  const existingLead = await getLeadByConversationIdRepository(conversation.id);

  if (existingLead) {
    throw new AppError("Ya existe un lead para esta conversación", 409, "LEAD_ALREADY_EXISTS");
  }

  const lead = await createLeadRepository({
    business_profile_id: conversation.business_profile_id,
    conversation_id: conversation.id,
    full_name: payload.full_name || null,
    email: payload.email || null,
    phone: payload.phone || null,
    company_name: payload.company_name || null,
    notes: payload.notes || null,
    lead_status: "new"
  });

  await updateConversationAfterLeadRepository(conversation.id);

  return lead;
}

export async function listLeadsService() {
  return listLeadsRepository();
}

export async function getLeadByIdService(id) {
  const lead = await getLeadByIdRepository(id);

  if (!lead) {
    throw new AppError("Lead no encontrado", 404, "LEAD_NOT_FOUND");
  }

  return lead;
}