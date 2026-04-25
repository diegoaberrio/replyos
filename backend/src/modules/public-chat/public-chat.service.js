import { AppError } from "../../common/errors/app-error.js";
import {
  getBusinessProfileIdForChat,
  getAgentSettingsForChat,
  createConversationRepository,
  getConversationByPublicIdentifierRepository,
  listConversationMessagesRepository,
  appendVisitorAndAgentMessagesRepository,
  getBusinessProfileForChat,
  listFaqsForChat,
  listServicesForChat,
  listRecentConversationMessagesRepository,
  getLeadByConversationIdRepository,
} from "./public-chat.repository.js";
import { generateOpenAIReply } from "./openai-reply.js";

function normalizeIntentText(text = "") {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function detectIntent(messageText) {
  const text = normalizeIntentText(messageText);

  const asksForSchedulingDirectly =
    text.includes("agendar") ||
    text.includes("agenda") ||
    text.includes("reunion") ||
    text.includes("llamada") ||
    text.includes("cita") ||
    text.includes("visita") ||
    text.includes("reservar") ||
    text.includes("podemos hablar") ||
    text.includes("quiero hablar contigo") ||
    text.includes("quiero hablarlo contigo") ||
    text.includes("me gustaria una reunion") ||
    text.includes("me gustaria una llamada") ||
    text.includes("me gustaria agendar") ||
    text.includes("quiero una reunion") ||
    text.includes("quiero una llamada") ||
    text.includes("quiero agendar") ||
    text.includes("quiero avanzar") ||
    text.includes("siguiente paso") ||
    text.includes("cuando podemos hablar") ||
    text.includes("podemos agendar") ||
    text.includes("podemos vernos");

  const indicatesLeadAlreadyCapturedByText =
    text.includes("ya te he dado mis datos") ||
    text.includes("ya te deje mis datos") ||
    text.includes("ya tienes mis datos") ||
    text.includes("ya te pase mis datos") ||
    text.includes("ya he dejado mis datos");

  const showsClearCommercialInterest =
    text.includes("me interesa") ||
    text.includes("me encaja") ||
    text.includes("podria encajar") ||
    text.includes("quiero verlo") ||
    text.includes("quiero mas informacion") ||
    text.includes("me gustaria verlo") ||
    text.includes("si tiene sentido") ||
    text.includes("como lo plantearias") ||
    text.includes("que me recomendarias") ||
    text.includes("que opcion encaja mas") ||
    text.includes("landing") ||
    text.includes("automatizacion") ||
    text.includes("web") ||
    text.includes("app") ||
    text.includes("agente") ||
    text.includes("ia") ||
    text.includes("precio") ||
    text.includes("servicio") ||
    text.includes("servicios");

  if (asksForSchedulingDirectly || indicatesLeadAlreadyCapturedByText) {
    return {
      detected_intent: "ready_to_advance",
      status: "in_follow_up",
      result: "interest_without_closure",
    };
  }

  if (showsClearCommercialInterest) {
    return {
      detected_intent: "commercial_interest",
      status: "open",
      result: "none",
    };
  }

  return {
    detected_intent: "information",
    status: "open",
    result: "none",
  };
}

function buildRecentAgentWindow(recentMessages = []) {
  return recentMessages
    .filter((msg) => msg.sender_type === "agent")
    .slice(-3)
    .map((msg) => normalizeIntentText(msg.message_text))
    .join(" ");
}

function buildUiHints({ detected_intent, recentMessages, hasLead }) {
  const recentAgentText = buildRecentAgentWindow(recentMessages);

  const alreadyPromptedLead =
    recentAgentText.includes("formulario que he abierto para ti") ||
    recentAgentText.includes("dejar tus datos de contacto") ||
    recentAgentText.includes("dejarme tus datos") ||
    recentAgentText.includes("tu nombre o el de tu empresa") ||
    recentAgentText.includes("nombre o el de tu empresa") ||
    recentAgentText.includes("forma de contacto");

  const alreadyPromptedRequest =
    recentAgentText.includes("llamada, cita o reunion") ||
    recentAgentText.includes("proponer una llamada") ||
    recentAgentText.includes("preferencia de reunion o contacto") ||
    recentAgentText.includes("dejar tu preferencia") ||
    recentAgentText.includes("agenda que he abierto para ti") ||
    recentAgentText.includes("llamada o reunion");

  if (detected_intent === "ready_to_advance") {
    if (hasLead) {
      return {
        should_prompt_lead: false,
        should_prompt_request: !alreadyPromptedRequest,
        next_recommended_step: "request",
      };
    }

    return {
      should_prompt_lead: !alreadyPromptedLead,
      should_prompt_request: false,
      next_recommended_step: "lead",
    };
  }

  if (detected_intent === "commercial_interest") {
    return {
      should_prompt_lead: !alreadyPromptedLead,
      should_prompt_request: false,
      next_recommended_step: "lead",
    };
  }

  return {
    should_prompt_lead: false,
    should_prompt_request: false,
    next_recommended_step: "contact",
  };
}

function normalizeText(text = "") {
  return normalizeIntentText(text);
}

function alreadyMentionsLeadInvitation(text = "") {
  const normalized = normalizeText(text);

  return (
    normalized.includes("formulario que he abierto para ti") ||
    normalized.includes("dejar tus datos de contacto") ||
    normalized.includes("dejarme tus datos") ||
    normalized.includes("nombre o el de tu empresa") ||
    normalized.includes("forma de contacto")
  );
}

function alreadyMentionsRequestInvitation(text = "") {
  const normalized = normalizeText(text);

  return (
    normalized.includes("llamada, cita o reunion") ||
    normalized.includes("proponer una llamada") ||
    normalized.includes("preferencia de reunion") ||
    normalized.includes("dejar tu preferencia") ||
    normalized.includes("fase 3") ||
    normalized.includes("agenda que he abierto para ti")
  );
}

function enrichReplyWithPhaseInvitation({ replyText, uiHints }) {
  const safeReply = (replyText || "").trim();

  if (!safeReply) {
    return safeReply;
  }

  if (
    uiHints?.should_prompt_request &&
    !alreadyMentionsRequestInvitation(safeReply)
  ) {
    return `${safeReply} Si te encaja avanzar, te invito a dejar tu preferencia de llamada, cita o reunión en el formulario que he abierto para ti.`;
  }

  if (
    uiHints?.should_prompt_lead &&
    !alreadyMentionsLeadInvitation(safeReply)
  ) {
    return `${safeReply} Si te parece, te invito a dejar tus datos de contacto en el formulario que he abierto para ti y así sé mejor con quién hablo y cómo orientarte.`;
  }

  return safeReply;
}

export async function createConversationService(payload) {
  const businessProfileId = await getBusinessProfileIdForChat();

  if (!businessProfileId) {
    throw new AppError(
      "El negocio no está configurado todavía",
      400,
      "BUSINESS_PROFILE_REQUIRED"
    );
  }

  const conversation = await createConversationRepository({
    business_profile_id: businessProfileId,
    visitor_name: payload.visitor_name || null,
    visitor_email: payload.visitor_email || null,
    visitor_phone: payload.visitor_phone || null,
  });

  const agentSettings = await getAgentSettingsForChat();

  return {
    conversation_id: conversation.id,
    public_identifier: conversation.public_identifier,
    status: conversation.status,
    detected_intent: conversation.detected_intent,
    result: conversation.result,
    welcome_message:
      agentSettings?.welcome_message || "Hola, ¿en qué puedo ayudarte?",
    ui_hints: {
      should_prompt_lead: false,
      should_prompt_request: false,
      next_recommended_step: "contact",
    },
  };
}

export async function sendMessageService(publicIdentifier, payload) {
  const conversation =
    await getConversationByPublicIdentifierRepository(publicIdentifier);

  if (!conversation) {
    throw new AppError(
      "Conversación no encontrada",
      404,
      "CONVERSATION_NOT_FOUND"
    );
  }

  const agentSettings = await getAgentSettingsForChat();

  if (!agentSettings || !agentSettings.is_active) {
    throw new AppError(
      "El agente no está disponible actualmente",
      503,
      "AGENT_NOT_AVAILABLE"
    );
  }

  const [businessProfile, faqs, services, recentMessages, existingLead] =
    await Promise.all([
      getBusinessProfileForChat(),
      listFaqsForChat(),
      listServicesForChat(),
      listRecentConversationMessagesRepository(conversation.id, 12),
      getLeadByConversationIdRepository(conversation.id),
    ]);

  const intentPatch = detectIntent(payload.message_text);

  let aiReply;
  try {
    aiReply = await generateOpenAIReply({
      businessProfile,
      agentSettings,
      faqs,
      services,
      recentMessages,
      userMessageText: payload.message_text,
    });
  } catch (error) {
    console.error("[OPENAI_ERROR]", error);

    aiReply = {
      text:
        agentSettings?.fallback_message ||
        "No tengo esa información exacta ahora mismo, pero si quieres puedo ayudarte a orientarlo un poco mejor.",
      model: "fallback-local",
    };
  }

  const uiHints = buildUiHints({
    detected_intent: intentPatch.detected_intent,
    recentMessages: [
      ...recentMessages,
      { sender_type: "agent", message_text: aiReply.text },
    ],
    hasLead: Boolean(existingLead),
  });

  const enrichedAgentText = enrichReplyWithPhaseInvitation({
    replyText: aiReply.text,
    uiHints,
  });

  const result = await appendVisitorAndAgentMessagesRepository({
    conversation_id: conversation.id,
    user_message_text: payload.message_text,
    agent_message_text: enrichedAgentText,
    model_name: aiReply.model,
    status: intentPatch.status,
    detected_intent: intentPatch.detected_intent,
    result: intentPatch.result,
    summary: `Última interacción clasificada como ${intentPatch.detected_intent}`,
  });

  return {
    ...result,
    ui_hints: buildUiHints({
      detected_intent: intentPatch.detected_intent,
      recentMessages: [
        ...recentMessages,
        { sender_type: "agent", message_text: enrichedAgentText },
      ],
      hasLead: Boolean(existingLead),
    }),
  };
}

export async function getConversationPublicService(publicIdentifier) {
  const conversation =
    await getConversationByPublicIdentifierRepository(publicIdentifier);

  if (!conversation) {
    throw new AppError(
      "Conversación no encontrada",
      404,
      "CONVERSATION_NOT_FOUND"
    );
  }

  return conversation;
}

export async function getConversationMessagesPublicService(publicIdentifier) {
  const conversation =
    await getConversationByPublicIdentifierRepository(publicIdentifier);

  if (!conversation) {
    throw new AppError(
      "Conversación no encontrada",
      404,
      "CONVERSATION_NOT_FOUND"
    );
  }

  const [messages, existingLead] = await Promise.all([
    listConversationMessagesRepository(conversation.id),
    getLeadByConversationIdRepository(conversation.id),
  ]);

  return {
    conversation,
    messages,
    ui_hints: buildUiHints({
      detected_intent: conversation.detected_intent,
      recentMessages: messages,
      hasLead: Boolean(existingLead),
    }),
  };
}