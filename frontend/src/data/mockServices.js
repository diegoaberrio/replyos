export const mockServicesResponse = {
  success: true,
  data: {
    items: [
      {
        id: 'service-001',
        business_profile_id: 'business-001',
        name: 'Implementación inicial',
        short_description: 'Configuración base del agente y su contexto.',
        detailed_description:
          'Incluye levantamiento del negocio, estructura inicial de FAQs, servicios, tono y mensajes.',
        is_active: true,
        created_at: '2026-04-19T09:00:00.000Z',
        updated_at: '2026-04-21T09:00:00.000Z',
      },
      {
        id: 'service-002',
        business_profile_id: 'business-001',
        name: 'Optimización conversacional',
        short_description: 'Mejora de prompts, flujos y conversión.',
        detailed_description:
          'Ajuste del tono, rutas conversacionales, heurísticas de captación y estructura de cierre.',
        is_active: true,
        created_at: '2026-04-19T09:15:00.000Z',
        updated_at: '2026-04-21T09:15:00.000Z',
      },
      {
        id: 'service-003',
        business_profile_id: 'business-001',
        name: 'Auditoría de conversaciones',
        short_description: 'Revisión operativa de interacciones y leads.',
        detailed_description:
          'Análisis de conversaciones registradas para detectar fricción, vacíos de contexto y mejora comercial.',
        is_active: false,
        created_at: '2026-04-19T09:30:00.000Z',
        updated_at: '2026-04-21T09:30:00.000Z',
      },
    ],
  },
};