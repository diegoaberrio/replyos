import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getLeadDetail } from '../../services/leadsService';

function LeadDetailPage() {
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
        const response = await getLeadDetail(id);

        if (!ignore) {
          setDetail(response.data);
        }
      } catch (error) {
        if (!ignore) {
          setErrorMessage(error?.error?.message || 'No se pudo cargar el lead.');
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
      <section className="lead-detail-page lead-detail-page--wow">
        <div className="content-page-card dashboard-state-card dashboard-state-card--loading lead-detail-state">
          <div className="dashboard-state-orbit" aria-hidden="true">
            <span>◈</span>
          </div>

          <span className="mini-chip">Lead</span>
          <h3 className="content-page-title">Cargando lead</h3>
          <p className="content-page-copy">
            Recuperando datos de contacto, conversación e intención comercial.
          </p>
        </div>
      </section>
    );
  }

  if (errorMessage) {
    return (
      <section className="lead-detail-page lead-detail-page--wow">
        <div className="content-page-card dashboard-state-card dashboard-state-card--error lead-detail-state">
          <div className="dashboard-state-orbit" aria-hidden="true">
            <span>!</span>
          </div>

          <span className="mini-chip">Lead</span>
          <h3 className="content-page-title">Error al cargar</h3>
          <p className="content-page-copy">{errorMessage}</p>
        </div>
      </section>
    );
  }

  const fullName = detail?.full_name || 'Lead sin nombre';
  const email = detail?.email || 'Sin email';
  const phone = detail?.phone || 'Sin teléfono';
  const company = detail?.company_name || 'Sin empresa';
  const leadStatus = detail?.lead_status || 'new';
  const conversationStatus = detail?.conversation_status || 'open';
  const intent = detail?.detected_intent || 'unknown';
  const result = detail?.conversation_result || detail?.result || 'none';
  const isConverted = leadStatus === 'converted';

  return (
    <section className="detail-layout lead-detail-page lead-detail-page--wow">
      <article className="content-page-card lead-detail-hero">
        <div className="lead-detail-identity">
          <div
            className={`lead-detail-avatar ${
              isConverted ? 'lead-detail-avatar--converted' : ''
            }`}
            aria-hidden="true"
          >
            {isConverted ? '✓' : '◈'}
          </div>

          <div>
            <span className="mini-chip">Lead detail</span>

            <h3 className="content-page-title">
              <span className="native-title-icon" aria-hidden="true">
                ◈
              </span>
              {fullName}
            </h3>

            <p className="content-page-copy">
              {email} · {phone}
            </p>
          </div>
        </div>

        <aside className="lead-detail-status-card" aria-label="Estado comercial del lead">
          <span>Oportunidad comercial</span>
          <strong>{leadStatus}</strong>
          <small>{company}</small>
        </aside>
      </article>

      <div className="lead-detail-grid">
        <article className="content-page-card lead-detail-card">
          <div className="panel-card__heading">
            <span className="panel-card__icon" aria-hidden="true">
              ✉
            </span>
            <h4>Datos de contacto</h4>
          </div>

          <div className="lead-contact-list">
            <div className="lead-contact-item">
              <span aria-hidden="true">◈</span>
              <div>
                <small>Nombre</small>
                <strong>{fullName}</strong>
              </div>
            </div>

            <div className="lead-contact-item">
              <span aria-hidden="true">✉</span>
              <div>
                <small>Email</small>
                <strong>{email}</strong>
              </div>
            </div>

            <div className="lead-contact-item">
              <span aria-hidden="true">☎</span>
              <div>
                <small>Teléfono</small>
                <strong>{phone}</strong>
              </div>
            </div>

            <div className="lead-contact-item">
              <span aria-hidden="true">◆</span>
              <div>
                <small>Empresa</small>
                <strong>{company}</strong>
              </div>
            </div>
          </div>
        </article>

        <article className="content-page-card lead-detail-card">
          <div className="panel-card__heading">
            <span className="panel-card__icon" aria-hidden="true">
              ●
            </span>
            <h4>Contexto conversacional</h4>
          </div>

          <div className="detail-meta-grid detail-meta-grid--wow lead-detail-meta-grid">
            <div className="detail-meta-card detail-meta-card--status">
              <span>Estado lead</span>
              <strong>{leadStatus}</strong>
            </div>

            <div className="detail-meta-card detail-meta-card--intent">
              <span>Estado conversación</span>
              <strong>{conversationStatus}</strong>
            </div>

            <div className="detail-meta-card detail-meta-card--result">
              <span>Intención</span>
              <strong>{intent}</strong>
            </div>
          </div>

          <div className="lead-result-panel">
            <span className="lead-result-panel__icon" aria-hidden="true">
              ✓
            </span>

            <div>
              <strong>Resultado asociado</strong>
              <p>{result}</p>
            </div>
          </div>
        </article>
      </div>

      <article className="content-page-card lead-notes-card">
        <div className="panel-card__heading">
          <span className="panel-card__icon" aria-hidden="true">
            ◌
          </span>
          <h4>Notas comerciales</h4>
        </div>

        <div className="lead-notes-panel">
          <p>{detail?.notes || 'Sin notas registradas para este lead.'}</p>
        </div>
      </article>
    </section>
  );
}

export default LeadDetailPage;