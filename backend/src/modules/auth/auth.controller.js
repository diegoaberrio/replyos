import { loginSchema } from "./auth.schemas.js";
import { loginAdmin, getCurrentAdmin } from "./auth.service.js";
import { AppError } from "../../common/errors/app-error.js";

export async function login(req, res, next) {
  try {
    const parsed = loginSchema.safeParse(req.body);

    if (!parsed.success) {
      throw new AppError(
        "Datos de login inválidos",
        400,
        "VALIDATION_ERROR",
        parsed.error.issues.map(issue => ({
          field: issue.path.join("."),
          message: issue.message
        }))
      );
    }

    const result = await loginAdmin(parsed.data);

    return res.status(200).json({
      success: true,
      data: result,
      message: "Login successful"
    });
  } catch (error) {
    next(error);
  }
}

export async function me(req, res, next) {
  try {
    const admin = await getCurrentAdmin(req.user.id);

    return res.status(200).json({
      success: true,
      data: admin
    });
  } catch (error) {
    next(error);
  }
}

export async function logout(req, res, next) {
  try {
    return res.status(200).json({
      success: true,
      message: "Logout successful"
    });
  } catch (error) {
    next(error);
  }
}