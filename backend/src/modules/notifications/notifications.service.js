import { createMailerTransport, canSendRealEmails } from "../../config/mailer.js";
import {
  createNotificationRepository,
  listNotificationsRepository,
  getBusinessAndLeadDataForCommercialRequestRepository
} from "./notifications.repository.js";

function formatPreferredDate(value) {
  if (!value) return "No especificada";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toISOString().slice(0, 10);
}

export async function listNotificationsService() {
  return listNotificationsRepository();
}

export async function sendCommercialRequestNotificationsService(commercialRequestId) {
  const data = await getBusinessAndLeadDataForCommercialRequestRepository(commercialRequestId);

  if (!data) {
    return [];
  }

  const notifications = [];
  const transport = createMailerTransport();
  const realSendingEnabled = canSendRealEmails();

  const businessRecipient = data.primary_contact_email || data.business_email;
  const businessSubject = `Nueva solicitud comercial recibida - ${data.business_name}`;
  const businessBody = `
Nueva solicitud comercial recibida.

Lead: ${data.full_name || "Sin nombre"}
Email: ${data.email || "No informado"}
Teléfono: ${data.phone || "No informado"}
Empresa: ${data.company_name || "No informada"}

Tipo de solicitud: ${data.request_type}
Fecha preferida: ${formatPreferredDate(data.preferred_date)}
Hora preferida: ${data.preferred_time || "No especificada"}
Franja: ${data.preferred_time_range || "No especificada"}

Detalles: ${data.details || "Sin detalles"}
`.trim();

  if (businessRecipient) {
    if (realSendingEnabled && transport) {
      try {
        const info = await transport.sendMail({
          from: process.env.MAIL_FROM,
          to: businessRecipient,
          subject: businessSubject,
          text: businessBody
        });

        notifications.push(
          await createNotificationRepository({
            business_profile_id: data.business_profile_id,
            conversation_id: data.conversation_id,
            lead_id: data.lead_id,
            commercial_request_id: data.commercial_request_id,
            recipient_type: "business",
            recipient_address: businessRecipient,
            subject: businessSubject,
            body: businessBody,
            status: "sent",
            provider_message_id: info.messageId,
            sent_at: new Date()
          })
        );
      } catch (error) {
        notifications.push(
          await createNotificationRepository({
            business_profile_id: data.business_profile_id,
            conversation_id: data.conversation_id,
            lead_id: data.lead_id,
            commercial_request_id: data.commercial_request_id,
            recipient_type: "business",
            recipient_address: businessRecipient,
            subject: businessSubject,
            body: businessBody,
            status: "failed",
            error_message: error.message
          })
        );
      }
    } else {
      notifications.push(
        await createNotificationRepository({
          business_profile_id: data.business_profile_id,
          conversation_id: data.conversation_id,
          lead_id: data.lead_id,
          commercial_request_id: data.commercial_request_id,
          recipient_type: "business",
          recipient_address: businessRecipient,
          subject: businessSubject,
          body: businessBody,
          status: "sent",
          provider_message_id: "mock-email",
          sent_at: new Date()
        })
      );
    }
  }

  if (data.email) {
    const leadSubject = `Hemos recibido tu solicitud - ${data.business_name}`;
    const leadBody = `
Hola ${data.full_name || ""},

Hemos recibido correctamente tu solicitud de tipo "${data.request_type}".

Fecha preferida: ${formatPreferredDate(data.preferred_date)}
Hora preferida: ${data.preferred_time || "No especificada"}
Franja: ${data.preferred_time_range || "No especificada"}

Nos pondremos en contacto contigo lo antes posible.

Gracias,
${data.business_name}
`.trim();

    if (realSendingEnabled && transport) {
      try {
        const info = await transport.sendMail({
          from: process.env.MAIL_FROM,
          to: data.email,
          subject: leadSubject,
          text: leadBody
        });

        notifications.push(
          await createNotificationRepository({
            business_profile_id: data.business_profile_id,
            conversation_id: data.conversation_id,
            lead_id: data.lead_id,
            commercial_request_id: data.commercial_request_id,
            recipient_type: "lead",
            recipient_address: data.email,
            subject: leadSubject,
            body: leadBody,
            status: "sent",
            provider_message_id: info.messageId,
            sent_at: new Date()
          })
        );
      } catch (error) {
        notifications.push(
          await createNotificationRepository({
            business_profile_id: data.business_profile_id,
            conversation_id: data.conversation_id,
            lead_id: data.lead_id,
            commercial_request_id: data.commercial_request_id,
            recipient_type: "lead",
            recipient_address: data.email,
            subject: leadSubject,
            body: leadBody,
            status: "failed",
            error_message: error.message
          })
        );
      }
    } else {
      notifications.push(
        await createNotificationRepository({
          business_profile_id: data.business_profile_id,
          conversation_id: data.conversation_id,
          lead_id: data.lead_id,
          commercial_request_id: data.commercial_request_id,
          recipient_type: "lead",
          recipient_address: data.email,
          subject: leadSubject,
          body: leadBody,
          status: "sent",
          provider_message_id: "mock-email",
          sent_at: new Date()
        })
      );
    }
  }

  return notifications;
}