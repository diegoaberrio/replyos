export const mockDashboardSummary = {
  success: true,
  data: {
    totals: {
      conversations: 128,
      leads: 47,
      commercial_requests: 18,
    },
    conversions: {
      conversation_to_lead_percentage: 36.7,
      lead_to_request_percentage: 38.3,
    },
    breakdowns: {
      conversations_by_status: {
        open: 22,
        in_follow_up: 31,
        converted: 18,
        closed_no_conversion: 57,
      },
      conversations_by_intent: {
        information: 34,
        commercial_interest: 52,
        ready_to_advance: 26,
        unknown: 16,
      },
    },
    recent_activity: {
      latest_conversations: [
        {
          id: 'conv-001',
          public_identifier: 'public-conv-001',
          visitor_name: 'Laura Gómez',
          status: 'converted',
          detected_intent: 'ready_to_advance',
          result: 'commercial_request_created',
          started_at: '2026-04-23T08:30:00.000Z',
        },
        {
          id: 'conv-002',
          public_identifier: 'public-conv-002',
          visitor_name: 'Carlos Pérez',
          status: 'in_follow_up',
          detected_intent: 'commercial_interest',
          result: 'interest_without_closure',
          started_at: '2026-04-23T09:12:00.000Z',
        },
      ],
      latest_leads: [
        {
          id: 'lead-001',
          full_name: 'Laura Gómez',
          email: 'laura@email.com',
          lead_status: 'converted',
          captured_at: '2026-04-23T08:40:00.000Z',
        },
        {
          id: 'lead-002',
          full_name: 'Carlos Pérez',
          email: 'carlos@email.com',
          lead_status: 'new',
          captured_at: '2026-04-23T09:15:00.000Z',
        },
      ],
      latest_commercial_requests: [
        {
          id: 'req-001',
          request_type: 'meeting',
          request_status: 'pending',
          full_name: 'Laura Gómez',
          preferred_date: '2026-04-25T00:00:00.000Z',
        },
      ],
    },
  },
};