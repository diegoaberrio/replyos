import { query } from "../../config/db.js";

export async function getBusinessProfileId() {
  const sql = `
    SELECT id
    FROM business_profile
    ORDER BY created_at ASC
    LIMIT 1
  `;

  const result = await query(sql);
  return result.rows[0]?.id || null;
}

export async function listFaqsRepository() {
  const businessProfileId = await getBusinessProfileId();

  if (!businessProfileId) {
    return [];
  }

  const sql = `
    SELECT id, business_profile_id, question, answer, sort_order, is_active, created_at, updated_at
    FROM faqs
    WHERE business_profile_id = $1
    ORDER BY sort_order ASC, created_at DESC
  `;

  const result = await query(sql, [businessProfileId]);
  return result.rows;
}

export async function getFaqByIdRepository(id) {
  const sql = `
    SELECT id, business_profile_id, question, answer, sort_order, is_active, created_at, updated_at
    FROM faqs
    WHERE id = $1
    LIMIT 1
  `;

  const result = await query(sql, [id]);
  return result.rows[0] || null;
}

export async function createFaqRepository(payload) {
  const sql = `
    INSERT INTO faqs (
      business_profile_id,
      question,
      answer,
      sort_order,
      is_active
    ) VALUES ($1, $2, $3, $4, $5)
    RETURNING id, business_profile_id, question, answer, sort_order, is_active, created_at, updated_at
  `;

  const result = await query(sql, [
    payload.business_profile_id,
    payload.question,
    payload.answer,
    payload.sort_order,
    payload.is_active
  ]);

  return result.rows[0];
}

export async function updateFaqRepository(id, payload) {
  const sql = `
    UPDATE faqs
    SET
      question = $2,
      answer = $3,
      sort_order = $4,
      is_active = $5,
      updated_at = NOW()
    WHERE id = $1
    RETURNING id, business_profile_id, question, answer, sort_order, is_active, created_at, updated_at
  `;

  const result = await query(sql, [
    id,
    payload.question,
    payload.answer,
    payload.sort_order,
    payload.is_active
  ]);

  return result.rows[0] || null;
}

export async function deleteFaqRepository(id) {
  const sql = `
    DELETE FROM faqs
    WHERE id = $1
    RETURNING id
  `;

  const result = await query(sql, [id]);
  return result.rows[0] || null;
}