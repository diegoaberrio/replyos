import { useEffect, useState } from 'react';
import {
  getBusinessProfile,
  updateBusinessProfile,
} from '../../services/businessProfileService';

const INITIAL_FORM = {
  business_name: '',
  legal_name: '',
  business_email: '',
  business_phone: '',
  website_url: '',
  description: '',
  address_line: '',
  city: '',
  region: '',
  country: '',
  postal_code: '',
  attention_zones: '',
  business_hours: '',
  primary_contact_name: '',
  primary_contact_email: '',
  primary_contact_phone: '',
};

function BusinessProfilePage() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    let ignore = false;

    async function loadProfile() {
      try {
        setIsLoading(true);
        setErrorMessage('');

        const response = await getBusinessProfile();

        if (!ignore) {
          setForm({
            business_name: response.data.business_name ?? '',
            legal_name: response.data.legal_name ?? '',
            business_email: response.data.business_email ?? '',
            business_phone: response.data.business_phone ?? '',
            website_url: response.data.website_url ?? '',
            description: response.data.description ?? '',
            address_line: response.data.address_line ?? '',
            city: response.data.city ?? '',
            region: response.data.region ?? '',
            country: response.data.country ?? '',
            postal_code: response.data.postal_code ?? '',
            attention_zones: response.data.attention_zones ?? '',
            business_hours: response.data.business_hours ?? '',
            primary_contact_name: response.data.primary_contact_name ?? '',
            primary_contact_email: response.data.primary_contact_email ?? '',
            primary_contact_phone: response.data.primary_contact_phone ?? '',
          });
        }
      } catch (error) {
        if (!ignore) {
          setErrorMessage(
            error?.error?.message || 'No se pudo cargar el perfil del negocio.'
          );
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      ignore = true;
    };
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
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

      await updateBusinessProfile(form);

      setSuccessMessage('Perfil del negocio guardado correctamente.');
    } catch (error) {
      setErrorMessage(
        error?.error?.message || 'No se pudo guardar el perfil del negocio.'
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="business-profile-page business-profile-page--wow">
      <div className="content-page-card business-profile-hero">
        <div className="business-profile-hero__copy">
          <span className="mini-chip">Negocio</span>

          <h3 className="content-page-title">
            <span className="native-title-icon" aria-hidden="true">
              ⌂
            </span>
            Perfil del negocio
          </h3>

          <p className="content-page-copy">
            Define la identidad, contacto, cobertura y datos operativos que
            utilizará ReplyOS para contextualizar la conversación comercial.
          </p>
        </div>

        <aside className="business-profile-preview" aria-label="Resumen del negocio">
          <div className="business-profile-preview__mark" aria-hidden="true">
            {form.business_name?.trim()?.charAt(0)?.toUpperCase() || 'R'}
          </div>

          <div>
            <span>Vista rápida</span>
            <strong>{form.business_name || 'Nombre del negocio'}</strong>
            <small>{form.city || 'Ciudad'} · {form.country || 'País'}</small>
          </div>
        </aside>
      </div>

      {isLoading ? (
        <div className="content-page-card dashboard-state-card dashboard-state-card--loading">
          <div className="dashboard-state-orbit" aria-hidden="true">
            <span>⌂</span>
          </div>

          <span className="mini-chip">Perfil</span>
          <h3 className="content-page-title">Cargando negocio</h3>
          <p className="content-page-copy">
            Recuperando datos de identidad, contacto y operación comercial.
          </p>
        </div>
      ) : null}

      {!isLoading ? (
        <div className="business-profile-layout">
          <aside className="business-insight-panel">
            <div className="business-insight-card business-insight-card--main">
              <span className="business-insight-icon" aria-hidden="true">
                ✦
              </span>

              <div>
                <span className="business-insight-label">Identidad activa</span>
                <strong>{form.business_name || 'Pendiente de completar'}</strong>
                <p>
                  {form.description ||
                    'Agrega una descripción clara para que el agente responda con mayor precisión.'}
                </p>
              </div>
            </div>

            <div className="business-insight-grid">
              <div className="business-insight-mini">
                <span aria-hidden="true">✉</span>
                <strong>{form.business_email || 'Sin email'}</strong>
                <small>Email negocio</small>
              </div>

              <div className="business-insight-mini">
                <span aria-hidden="true">☎</span>
                <strong>{form.business_phone || 'Sin teléfono'}</strong>
                <small>Teléfono negocio</small>
              </div>

              <div className="business-insight-mini">
                <span aria-hidden="true">⌖</span>
                <strong>{form.attention_zones || 'Sin zonas'}</strong>
                <small>Cobertura</small>
              </div>

              <div className="business-insight-mini">
                <span aria-hidden="true">◷</span>
                <strong>{form.business_hours || 'Sin horario'}</strong>
                <small>Horario</small>
              </div>
            </div>
          </aside>

          <form className="settings-form business-profile-form" onSubmit={handleSubmit}>
            <div className="form-section-card">
              <div className="form-section-heading">
                <span className="form-section-icon" aria-hidden="true">
                  ⌂
                </span>
                <div>
                  <h4>Identidad del negocio</h4>
                  <p>Información base que define cómo se presenta la empresa.</p>
                </div>
              </div>

              <div className="settings-form-grid">
                <label className="field-group">
                  <span>Nombre comercial</span>
                  <input
                    name="business_name"
                    value={form.business_name}
                    onChange={handleChange}
                  />
                </label>

                <label className="field-group">
                  <span>Razón social</span>
                  <input
                    name="legal_name"
                    value={form.legal_name}
                    onChange={handleChange}
                  />
                </label>

                <label className="field-group field-group--full">
                  <span>Web</span>
                  <input
                    name="website_url"
                    value={form.website_url}
                    onChange={handleChange}
                  />
                </label>

                <label className="field-group field-group--full">
                  <span>Descripción</span>
                  <textarea
                    name="description"
                    rows="4"
                    value={form.description}
                    onChange={handleChange}
                  />
                </label>
              </div>
            </div>

            <div className="form-section-card">
              <div className="form-section-heading">
                <span className="form-section-icon" aria-hidden="true">
                  ✉
                </span>
                <div>
                  <h4>Contacto comercial</h4>
                  <p>Datos que facilitan continuidad, avisos y seguimiento.</p>
                </div>
              </div>

              <div className="settings-form-grid">
                <label className="field-group">
                  <span>Email negocio</span>
                  <input
                    name="business_email"
                    type="email"
                    value={form.business_email}
                    onChange={handleChange}
                  />
                </label>

                <label className="field-group">
                  <span>Teléfono negocio</span>
                  <input
                    name="business_phone"
                    value={form.business_phone}
                    onChange={handleChange}
                  />
                </label>

                <label className="field-group">
                  <span>Contacto principal</span>
                  <input
                    name="primary_contact_name"
                    value={form.primary_contact_name}
                    onChange={handleChange}
                  />
                </label>

                <label className="field-group">
                  <span>Email contacto</span>
                  <input
                    name="primary_contact_email"
                    type="email"
                    value={form.primary_contact_email}
                    onChange={handleChange}
                  />
                </label>

                <label className="field-group field-group--full">
                  <span>Teléfono contacto</span>
                  <input
                    name="primary_contact_phone"
                    value={form.primary_contact_phone}
                    onChange={handleChange}
                  />
                </label>
              </div>
            </div>

            <div className="form-section-card">
              <div className="form-section-heading">
                <span className="form-section-icon" aria-hidden="true">
                  ⌖
                </span>
                <div>
                  <h4>Ubicación y cobertura</h4>
                  <p>Ayuda al agente a responder sobre zonas y alcance.</p>
                </div>
              </div>

              <div className="settings-form-grid">
                <label className="field-group field-group--full">
                  <span>Dirección</span>
                  <input
                    name="address_line"
                    value={form.address_line}
                    onChange={handleChange}
                  />
                </label>

                <label className="field-group">
                  <span>Ciudad</span>
                  <input name="city" value={form.city} onChange={handleChange} />
                </label>

                <label className="field-group">
                  <span>Región</span>
                  <input
                    name="region"
                    value={form.region}
                    onChange={handleChange}
                  />
                </label>

                <label className="field-group">
                  <span>País</span>
                  <input
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                  />
                </label>

                <label className="field-group">
                  <span>Código postal</span>
                  <input
                    name="postal_code"
                    value={form.postal_code}
                    onChange={handleChange}
                  />
                </label>

                <label className="field-group field-group--full">
                  <span>Zonas de atención</span>
                  <input
                    name="attention_zones"
                    value={form.attention_zones}
                    onChange={handleChange}
                  />
                </label>
              </div>
            </div>

            <div className="form-section-card">
              <div className="form-section-heading">
                <span className="form-section-icon" aria-hidden="true">
                  ◷
                </span>
                <div>
                  <h4>Operación</h4>
                  <p>Información útil para atención, disponibilidad y contexto.</p>
                </div>
              </div>

              <div className="settings-form-grid">
                <label className="field-group field-group--full">
                  <span>Horario comercial</span>
                  <input
                    name="business_hours"
                    value={form.business_hours}
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

            <div className="settings-form-actions business-profile-actions">
              <button className="primary-btn" type="submit" disabled={isSaving}>
                {isSaving ? 'Guardando...' : 'Guardar perfil'}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </section>
  );
}

export default BusinessProfilePage;