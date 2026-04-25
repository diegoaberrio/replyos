import { apiClient } from './apiClient';

export async function createPublicConversation(payload) {
  return apiClient('/public/conversations', {
    method: 'POST',
    token: null,
    body: {
      visitor_name: payload.visitor_name ?? '',
      visitor_email: payload.visitor_email ?? '',
      visitor_phone: payload.visitor_phone ?? '',
    },
  });
}

export async function getPublicConversation(publicIdentifier) {
  return apiClient(`/public/conversations/${publicIdentifier}`, {
    method: 'GET',
    token: null,
  });
}

export async function getPublicConversationMessages(publicIdentifier) {
  return apiClient(`/public/conversations/${publicIdentifier}/messages`, {
    method: 'GET',
    token: null,
  });
}

export async function sendPublicMessage(publicIdentifier, payload) {
  return apiClient(`/public/conversations/${publicIdentifier}/messages`, {
    method: 'POST',
    token: null,
    body: {
      message_text: payload.message_text,
    },
  });
}

export async function createPublicLead(publicIdentifier, payload) {
  return apiClient(`/public/conversations/${publicIdentifier}/lead`, {
    method: 'POST',
    token: null,
    body: {
      full_name: payload.full_name ?? '',
      email: payload.email ?? '',
      phone: payload.phone ?? '',
      company_name: payload.company_name ?? '',
      notes: payload.notes ?? '',
    },
  });
}

export async function createPublicCommercialRequest(publicIdentifier, payload) {
  return apiClient(
    `/public/conversations/${publicIdentifier}/commercial-requests`,
    {
      method: 'POST',
      token: null,
      body: {
        request_type: payload.request_type,
        preferred_date: payload.preferred_date || null,
        preferred_time: payload.preferred_time || null,
        preferred_time_range: payload.preferred_time_range || '',
        details: payload.details || '',
      },
    }
  );
}