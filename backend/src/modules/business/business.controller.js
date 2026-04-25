import { AppError } from "../../common/errors/app-error.js";
import { upsertBusinessProfileSchema } from "./business.schemas.js";
import {
  getBusinessProfileService,
  upsertBusinessProfileService
} from "./business.service.js";

export async function getBusinessProfileController(req, res, next) {
  try {
    const profile = await getBusinessProfileService();

    return res.status(200).json({
      success: true,
      data: profile,
      message: profile ? "Business profile fetched" : "Business profile not configured yet"
    });
  } catch (error) {
    next(error);
  }
}

export async function upsertBusinessProfileController(req, res, next) {
  try {
    const parsed = upsertBusinessProfileSchema.safeParse(req.body);

    if (!parsed.success) {
      throw new AppError(
        "Datos inválidos para el perfil del negocio",
        400,
        "VALIDATION_ERROR",
        parsed.error.issues.map(issue => ({
          field: issue.path.join("."),
          message: issue.message
        }))
      );
    }

    const profile = await upsertBusinessProfileService(parsed.data, req.user.id);

    return res.status(200).json({
      success: true,
      data: profile,
      message: "Business profile saved successfully"
    });
  } catch (error) {
    next(error);
  }
}