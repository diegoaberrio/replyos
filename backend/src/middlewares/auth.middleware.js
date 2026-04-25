import { AppError } from "../common/errors/app-error.js";
import { verifyAccessToken } from "../common/utils/jwt.js";

export function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AppError("Token requerido", 401, "UNAUTHORIZED");
    }

    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      throw new AppError("Formato de token inválido", 401, "UNAUTHORIZED");
    }

    const payload = verifyAccessToken(token);

    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role
    };

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return next(new AppError("Token inválido o expirado", 401, "UNAUTHORIZED"));
    }

    next(error);
  }
}