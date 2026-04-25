import { AppError } from "../../common/errors/app-error.js";
import {
  getBusinessProfileIdForServices,
  listServicesRepository,
  getServiceByIdRepository,
  createServiceRepository,
  updateServiceRepository,
  deleteServiceRepository
} from "./services.repository.js";

export async function listServicesService() {
  return listServicesRepository();
}

export async function getServiceByIdService(id) {
  const item = await getServiceByIdRepository(id);

  if (!item) {
    throw new AppError("Servicio no encontrado", 404, "SERVICE_NOT_FOUND");
  }

  return item;
}

export async function createServiceService(payload) {
  const businessProfileId = await getBusinessProfileIdForServices();

  if (!businessProfileId) {
    throw new AppError("Debes crear primero el perfil del negocio", 400, "BUSINESS_PROFILE_REQUIRED");
  }

  return createServiceRepository({
    ...payload,
    business_profile_id: businessProfileId
  });
}

export async function updateServiceService(id, payload) {
  const existing = await getServiceByIdRepository(id);

  if (!existing) {
    throw new AppError("Servicio no encontrado", 404, "SERVICE_NOT_FOUND");
  }

  return updateServiceRepository(id, payload);
}

export async function deleteServiceService(id) {
  const deleted = await deleteServiceRepository(id);

  if (!deleted) {
    throw new AppError("Servicio no encontrado", 404, "SERVICE_NOT_FOUND");
  }

  return deleted;
}