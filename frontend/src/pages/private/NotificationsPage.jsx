import { useEffect, useMemo, useState } from 'react';
import { listNotifications } from '../../services/notificationsService';

function NotificationsPage() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let ignore = false;

    async function loadData() {
      try {
        setIsLoading(true);
        setErrorMessage('');
        const response = await listNotifications();

        if (!ignore) {
          setItems(response.data.items ?? []);
        }
      } catch (error) {
        if (!ignore) {
          setErrorMessage(
            error?.error?.message || 'No se pudieron cargar las notificaciones.'
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

  const sentCount = useMemo(
    () => items.filter((item) => item.status === 'sent').length,
    [items]
  );

  const pendingCount = useMemo(
    () => items.filter((item) => item.status === 'pending').length,
    [items]
  );

  const failedCount = useMemo(
    () => items.filter((item) => item.status === 'failed').length,
    [items]
  );

  return (
    <section className="notifications-page notifications-page--wow">
      <div className="content-page-card notifications-hero">
        <div className="notifications-hero__copy">
          <span className="mini-chip">Notificaciones</span>

          <h3 className="content-page-title">
            <span className="native-title-icon" aria-hidden="true">
              ✉
            </span>
            Histórico de notificaciones
          </h3>

          <p className="content-page-copy">
            Auditoría visual de correos y avisos generados por leads,
            conversaciones y solicitudes comerciales.
          </p>
        </div>

        <aside className="notifications-meter" aria-label="Resumen de notificaciones">
          <div className="notifications-meter__orb" aria-hidden="true">
            ✉
          </div>

          <div>
            <span>Auditoría de envío</span>
            <strong>{items.length} notificaciones</strong>
            <small>{sentCount} enviadas · {pendingCount} pendientes</small>
          </div>
        </aside>
      </div>

      <div className="notification-kpi-strip" aria-label="Indicadores rápidos">
        <article className="notification-mini-kpi">
          <span aria-hidden="true">✉</span>
          <div>
            <strong>{items.length}</strong>
            <small>Total</small>
          </div>
        </article>

        <article className="notification-mini-kpi">
          <span aria-hidden="true">✓</span>
          <div>
            <strong>{sentCount}</strong>
            <small>Enviadas</small>
          </div>
        </article>

        <article className="notification-mini-kpi">
          <span aria-hidden="true">!</span>
          <div>
            <strong>{failedCount}</strong>
            <small>Fallidas</small>
          </div>
        </article>
      </div>

      {isLoading ? (
        <div className="content-page-card dashboard-state-card dashboard-state-card--loading notifications-state-card">
          <div className="dashboard-state-orbit" aria-hidden="true">
            <span>✉</span>
          </div>

          <span className="mini-chip">Notificaciones</span>
          <h3 className="content-page-title">Cargando histórico</h3>
          <p className="content-page-copy">
            Recuperando trazabilidad de envíos desde la API privada.
          </p>
        </div>
      ) : null}

      {errorMessage ? (
        <div className="content-page-card dashboard-state-card dashboard-state-card--error notifications-state-card">
          <div className="dashboard-state-orbit" aria-hidden="true">
            <span>!</span>
          </div>

          <span className="mini-chip">Notificaciones</span>
          <h3 className="content-page-title">Error al cargar</h3>
          <p className="content-page-copy">{errorMessage}</p>
        </div>
      ) : null}

      {!isLoading && !errorMessage && items.length === 0 ? (
        <div className="notifications-empty-state">
          <span className="notifications-empty-state__icon" aria-hidden="true">
            ✉
          </span>
          <strong>No hay notificaciones registradas todavía.</strong>
          <p>
            Cuando ReplyOS envíe correos al negocio o al lead, aparecerán aquí
            con estado, destinatario, canal y fecha de envío.
          </p>
        </div>
      ) : null}

      {!isLoading && !errorMessage && items.length > 0 ? (
        <div className="notification-list">
          {items.map((item) => {
            const isSent = item.status === 'sent';
            const isFailed = item.status === 'failed';
            const isPending = item.status === 'pending';
            const subject = item.subject || 'Notificación sin asunto';
            const recipientType = item.recipient_type || 'recipient';
            const recipientAddress = item.recipient_address || 'Sin dirección';
            const channel = item.channel || 'N/A';
            const status = item.status || 'unknown';
            const sentAt = item.sent_at
              ? item.sent_at.slice(0, 16).replace('T', ' ')
              : 'Pendiente de envío';

            return (
              <article
                key={item.id}
                className={`notification-card ${
                  isSent ? 'notification-card--sent' : ''
                } ${isFailed ? 'notification-card--failed' : ''} ${
                  isPending ? 'notification-card--pending' : ''
                }`}
              >
                <div className="notification-card__avatar" aria-hidden="true">
                  {isSent ? '✓' : isFailed ? '!' : '◌'}
                </div>

                <div className="notification-card__main">
                  <div className="notification-card__top">
                    <div>
                      <h4>{subject}</h4>
                      <p>{recipientType} · {recipientAddress}</p>
                    </div>

                    <span
                      className={`status-badge ${
                        isSent ? 'status-badge--active' : 'status-badge--inactive'
                      }`}
                    >
                      {status}
                    </span>
                  </div>

                  <div className="notification-card__chips">
                    <span>✉ Canal: {channel}</span>
                    <span>◷ {sentAt}</span>
                    <span>◆ Destino: {recipientType}</span>
                  </div>

                  <p className="notification-card__summary">
                    {isSent
                      ? 'Notificación enviada correctamente.'
                      : isFailed
                      ? 'El envío no se completó correctamente.'
                      : 'Notificación pendiente de envío o confirmación.'}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}

export default NotificationsPage;