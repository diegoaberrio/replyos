import { query } from "../../config/db.js";

export async function createNotificationRepository(payload) {
  const sql = `
    INSERT INTO notifications (
      business_profile_id,
      conversation_id,
      lead_id,
      commercial_request_id,
      channel,
      recipient_type,
      recipient_address,
      subject,
      body,
      status,
      provider_message_id,
      sent_at,
      error_message
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
    RETURNING *
  `;

  const result = await query(sql, [
    payload.business_profile_id,
    payload.conversation_id,
    payload.lead_id,
    payload.commercial_request_id,
    payload.channel || "email",
    payload.recipient_type,
    payload.recipient_address,
    payload.subject,
    payload.body,
    payload.status,
    payload.provider_message_id || null,
    payload.sent_at || null,
    payload.error_message || null
  ]);

  return result.rows[0];
}

export async function listNotificationsRepository() {
  const sql = `
    SELECT
      id,
      business_profile_id,
      conversation_id,
      lead_id,
      commercial_request_id,
      channel,
      recipient_type,
      recipient_address,
      subject,
      status,
      provider_message_id,
      sent_at,
      error_message,
      created_at
    FROM notifications
    ORDER BY created_at DESC
  `;

  const result = await query(sql);
  return result.rows;
}

export async function getBusinessAndLeadDataForCommercialRequestRepository(commercialRequestId) {
  const sql = `
    SELECT
      cr.id AS commercial_request_id,
      cr.business_profile_id,
      cr.conversation_id,
      cr.lead_id,
      cr.request_type,
      cr.request_status,
      cr.preferred_date,
      cr.preferred_time,
      cr.preferred_time_range,
      cr.details,
      bp.business_name,
      bp.business_email,
      bp.primary_contact_email,
      l.full_name,
      l.email,
      l.phone,
      l.company_name
    FROM commercial_requests cr
    INNER JOIN business_profile bp ON bp.id = cr.business_profile_id
    INNER JOIN leads l ON l.id = cr.lead_id
    WHERE cr.id = $1
    LIMIT 1
  `;

  const result = await query(sql, [commercialRequestId]);
  return result.rows[0] || null;
}