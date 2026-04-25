import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { listConversations } from '../../services/conversationsService';

function ConversationsPage() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let ignore = false;

    async function loadData() {
      try {
        setIsLoading(true);
        setErrorMessage('');
        const response = await listConversations();

        if (!ignore) {
          setItems(response.data.items ?? []);
        }
      } catch (error) {
        if (!ignore) {
          setErrorMessage(
            error?.error?.message || 'No se pudieron cargar las conversaciones.'
          );
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      ignore = true;
    };
  }, []);

  const convertedCount = useMemo(
    () => items.filter((item) => item.status === 'converted').length,
    [items]
  );

  const followUpCount = useMemo(
    () => items.filter((item) => item.status === 'in_follow_up').length,
    [items]
  );

  const readyToAdvanceCount = useMemo(
    () => items.filter((item) => item.detected_intent === 'ready_to_advance').length,
    [items]
  );

  return (
    <section className="conversations-page conversations-page--wow">
      <div className="content-page-card conversations-hero">
        <div className="conversations-hero__copy">
          <span className="mini-chip">Conversaciones</span>

          <h3 className="content-page-title">
            <span className="native-title-icon" aria-hidden="true">
              ✉
            </span>
            Inbox conversacional
          </h3>

          <p className="content-page-copy">
            Revisa las conversaciones públicas registradas, su intención
            detectada y el avance comercial de cada interacción.
          </p>
        </div>

        <aside className="conversations-meter" aria-label="Resumen de conversaciones">
          <div className="conversations-meter__orb" aria-hidden="true">
            ✉
          </div>

          <div>
            <span>Actividad capturada</span>
            <strong>{items.length} conversaciones</strong>
            <small>{convertedCount} convertidas · {followUpCount} en seguimiento</small>
          </div>
        </aside>
      </div>

      <div className="conversation-kpi-strip" aria-label="Indicadores rápidos">
        <article className="conversation-mini-kpi">
          <span aria-hidden="true">✉</span>
          <div>
            <strong>{items.length}</strong>
            <small>Total</small>
          </div>
        </article>

        <article className="conversation-mini-kpi">
          <span aria-hidden="true">✓</span>
          <div>
            <strong>{convertedCount}</strong>
            <small>Convertidas</small>
          </div>
        </article>

        <article className="conversation-mini-kpi">
          <span aria-hidden="true">→</span>
          <div>
            <strong>{readyToAdvanceCount}</strong>
            <small>Listas para avanzar</small>
          </div>
        </article>
      </div>

      {isLoading ? (
        <div className="content-page-card dashboard-state-card dashboard-state-card--loading conversations-state-card">
          <div className="dashboard-state-orbit" aria-hidden="true">
            <span>✉</span>
          </div>

          <span className="mini-chip">Inbox</span>
          <h3 className="content-page-title">Cargando conversaciones</h3>
          <p className="content-page-copy">
            Recuperando interacciones públicas desde la API privada.
          </p>
        </div>
      ) : null}

      {errorMessage ? (
        <div className="content-page-card dashboard-state-card dashboard-state-card--error conversations-state-card">
          <div className="dashboard-state-orbit" aria-hidden="true">
            <span>!</span>
          </div>

          <span className="mini-chip">Inbox</span>
          <h3 className="content-page-title">Error al cargar</h3>
          <p className="content-page-copy">{errorMessage}</p>
        </div>
      ) : null}

      {!isLoading && !errorMessage && items.length === 0 ? (
        <div className="conversations-empty-state">
          <span className="conversations-empty-state__icon" aria-hidden="true">
            ✉
          </span>
          <strong>No hay conversaciones registradas todavía.</strong>
          <p>
            Cuando un visitante use el chat público, sus mensajes aparecerán aquí
            con estado, intención y resultado comercial.
          </p>
        </div>
      ) : null}

      {!isLoading && !errorMessage && items.length > 0 ? (
        <div className="conversation-inbox-list">
          {items.map((item) => {
            const isConverted = item.status === 'converted';
            const displayName = item.visitor_name || 'Visitante sin nombre';
            const displayEmail = item.visitor_email || 'Sin email registrado';
            const intent = item.detected_intent || 'unknown';
            const channel = item.source_channel || 'web';

            return (
              <article
                key={item.id}
                className={`conversation-card ${
                  isConverted ? 'conversation-card--converted' : ''
                }`}
              >
                <div className="conversation-card__avatar" aria-hidden="true">
                  {isConverted ? '✓' : '✉'}
                </div>

                <div className="conversation-card__main">
                  <div className="conversation-card__top">
                    <div>
                      <h4>{displayName}</h4>
                      <p>{displayEmail}</p>
                    </div>

                    <span
                      className={`status-badge ${
                        isConverted
                          ? 'status-badge--active'
                          : 'status-badge--inactive'
                      }`}
                    >
                      {item.status || 'open'}
                    </span>
                  </div>

                  <div className="conversation-card__chips">
                    <span>◌ {channel}</span>
                    <span>◆ {intent}</span>
                    <span>● {item.result || 'none'}</span>
                  </div>

                  <p className="conversation-card__summary">
                    {item.summary || 'Sin resumen conversacional disponible.'}
                  </p>
                </div>

                <Link
                  className="secondary-btn inline-action-btn conversation-card__cta"
                  to={`/app/conversations/${item.id}`}
                >
                  Ver detalle
                </Link>
              </article>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}

export default ConversationsPage;