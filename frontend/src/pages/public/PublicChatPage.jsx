import { useEffect, useMemo, useRef, useState } from 'react';
import {
  clearPublicChatSession,
  getPublicChatSession,
  savePublicChatSession,
} from '../../utils/publicChatStorage';
import {
  createPublicCommercialRequest,
  createPublicConversation,
  createPublicLead,
  getPublicConversationMessages,
  sendPublicMessage,
} from '../../services/publicChatService';

const INITIAL_LEAD_FORM = {
  full_name: '',
  email: '',
  phone: '',
  company_name: '',
  notes: '',
};

const INITIAL_REQUEST_FORM = {
  request_type: 'meeting',
  preferred_date: '',
  preferred_time: '',
  preferred_time_range: '',
  details: '',
};

const FLOW_STEPS = {
  contact: {
    icon: '✉',
    phase: 'Fase 1',
    title: 'Contacto',
  },
  lead: {
    icon: '◈',
    phase: 'Fase 2',
    title: 'Lead',
  },
  agenda: {
    icon: '✓',
    phase: 'Fase 3',
    title: 'Reunión o agenda',
  },
};

function PublicChatPage() {
  const [publicIdentifier, setPublicIdentifier] = useState(null);
  const [messages, setMessages] = useState([]);
  const [conversation, setConversation] = useState(null);
  const [uiHints, setUiHints] = useState({
    should_prompt_lead: false,
    should_prompt_request: false,
    next_recommended_step: 'contact',
  });

  const [messageInput, setMessageInput] = useState('');
  const [isBooting, setIsBooting] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [leadForm, setLeadForm] = useState(INITIAL_LEAD_FORM);
  const [requestForm, setRequestForm] = useState(INITIAL_REQUEST_FORM);

  const [isLeadSubmitting, setIsLeadSubmitting] = useState(false);
  const [isRequestSubmitting, setIsRequestSubmitting] = useState(false);

  const [openAccordion, setOpenAccordion] = useState('contact');
  const [floatingAction, setFloatingAction] = useState(null);

  const chatComposerRef = useRef(null);
  const chatMessagesRef = useRef(null);
  const leadSectionRef = useRef(null);
  const requestSectionRef = useRef(null);

  function scrollToElement(element) {
    if (!element) {
      return;
    }

    element.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }

  function scrollChatToLatestEvent() {
    const chatMessagesElement = chatMessagesRef.current;

    if (!chatMessagesElement) {
      return;
    }

    window.requestAnimationFrame(() => {
      chatMessagesElement.scrollTo({
        top: chatMessagesElement.scrollHeight,
        behavior: 'smooth',
      });
    });
  }

  function showFloatingAction(type) {
    if (type === 'lead') {
      setFloatingAction({
        type: 'lead',
        icon: '◈',
        title: 'Completar datos',
        copy: 'El agente ya puede registrar tu contacto.',
      });
      return;
    }

    if (type === 'agenda') {
      setFloatingAction({
        type: 'agenda',
        icon: '✓',
        title: 'Ir a agenda',
        copy: 'Registra tu preferencia de contacto.',
      });
      return;
    }

    if (type === 'chat') {
      setFloatingAction({
        type: 'chat',
        icon: '✉',
        title: 'Volver al chat',
        copy: 'Continúa la conversación con el agente.',
      });
      return;
    }

    setFloatingAction(null);
  }

  function handleFloatingActionClick() {
    if (!floatingAction) {
      return;
    }

    if (floatingAction.type === 'lead') {
      setOpenAccordion('lead');
      window.setTimeout(() => scrollToElement(leadSectionRef.current), 180);
      setFloatingAction(null);
      return;
    }

    if (floatingAction.type === 'agenda') {
      setOpenAccordion('agenda');
      window.setTimeout(() => scrollToElement(requestSectionRef.current), 180);
      setFloatingAction(null);
      return;
    }

    if (floatingAction.type === 'chat') {
      setOpenAccordion('contact');
      window.setTimeout(() => scrollToElement(chatComposerRef.current), 180);
      setFloatingAction(null);
    }
  }

  function applyUiHints(nextHints) {
    const safeHints = {
      should_prompt_lead: Boolean(nextHints?.should_prompt_lead),
      should_prompt_request: Boolean(nextHints?.should_prompt_request),
      next_recommended_step: nextHints?.next_recommended_step || 'contact',
    };

    setUiHints(safeHints);

    if (safeHints.next_recommended_step === 'request') {
      setOpenAccordion('agenda');
      showFloatingAction('agenda');
      return;
    }

    if (safeHints.next_recommended_step === 'lead') {
      setOpenAccordion('lead');
      showFloatingAction('lead');
      return;
    }

    setOpenAccordion('contact');
  }

  useEffect(() => {
    scrollChatToLatestEvent();
  }, [messages, isSending]);

  useEffect(() => {
    let ignore = false;

    async function bootstrapConversation() {
      try {
        setIsBooting(true);
        setErrorMessage('');

        const storedSession = getPublicChatSession();

        if (storedSession?.public_identifier) {
          const response = await getPublicConversationMessages(
            storedSession.public_identifier
          );

          if (!ignore) {
            setPublicIdentifier(storedSession.public_identifier);
            setConversation(response.data.conversation ?? null);
            setMessages(response.data.messages ?? []);
            applyUiHints(response.data.ui_hints);
          }

          return;
        }

        const created = await createPublicConversation({
          visitor_name: '',
          visitor_email: '',
          visitor_phone: '',
        });

        const nextIdentifier = created.data.public_identifier;

        savePublicChatSession({
          public_identifier: nextIdentifier,
        });

        if (!ignore) {
          setPublicIdentifier(nextIdentifier);
          setConversation({
            public_identifier: nextIdentifier,
            status: created.data.status,
            detected_intent: created.data.detected_intent,
            result: created.data.result,
          });

          setMessages([
            {
              id: 'welcome-local',
              sender_type: 'agent',
              message_text:
                created.data.welcome_message ||
                'Hola, soy el asistente virtual de ReplyOS. ¿En qué puedo ayudarte hoy?',
              created_at: new Date().toISOString(),
            },
          ]);

          applyUiHints(created.data.ui_hints);
        }
      } catch (error) {
        if (!ignore) {
          setErrorMessage(
            error?.error?.message ||
              'No se pudo iniciar la conversación pública.'
          );
        }
      } finally {
        if (!ignore) {
          setIsBooting(false);
        }
      }
    }

    bootstrapConversation();

    return () => {
      ignore = true;
    };
  }, []);

  const canShowLeadForm = useMemo(() => {
    const status = conversation?.status;
    const intent = conversation?.detected_intent;

    return (
      status === 'in_follow_up' ||
      status === 'converted' ||
      intent === 'commercial_interest' ||
      intent === 'ready_to_advance' ||
      uiHints.should_prompt_lead
    );
  }, [conversation, uiHints]);

  const canShowRequestForm = useMemo(() => {
    return (
      conversation?.detected_intent === 'ready_to_advance' ||
      canShowLeadForm ||
      uiHints.should_prompt_request
    );
  }, [conversation, canShowLeadForm, uiHints]);

  function toggleAccordion(section) {
    setOpenAccordion((prev) => (prev === section ? null : section));
  }

  function handleMessageChange(event) {
    setMessageInput(event.target.value);

    if (successMessage) {
      setSuccessMessage('');
    }

    if (errorMessage) {
      setErrorMessage('');
    }
  }

  async function handleSendMessage(event) {
    event.preventDefault();

    const cleanMessage = messageInput.trim();

    if (!cleanMessage || !publicIdentifier || isSending) {
      return;
    }

    const localMessageId = `visitor-local-${Date.now()}`;

    const optimisticUserMessage = {
      id: localMessageId,
      sender_type: 'visitor',
      message_text: cleanMessage,
      created_at: new Date().toISOString(),
      is_optimistic: true,
    };

    try {
      setIsSending(true);
      setErrorMessage('');
      setSuccessMessage('');
      setFloatingAction(null);
      setMessageInput('');

      setMessages((prev) => [...prev, optimisticUserMessage]);

      const response = await sendPublicMessage(publicIdentifier, {
        message_text: cleanMessage,
      });

      setConversation(response.data.conversation ?? null);
      setUiHints((prev) => ({
        ...prev,
        ...(response.data.ui_hints ?? {}),
      }));

      if (response.data.ui_hints) {
        applyUiHints(response.data.ui_hints);
      }

      setMessages((prev) => [
        ...prev.filter((message) => message.id !== localMessageId),
        response.data.userMessage,
        response.data.agentMessage,
      ]);
    } catch (error) {
      setMessages((prev) =>
        prev.filter((message) => message.id !== localMessageId)
      );

      setMessageInput(cleanMessage);

      setErrorMessage(
        error?.error?.message || 'No se pudo enviar el mensaje.'
      );
    } finally {
      setIsSending(false);
    }
  }

  function handleLeadChange(event) {
    const { name, value } = event.target;

    setLeadForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleLeadSubmit(event) {
    event.preventDefault();

    if (!publicIdentifier) {
      return;
    }

    if (!leadForm.email.trim() && !leadForm.phone.trim()) {
      setErrorMessage('Debes indicar al menos email o teléfono.');
      setOpenAccordion('lead');
      showFloatingAction('lead');
      return;
    }

    try {
      setIsLeadSubmitting(true);
      setErrorMessage('');
      setSuccessMessage('');
      setFloatingAction(null);

      await createPublicLead(publicIdentifier, leadForm);

      setSuccessMessage('Tus datos han quedado registrados correctamente.');
      setOpenAccordion('agenda');
      showFloatingAction('agenda');
    } catch (error) {
      setErrorMessage(
        error?.error?.message || 'No se pudieron registrar tus datos.'
      );
      setOpenAccordion('lead');
      showFloatingAction('lead');
    } finally {
      setIsLeadSubmitting(false);
    }
  }

  function handleRequestChange(event) {
    const { name, value } = event.target;

    setRequestForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleRequestSubmit(event) {
    event.preventDefault();

    if (!publicIdentifier) {
      return;
    }

    try {
      setIsRequestSubmitting(true);
      setErrorMessage('');
      setSuccessMessage('');
      setFloatingAction(null);

      await createPublicCommercialRequest(publicIdentifier, requestForm);

      setSuccessMessage(
        'Tu solicitud comercial ha sido registrada correctamente.'
      );
      setOpenAccordion('contact');
      showFloatingAction('chat');
    } catch (error) {
      setErrorMessage(
        error?.error?.message || 'No se pudo registrar la solicitud comercial.'
      );
      setOpenAccordion('agenda');
      showFloatingAction('agenda');
    } finally {
      setIsRequestSubmitting(false);
    }
  }

  function handleRestartConversation() {
    clearPublicChatSession();
    window.location.reload();
  }

  return (
    <div className="chat-page chat-page--public-real chat-page--wow">
      <div className="chat-window chat-window--wow">
        <div className="chat-window__header chat-window__header--wow">
          <div className="chat-window__heading">
            <span className="mini-chip">Chat público</span>

            <h3 className="chat-window__title">
              <span className="native-title-icon" aria-hidden="true">
                ✦
              </span>
              Conversación en tiempo real
            </h3>

            <p className="chat-window__copy">
              Flujo público conectado al backend real de ReplyOS.
            </p>
          </div>

          <div className="chat-window__actions">
            <span className="live-pill" aria-label="Estado de conexión">
              <span aria-hidden="true" />
              API + IA activa
            </span>

            <button
              className="secondary-btn"
              type="button"
              onClick={handleRestartConversation}
            >
              Empezar de nuevo
            </button>
          </div>
        </div>

        {isBooting ? (
          <div className="state-box state-box--info">
            <p>Iniciando conversación pública...</p>
          </div>
        ) : null}

        {errorMessage ? (
          <div className="form-feedback form-feedback--error">
            {errorMessage}
          </div>
        ) : null}

        {successMessage ? (
          <div className="form-feedback form-feedback--success">
            {successMessage}
          </div>
        ) : null}

        {!isBooting ? (
          <>
            <div
              ref={chatMessagesRef}
              className="chat-messages chat-messages--real chat-messages--wow chat-messages--focus-feed"
              role="log"
              aria-live="polite"
              aria-relevant="additions text"
            >
              {messages.map((message, index) => {
                const isAgent = message.sender_type === 'agent';

                return (
                  <article
                    key={message.id || `${message.sender_type}-${index}`}
                    className={`message-bubble ${
                      isAgent
                        ? 'message-bubble--agent'
                        : 'message-bubble--visitor'
                    } ${
                      message.is_optimistic ? 'message-bubble--pending' : ''
                    } message-bubble--wow`}
                  >
                    <div className="message-avatar" aria-hidden="true">
                      {isAgent ? '✦' : '◈'}
                    </div>

                    <div className="message-content">
                      <span className="message-role">
                        {isAgent ? 'Agente ReplyOS' : 'Visitante'}
                      </span>
                      <p>{message.message_text}</p>
                    </div>
                  </article>
                );
              })}

              {isSending ? (
                <article
                  className="message-bubble message-bubble--agent message-bubble--typing message-bubble--wow"
                  aria-live="polite"
                  aria-label="El agente está escribiendo"
                >
                  <div className="message-avatar" aria-hidden="true">
                    ✦
                  </div>

                  <div className="message-content">
                    <span className="message-role">Agente ReplyOS</span>

                    <div className="typing-indicator">
                      <span className="typing-indicator__label">
                        Escribiendo
                      </span>

                      <span className="typing-indicator__dots" aria-hidden="true">
                        <span />
                        <span />
                        <span />
                      </span>
                    </div>
                  </div>
                </article>
              ) : null}
            </div>

            <form
              ref={chatComposerRef}
              className="chat-composer chat-composer--wow"
              onSubmit={handleSendMessage}
            >
              <div className="chat-input-shell">
                <span className="chat-input-shell__icon" aria-hidden="true">
                  ✉
                </span>

                <input
                  className="chat-input"
                  type="text"
                  placeholder={
                    isSending
                      ? 'El agente está preparando la respuesta...'
                      : 'Escribe tu mensaje...'
                  }
                  value={messageInput}
                  onChange={handleMessageChange}
                  disabled={isSending}
                />
              </div>

              <button className="primary-btn" type="submit" disabled={isSending}>
                {isSending ? 'Enviando...' : 'Enviar'}
              </button>
            </form>
          </>
        ) : null}
      </div>

      <div className="public-chat-side-stack">
        <aside className="chat-side-card chat-side-card--status">
          <span className="mini-chip">Estado</span>
          <h3>
            <span className="native-title-icon" aria-hidden="true">
              ◌
            </span>
            Resumen conversacional
          </h3>

          <div className="detail-meta-grid detail-meta-grid--wow">
            <div className="detail-meta-card detail-meta-card--status">
              <span>Estado</span>
              <strong>{conversation?.status || 'open'}</strong>
            </div>

            <div className="detail-meta-card detail-meta-card--intent">
              <span>Intención</span>
              <strong>{conversation?.detected_intent || 'unknown'}</strong>
            </div>

            <div className="detail-meta-card detail-meta-card--result">
              <span>Resultado</span>
              <strong>{conversation?.result || 'none'}</strong>
            </div>
          </div>
        </aside>

        <aside className="chat-side-card chat-side-card--flow">
          <span className="mini-chip">Flujo guiado</span>
          <h3>
            <span className="native-title-icon" aria-hidden="true">
              ◆
            </span>
            Proceso comercial
          </h3>
          <p>
            Los tres pasos permanecen siempre visibles para que el usuario tenga
            contexto y control durante toda la conversación.
          </p>

          <div className="accordion-stack accordion-stack--wow">
            <section className="accordion-card accordion-card--flow">
              <button
                type="button"
                className={`accordion-trigger ${
                  openAccordion === 'contact' ? 'accordion-trigger--open' : ''
                }`}
                onClick={() => toggleAccordion('contact')}
              >
                <div className="flow-trigger-content">
                  <span className="flow-step-icon" aria-hidden="true">
                    {FLOW_STEPS.contact.icon}
                  </span>

                  <div>
                    <span className="accordion-step">
                      {FLOW_STEPS.contact.phase}
                    </span>
                    <strong>{FLOW_STEPS.contact.title}</strong>
                  </div>
                </div>

                <span className="accordion-indicator">
                  {openAccordion === 'contact' ? '−' : '+'}
                </span>
              </button>

              <div
                className={`accordion-content ${
                  openAccordion === 'contact' ? 'accordion-content--open' : ''
                }`}
              >
                <p className="accordion-copy">
                  Usa el chat para explicar tu necesidad, pedir información y
                  avanzar en la conversación con el agente.
                </p>
              </div>
            </section>

            <section
              ref={leadSectionRef}
              className="accordion-card accordion-card--flow"
            >
              <button
                type="button"
                className={`accordion-trigger ${
                  openAccordion === 'lead' ? 'accordion-trigger--open' : ''
                }`}
                onClick={() => toggleAccordion('lead')}
              >
                <div className="flow-trigger-content">
                  <span className="flow-step-icon" aria-hidden="true">
                    {FLOW_STEPS.lead.icon}
                  </span>

                  <div>
                    <span className="accordion-step">
                      {FLOW_STEPS.lead.phase}
                    </span>
                    <strong>{FLOW_STEPS.lead.title}</strong>
                  </div>
                </div>

                <span className="accordion-indicator">
                  {openAccordion === 'lead' ? '−' : '+'}
                </span>
              </button>

              <div
                className={`accordion-content ${
                  openAccordion === 'lead' ? 'accordion-content--open' : ''
                }`}
              >
                <p className="accordion-copy">
                  Deja tus datos cuando quieras que el negocio pueda continuar el
                  contacto contigo.
                </p>

                <form className="settings-form" onSubmit={handleLeadSubmit}>
                  <div className="settings-form-grid">
                    <label className="field-group field-group--full">
                      <span>Nombre completo</span>
                      <input
                        name="full_name"
                        value={leadForm.full_name}
                        onChange={handleLeadChange}
                      />
                    </label>

                    <label className="field-group">
                      <span>Email</span>
                      <input
                        name="email"
                        type="email"
                        value={leadForm.email}
                        onChange={handleLeadChange}
                      />
                    </label>

                    <label className="field-group">
                      <span>Teléfono</span>
                      <input
                        name="phone"
                        value={leadForm.phone}
                        onChange={handleLeadChange}
                      />
                    </label>

                    <label className="field-group field-group--full">
                      <span>Empresa</span>
                      <input
                        name="company_name"
                        value={leadForm.company_name}
                        onChange={handleLeadChange}
                      />
                    </label>

                    <label className="field-group field-group--full">
                      <span>Notas</span>
                      <textarea
                        name="notes"
                        rows="3"
                        value={leadForm.notes}
                        onChange={handleLeadChange}
                      />
                    </label>
                  </div>

                  <div className="settings-form-actions">
                    <button
                      className="primary-btn"
                      type="submit"
                      disabled={isLeadSubmitting}
                    >
                      {isLeadSubmitting ? 'Registrando...' : 'Registrar datos'}
                    </button>
                  </div>
                </form>

                {!canShowLeadForm ? (
                  <p className="accordion-hint">
                    Este paso puede completarse en cualquier momento, aunque suele
                    tener más sentido cuando ya existe interés comercial.
                  </p>
                ) : null}
              </div>
            </section>

            <section
              ref={requestSectionRef}
              className="accordion-card accordion-card--flow"
            >
              <button
                type="button"
                className={`accordion-trigger ${
                  openAccordion === 'agenda' ? 'accordion-trigger--open' : ''
                }`}
                onClick={() => toggleAccordion('agenda')}
              >
                <div className="flow-trigger-content">
                  <span className="flow-step-icon" aria-hidden="true">
                    {FLOW_STEPS.agenda.icon}
                  </span>

                  <div>
                    <span className="accordion-step">
                      {FLOW_STEPS.agenda.phase}
                    </span>
                    <strong>{FLOW_STEPS.agenda.title}</strong>
                  </div>
                </div>

                <span className="accordion-indicator">
                  {openAccordion === 'agenda' ? '−' : '+'}
                </span>
              </button>

              <div
                className={`accordion-content ${
                  openAccordion === 'agenda' ? 'accordion-content--open' : ''
                }`}
              >
                <p className="accordion-copy">
                  Cuando quieras avanzar, registra aquí tu preferencia de contacto,
                  llamada, reunión o visita.
                </p>

                <form className="settings-form" onSubmit={handleRequestSubmit}>
                  <div className="settings-form-grid">
                    <label className="field-group">
                      <span>Tipo</span>
                      <select
                        name="request_type"
                        value={requestForm.request_type}
                        onChange={handleRequestChange}
                      >
                        <option value="contact_request">
                          Solicitud de contacto
                        </option>
                        <option value="call">Llamada</option>
                        <option value="meeting">Reunión</option>
                        <option value="visit">Visita</option>
                      </select>
                    </label>

                    <label className="field-group">
                      <span>Fecha preferida</span>
                      <input
                        name="preferred_date"
                        type="date"
                        value={requestForm.preferred_date}
                        onChange={handleRequestChange}
                      />
                    </label>

                    <label className="field-group">
                      <span>Hora preferida</span>
                      <input
                        name="preferred_time"
                        type="time"
                        value={requestForm.preferred_time}
                        onChange={handleRequestChange}
                      />
                    </label>

                    <label className="field-group">
                      <span>Franja</span>
                      <input
                        name="preferred_time_range"
                        value={requestForm.preferred_time_range}
                        onChange={handleRequestChange}
                        placeholder="Ej. mañana"
                      />
                    </label>

                    <label className="field-group field-group--full">
                      <span>Detalles</span>
                      <textarea
                        name="details"
                        rows="3"
                        value={requestForm.details}
                        onChange={handleRequestChange}
                      />
                    </label>
                  </div>

                  <div className="settings-form-actions">
                    <button
                      className="primary-btn"
                      type="submit"
                      disabled={isRequestSubmitting}
                    >
                      {isRequestSubmitting
                        ? 'Registrando...'
                        : 'Registrar solicitud'}
                    </button>
                  </div>
                </form>

                {!canShowRequestForm ? (
                  <p className="accordion-hint">
                    Este paso suele utilizarse cuando la conversación ya ha
                    avanzado hacia una intención clara.
                  </p>
                ) : null}
              </div>
            </section>
          </div>
        </aside>
      </div>

      {floatingAction ? (
        <div className="mobile-flow-nudge" role="status" aria-live="polite">
          <button
            className="mobile-flow-nudge__button"
            type="button"
            onClick={handleFloatingActionClick}
          >
            <span className="mobile-flow-nudge__icon" aria-hidden="true">
              {floatingAction.icon}
            </span>

            <span className="mobile-flow-nudge__content">
              <strong>{floatingAction.title}</strong>
              <small>{floatingAction.copy}</small>
            </span>
          </button>

          <button
            className="mobile-flow-nudge__close"
            type="button"
            onClick={() => setFloatingAction(null)}
            aria-label="Ocultar sugerencia"
          >
            ×
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default PublicChatPage;