import { AppError } from "../../common/errors/app-error.js";
import { upsertAgentSettingsSchema } from "./agent-settings.schemas.js";
import {
  getAgentSettingsService,
  upsertAgentSettingsService
} from "./agent-settings.service.js";

export async function getAgentSettingsController(req, res, next) {
  try {
    const settings = await getAgentSettingsService();

    return res.status(200).json({
      success: true,
      data: settings,
      message: settings ? "Agent settings fetched" : "Agent settings not configured yet"
    });
  } catch (error) {
    next(error);
  }
}

export async function upsertAgentSettingsController(req, res, next) {
  try {
    const parsed = upsertAgentSettingsSchema.safeParse(req.body);

    if (!parsed.success) {
      throw new AppError(
        "Datos inválidos para la configuración del agente",
        400,
        "VALIDATION_ERROR",
        parsed.error.issues.map(issue => ({
          field: issue.path.join("."),
          message: issue.message
        }))
      );
    }

    const settings = await upsertAgentSettingsService(parsed.data);

    return res.status(200).json({
      success: true,
      data: settings,
      message: "Agent settings saved successfully"
    });
  } catch (error) {
    next(error);
  }
}