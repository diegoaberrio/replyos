import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";

export function generateAccessToken(payload) {
  return jwt.sign(payload, env.jwtAccessSecret, { expiresIn: "1h" });
}

export function generateRefreshToken(payload) {
  return jwt.sign(payload, env.jwtRefreshSecret, { expiresIn: "7d" });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, env.jwtAccessSecret);
}