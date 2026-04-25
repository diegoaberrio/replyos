import { query } from "../../config/db.js";

export async function getAgentSettings() {
  const sql = `
    SELECT a.*
    FROM agent_settings a
    ORDER BY a.created_at ASC
    LIMIT 1
  `;

  const result = await query(sql);
  return result.rows[0] || null;
}

export async function createAgentSettings(payload) {
  const sql = `
    INSERT INTO agent_settings (
      business_profile_id,
      commercial_goal,
      tone_style,
      general_instructions,
      welcome_message,
      fallback_message,
      is_active
    ) VALUES ($1,$2,$3,$4,$5,$6,$7)
    RETURNING *
  `;

  const values = [
    payload.business_profile_id,
    payload.commercial_goal,
    payload.tone_style,
    payload.general_instructions,
    payload.welcome_message,
    payload.fallback_message,
    payload.is_active
  ];

  const result = await query(sql, values);
  return result.rows[0];
}

export async function updateAgentSettings(id, payload) {
  const sql = `
    UPDATE agent_settings
    SET
      commercial_goal = $2,
      tone_style = $3,
      general_instructions = $4,
      welcome_message = $5,
      fallback_message = $6,
      is_active = $7,
      updated_at = NOW()
    WHERE id = $1
    RETURNING *
  `;

  const values = [
    id,
    payload.commercial_goal,
    payload.tone_style,
    payload.general_instructions,
    payload.welcome_message,
    payload.fallback_message,
    payload.is_active
  ];

  const result = await query(sql, values);
  return result.rows[0] || null;
}