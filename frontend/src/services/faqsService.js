import { apiClient } from './apiClient';

function sortByOrder(items = []) {
  return [...items].sort(
    (a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0)
  );
}

export async function listFaqs() {
  const response = await apiClient('/admin/faqs', {
    method: 'GET',
  });

  return {
    ...response,
    data: {
      ...response.data,
      items: sortByOrder(response.data?.items ?? []),
    },
  };
}

export async function getFaq(id) {
  return apiClient(`/admin/faqs/${id}`, {
    method: 'GET',
  });
}

export async function createFaq(payload) {
  return apiClient('/admin/faqs', {
    method: 'POST',
    body: {
      question: payload.question,
      answer: payload.answer,
      sort_order: Number(payload.sort_order),
      is_active: Boolean(payload.is_active),
    },
  });
}

export async function updateFaq(id, payload) {
  return apiClient(`/admin/faqs/${id}`, {
    method: 'PUT',
    body: {
      question: payload.question,
      answer: payload.answer,
      sort_order: Number(payload.sort_order),
      is_active: Boolean(payload.is_active),
    },
  });
}

export async function deleteFaq(id) {
  return apiClient(`/admin/faqs/${id}`, {
    method: 'DELETE',
  });
}