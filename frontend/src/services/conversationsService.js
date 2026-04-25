import { apiClient } from './apiClient';

export async function listConversations() {
  return apiClient('/admin/conversations', {
    method: 'GET',
  });
}

export async function getConversationDetail(id) {
  return apiClient(`/admin/conversations/${id}`, {
    method: 'GET',
  });
}