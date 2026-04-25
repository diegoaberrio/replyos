import { AppError } from "../../common/errors/app-error.js";
import {
  getBusinessProfile,
  createBusinessProfile,
  updateBusinessProfile
} from "./business.repository.js";

export async function getBusinessProfileService() {
  return getBusinessProfile();
}

export async function upsertBusinessProfileService(payload, adminUserId) {
  const existing = await getBusinessProfile();

  if (!existing) {
    return createBusinessProfile({
      ...payload,
      created_by: adminUserId
    });
  }

  const updated = await updateBusinessProfile(existing.id, payload);

  if (!updated) {
    throw new AppError("No se pudo actualizar el perfil del negocio", 500, "BUSINESS_UPDATE_FAILED");
  }

  return updated;
}