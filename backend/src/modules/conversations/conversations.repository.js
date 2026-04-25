import { query } from "../../config/db.js";

export async function listConversationsRepository() {
  const sql = `
    SELECT
      id,
      public_identifier,
      visitor_name,
      visitor_email,
      visitor_phone,
      source_channel,
      started_at,
      last_message_at,
      status,
      detected_intent,
      result,
      summary,
      created_at,
      updated_at
    FROM conversations
    ORDER BY started_at DESC
  `;

  const result = await query(sql);
  return result.rows;
}

export async function getConversationDetailRepository(id) {
  const conversationSql = `
    SELECT
      id,
      business_profile_id,
      public_identifier,
      visitor_name,
      visitor_email,
      visitor_phone,
      source_channel,
      started_at,
      last_message_at,
      status,
      detected_intent,
      result,
      summary,
      notes,
      closed_at,
      created_at,
      updated_at
    FROM conversations
    WHERE id = $1
    LIMIT 1
  `;

  const conversationResult = await query(conversationSql, [id]);
  const conversation = conversationResult.rows[0] || null;

  if (!conversation) {
    return null;
  }

  const messagesSql = `
    SELECT id, conversation_id, sender_type, message_text, message_order, model_name, created_at
    FROM conversation_messages
    WHERE conversation_id = $1
    ORDER BY message_order ASC, created_at ASC
  `;

  const messagesResult = await query(messagesSql, [id]);

  return {
    conversation,
    messages: messagesResult.rows
  };
}