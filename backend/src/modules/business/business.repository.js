import { query } from "../../config/db.js";

export async function getBusinessProfile() {
  const sql = `
    SELECT *
    FROM business_profile
    ORDER BY created_at ASC
    LIMIT 1
  `;

  const result = await query(sql);
  return result.rows[0] || null;
}

export async function createBusinessProfile(payload) {
  const sql = `
    INSERT INTO business_profile (
      business_name,
      legal_name,
      business_email,
      business_phone,
      website_url,
      description,
      address_line,
      city,
      region,
      country,
      postal_code,
      attention_zones,
      business_hours,
      primary_contact_name,
      primary_contact_email,
      primary_contact_phone,
      created_by
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17
    )
    RETURNING *
  `;

  const values = [
    payload.business_name,
    payload.legal_name,
    payload.business_email,
    payload.business_phone,
    payload.website_url,
    payload.description,
    payload.address_line,
    payload.city,
    payload.region,
    payload.country,
    payload.postal_code,
    payload.attention_zones,
    payload.business_hours,
    payload.primary_contact_name,
    payload.primary_contact_email,
    payload.primary_contact_phone,
    payload.created_by
  ];

  const result = await query(sql, values);
  return result.rows[0];
}

export async function updateBusinessProfile(id, payload) {
  const sql = `
    UPDATE business_profile
    SET
      business_name = $2,
      legal_name = $3,
      business_email = $4,
      business_phone = $5,
      website_url = $6,
      description = $7,
      address_line = $8,
      city = $9,
      region = $10,
      country = $11,
      postal_code = $12,
      attention_zones = $13,
      business_hours = $14,
      primary_contact_name = $15,
      primary_contact_email = $16,
      primary_contact_phone = $17,
      updated_at = NOW()
    WHERE id = $1
    RETURNING *
  `;

  const values = [
    id,
    payload.business_name,
    payload.legal_name,
    payload.business_email,
    payload.business_phone,
    payload.website_url,
    payload.description,
    payload.address_line,
    payload.city,
    payload.region,
    payload.country,
    payload.postal_code,
    payload.attention_zones,
    payload.business_hours,
    payload.primary_contact_name,
    payload.primary_contact_email,
    payload.primary_contact_phone
  ];

  const result = await query(sql, values);
  return result.rows[0] || null;
}