import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { listCommercialRequests } from '../../services/commercialRequestsService';

const requestTypeLabels = {
  contact_request: 'Contacto',
  call: 'Llamada',
  meeting: 'Reunión',
  visit: 'Visita',
};

function CommercialRequestsPage() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let ignore = false;

    async function loadData() {
      try {
        setIsLoading(true);
        setErrorMessage('');
        const response = await listCommercialRequests();

        if (!ignore) {
          setItems(response.data.items ?? []);
        }
      } catch (error) {
        if (!ignore) {
          setErrorMessage(
            error?.error?.message || 'No se pudieron cargar las solicitudes.'
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

  const pendingCount = useMemo(
    () => items.filter((item) => item.request_status === 'pending').length,
    [items]
  );

  const confirmedCount = useMemo(
    () => items.filter((item) => item.request_status === 'confirmed').length,
    [items]
  );

  const completedCount = useMemo(
    () => items.filter((item) => item.request_status === 'completed').length,
    [items]
  );

  return (
    <section className="commercial-requests-page commercial-requests-page--wow">
      <div className="content-page-card commercial-requests-hero">
        <div className="commercial-requests-hero__copy">
          <span className="mini-chip">Solicitudes</span>

          <h3 className="content-page-title">
            <span className="native-title-icon" aria-hidden="true">
              ✓
            </span>
            Agenda comercial
          </h3>

          <p className="content-page-copy">
            Revisa las solicitudes generadas por las conversaciones: contactos,
            llamadas, reuniones o visitas pendientes de gestión.
          </p>
        </div>

        <aside
          className="commercial-requests-meter"
          aria-label="Resumen de solicitudes comerciales"
        >
          <div className="commercial-requests-meter__orb" aria-hidden="true">
            ✓
          </div>

          <div>
            <span>Operación comercial</span>
            <strong>{items.length} solicitudes</strong>
            <small>
              {pendingCount} pendientes · {confirmedCount} confirmadas
            </small>
          </div>
        </aside>
      </div>

      <div className="commercial-request-kpi-strip" aria-label="Indicadores rápidos">
        <article className="commercial-request-mini-kpi">
          <span aria-hidden="true">✓</span>
          <div>
            <strong>{items.length}</strong>
            <small>Total</small>
          </div>
        </article>

        <article className="commercial-request-mini-kpi">
          <span aria-hidden="true">◌</span>
          <div>
            <strong>{pendingCount}</strong>
            <small>Pendientes</small>
          </div>
        </article>

        <article className="commercial-request-mini-kpi">
          <span aria-hidden="true">●</span>
          <div>
            <strong>{completedCount}</strong>
            <small>Completadas</small>
          </div>
        </article>
      </div>

      {isLoading ? (
        <div className="content-page-card dashboard-state-card dashboard-state-card--loading commercial-requests-state-card">
          <div className="dashboard-state-orbit" aria-hidden="true">
            <span>✓</span>
          </div>

          <span className="mini-chip">Solicitudes</span>
          <h3 className="content-page-title">Cargando solicitudes</h3>
          <p className="content-page-copy">
            Recuperando agenda comercial desde la API privada.
          </p>
        </div>
      ) : null}

      {errorMessage ? (
        <div className="content-page-card dashboard-state-card dashboard-state-card--error commercial-requests-state-card">
          <div className="dashboard-state-orbit" aria-hidden="true">
            <span>!</span>
          </div>

          <span className="mini-chip">Solicitudes</span>
          <h3 className="content-page-title">Error al cargar</h3>
          <p className="content-page-copy">{errorMessage}</p>
        </div>
      ) : null}

      {!isLoading && !errorMessage && items.length === 0 ? (
        <div className="commercial-requests-empty-state">
          <span className="commercial-requests-empty-state__icon" aria-hidden="true">
            ✓
          </span>
          <strong>No hay solicitudes comerciales todavía.</strong>
          <p>
            Cuando un lead avance hacia llamada, reunión, visita o contacto, la
            solicitud aparecerá aquí con sus preferencias de agenda.
          </p>
        </div>
      ) : null}

      {!isLoading && !errorMessage && items.length > 0 ? (
        <div className="commercial-request-list">
          {items.map((item) => {
            const isPending = item.request_status === 'pending';
            const isCompleted = item.request_status === 'completed';
            const displayName = item.full_name || 'Contacto sin nombre';
            const displayEmail = item.email || 'Sin email';
            const displayPhone = item.phone || 'Sin teléfono';
            const requestType =
              requestTypeLabels[item.request_type] || item.request_type || 'Solicitud';
            const status = item.request_status || 'pending';
            const preferredDate = item.preferred_date
              ? new Date(item.preferred_date).toLocaleDateString('es-ES')
              : 'Sin fecha';
            const preferredTime = item.preferred_time || 'Sin hora';
            const preferredRange = item.preferred_time_range || 'Sin franja';

            return (
              <article
                key={item.id}
                className={`commercial-request-card ${
                  isPending ? 'commercial-request-card--pending' : ''
                } ${isCompleted ? 'commercial-request-card--completed' : ''}`}
              >
                <div className="commercial-request-card__avatar" aria-hidden="true">
                  {isCompleted ? '✓' : isPending ? '◌' : '●'}
                </div>

                <div className="commercial-request-card__main">
                  <div className="commercial-request-card__top">
                    <div>
                      <h4>{displayName}</h4>
                      <p>{displayEmail} · {displayPhone}</p>
                    </div>

                    <span
                      className={`status-badge ${
                        isPending
                          ? 'status-badge--inactive'
                          : 'status-badge--active'
                      }`}
                    >
                      {status}
                    </span>
                  </div>

                  <div className="commercial-request-card__chips">
                    <span>◆ {requestType}</span>
                    <span>◷ {preferredDate}</span>
                    <span>⌚ {preferredTime}</span>
                    <span>◌ {preferredRange}</span>
                  </div>

                  <p className="commercial-request-card__summary">
                    {item.details || 'Solicitud sin detalles adicionales.'}
                  </p>
                </div>

                <Link
                  className="secondary-btn inline-action-btn commercial-request-card__cta"
                  to={`/app/commercial-requests/${item.id}`}
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

export default CommercialRequestsPage;