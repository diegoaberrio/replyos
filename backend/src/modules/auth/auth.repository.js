import { query } from "../../config/db.js";

export async function findAdminByEmail(email) {
  const sql = `
    SELECT id, full_name, email, password_hash, status, last_login_at, created_at, updated_at
    FROM admin_users
    WHERE email = $1
    LIMIT 1
  `;

  const result = await query(sql, [email]);
  return result.rows[0] || null;
}

export async function findAdminById(id) {
  const sql = `
    SELECT id, full_name, email, status, last_login_at, created_at, updated_at
    FROM admin_users
    WHERE id = $1
    LIMIT 1
  `;

  const result = await query(sql, [id]);
  return result.rows[0] || null;
}

export async function updateLastLogin(id) {
  const sql = `
    UPDATE admin_users
    SET last_login_at = NOW(),
        updated_at = NOW()
    WHERE id = $1
  `;

  await query(sql, [id]);
}