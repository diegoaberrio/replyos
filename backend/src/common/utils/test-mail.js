import { createMailerTransport, canSendRealEmails } from "../../config/mailer.js";
import { env } from "../../config/env.js";

async function main() {
  console.log("MAIL_HOST:", env.mailHost);
  console.log("MAIL_PORT:", env.mailPort);
  console.log("MAIL_USER:", env.mailUser);
  console.log("MAIL_FROM:", env.mailFrom);
  console.log("Can send real emails:", canSendRealEmails());

  const transport = createMailerTransport();

  if (!transport) {
    throw new Error("No hay configuración SMTP válida en el .env");
  }

  await transport.verify();
  console.log("SMTP OK: conexión verificada");

  const info = await transport.sendMail({
    from: env.mailFrom,
    to: env.mailUser,
    subject: "Prueba SMTP ReplyOS",
    text: "Si recibes este correo, ReplyOS ya puede enviar emails reales."
  });

  console.log("Correo enviado:", info.messageId);
}

main().catch((error) => {
  console.error("Error SMTP:", error);
  process.exit(1);
});