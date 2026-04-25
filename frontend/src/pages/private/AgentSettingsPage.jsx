import { useEffect, useState } from 'react';
import {
  getAgentSettings,
  updateAgentSettings,
} from '../../services/agentSettingsService';

const INITIAL_FORM = {
  commercial_goal: '',
  tone_style: '',
  general_instructions: '',
  welcome_message: '',
  fallback_message: '',
  is_active: true,
};

const goalLabels = {
  contact_request: 'Solicitud de contacto',
  call: 'Llamada',
  meeting: 'Reunión',
  visit: 'Visita',
};

const toneLabels = {
  professional_close: 'Profesional cercano',
  friendly_consultative: 'Amable consultivo',
  direct_sales: 'Comercial directo',
};

function AgentSettingsPage() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    let ignore = false;

    async function loadSettings() {
      try {
        setIsLoading(true);
        setErrorMessage('');

        const response = await getAgentSettings();

        if (!ignore) {
          setForm({
            commercial_goal: response.data.commercial_goal ?? '',
            tone_style: response.data.tone_style ?? '',
            general_instructions: response.data.general_instructions ?? '',
            welcome_message: response.data.welcome_message ?? '',
            fallback_message: response.data.fallback_message ?? '',
            is_active: Boolean(response.data.is_active),
          });
        }
      } catch (error) {
        if (!ignore) {
          setErrorMessage(
            error?.error?.message ||
              'No se pudo cargar la configuración del agente.'
          );
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadSettings();

    return () => {
      ignore = true;
    };
  }, []);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (successMessage) {
      setSuccessMessage('');
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setIsSaving(true);
      setErrorMessage('');
      setSuccessMessage('');

      await updateAgentSettings(form);

      setSuccessMessage('Configuración del agente guardada correctamente.');
    } catch (error) {
      setErrorMessage(
        error?.error?.message ||
          'No se pudo guardar la configuración del agente.'
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="agent-settings-page agent-settings-page--wow">
      <div className="content-page-card agent-settings-hero">
        <div className="agent-settings-hero__copy">
          <span className="mini-chip">Agente</span>

          <h3 className="content-page-title">
            <span className="native-title-icon" aria-hidden="true">
              ✦
            </span>
            Configuración del agente
          </h3>

          <p className="content-page-copy">
            Ajusta el objetivo comercial, tono, mensajes e instrucciones que
            guían la conversación pública de ReplyOS.
          </p>
        </div>

        <aside className="agent-status-orb" aria-label="Estado del agente">
          <div className="agent-status-orb__core" aria-hidden="true">
            ✦
          </div>

          <div>
            <span>{form.is_active ? 'Agente activo' : 'Agente inactivo'}</span>
            <strong>
              {goalLabels[form.commercial_goal] || 'Objetivo pendiente'}
            </strong>
            <small>{toneLabels[form.tone_style] || 'Tono por definir'}</small>
          </div>
        </aside>
      </div>

      {isLoading ? (
        <div className="content-page-card dashboard-state-card dashboard-state-card--loading">
          <div className="dashboard-state-orbit" aria-hidden="true">
            <span>✦</span>
          </div>

          <span className="mini-chip">Agente</span>
          <h3 className="content-page-title">Cargando configuración</h3>
          <p className="content-page-copy">
            Recuperando objetivo, tono e instrucciones del agente.
          </p>
        </div>
      ) : null}

      {!isLoading ? (
        <div className="agent-settings-layout">
          <aside className="agent-control-panel">
            <div className="agent-brain-card">
              <span className="agent-brain-card__icon" aria-hidden="true">
                ✦
              </span>

              <div>
                <span className="agent-brain-card__label">Cerebro comercial</span>
                <strong>
                  {form.is_active ? 'Listo para conversar' : 'Pausado'}
                </strong>
                <p>
                  El agente usará estas instrucciones para responder con contexto,
                  captar interés y conducir hacia la acción comercial definida.
                </p>
              </div>
            </div>

            <div className="agent-config-grid">
              <div className="agent-config-mini">
                <span aria-hidden="true">→</span>
                <strong>
                  {goalLabels[form.commercial_goal] || 'Sin objetivo'}
                </strong>
                <small>Objetivo comercial</small>
              </div>

              <div className="agent-config-mini">
                <span aria-hidden="true">◌</span>
                <strong>{toneLabels[form.tone_style] || 'Sin tono'}</strong>
                <small>Estilo de respuesta</small>
              </div>

              <div className="agent-config-mini">
                <span aria-hidden="true">✉</span>
                <strong>
                  {form.welcome_message ? 'Configurado' : 'Pendiente'}
                </strong>
                <small>Bienvenida</small>
              </div>

              <div className="agent-config-mini">
                <span aria-hidden="true">!</span>
                <strong>
                  {form.fallback_message ? 'Configurado' : 'Pendiente'}
                </strong>
                <small>Fallback</small>
              </div>
            </div>
          </aside>

          <form className="settings-form agent-settings-form" onSubmit={handleSubmit}>
            <div className="form-section-card agent-section-card">
              <div className="form-section-heading">
                <span className="form-section-icon" aria-hidden="true">
                  →
                </span>
                <div>
                  <h4>Objetivo y tono</h4>
                  <p>
                    Define hacia dónde debe conducir la conversación y cómo debe
                    sonar el agente.
                  </p>
                </div>
              </div>

              <div className="settings-form-grid">
                <label className="field-group">
                  <span>Objetivo comercial</span>
                  <select
                    name="commercial_goal"
                    value={form.commercial_goal}
                    onChange={handleChange}
                  >
                    <option value="contact_request">Solicitud de contacto</option>
                    <option value="call">Llamada</option>
                    <option value="meeting">Reunión</option>
                    <option value="visit">Visita</option>
                  </select>
                </label>

                <label className="field-group">
                  <span>Tono</span>
                  <select
                    name="tone_style"
                    value={form.tone_style}
                    onChange={handleChange}
                  >
                    <option value="professional_close">Professional close</option>
                    <option value="friendly_consultative">
                      Friendly consultative
                    </option>
                    <option value="direct_sales">Direct sales</option>
                  </select>
                </label>

                <label className="toggle-field field-group--full agent-toggle-field">
                  <input
                    name="is_active"
                    type="checkbox"
                    checked={form.is_active}
                    onChange={handleChange}
                  />
                  <span>Agente activo</span>
                </label>
              </div>
            </div>

            <div className="form-section-card agent-section-card">
              <div className="form-section-heading">
                <span className="form-section-icon" aria-hidden="true">
                  ✦
                </span>
                <div>
                  <h4>Instrucciones del agente</h4>
                  <p>
                    Reglas internas que orientan claridad, enfoque comercial y
                    límites de respuesta.
                  </p>
                </div>
              </div>

              <div className="settings-form-grid">
                <label className="field-group field-group--full">
                  <span>Instrucciones generales</span>
                  <textarea
                    name="general_instructions"
                    rows="5"
                    value={form.general_instructions}
                    onChange={handleChange}
                  />
                </label>
              </div>
            </div>

            <div className="form-section-card agent-section-card">
              <div className="form-section-heading">
                <span className="form-section-icon" aria-hidden="true">
                  ✉
                </span>
                <div>
                  <h4>Mensajes conversacionales</h4>
                  <p>
                    Textos base para iniciar la conversación y responder cuando
                    falte información exacta.
                  </p>
                </div>
              </div>

              <div className="settings-form-grid">
                <label className="field-group field-group--full">
                  <span>Mensaje de bienvenida</span>
                  <textarea
                    name="welcome_message"
                    rows="3"
                    value={form.welcome_message}
                    onChange={handleChange}
                  />
                </label>

                <label className="field-group field-group--full">
                  <span>Mensaje fallback</span>
                  <textarea
                    name="fallback_message"
                    rows="3"
                    value={form.fallback_message}
                    onChange={handleChange}
                  />
                </label>
              </div>
            </div>

            {errorMessage ? (
              <div className="form-feedback form-feedback--error">
                {errorMessage}
              </div>
            ) : null}

            {successMessage ? (
              <div className="form-feedback form-feedback--success">
                {successMessage}
              </div>
            ) : null}

            <div className="settings-form-actions agent-settings-actions">
              <button className="primary-btn" type="submit" disabled={isSaving}>
                {isSaving ? 'Guardando...' : 'Guardar configuración'}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </section>
  );
}

export default AgentSettingsPage;