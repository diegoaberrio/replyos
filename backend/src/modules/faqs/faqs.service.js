import { AppError } from "../../common/errors/app-error.js";
import {
  getBusinessProfileId,
  listFaqsRepository,
  getFaqByIdRepository,
  createFaqRepository,
  updateFaqRepository,
  deleteFaqRepository
} from "./faqs.repository.js";

export async function listFaqsService() {
  return listFaqsRepository();
}

export async function getFaqByIdService(id) {
  const faq = await getFaqByIdRepository(id);

  if (!faq) {
    throw new AppError("FAQ no encontrada", 404, "FAQ_NOT_FOUND");
  }

  return faq;
}

export async function createFaqService(payload) {
  const businessProfileId = await getBusinessProfileId();

  if (!businessProfileId) {
    throw new AppError("Debes crear primero el perfil del negocio", 400, "BUSINESS_PROFILE_REQUIRED");
  }

  return createFaqRepository({
    ...payload,
    business_profile_id: businessProfileId
  });
}

export async function updateFaqService(id, payload) {
  const existing = await getFaqByIdRepository(id);

  if (!existing) {
    throw new AppError("FAQ no encontrada", 404, "FAQ_NOT_FOUND");
  }

  return updateFaqRepository(id, payload);
}

export async function deleteFaqService(id) {
  const deleted = await deleteFaqRepository(id);

  if (!deleted) {
    throw new AppError("FAQ no encontrada", 404, "FAQ_NOT_FOUND");
  }

  return deleted;
}