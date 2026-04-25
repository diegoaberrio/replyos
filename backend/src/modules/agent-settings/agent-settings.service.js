import { AppError } from "../../common/errors/app-error.js";
import { getBusinessProfile } from "../business/business.repository.js";
import {
  getAgentSettings,
  createAgentSettings,
  updateAgentSettings
} from "./agent-settings.repository.js";

export async function getAgentSettingsService() {
  return getAgentSettings();
}

export async function upsertAgentSettingsService(payload) {
  const businessProfile = await getBusinessProfile();

  if (!businessProfile) {
    throw new AppError(
      "Debes crear primero el perfil del negocio",
      400,
      "BUSINESS_PROFILE_REQUIRED"
    );
  }

  const existing = await getAgentSettings();

  if (!existing) {
    return createAgentSettings({
      ...payload,
      business_profile_id: businessProfile.id
    });
  }

  const updated = await updateAgentSettings(existing.id, payload);

  if (!updated) {
    throw new AppError("No se pudo actualizar la configuración del agente", 500, "AGENT_SETTINGS_UPDATE_FAILED");
  }

  return updated;
}