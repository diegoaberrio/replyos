import { useEffect, useMemo, useState } from 'react';
import {
  createService,
  deleteService,
  listServices,
  updateService,
} from '../../services/servicesService';

const INITIAL_FORM = {
  name: '',
  short_description: '',
  detailed_description: '',
  is_active: true,
};

function ServicesPage() {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);

  const activeServices = useMemo(
    () => services.filter((service) => service.is_active).length,
    [services]
  );

  const inactiveServices = useMemo(
    () => services.filter((service) => !service.is_active).length,
    [services]
  );

  useEffect(() => {
    loadServices();
  }, []);

  async function loadServices() {
    try {
      setIsLoading(true);
      setErrorMessage('');

      const response = await listServices();
      setServices(response.data.items ?? []);
    } catch (error) {
      setErrorMessage(
        error?.error?.message || 'No se pudieron cargar los servicios.'
      );
    } finally {
      setIsLoading(false);
    }
  }

  function resetForm() {
    setForm(INITIAL_FORM);
    setEditingId(null);
  }

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

  function handleEdit(service) {
    setEditingId(service.id);
    setErrorMessage('');
    setSuccessMessage('');
    setForm({
      name: service.name ?? '',
      short_description: service.short_description ?? '',
      detailed_description: service.detailed_description ?? '',
      is_active: Boolean(service.is_active),
    });
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      '¿Seguro que quieres eliminar este servicio?'
    );

    if (!confirmed) {
      return;
    }

    try {
      setErrorMessage('');
      setSuccessMessage('');
      await deleteService(id);
      await loadServices();

      if (editingId === id) {
        resetForm();
      }

      setSuccessMessage('Servicio eliminado correctamente.');
    } catch (error) {
      setErrorMessage(
        error?.error?.message || 'No se pudo eliminar el servicio.'
      );
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setIsSaving(true);
      setErrorMessage('');
      setSuccessMessage('');

      if (!form.name.trim() || !form.short_description.trim()) {
        setErrorMessage('Nombre y descripción corta son obligatorios.');
        setIsSaving(false);
        return;
      }

      if (editingId) {
        await updateService(editingId, form);
        setSuccessMessage('Servicio actualizado correctamente.');
      } else {
        await createService(form);
        setSuccessMessage('Servicio creado correctamente.');
      }

      await loadServices();
      resetForm();
    } catch (error) {
      setErrorMessage(
        error?.error?.message || 'No se pudo guardar el servicio.'
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="services-page services-page--wow">
      <div className="content-page-card services-hero">
        <div className="services-hero__copy">
          <span className="mini-chip">Servicios</span>

          <h3 className="content-page-title">
            <span className="native-title-icon" aria-hidden="true">
              ◆
            </span>
            Catálogo comercial del agente
          </h3>

          <p className="content-page-copy">
            Define los servicios que ReplyOS puede explicar, recomendar y usar
            como contexto durante la conversación con potenciales clientes.
          </p>
        </div>

        <aside className="services-catalog-meter" aria-label="Resumen de servicios">
          <div className="services-catalog-meter__orb" aria-hidden="true">
            ◆
          </div>

          <div>
            <span>Oferta disponible</span>
            <strong>{activeServices} servicios activos</strong>
            <small>{inactiveServices} inactivos · {services.length} totales</small>
          </div>
        </aside>
      </div>

      <div className="crud-page services-crud-layout">
        <article className="content-page-card services-editor-card">
          <div className="crud-header">
            <div>
              <span className="mini-chip">
                {editingId ? 'Modo edición' : 'Nuevo servicio'}
              </span>

              <h3 className="content-page-title">
                {editingId ? 'Editar servicio' : 'Crear servicio'}
              </h3>

              <p className="content-page-copy">
                Convierte cada servicio en una pieza clara del contexto comercial
                que podrá usar el agente durante el chat.
              </p>
            </div>

            {editingId ? (
              <button className="secondary-btn" type="button" onClick={resetForm}>
                Cancelar edición
              </button>
            ) : null}
          </div>

          <div className="service-editor-insight">
            <span className="service-editor-insight__icon" aria-hidden="true">
              ✦
            </span>

            <div>
              <strong>
                {editingId ? 'Actualizando oferta' : 'Añadiendo oferta'}
              </strong>
              <p>
                Cuanto más claro sea el servicio, mejor podrá el agente explicar
                valor, resolver dudas y conducir a una solicitud comercial.
              </p>
            </div>
          </div>

          <form className="settings-form services-form" onSubmit={handleSubmit}>
            <div className="settings-form-grid">
              <label className="field-group field-group--full">
                <span>Nombre</span>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Ej. Implementación inicial"
                />
              </label>

              <label className="field-group field-group--full">
                <span>Descripción corta</span>
                <textarea
                  name="short_description"
                  rows="3"
                  value={form.short_description}
                  onChange={handleChange}
                  placeholder="Resumen breve del servicio..."
                />
              </label>

              <label className="field-group field-group--full">
                <span>Descripción detallada</span>
                <textarea
                  name="detailed_description"
                  rows="5"
                  value={form.detailed_description}
                  onChange={handleChange}
                  placeholder="Detalle ampliado del servicio..."
                />
              </label>

              <label className="toggle-field field-group--full service-toggle-field">
                <input
                  name="is_active"
                  type="checkbox"
                  checked={form.is_active}
                  onChange={handleChange}
                />
                <span>Servicio activo</span>
              </label>
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

            <div className="settings-form-actions services-form-actions">
              <button className="primary-btn" type="submit" disabled={isSaving}>
                {isSaving
                  ? editingId
                    ? 'Guardando cambios...'
                    : 'Creando servicio...'
                  : editingId
                  ? 'Guardar cambios'
                  : 'Crear servicio'}
              </button>
            </div>
          </form>
        </article>

        <article className="content-page-card services-list-card">
          <div className="services-list-header">
            <div>
              <span className="mini-chip">Listado</span>
              <h3 className="content-page-title">Servicios registrados</h3>
              <p className="content-page-copy">
                Oferta comercial disponible para enriquecer las respuestas del
                agente.
              </p>
            </div>

            <div className="services-count-pill" aria-hidden="true">
              <strong>{services.length}</strong>
              <span>Total</span>
            </div>
          </div>

          {isLoading ? (
            <div className="dashboard-state-card dashboard-state-card--loading services-state-card">
              <div className="dashboard-state-orbit" aria-hidden="true">
                <span>◆</span>
              </div>

              <span className="mini-chip">Servicios</span>
              <h3 className="content-page-title">Cargando catálogo</h3>
              <p className="content-page-copy">
                Recuperando servicios desde la API.
              </p>
            </div>
          ) : null}

          {!isLoading && services.length === 0 ? (
            <div className="services-empty-state">
              <span className="services-empty-state__icon" aria-hidden="true">
                ◆
              </span>
              <strong>No hay servicios cargados todavía.</strong>
              <p>
                Crea el primer servicio para que el agente pueda explicar mejor
                la oferta comercial del negocio.
              </p>
            </div>
          ) : null}

          {!isLoading && services.length > 0 ? (
            <div className="entity-grid services-grid">
              {services.map((service) => (
                <article
                  key={service.id}
                  className={`entity-card service-card ${
                    service.is_active
                      ? 'service-card--active'
                      : 'service-card--inactive'
                  } ${editingId === service.id ? 'service-card--editing' : ''}`}
                >
                  <div className="entity-card__top service-card__top">
                    <span
                      className={`status-badge ${
                        service.is_active
                          ? 'status-badge--active'
                          : 'status-badge--inactive'
                      }`}
                    >
                      {service.is_active ? 'Activo' : 'Inactivo'}
                    </span>

                    <span className="service-card__tag">Oferta</span>
                  </div>

                  <div className="service-card__title">
                    <span aria-hidden="true">◆</span>
                    <h4 className="entity-title">{service.name}</h4>
                  </div>

                  <p className="entity-copy service-card__summary">
                    {service.short_description}
                  </p>

                  {service.detailed_description ? (
                    <p className="entity-copy entity-copy--muted service-card__detail">
                      {service.detailed_description}
                    </p>
                  ) : (
                    <p className="entity-copy entity-copy--muted service-card__detail">
                      Sin descripción detallada todavía.
                    </p>
                  )}

                  <div className="entity-actions service-card__actions">
                    <button
                      className="secondary-btn"
                      type="button"
                      onClick={() => handleEdit(service)}
                    >
                      Editar
                    </button>

                    <button
                      className="danger-btn"
                      type="button"
                      onClick={() => handleDelete(service.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : null}
        </article>
      </div>
    </section>
  );
}

export default ServicesPage;