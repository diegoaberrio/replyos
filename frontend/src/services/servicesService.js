import { apiClient } from './apiClient';

export async function listServices() {
  return apiClient('/admin/services', {
    method: 'GET',
  });
}

export async function getService(id) {
  return apiClient(`/admin/services/${id}`, {
    method: 'GET',
  });
}

export async function createService(payload) {
  return apiClient('/admin/services', {
    method: 'POST',
    body: {
      name: payload.name,
      short_description: payload.short_description,
      detailed_description: payload.detailed_description,
      is_active: Boolean(payload.is_active),
    },
  });
}

export async function updateService(id, payload) {
  return apiClient(`/admin/services/${id}`, {
    method: 'PUT',
    body: {
      name: payload.name,
      short_description: payload.short_description,
      detailed_description: payload.detailed_description,
      is_active: Boolean(payload.is_active),
    },
  });
}

export async function deleteService(id) {
  return apiClient(`/admin/services/${id}`, {
    method: 'DELETE',
  });
}