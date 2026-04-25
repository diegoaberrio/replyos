import { query } from "../../config/db.js";

export async function getConversationTotalsRepository() {
  const sql = `
    SELECT COUNT(*)::int AS total
    FROM conversations
  `;

  const result = await query(sql);
  return result.rows[0].total;
}

export async function getLeadTotalsRepository() {
  const sql = `
    SELECT COUNT(*)::int AS total
    FROM leads
  `;

  const result = await query(sql);
  return result.rows[0].total;
}

export async function getCommercialRequestTotalsRepository() {
  const sql = `
    SELECT COUNT(*)::int AS total
    FROM commercial_requests
  `;

  const result = await query(sql);
  return result.rows[0].total;
}

export async function getConversationStatusBreakdownRepository() {
  const sql = `
    SELECT status, COUNT(*)::int AS total
    FROM conversations
    GROUP BY status
  `;

  const result = await query(sql);
  return result.rows;
}

export async function getConversationIntentBreakdownRepository() {
  const sql = `
    SELECT detected_intent, COUNT(*)::int AS total
    FROM conversations
    GROUP BY detected_intent
  `;

  const result = await query(sql);
  return result.rows;
}

export async function getLatestConversationsRepository(limit = 5) {
  const sql = `
    SELECT
      id,
      public_identifier,
      visitor_name,
      visitor_email,
      status,
      detected_intent,
      result,
      started_at,
      last_message_at
    FROM conversations
    ORDER BY started_at DESC
    LIMIT $1
  `;

  const result = await query(sql, [limit]);
  return result.rows;
}

export async function getLatestLeadsRepository(limit = 5) {
  const sql = `
    SELECT
      id,
      conversation_id,
      full_name,
      email,
      phone,
      company_name,
      lead_status,
      captured_at
    FROM leads
    ORDER BY captured_at DESC
    LIMIT $1
  `;

  const result = await query(sql, [limit]);
  return result.rows;
}

export async function getLatestCommercialRequestsRepository(limit = 5) {
  const sql = `
    SELECT
      id,
      conversation_id,
      lead_id,
      request_type,
      request_status,
      preferred_date,
      preferred_time,
      preferred_time_range,
      registered_at
    FROM commercial_requests
    ORDER BY registered_at DESC
    LIMIT $1
  `;

  const result = await query(sql, [limit]);
  return result.rows;
}