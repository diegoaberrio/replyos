import { query } from "../../config/db.js";

export async function getConversationByPublicIdentifierForLead(publicIdentifier) {
  const sql = `
    SELECT *
    FROM conversations
    WHERE public_identifier = $1
    LIMIT 1
  `;

  const result = await query(sql, [publicIdentifier]);
  return result.rows[0] || null;
}

export async function getLeadByConversationIdRepository(conversationId) {
  const sql = `
    SELECT *
    FROM leads
    WHERE conversation_id = $1
    LIMIT 1
  `;

  const result = await query(sql, [conversationId]);
  return result.rows[0] || null;
}

export async function createLeadRepository(payload) {
  const sql = `
    INSERT INTO leads (
      business_profile_id,
      conversation_id,
      full_name,
      email,
      phone,
      company_name,
      notes,
      lead_status
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    RETURNING *
  `;

  const result = await query(sql, [
    payload.business_profile_id,
    payload.conversation_id,
    payload.full_name,
    payload.email,
    payload.phone,
    payload.company_name,
    payload.notes,
    payload.lead_status
  ]);

  return result.rows[0];
}

export async function updateConversationAfterLeadRepository(conversationId) {
  const sql = `
    UPDATE conversations
    SET
      status = 'in_follow_up',
      result = 'lead_captured',
      updated_at = NOW()
    WHERE id = $1
    RETURNING *
  `;

  const result = await query(sql, [conversationId]);
  return result.rows[0] || null;
}

export async function listLeadsRepository() {
  const sql = `
    SELECT
      l.id,
      l.business_profile_id,
      l.conversation_id,
      l.full_name,
      l.email,
      l.phone,
      l.company_name,
      l.notes,
      l.lead_status,
      l.captured_at,
      l.created_at,
      l.updated_at,
      c.public_identifier,
      c.detected_intent,
      c.result
    FROM leads l
    INNER JOIN conversations c ON c.id = l.conversation_id
    ORDER BY l.captured_at DESC
  `;

  const result = await query(sql);
  return result.rows;
}

export async function getLeadByIdRepository(id) {
  const sql = `
    SELECT
      l.*,
      c.public_identifier,
      c.visitor_name,
      c.visitor_email,
      c.visitor_phone,
      c.status AS conversation_status,
      c.detected_intent,
      c.result AS conversation_result
    FROM leads l
    INNER JOIN conversations c ON c.id = l.conversation_id
    WHERE l.id = $1
    LIMIT 1
  `;

  const result = await query(sql, [id]);
  return result.rows[0] || null;
}