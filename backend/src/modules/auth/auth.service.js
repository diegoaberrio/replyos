import { AppError } from "../../common/errors/app-error.js";
import { comparePassword } from "../../common/utils/hash.js";
import { generateAccessToken, generateRefreshToken } from "../../common/utils/jwt.js";
import { findAdminByEmail, findAdminById, updateLastLogin } from "./auth.repository.js";

export async function loginAdmin({ email, password }) {
  const admin = await findAdminByEmail(email);

  if (!admin) {
    throw new AppError("Credenciales inválidas", 401, "INVALID_CREDENTIALS");
  }

  if (admin.status !== "active") {
    throw new AppError("Usuario no disponible para iniciar sesión", 403, "USER_NOT_ACTIVE");
  }

  const isValidPassword = await comparePassword(password, admin.password_hash);

  if (!isValidPassword) {
    throw new AppError("Credenciales inválidas", 401, "INVALID_CREDENTIALS");
  }

  await updateLastLogin(admin.id);

  const safeUser = {
    id: admin.id,
    full_name: admin.full_name,
    email: admin.email,
    status: admin.status
  };

  const tokenPayload = {
    sub: admin.id,
    email: admin.email,
    role: "admin"
  };

  return {
    access_token: generateAccessToken(tokenPayload),
    refresh_token: generateRefreshToken(tokenPayload),
    user: safeUser
  };
}

export async function getCurrentAdmin(adminId) {
  const admin = await findAdminById(adminId);

  if (!admin) {
    throw new AppError("Usuario no encontrado", 404, "ADMIN_NOT_FOUND");
  }

  return admin;
}