import pg from "pg";
import { env } from "./env.js";

const { Pool } = pg;

export const pool = new Pool({
  connectionString: env.databaseUrl
});

export async function query(text, params = []) {
  const result = await pool.query(text, params);
  return result;
}

export async function testConnection() {
  const result = await pool.query("SELECT NOW() AS current_time");
  return result.rows[0];
}

export async function withTransaction(callback) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}