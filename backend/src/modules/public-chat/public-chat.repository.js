import { query, withTransaction } from "../../config/db.js";

export async function getBusinessProfileIdForChat() {
  const sql = `
    SELECT id
    FROM business_profile
    ORDER BY created_at ASC
    LIMIT 1
  `;

  const result = await query(sql);
  return result.rows[0]?.id || null;
}

export async function getAgentSettingsForChat() {
  const sql = `
    SELECT id, commercial_goal, tone_style, general_instructions, welcome_message, fallback_message, is_active
    FROM agent_settings
    ORDER BY created_at ASC
    LIMIT 1
  `;

  const result = await query(sql);
  return result.rows[0] || null;
}

export async function createConversationRepository(payload) {
  const sql = `
    INSERT INTO conversations (
      business_profile_id,
      visitor_name,
      visitor_email,
      visitor_phone,
      source_channel,
      started_at,
      last_message_at,
      status,
      detected_intent,
      result
    ) VALUES ($1,$2,$3,$4,'web',NOW(),NOW(),'open','unknown','none')
    RETURNING *
  `;

  const result = await query(sql, [
    payload.business_profile_id,
    payload.visitor_name,
    payload.visitor_email,
    payload.visitor_phone
  ]);

  return result.rows[0];
}

export async function getConversationByPublicIdentifierRepository(publicIdentifier) {
  const sql = `
    SELECT *
    FROM conversations
    WHERE public_identifier = $1
    LIMIT 1
  `;

  const result = await query(sql, [publicIdentifier]);
  return result.rows[0] || null;
}

export async function listConversationMessagesRepository(conversationId) {
  const sql = `
    SELECT id, conversation_id, sender_type, message_text, message_order, model_name, created_at
    FROM conversation_messages
    WHERE conversation_id = $1
    ORDER BY message_order ASC, created_at ASC
  `;

  const result = await query(sql, [conversationId]);
  return result.rows;
}

export async function getNextMessageOrder(client, conversationId) {
  const sql = `
    SELECT COALESCE(MAX(message_order), 0) AS max_order
    FROM conversation_messages
    WHERE conversation_id = $1
  `;

  const result = await client.query(sql, [conversationId]);
  return Number(result.rows[0].max_order) + 1;
}

export async function addConversationMessage(client, payload) {
  const sql = `
    INSERT INTO conversation_messages (
      conversation_id,
      sender_type,
      message_text,
      message_order,
      model_name
    ) VALUES ($1,$2,$3,$4,$5)
    RETURNING id, conversation_id, sender_type, message_text, message_order, model_name, created_at
  `;

  const result = await client.query(sql, [
    payload.conversation_id,
    payload.sender_type,
    payload.message_text,
    payload.message_order,
    payload.model_name || null
  ]);

  return result.rows[0];
}

export async function updateConversationAfterMessage(client, conversationId, patch) {
  const sql = `
    UPDATE conversations
    SET
      last_message_at = NOW(),
      status = $2,
      detected_intent = $3,
      result = $4,
      summary = $5,
      updated_at = NOW()
    WHERE id = $1
    RETURNING *
  `;

  const result = await client.query(sql, [
    conversationId,
    patch.status,
    patch.detected_intent,
    patch.result,
    patch.summary || null
  ]);

  return result.rows[0];
}

export async function appendVisitorAndAgentMessagesRepository(payload) {
  return withTransaction(async (client) => {
    let nextOrder = await getNextMessageOrder(client, payload.conversation_id);

    const userMessage = await addConversationMessage(client, {
      conversation_id: payload.conversation_id,
      sender_type: "visitor",
      message_text: payload.user_message_text,
      message_order: nextOrder
    });

    nextOrder += 1;

    const agentMessage = await addConversationMessage(client, {
      conversation_id: payload.conversation_id,
      sender_type: "agent",
      message_text: payload.agent_message_text,
      message_order: nextOrder,
      model_name: payload.model_name || "mock-agent-v1"
    });

    const conversation = await updateConversationAfterMessage(
      client,
      payload.conversation_id,
      {
        status: payload.status,
        detected_intent: payload.detected_intent,
        result: payload.result,
        summary: payload.summary
      }
    );

    return {
      conversation,
      userMessage,
      agentMessage
    };
  });
}

export async function getBusinessProfileForChat() {
  const sql = `
    SELECT
      id,
      business_name,
      description,
      attention_zones,
      business_hours,
      business_email,
      business_phone,
      website_url
    FROM business_profile
    ORDER BY created_at ASC
    LIMIT 1
  `;

  const result = await query(sql);
  return result.rows[0] || null;
}

export async function listFaqsForChat() {
  const sql = `
    SELECT question, answer
    FROM faqs
    WHERE is_active = true
    ORDER BY sort_order ASC, created_at ASC
    LIMIT 20
  `;

  const result = await query(sql);
  return result.rows;
}

export async function listServicesForChat() {
  const sql = `
    SELECT name, short_description, detailed_description
    FROM services
    WHERE is_active = true
    ORDER BY created_at ASC
    LIMIT 20
  `;

  const result = await query(sql);
  return result.rows;
}

export async function listRecentConversationMessagesRepository(conversationId, limit = 12) {
  const sql = `
    SELECT id, conversation_id, sender_type, message_text, message_order, model_name, created_at
    FROM conversation_messages
    WHERE conversation_id = $1
    ORDER BY message_order DESC
    LIMIT $2
  `;

  const result = await query(sql, [conversationId, limit]);
  return result.rows.reverse();
}

export async function getLeadByConversationIdRepository(conversationId) {
  const sql = `
    SELECT id, conversation_id, full_name, email, phone, company_name, lead_status, captured_at
    FROM leads
    WHERE conversation_id = $1
    LIMIT 1
  `;

  const result = await query(sql, [conversationId]);
  return result.rows[0] || null;
}