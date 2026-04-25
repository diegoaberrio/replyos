export const mockCommercialRequestsResponse = {
  success: true,
  data: {
    items: [
      {
        id: 'req-001',
        business_profile_id: 'business-001',
        conversation_id: 'conv-001',
        lead_id: 'lead-001',
        request_type: 'meeting',
        request_status: 'pending',
        preferred_date: '2026-04-25T00:00:00.000Z',
        preferred_time: '11:00:00',
        preferred_time_range: 'mañana',
        details: 'Disponible por videollamada.',
        registered_at: '2026-04-23T08:41:00.000Z',
        created_at: '2026-04-23T08:41:00.000Z',
        updated_at: '2026-04-23T08:41:00.000Z',
        full_name: 'Laura Gómez',
        email: 'laura@email.com',
        phone: '+34600111222',
        public_identifier: 'public-conv-001',
      },
    ],
  },
};

export const mockCommercialRequestDetails = {
  'req-001': {
    success: true,
    data: {
      id: 'req-001',
      business_profile_id: 'business-001',
      conversation_id: 'conv-001',
      lead_id: 'lead-001',
      request_type: 'meeting',
      request_status: 'pending',
      preferred_date: '2026-04-25T00:00:00.000Z',
      preferred_time: '11:00:00',
      preferred_time_range: 'mañana',
      details: 'Disponible por videollamada.',
      registered_at: '2026-04-23T08:41:00.000Z',
      created_at: '2026-04-23T08:41:00.000Z',
      updated_at: '2026-04-23T08:41:00.000Z',
      full_name: 'Laura Gómez',
      email: 'laura@email.com',
      phone: '+34600111222',
      public_identifier: 'public-conv-001',
      lead_status: 'converted',
      conversation_status: 'converted',
      conversation_result: 'commercial_request_created',
    },
  },
};