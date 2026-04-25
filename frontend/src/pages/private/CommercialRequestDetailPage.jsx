import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCommercialRequestDetail } from '../../services/commercialRequestsService';

const requestTypeLabels = {
  contact_request: 'Solicitud de contacto',
  call: 'Llamada',
  meeting: 'Reunión',
  visit: 'Visita',
};

function CommercialRequestDetailPage() {
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
        const response = await getCommercialRequestDetail(id);

        if (!ignore) {
          setDetail(response.data);
        }
      } catch (error) {
        if (!ignore) {
          setErrorMessage(
            error?.error?.message || 'No se pudo cargar la solicitud.'
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
      <section className="commercial-request-detail-page commercial-request-detail-page--wow">
        <div className="content-page-card dashboard-state-card dashboard-state-card--loading commercial-request-detail-state">
          <div className="dashboard-state-orbit" aria-hidden="true">
            <span>✓</span>
          </div>

          <span className="mini-chip">Solicitud</span>
          <h3 className="content-page-title">Cargando solicitud</h3>
          <p className="content-page-copy">
            Recuperando contacto, agenda y detalles comerciales.
          </p>
        </div>
      </section>
    );
  }

  if (errorMessage) {
    return (
      <section className="commercial-request-detail-page commercial-request-detail-page--wow">
        <div className="content-page-card dashboard-state-card dashboard-state-card--error commercial-request-detail-state">
          <div className="dashboard-state-orbit" aria-hidden="true">
            <span>!</span>
          </div>

          <span className="mini-chip">Solicitud</span>
          <h3 className="content-page-title">Error al cargar</h3>
          <p className="content-page-copy">{errorMessage}</p>
        </div>
      </section>
    );
  }

  const fullName = detail?.full_name || 'Contacto sin nombre';
  const email = detail?.email || 'Sin email';
  const phone = detail?.phone || 'Sin teléfono';
  const requestType =
    requestTypeLabels[detail?.request_type] || detail?.request_type || 'Solicitud';
  const requestStatus = detail?.request_status || 'pending';
  const preferredDate = detail?.preferred_date
    ? new Date(detail.preferred_date).toLocaleDateString('es-ES')
    : 'Sin fecha';
  const preferredTime = detail?.preferred_time || 'Sin hora';
  const preferredRange = detail?.preferred_time_range || 'Sin franja';
  const details = detail?.details || 'Solicitud sin detalles adicionales.';
  const isCompleted = requestStatus === 'completed';
  const isPending = requestStatus === 'pending';

  return (
    <section className="detail-layout commercial-request-detail-page commercial-request-detail-page--wow">
      <article className="content-page-card commercial-request-detail-hero">
        <div className="commercial-request-detail-identity">
          <div
            className={`commercial-request-detail-avatar ${
              isCompleted ? 'commercial-request-detail-avatar--completed' : ''
            } ${isPending ? 'commercial-request-detail-avatar--pending' : ''}`}
            aria-hidden="true"
          >
            {isCompleted ? '✓' : isPending ? '◌' : '●'}
          </div>

          <div>
            <span className="mini-chip">Request detail</span>

            <h3 className="content-page-title">
              <span className="native-title-icon" aria-hidden="true">
                ✓
              </span>
              {fullName}
            </h3>

            <p className="content-page-copy">
              {email} · {phone}
            </p>
          </div>
        </div>

        <aside
          className="commercial-request-detail-status-card"
          aria-label="Estado de solicitud comercial"
        >
          <span>Solicitud comercial</span>
          <strong>{requestStatus}</strong>
          <small>{requestType}</small>
        </aside>
      </article>

      <div className="commercial-request-detail-grid">
        <article className="content-page-card commercial-request-detail-card">
          <div className="panel-card__heading">
            <span className="panel-card__icon" aria-hidden="true">
              ✉
            </span>
            <h4>Contacto asociado</h4>
          </div>

          <div className="commercial-request-contact-list">
            <div className="commercial-request-contact-item">
              <span aria-hidden="true">◈</span>
              <div>
                <small>Nombre</small>
                <strong>{fullName}</strong>
              </div>
            </div>

            <div className="commercial-request-contact-item">
              <span aria-hidden="true">✉</span>
              <div>
                <small>Email</small>
                <strong>{email}</strong>
              </div>
            </div>

            <div className="commercial-request-contact-item">
              <span aria-hidden="true">☎</span>
              <div>
                <small>Teléfono</small>
                <strong>{phone}</strong>
              </div>
            </div>
          </div>
        </article>

        <article className="content-page-card commercial-request-detail-card">
          <div className="panel-card__heading">
            <span className="panel-card__icon" aria-hidden="true">
              ◷
            </span>
            <h4>Preferencia de agenda</h4>
          </div>

          <div className="detail-meta-grid detail-meta-grid--wow commercial-request-detail-meta-grid">
            <div className="detail-meta-card detail-meta-card--status">
              <span>Tipo</span>
              <strong>{requestType}</strong>
            </div>

            <div className="detail-meta-card detail-meta-card--intent">
              <span>Estado</span>
              <strong>{requestStatus}</strong>
            </div>

            <div className="detail-meta-card detail-meta-card--result">
              <span>Fecha</span>
              <strong>{preferredDate}</strong>
            </div>
          </div>

          <div className="commercial-request-schedule-panel">
            <span className="commercial-request-schedule-panel__icon" aria-hidden="true">
              ⌚
            </span>

            <div>
              <strong>{preferredTime}</strong>
              <p>{preferredRange}</p>
            </div>
          </div>
        </article>
      </div>

      <article className="content-page-card commercial-request-notes-card">
        <div className="panel-card__heading">
          <span className="panel-card__icon" aria-hidden="true">
            ◌
          </span>
          <h4>Detalles de la solicitud</h4>
        </div>

        <div className="commercial-request-notes-panel">
          <p>{details}</p>
        </div>
      </article>
    </section>
  );
}

export default CommercialRequestDetailPage;