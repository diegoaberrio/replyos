import dotenv from "dotenv";

dotenv.config();

function required(name, value) {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 3000),

  databaseUrl: required("DATABASE_URL", process.env.DATABASE_URL),

  jwtAccessSecret: required("JWT_ACCESS_SECRET", process.env.JWT_ACCESS_SECRET),
  jwtRefreshSecret: required("JWT_REFRESH_SECRET", process.env.JWT_REFRESH_SECRET),

  mailHost: process.env.MAIL_HOST || "",
  mailPort: Number(process.env.MAIL_PORT || 587),
  mailUser: process.env.MAIL_USER || "",
  mailPass: process.env.MAIL_PASS || "",
  mailFrom: process.env.MAIL_FROM || "",

  openAiApiKey: process.env.OPENAI_API_KEY || "",
  openAiModel: process.env.OPENAI_MODEL || "gpt-5.4-mini"
};