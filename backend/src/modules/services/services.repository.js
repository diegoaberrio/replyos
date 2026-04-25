import { query } from "../../config/db.js";

export async function getBusinessProfileIdForServices() {
  const sql = `
    SELECT id
    FROM business_profile
    ORDER BY created_at ASC
    LIMIT 1
  `;

  const result = await query(sql);
  return result.rows[0]?.id || null;
}

export async function listServicesRepository() {
  const businessProfileId = await getBusinessProfileIdForServices();

  if (!businessProfileId) {
    return [];
  }

  const sql = `
    SELECT id, business_profile_id, name, short_description, detailed_description, is_active, created_at, updated_at
    FROM services
    WHERE business_profile_id = $1
    ORDER BY created_at DESC
  `;

  const result = await query(sql, [businessProfileId]);
  return result.rows;
}

export async function getServiceByIdRepository(id) {
  const sql = `
    SELECT id, business_profile_id, name, short_description, detailed_description, is_active, created_at, updated_at
    FROM services
    WHERE id = $1
    LIMIT 1
  `;

  const result = await query(sql, [id]);
  return result.rows[0] || null;
}

export async function createServiceRepository(payload) {
  const sql = `
    INSERT INTO services (
      business_profile_id,
      name,
      short_description,
      detailed_description,
      is_active
    ) VALUES ($1, $2, $3, $4, $5)
    RETURNING id, business_profile_id, name, short_description, detailed_description, is_active, created_at, updated_at
  `;

  const result = await query(sql, [
    payload.business_profile_id,
    payload.name,
    payload.short_description,
    payload.detailed_description,
    payload.is_active
  ]);

  return result.rows[0];
}

export async function updateServiceRepository(id, payload) {
  const sql = `
    UPDATE services
    SET
      name = $2,
      short_description = $3,
      detailed_description = $4,
      is_active = $5,
      updated_at = NOW()
    WHERE id = $1
    RETURNING id, business_profile_id, name, short_description, detailed_description, is_active, created_at, updated_at
  `;

  const result = await query(sql, [
    id,
    payload.name,
    payload.short_description,
    payload.detailed_description,
    payload.is_active
  ]);

  return result.rows[0] || null;
}

export async function deleteServiceRepository(id) {
  const sql = `
    DELETE FROM services
    WHERE id = $1
    RETURNING id
  `;

  const result = await query(sql, [id]);
  return result.rows[0] || null;
}