import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getConversationDetail } from '../../services/conversationsService';

function ConversationDetailPage() {
  const { id } = useParams();
  const [detail, setDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let ignore = false;

    async function loadDetail() {
      try {
        setIsLoading(true);
        setErrorMessage('');
        const response = await getConversationDetail(id);

        if (!ignore) {
          setDetail(response.data);
        }
      } catch (error) {
        if (!ignore) {
          setErrorMessage(
            error?.error?.message || 'No se pudo cargar el detalle.'
          );
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadDetail();

    return () => {
      ignore = true;
    };
  }, [id]);

  if (isLoading) {
    return (
      <section className="conversation-detail-page conversation-detail-page--wow">
        <div className="content-page-card dashboard-state-card dashboard-state-card--loading conversation-detail-state">
          <div className="dashboard-state-orbit" aria-hidden="true">
            <span>✉</span>
          </div>

          <span className="mini-chip">Detalle</span>
          <h3 className="content-page-title">Cargando conversación</h3>
          <p className="content-page-copy">
            Recuperando mensajes, estado e intención detectada.
          </p>
        </div>
      </section>
    );
  }

  if (errorMessage) {
    return (
      <section className="conversation-detail-page conversation-detail-page--wow">
        <div className="content-page-card dashboard-state-card dashboard-state-card--error conversation-detail-state">
          <div className="dashboard-state-orbit" aria-hidden="true">
            <span>!</span>
          </div>

          <span className="mini-chip">Detalle</span>
          <h3 className="content-page-title">Error al cargar</h3>
          <p className="content-page-copy">{errorMessage}</p>
        </div>
      </section>
    );
  }

  const conversation = detail?.conversation;
  const messages = detail?.messages ?? [];

  const visitorName = conversation?.visitor_name || 'Visitante sin nombre';
  const visitorEmail = conversation?.visitor_email || 'Sin email registrado';
  const visitorPhone = conversation?.visitor_phone || 'Sin teléfono';
  const status = conversation?.status || 'open';
  const intent = conversation?.detected_intent || 'unknown';
  const result = conversation?.result || 'none';
  const isConverted = status === 'converted';

  return (
    <section className="detail-layout conversation-detail-page conversation-detail-page--wow">
      <article className="content-page-card conversation-detail-hero">
        <div className="conversation-detail-identity">
          <div
            className={`conversation-detail-avatar ${
              isConverted ? 'conversation-detail-avatar--converted' : ''
            }`}
            aria-hidden="true"
          >
            {isConverted ? '✓' : '✉'}
          </div>

          <div>
            <span className="mini-chip">Conversación</span>

            <h3 className="content-page-title">
              <span className="native-title-icon" aria-hidden="true">
                ✉
              </span>
              {visitorName}
            </h3>

            <p className="content-page-copy">
              {visitorEmail} · {visitorPhone}
            </p>
          </div>
        </div>

        <aside className="conversation-detail-status-card" aria-label="Estado comercial">
          <span>Estado comercial</span>
          <strong>{status}</strong>
          <small>{intent} · {result}</small>
        </aside>
      </article>

      <article className="content-page-card conversation-detail-summary-card">
        <div className="detail-meta-grid detail-meta-grid--wow conversation-detail-meta-grid">
          <div className="detail-meta-card detail-meta-card--status">
            <span>Estado</span>
            <strong>{status}</strong>
          </div>

          <div className="detail-meta-card detail-meta-card--intent">
            <span>Intención</span>
            <strong>{intent}</strong>
          </div>

          <div className="detail-meta-card detail-meta-card--result">
            <span>Resultado</span>
            <strong>{result}</strong>
          </div>
        </div>

        <div className="conversation-summary-panel">
          <span className="conversation-summary-panel__icon" aria-hidden="true">
            ◌
          </span>

          <div>
            <strong>Resumen conversacional</strong>
            <p>
              {conversation?.summary ||
                'Esta conversación todavía no tiene un resumen disponible.'}
            </p>
          </div>
        </div>
      </article>

      <article className="content-page-card conversation-thread-card">
        <div className="conversation-thread-header">
          <div>
            <span className="mini-chip">Mensajes</span>
            <h3 className="content-page-title">Hilo de conversación</h3>
            <p className="content-page-copy">
              Secuencia de mensajes entre el visitante y el agente ReplyOS.
            </p>
          </div>

          <div className="conversation-thread-count" aria-hidden="true">
            <strong>{messages.length}</strong>
            <span>mensajes</span>
          </div>
        </div>

        {messages.length ? (
          <div className="message-thread message-thread--wow">
            {messages.map((message, index) => {
              const isAgent = message.sender_type === 'agent';

              return (
                <div
                  key={message.id}
                  className={`thread-bubble thread-bubble--wow ${
                    isAgent ? 'thread-bubble--agent' : 'thread-bubble--visitor'
                  }`}
                >
                  <div className="thread-bubble__avatar" aria-hidden="true">
                    {isAgent ? '✦' : '◈'}
                  </div>

                  <div className="thread-bubble__content">
                    <div className="thread-bubble__top">
                      <strong>{isAgent ? 'Agente ReplyOS' : 'Visitante'}</strong>
                      <span>#{index + 1}</span>
                    </div>

                    <p>{message.message_text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="conversations-empty-state conversation-detail-empty">
            <span className="conversations-empty-state__icon" aria-hidden="true">
              ✉
            </span>
            <strong>No hay mensajes registrados.</strong>
            <p>
              Cuando existan mensajes asociados a esta conversación, aparecerán
              aquí en orden cronológico.
            </p>
          </div>
        )}
      </article>
    </section>
  );
}

export default ConversationDetailPage;