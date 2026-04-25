import { useEffect, useMemo, useState } from 'react';
import {
  createFaq,
  deleteFaq,
  listFaqs,
  updateFaq,
} from '../../services/faqsService';

const INITIAL_FORM = {
  question: '',
  answer: '',
  sort_order: 1,
  is_active: true,
};

function FaqsPage() {
  const [faqs, setFaqs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);

  const activeFaqs = useMemo(
    () => faqs.filter((faq) => faq.is_active).length,
    [faqs]
  );

  const inactiveFaqs = useMemo(
    () => faqs.filter((faq) => !faq.is_active).length,
    [faqs]
  );

  const nextSortOrder = useMemo(() => {
    if (!faqs.length) {
      return 1;
    }

    return Math.max(...faqs.map((faq) => Number(faq.sort_order) || 0)) + 1;
  }, [faqs]);

  useEffect(() => {
    loadFaqs();
  }, []);

  async function loadFaqs() {
    try {
      setIsLoading(true);
      setErrorMessage('');

      const response = await listFaqs();
      setFaqs(response.data.items ?? []);
    } catch (error) {
      setErrorMessage(error?.error?.message || 'No se pudieron cargar las FAQs.');
    } finally {
      setIsLoading(false);
    }
  }

  function resetForm() {
    setForm({
      ...INITIAL_FORM,
      sort_order: nextSortOrder,
    });
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

  function handleEdit(faq) {
    setEditingId(faq.id);
    setErrorMessage('');
    setSuccessMessage('');
    setForm({
      question: faq.question ?? '',
      answer: faq.answer ?? '',
      sort_order: faq.sort_order ?? 1,
      is_active: Boolean(faq.is_active),
    });
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      '¿Seguro que quieres eliminar esta FAQ?'
    );

    if (!confirmed) {
      return;
    }

    try {
      setErrorMessage('');
      setSuccessMessage('');
      await deleteFaq(id);
      await loadFaqs();

      if (editingId === id) {
        resetForm();
      }

      setSuccessMessage('FAQ eliminada correctamente.');
    } catch (error) {
      setErrorMessage(error?.error?.message || 'No se pudo eliminar la FAQ.');
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setIsSaving(true);
      setErrorMessage('');
      setSuccessMessage('');

      if (!form.question.trim() || !form.answer.trim()) {
        setErrorMessage('Pregunta y respuesta son obligatorias.');
        setIsSaving(false);
        return;
      }

      if (editingId) {
        await updateFaq(editingId, form);
        setSuccessMessage('FAQ actualizada correctamente.');
      } else {
        await createFaq(form);
        setSuccessMessage('FAQ creada correctamente.');
      }

      await loadFaqs();
      resetForm();
    } catch (error) {
      setErrorMessage(error?.error?.message || 'No se pudo guardar la FAQ.');
    } finally {
      setIsSaving(false);
    }
  }

  useEffect(() => {
    if (!editingId && !isLoading) {
      setForm((prev) => ({
        ...prev,
        sort_order: nextSortOrder,
      }));
    }
  }, [nextSortOrder, editingId, isLoading]);

  return (
    <section className="faqs-page faqs-page--wow">
      <div className="content-page-card faqs-hero">
        <div className="faqs-hero__copy">
          <span className="mini-chip">FAQs</span>

          <h3 className="content-page-title">
            <span className="native-title-icon" aria-hidden="true">
              ?
            </span>
            Base de respuestas del agente
          </h3>

          <p className="content-page-copy">
            Entrena al agente con preguntas frecuentes claras para responder con
            precisión, reducir fricción y acelerar la conversión.
          </p>
        </div>

        <aside className="faqs-knowledge-meter" aria-label="Resumen de FAQs">
          <div className="faqs-knowledge-meter__orb" aria-hidden="true">
            ?
          </div>

          <div>
            <span>Conocimiento activo</span>
            <strong>{activeFaqs} FAQs activas</strong>
            <small>{inactiveFaqs} inactivas · {faqs.length} totales</small>
          </div>
        </aside>
      </div>

      <div className="crud-page faqs-crud-layout">
        <article className="content-page-card faqs-editor-card">
          <div className="crud-header">
            <div>
              <span className="mini-chip">
                {editingId ? 'Modo edición' : 'Nueva FAQ'}
              </span>

              <h3 className="content-page-title">
                {editingId ? 'Editar pregunta frecuente' : 'Crear pregunta frecuente'}
              </h3>

              <p className="content-page-copy">
                Define una pregunta y una respuesta de referencia para que el
                agente pueda usarla durante la conversación.
              </p>
            </div>

            {editingId ? (
              <button className="secondary-btn" type="button" onClick={resetForm}>
                Cancelar edición
              </button>
            ) : null}
          </div>

          <div className="faq-editor-insight">
            <span className="faq-editor-insight__icon" aria-hidden="true">
              ✦
            </span>

            <div>
              <strong>
                {editingId ? 'Actualizando conocimiento' : 'Añadiendo conocimiento'}
              </strong>
              <p>
                Las FAQs activas ayudan al agente a responder dudas recurrentes
                con más consistencia.
              </p>
            </div>
          </div>

          <form className="settings-form faqs-form" onSubmit={handleSubmit}>
            <div className="settings-form-grid">
              <label className="field-group field-group--full">
                <span>Pregunta</span>
                <input
                  name="question"
                  value={form.question}
                  onChange={handleChange}
                  placeholder="Ej. ¿Qué hace ReplyOS exactamente?"
                />
              </label>

              <label className="field-group field-group--full">
                <span>Respuesta</span>
                <textarea
                  name="answer"
                  rows="5"
                  value={form.answer}
                  onChange={handleChange}
                  placeholder="Escribe la respuesta de referencia..."
                />
              </label>

              <label className="field-group">
                <span>Orden</span>
                <input
                  name="sort_order"
                  type="number"
                  min="1"
                  value={form.sort_order}
                  onChange={handleChange}
                />
              </label>

              <label className="toggle-field faq-toggle-field">
                <input
                  name="is_active"
                  type="checkbox"
                  checked={form.is_active}
                  onChange={handleChange}
                />
                <span>FAQ activa</span>
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

            <div className="settings-form-actions faqs-form-actions">
              <button className="primary-btn" type="submit" disabled={isSaving}>
                {isSaving
                  ? editingId
                    ? 'Guardando cambios...'
                    : 'Creando FAQ...'
                  : editingId
                  ? 'Guardar cambios'
                  : 'Crear FAQ'}
              </button>
            </div>
          </form>
        </article>

        <article className="content-page-card faqs-list-card">
          <div className="faqs-list-header">
            <div>
              <span className="mini-chip">Listado</span>
              <h3 className="content-page-title">FAQs registradas</h3>
              <p className="content-page-copy">
                Conocimiento operativo que el agente puede consultar para
                responder mejor.
              </p>
            </div>

            <div className="faqs-count-pill" aria-hidden="true">
              <strong>{faqs.length}</strong>
              <span>Total</span>
            </div>
          </div>

          {isLoading ? (
            <div className="dashboard-state-card dashboard-state-card--loading faqs-state-card">
              <div className="dashboard-state-orbit" aria-hidden="true">
                <span>?</span>
              </div>

              <span className="mini-chip">FAQs</span>
              <h3 className="content-page-title">Cargando conocimiento</h3>
              <p className="content-page-copy">
                Recuperando preguntas frecuentes desde la API.
              </p>
            </div>
          ) : null}

          {!isLoading && faqs.length === 0 ? (
            <div className="faqs-empty-state">
              <span className="faqs-empty-state__icon" aria-hidden="true">
                ?
              </span>
              <strong>No hay FAQs registradas todavía.</strong>
              <p>
                Crea la primera pregunta frecuente para empezar a construir la
                base de conocimiento del agente.
              </p>
            </div>
          ) : null}

          {!isLoading && faqs.length > 0 ? (
            <div className="entity-grid faqs-grid">
              {faqs.map((faq) => (
                <article
                  key={faq.id}
                  className={`entity-card faq-card ${
                    faq.is_active ? 'faq-card--active' : 'faq-card--inactive'
                  } ${editingId === faq.id ? 'faq-card--editing' : ''}`}
                >
                  <div className="entity-card__top faq-card__top">
                    <span
                      className={`status-badge ${
                        faq.is_active
                          ? 'status-badge--active'
                          : 'status-badge--inactive'
                      }`}
                    >
                      {faq.is_active ? 'Activa' : 'Inactiva'}
                    </span>

                    <span className="entity-meta">Orden #{faq.sort_order}</span>
                  </div>

                  <div className="faq-card__question">
                    <span aria-hidden="true">?</span>
                    <h4 className="entity-title">{faq.question}</h4>
                  </div>

                  <p className="entity-copy faq-card__answer">{faq.answer}</p>

                  <div className="entity-actions faq-card__actions">
                    <button
                      className="secondary-btn"
                      type="button"
                      onClick={() => handleEdit(faq)}
                    >
                      Editar
                    </button>

                    <button
                      className="danger-btn"
                      type="button"
                      onClick={() => handleDelete(faq.id)}
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

export default FaqsPage;