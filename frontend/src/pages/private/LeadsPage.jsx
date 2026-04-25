import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { listLeads } from '../../services/leadsService';

function LeadsPage() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let ignore = false;

    async function loadData() {
      try {
        setIsLoading(true);
        setErrorMessage('');
        const response = await listLeads();

        if (!ignore) {
          setItems(response.data.items ?? []);
        }
      } catch (error) {
        if (!ignore) {
          setErrorMessage(
            error?.error?.message || 'No se pudieron cargar los leads.'
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
    () => items.filter((item) => item.lead_status === 'converted').length,
    [items]
  );

  const newCount = useMemo(
    () => items.filter((item) => item.lead_status === 'new').length,
    [items]
  );

  const qualifiedCount = useMemo(
    () => items.filter((item) => item.lead_status === 'qualified').length,
    [items]
  );

  return (
    <section className="leads-page leads-page--wow">
      <div className="content-page-card leads-hero">
        <div className="leads-hero__copy">
          <span className="mini-chip">Leads</span>

          <h3 className="content-page-title">
            <span className="native-title-icon" aria-hidden="true">
              ◈
            </span>
            Leads capturados
          </h3>

          <p className="content-page-copy">
            Revisa los contactos generados por el agente, su estado comercial y
            el contexto de origen para priorizar seguimiento.
          </p>
        </div>

        <aside className="leads-meter" aria-label="Resumen de leads">
          <div className="leads-meter__orb" aria-hidden="true">
            ◈
          </div>

          <div>
            <span>Pipeline comercial</span>
            <strong>{items.length} leads capturados</strong>
            <small>
              {convertedCount} convertidos · {qualifiedCount} cualificados
            </small>
          </div>
        </aside>
      </div>

      <div className="lead-kpi-strip" aria-label="Indicadores rápidos">
        <article className="lead-mini-kpi">
          <span aria-hidden="true">◈</span>
          <div>
            <strong>{items.length}</strong>
            <small>Total</small>
          </div>
        </article>

        <article className="lead-mini-kpi">
          <span aria-hidden="true">●</span>
          <div>
            <strong>{newCount}</strong>
            <small>Nuevos</small>
          </div>
        </article>

        <article className="lead-mini-kpi">
          <span aria-hidden="true">✓</span>
          <div>
            <strong>{convertedCount}</strong>
            <small>Convertidos</small>
          </div>
        </article>
      </div>

      {isLoading ? (
        <div className="content-page-card dashboard-state-card dashboard-state-card--loading leads-state-card">
          <div className="dashboard-state-orbit" aria-hidden="true">
            <span>◈</span>
          </div>

          <span className="mini-chip">Leads</span>
          <h3 className="content-page-title">Cargando leads</h3>
          <p className="content-page-copy">
            Recuperando contactos capturados desde la API privada.
          </p>
        </div>
      ) : null}

      {errorMessage ? (
        <div className="content-page-card dashboard-state-card dashboard-state-card--error leads-state-card">
          <div className="dashboard-state-orbit" aria-hidden="true">
            <span>!</span>
          </div>

          <span className="mini-chip">Leads</span>
          <h3 className="content-page-title">Error al cargar</h3>
          <p className="content-page-copy">{errorMessage}</p>
        </div>
      ) : null}

      {!isLoading && !errorMessage && items.length === 0 ? (
        <div className="leads-empty-state">
          <span className="leads-empty-state__icon" aria-hidden="true">
            ◈
          </span>
          <strong>No hay leads capturados todavía.</strong>
          <p>
            Cuando una conversación pública capture datos de contacto, el lead
            aparecerá aquí con su estado, empresa y contexto comercial.
          </p>
        </div>
      ) : null}

      {!isLoading && !errorMessage && items.length > 0 ? (
        <div className="lead-pipeline-list">
          {items.map((item) => {
            const isConverted = item.lead_status === 'converted';
            const displayName = item.full_name || 'Lead sin nombre';
            const displayEmail = item.email || 'Sin email';
            const displayPhone = item.phone || 'Sin teléfono';
            const company = item.company_name || 'Sin empresa';
            const status = item.lead_status || 'new';

            return (
              <article
                key={item.id}
                className={`lead-card ${
                  isConverted ? 'lead-card--converted' : ''
                }`}
              >
                <div className="lead-card__avatar" aria-hidden="true">
                  {isConverted ? '✓' : '◈'}
                </div>

                <div className="lead-card__main">
                  <div className="lead-card__top">
                    <div>
                      <h4>{displayName}</h4>
                      <p>{company}</p>
                    </div>

                    <span
                      className={`status-badge ${
                        isConverted
                          ? 'status-badge--active'
                          : 'status-badge--inactive'
                      }`}
                    >
                      {status}
                    </span>
                  </div>

                  <div className="lead-card__chips">
                    <span>✉ {displayEmail}</span>
                    <span>☎ {displayPhone}</span>
                    <span>◆ {item.detected_intent || 'unknown'}</span>
                  </div>

                  <p className="lead-card__summary">
                    {item.notes || 'Lead sin notas adicionales.'}
                  </p>
                </div>

                <Link
                  className="secondary-btn inline-action-btn lead-card__cta"
                  to={`/app/leads/${item.id}`}
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

export default LeadsPage;