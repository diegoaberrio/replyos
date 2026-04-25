import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const navItems = [
  { to: '/app', label: 'Dashboard', icon: '▣', hint: 'Resumen' },
  { to: '/app/business-profile', label: 'Negocio', icon: '⌂', hint: 'Perfil' },
  { to: '/app/agent-settings', label: 'Agente', icon: '✦', hint: 'IA' },
  { to: '/app/faqs', label: 'FAQs', icon: '?', hint: 'Dudas' },
  { to: '/app/services', label: 'Servicios', icon: '◆', hint: 'Oferta' },
  {
    to: '/app/conversations',
    label: 'Conversaciones',
    icon: '✉',
    hint: 'Chat',
  },
  { to: '/app/leads', label: 'Leads', icon: '◈', hint: 'Contactos' },
  {
    to: '/app/commercial-requests',
    label: 'Solicitudes',
    icon: '✓',
    hint: 'Agenda',
  },
  {
    to: '/app/notifications',
    label: 'Notificaciones',
    icon: '●',
    hint: 'Avisos',
  },
];

function PrivateLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  async function handleLogout() {
    await logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="app-shell">
      <div className="app-background" />

      <section className="private-app-shell private-app-shell--wow">
        <aside className="private-sidebar private-sidebar--wow">
          <div className="private-brand private-brand--wow">
            <div className="private-brand-mark" aria-hidden="true">
              ✦
            </div>

            <div>
              <span className="topbar-chip">ReplyOS Admin</span>
              <h1 className="private-brand-title">Panel del agente</h1>
              <p className="private-brand-copy">
                Controla contexto, conversaciones, leads y solicitudes desde un
                entorno privado.
              </p>
            </div>
          </div>

          <div className="session-box session-box--wow">
            <span className="session-box__label">Sesión activa</span>
            <strong className="session-box__name">
              {user?.full_name || 'Administrador'}
            </strong>
            <span className="session-box__email">
              {user?.email || 'Acceso privado ReplyOS'}
            </span>
          </div>

          <nav className="private-nav private-nav--wow" aria-label="Panel privado">
            {navItems.map((item) => {
              const isActive =
                item.to === '/app'
                  ? location.pathname === '/app'
                  : location.pathname.startsWith(item.to);

              return (
                <Link
                  key={item.to}
                  className={`private-nav-item private-nav-item--wow ${
                    isActive ? 'private-nav-item--active' : ''
                  }`}
                  to={item.to}
                >
                  <span className="private-nav-item__icon" aria-hidden="true">
                    {item.icon}
                  </span>

                  <span className="private-nav-item__body">
                    <strong>{item.label}</strong>
                    <small>{item.hint}</small>
                  </span>
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="private-main private-main--wow">
          <header className="private-main-header private-main-header--wow">
            <div>
              <p className="private-eyebrow">Zona privada</p>
              <h2 className="private-main-title">
                ReplyOS · Operación del agente
              </h2>
            </div>

            <div className="private-main-actions">
              <span className="private-main-status" aria-hidden="true">
                <span />
                Sistema activo
              </span>

              <button
                className="secondary-btn"
                type="button"
                onClick={handleLogout}
              >
                Cerrar sesión
              </button>
            </div>
          </header>

          <div className="private-main-content">{children}</div>
        </div>
      </section>
    </div>
  );
}

export default PrivateLayout;