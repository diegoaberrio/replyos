export const mockFaqsResponse = {
  success: true,
  data: {
    items: [
      {
        id: 'faq-001',
        business_profile_id: 'business-001',
        question: '¿Qué hace ReplyOS exactamente?',
        answer:
          'ReplyOS automatiza la atención inicial, responde dudas frecuentes y ayuda a convertir conversaciones en oportunidades comerciales.',
        sort_order: 1,
        is_active: true,
        created_at: '2026-04-20T10:00:00.000Z',
        updated_at: '2026-04-21T10:00:00.000Z',
      },
      {
        id: 'faq-002',
        business_profile_id: 'business-001',
        question: '¿Se puede usar para captar reuniones?',
        answer:
          'Sí. El flujo está pensado para detectar interés, capturar datos y registrar solicitudes comerciales.',
        sort_order: 2,
        is_active: true,
        created_at: '2026-04-20T10:20:00.000Z',
        updated_at: '2026-04-21T10:20:00.000Z',
      },
      {
        id: 'faq-003',
        business_profile_id: 'business-001',
        question: '¿Funciona solo en web?',
        answer:
          'En el MVP el foco es el canal web controlado, dejando abierta la puerta a integraciones futuras.',
        sort_order: 3,
        is_active: false,
        created_at: '2026-04-20T10:35:00.000Z',
        updated_at: '2026-04-21T10:35:00.000Z',
      },
    ],
  },
};