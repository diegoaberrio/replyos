import nodemailer from "nodemailer";
import { env } from "./env.js";

function hasRealMailConfig() {
  return Boolean(env.mailHost && env.mailUser && env.mailPass && env.mailFrom);
}

export function canSendRealEmails() {
  return hasRealMailConfig();
}

export function createMailerTransport() {
  if (!hasRealMailConfig()) {
    return null;
  }

  return nodemailer.createTransport({
    host: env.mailHost,
    port: env.mailPort,
    secure: false,
    auth: {
      user: env.mailUser,
      pass: env.mailPass
    }
  });
}