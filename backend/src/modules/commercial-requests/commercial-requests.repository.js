import { query } from "../../config/db.js";

export async function getConversationByPublicIdentifierForRequest(publicIdentifier) {
  const sql = `
    SELECT *
    FROM conversations
    WHERE public_identifier = $1
    LIMIT 1
  `;

  const result = await query(sql, [publicIdentifier]);
  return result.rows[0] || null;
}

export async function getLeadByConversationIdForRequest(conversationId) {
  const sql = `
    SELECT *
    FROM leads
    WHERE conversation_id = $1
    LIMIT 1
  `;

  const result = await query(sql, [conversationId]);
  return result.rows[0] || null;
}

export async function createCommercialRequestRepository(payload) {
  const sql = `
    INSERT INTO commercial_requests (
      business_profile_id,
      conversation_id,
      lead_id,
      request_type,
      request_status,
      preferred_date,
      preferred_time,
      preferred_time_range,
      details
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    RETURNING *
  `;

  const result = await query(sql, [
    payload.business_profile_id,
    payload.conversation_id,
    payload.lead_id,
    payload.request_type,
    payload.request_status,
    payload.preferred_date,
    payload.preferred_time,
    payload.preferred_time_range,
    payload.details
  ]);

  return result.rows[0];
}

export async function updateConversationAfterCommercialRequestRepository(conversationId) {
  const sql = `
    UPDATE conversations
    SET
      status = 'converted',
      result = 'commercial_request_created',
      updated_at = NOW()
    WHERE id = $1
    RETURNING *
  `;

  const result = await query(sql, [conversationId]);
  return result.rows[0] || null;
}

export async function updateLeadAfterCommercialRequestRepository(leadId) {
  const sql = `
    UPDATE leads
    SET
      lead_status = 'converted',
      updated_at = NOW()
    WHERE id = $1
    RETURNING *
  `;

  const result = await query(sql, [leadId]);
  return result.rows[0] || null;
}

export async function listCommercialRequestsRepository() {
  const sql = `
    SELECT
      cr.*,
      l.full_name,
      l.email,
      l.phone,
      c.public_identifier
    FROM commercial_requests cr
    INNER JOIN leads l ON l.id = cr.lead_id
    INNER JOIN conversations c ON c.id = cr.conversation_id
    ORDER BY cr.registered_at DESC
  `;

  const result = await query(sql);
  return result.rows;
}

export async function getCommercialRequestByIdRepository(id) {
  const sql = `
    SELECT
      cr.*,
      l.full_name,
      l.email,
      l.phone,
      l.company_name,
      c.public_identifier,
      c.status AS conversation_status,
      c.detected_intent
    FROM commercial_requests cr
    INNER JOIN leads l ON l.id = cr.lead_id
    INNER JOIN conversations c ON c.id = cr.conversation_id
    WHERE cr.id = $1
    LIMIT 1
  `;

  const result = await query(sql, [id]);
  return result.rows[0] || null;
}