import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const INITIAL_FORM = {
  email: 'admin@replyos.com',
  password: 'Admin12345',
};

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState(INITIAL_FORM);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errorMessage) {
      setErrorMessage('');
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      await login(form);
      navigate('/app', { replace: true });
    } catch (error) {
      setErrorMessage(
        error?.error?.message || 'No se pudo iniciar sesión.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="app-shell">
      <div className="app-background" />

      <main className="login-page-shell login-page-shell--wow">
        <section className="login-card login-card--wow">
          <div className="login-security-panel" aria-hidden="true">
            <div className="login-security-orb">✦</div>
            <div>
              <span>ReplyOS Secure Access</span>
              <strong>Panel privado del agente</strong>
              <small>Autenticación conectada al backend</small>
            </div>
          </div>

          <div className="login-heading-block">
            <span className="mini-chip">Acceso privado</span>

            <h1 className="login-title">
              <span className="native-title-icon" aria-hidden="true">
                ◈
              </span>
              Iniciar sesión
            </h1>

            <p className="login-copy">
              Acceso del administrador del agente a la zona privada de ReplyOS
              para configurar negocio, contexto, conversaciones y oportunidades.
            </p>
          </div>

          <form className="login-form login-form--wow" onSubmit={handleSubmit}>
            <label className="field-group login-field">
              <span>Email</span>
              <div className="login-input-shell">
                <span className="login-input-icon" aria-hidden="true">
                  ✉
                </span>
                <input
                  name="email"
                  type="email"
                  placeholder="admin@replyos.com"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
            </label>

            <label className="field-group login-field">
              <span>Contraseña</span>
              <div className="login-input-shell">
                <span className="login-input-icon" aria-hidden="true">
                  ●
                </span>
                <input
                  name="password"
                  type="password"
                  placeholder="••••••••••"
                  value={form.password}
                  onChange={handleChange}
                />
              </div>
            </label>

            {errorMessage ? (
              <div className="form-feedback form-feedback--error">
                {errorMessage}
              </div>
            ) : null}

            <button
              className="primary-btn login-submit login-submit--wow"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="login-submit-loader" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </span>
                  Entrando...
                </>
              ) : (
                'Entrar al panel'
              )}
            </button>
          </form>

          <div className="login-helper-box login-helper-box--wow">
            <span className="login-helper-icon" aria-hidden="true">
              ✓
            </span>

            <div>
              <strong>Modo actual</strong>
              <span>Auth preparada para API real</span>
              <span>Fallback mock activo para seguir construyendo</span>
            </div>
          </div>

          <div className="login-footer-links login-footer-links--wow">
            <Link className="text-link" to="/">
              ← Volver al inicio
            </Link>

            <Link className="text-link" to="/chat">
              Probar chat público →
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

export default LoginPage;