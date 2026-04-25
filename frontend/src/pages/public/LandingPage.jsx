import { Link } from 'react-router-dom';

const valueItems = [
  {
    icon: '✦',
    title: 'Contexto real',
    text: 'Responde usando información vigente del negocio.',
  },
  {
    icon: '◈',
    title: 'Lead listo',
    text: 'Capta datos comerciales sin fricción.',
  },
  {
    icon: '→',
    title: 'Conversión guiada',
    text: 'Orienta hacia cita, llamada o contacto.',
  },
];

function LandingPage() {
  return (
    <section className="landing-page landing-page--wow">
      <div className="landing-hero-card landing-hero-card--polished landing-hero-card--wow">
        <div className="landing-hero-main">
          <div className="landing-hero-copy-block">
            <span className="hero-chip">ReplyOS · Agente comercial con IA</span>

            <h2 className="hero-title">
              Convierte conversaciones en oportunidades comerciales
            </h2>

            <p className="hero-copy">
              ReplyOS ayuda a una empresa a responder consultas, resolver dudas,
              captar datos relevantes y guiar cada interacción hacia una acción
              útil: una cita, una llamada, una visita o una solicitud de contacto.
            </p>

            <div className="landing-value-grid" aria-label="Ventajas principales">
              {valueItems.map((item) => (
                <article className="landing-value-item" key={item.title}>
                  <span className="landing-value-icon" aria-hidden="true">
                    {item.icon}
                  </span>

                  <div>
                    <strong>{item.title}</strong>
                    <span>{item.text}</span>
                  </div>
                </article>
              ))}
            </div>

            <div className="hero-actions">
              <Link className="primary-btn" to="/chat">
                Probar el chat
              </Link>

              <Link className="secondary-btn" to="/login">
                Entrar al panel
              </Link>
            </div>
          </div>

          <aside
            className="landing-product-orbit"
            aria-label="Vista conceptual del flujo ReplyOS"
          >
            <div className="landing-orbit-core">
              <span className="landing-orbit-core__icon" aria-hidden="true">
                ✦
              </span>
              <strong>ReplyOS</strong>
              <small>IA comercial</small>
            </div>

            <div className="landing-orbit-card landing-orbit-card--message">
              <span>✉ Consulta</span>
              <strong>“Quiero información”</strong>
            </div>

            <div className="landing-orbit-card landing-orbit-card--agent">
              <span>◌ Agente</span>
              <strong>Respuesta contextual</strong>
            </div>

            <div className="landing-orbit-card landing-orbit-card--lead">
              <span>✓ Lead</span>
              <strong>Cita o contacto</strong>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

export default LandingPage;