import { apiClient } from './apiClient';

export async function getAgentSettings() {
  return apiClient('/admin/agent-settings', {
    method: 'GET',
  });
}

export async function updateAgentSettings(payload) {
  return apiClient('/admin/agent-settings', {
    method: 'PUT',
    body: payload,
  });
}