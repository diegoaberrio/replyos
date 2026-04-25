import { Link, useLocation } from 'react-router-dom';

function PublicLayout({ children }) {
  const location = useLocation();

  return (
    <div className="app-shell">
      <div className="app-background" />

      <section className="public-app-shell">
        <header className="public-header public-header--wow">
          <div className="public-header__brand">
            <div className="public-brand-mark" aria-hidden="true">
              ✦
            </div>

            <div className="public-brand-copy">
              <span className="topbar-chip">ReplyOS</span>

              <h1 className="public-header__title">
                Agente conversacional comercial
              </h1>

              <p className="public-header__copy">
                Monoempresa, orientado a captación, conversación y conversión.
              </p>
            </div>
          </div>

          <nav className="public-header__nav" aria-label="Navegación pública">
            <Link
              className={`public-nav-link public-nav-link--home ${
                location.pathname === '/' ? 'public-nav-link--active' : ''
              }`}
              to="/"
            >
              Inicio
            </Link>

            <Link
              className={`public-nav-link public-nav-link--chat ${
                location.pathname === '/chat' ? 'public-nav-link--active' : ''
              }`}
              to="/chat"
            >
              Ir al chat
            </Link>
          </nav>

          <div className="public-header__signal" aria-hidden="true">
            <span />
            IA comercial activa
          </div>
        </header>

        <main className="public-page-content">{children}</main>
      </section>
    </div>
  );
}

export default PublicLayout;