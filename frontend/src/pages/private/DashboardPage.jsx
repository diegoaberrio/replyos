import { useEffect, useState } from 'react';
import { getDashboardSummary } from '../../services/dashboardService';

const metricCards = [
  {
    key: 'conversations',
    icon: '✉',
    label: 'Conversaciones',
    meta: 'Actividad total registrada',
    accent: 'cyan',
  },
  {
    key: 'leads',
    icon: '◈',
    label: 'Leads',
    meta: 'Contactos capturados',
    accent: 'purple',
  },
  {
    key: 'commercial_requests',
    icon: '✓',
    label: 'Solicitudes',
    meta: 'Acciones comerciales creadas',
    accent: 'green',
  },
];

const statusItems = [
  { key: 'open', label: 'Abiertas', icon: '●' },
  { key: 'in_follow_up', label: 'Seguimiento', icon: '◌' },
  { key: 'converted', label: 'Convertidas', icon: '✓' },
  { key: 'closed_no_conversion', label: 'Sin conversión', icon: '×' },
];

const intentItems = [
  { key: 'information', label: 'Información', icon: '?' },
  { key: 'commercial_interest', label: 'Interés', icon: '◆' },
  { key: 'ready_to_advance', label: 'Avanzar', icon: '→' },
  { key: 'unknown', label: 'Unknown', icon: '◌' },
];

function getSafePercentage(value) {
  const number = Number(value) || 0;
  return Math.max(0, Math.min(100, number));
}

function getBreakdownTotal(items, source) {
  return items.reduce((acc, item) => acc + (source?.[item.key] ?? 0), 0);
}

function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let ignore = false;

    async function loadSummary() {
      try {
        setIsLoading(true);
        setErrorMessage('');

        const response = await getDashboardSummary();

        if (!ignore) {
          setSummary(response.data);
        }
      } catch (error) {
        if (!ignore) {
          setErrorMessage(
            error?.error?.message ||
              'No se pudo cargar el resumen del dashboard.'
          );
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadSummary();

    return () => {
      ignore = true;
    };
  }, []);

  if (isLoading) {
    return (
      <section className="dashboard-page dashboard-page--wow">
        <div className="content-page-card dashboard-state-card dashboard-state-card--loading">
          <div className="dashboard-state-orbit" aria-hidden="true">
            <span>✦</span>
          </div>

          <span className="mini-chip">Dashboard</span>
          <h3 className="content-page-title">Cargando resumen</h3>
          <p className="content-page-copy">
            Preparando KPIs, conversiones y actividad reciente.
          </p>
        </div>
      </section>
    );
  }

  if (errorMessage) {
    return (
      <section className="dashboard-page dashboard-page--wow">
        <div className="content-page-card dashboard-state-card dashboard-state-card--error">
          <div className="dashboard-state-orbit" aria-hidden="true">
            <span>!</span>
          </div>

          <span className="mini-chip">Dashboard</span>
          <h3 className="content-page-title">Error al cargar</h3>
          <p className="content-page-copy">{errorMessage}</p>
        </div>
      </section>
    );
  }

  const totals = summary?.totals ?? {};
  const conversions = summary?.conversions ?? {};
  const breakdowns = summary?.breakdowns ?? {};
  const recentActivity = summary?.recent_activity ?? {};

  const latestConversations = recentActivity.latest_conversations ?? [];
  const latestLeads = recentActivity.latest_leads ?? [];

  const conversationToLead = getSafePercentage(
    conversions.conversation_to_lead_percentage
  );
  const leadToRequest = getSafePercentage(
    conversions.lead_to_request_percentage
  );

  const statusBreakdown = breakdowns?.conversations_by_status ?? {};
  const intentBreakdown = breakdowns?.conversations_by_intent ?? {};
  const statusTotal = getBreakdownTotal(statusItems, statusBreakdown);
  const intentTotal = getBreakdownTotal(intentItems, intentBreakdown);

  const totalConversations = totals.conversations ?? 0;
  const totalLeads = totals.leads ?? 0;
  const totalRequests = totals.commercial_requests ?? 0;

  return (
    <section className="dashboard-page dashboard-page--wow dashboard-page--executive">
      <div className="dashboard-hero dashboard-hero--wow dashboard-hero--executive">
        <div className="dashboard-hero__copy">
          <span className="mini-chip">Resumen operativo</span>

          <h3 className="dashboard-title">
            <span className="native-title-icon" aria-hidden="true">
              ▣
            </span>
            Centro de control ReplyOS
          </h3>

          <p className="dashboard-copy">
            Visualiza conversaciones, leads, solicitudes y señales comerciales
            del agente en tiempo real desde la API privada.
          </p>
        </div>

        <div className="dashboard-hero__signal" aria-hidden="true">
          <span>✦</span>
          Datos reales API
        </div>
      </div>

      <div className="stats-grid stats-grid--wow dashboard-kpi-grid">
        {metricCards.map((card) => (
          <article
            className={`stat-card stat-card--wow stat-card--executive stat-card--${card.accent}`}
            key={card.key}
          >
            <div className="stat-card__top">
              <span className="stat-icon" aria-hidden="true">
                {card.icon}
              </span>
              <span className="stat-label">{card.label}</span>
            </div>

            <strong className="stat-value">{totals[card.key] ?? 0}</strong>
            <span className="stat-meta">{card.meta}</span>

            <div className="kpi-sparkline" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
          </article>
        ))}
      </div>

      <div className="dashboard-visual-grid">
        <article className="panel-card dashboard-ring-panel">
          <div className="panel-card__heading">
            <span className="panel-card__icon" aria-hidden="true">
              ◉
            </span>
            <h4>Embudo de conversión</h4>
          </div>

          <div className="conversion-rings">
            <div
              className="conversion-ring"
              style={{ '--value': `${conversationToLead}%` }}
              aria-label={`Conversación a lead ${conversationToLead}%`}
            >
              <div className="conversion-ring__inner">
                <strong>{conversationToLead}%</strong>
                <span>Conversación → Lead</span>
              </div>
            </div>

            <div
              className="conversion-ring conversion-ring--secondary"
              style={{ '--value': `${leadToRequest}%` }}
              aria-label={`Lead a solicitud ${leadToRequest}%`}
            >
              <div className="conversion-ring__inner">
                <strong>{leadToRequest}%</strong>
                <span>Lead → Solicitud</span>
              </div>
            </div>
          </div>

          <div className="funnel-row">
            <span>
              <b>{totalConversations}</b>
              Conversaciones
            </span>
            <span>
              <b>{totalLeads}</b>
              Leads
            </span>
            <span>
              <b>{totalRequests}</b>
              Solicitudes
            </span>
          </div>
        </article>

        <article className="panel-card dashboard-chart-panel">
          <div className="panel-card__heading">
            <span className="panel-card__icon" aria-hidden="true">
              ◈
            </span>
            <h4>Estado del pipeline</h4>
          </div>

          <div className="pipeline-bars">
            {statusItems.map((item) => {
              const value = statusBreakdown?.[item.key] ?? 0;
              const percentage = statusTotal
                ? Math.round((value / statusTotal) * 100)
                : 0;

              return (
                <div className="pipeline-row" key={item.key}>
                  <div className="pipeline-row__label">
                    <span aria-hidden="true">{item.icon}</span>
                    <strong>{item.label}</strong>
                    <b>{value}</b>
                  </div>

                  <div className="pipeline-row__bar" aria-hidden="true">
                    <span style={{ width: `${percentage}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </article>
      </div>

      <div className="dashboard-panels dashboard-panels--wow">
        <article className="panel-card panel-card--wow dashboard-activity-card">
          <div className="panel-card__heading">
            <span className="panel-card__icon" aria-hidden="true">
              ✉
            </span>
            <h4>Últimas conversaciones</h4>
          </div>

          {latestConversations.length ? (
            <div className="activity-timeline">
              {latestConversations.map((item) => (
                <div key={item.id} className="activity-item">
                  <span className="activity-item__icon" aria-hidden="true">
                    ✉
                  </span>

                  <div>
                    <strong>{item.visitor_name || 'Visitante sin nombre'}</strong>
                    <span>
                      {item.status} · {item.detected_intent}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="entity-copy">Sin conversaciones recientes.</p>
          )}
        </article>

        <article className="panel-card panel-card--wow dashboard-activity-card">
          <div className="panel-card__heading">
            <span className="panel-card__icon" aria-hidden="true">
              ◈
            </span>
            <h4>Últimos leads</h4>
          </div>

          {latestLeads.length ? (
            <div className="activity-timeline">
              {latestLeads.map((item) => (
                <div key={item.id} className="activity-item">
                  <span className="activity-item__icon" aria-hidden="true">
                    ◈
                  </span>

                  <div>
                    <strong>{item.full_name || 'Lead sin nombre'}</strong>
                    <span>
                      {item.email || 'Sin email'} · {item.lead_status || 'Sin estado'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="entity-copy">Sin leads recientes.</p>
          )}
        </article>
      </div>

      <div className="dashboard-panels dashboard-panels--wow">
        <article className="panel-card panel-card--wow">
          <div className="panel-card__heading">
            <span className="panel-card__icon" aria-hidden="true">
              ●
            </span>
            <h4>Conversaciones por estado</h4>
          </div>

          <div className="breakdown-list">
            {statusItems.map((item) => {
              const value = statusBreakdown?.[item.key] ?? 0;
              const percentage = statusTotal
                ? Math.round((value / statusTotal) * 100)
                : 0;

              return (
                <div className="breakdown-item" key={item.key}>
                  <div className="breakdown-item__top">
                    <span>
                      <strong aria-hidden="true">{item.icon}</strong>
                      {item.label}
                    </span>
                    <b>{value}</b>
                  </div>

                  <div className="breakdown-bar" aria-hidden="true">
                    <span style={{ width: `${percentage}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </article>

        <article className="panel-card panel-card--wow">
          <div className="panel-card__heading">
            <span className="panel-card__icon" aria-hidden="true">
              ◆
            </span>
            <h4>Conversaciones por intención</h4>
          </div>

          <div className="breakdown-list">
            {intentItems.map((item) => {
              const value = intentBreakdown?.[item.key] ?? 0;
              const percentage = intentTotal
                ? Math.round((value / intentTotal) * 100)
                : 0;

              return (
                <div className="breakdown-item" key={item.key}>
                  <div className="breakdown-item__top">
                    <span>
                      <strong aria-hidden="true">{item.icon}</strong>
                      {item.label}
                    </span>
                    <b>{value}</b>
                  </div>

                  <div className="breakdown-bar" aria-hidden="true">
                    <span style={{ width: `${percentage}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </article>
      </div>
    </section>
  );
}

export default DashboardPage;