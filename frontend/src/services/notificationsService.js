import { apiClient } from './apiClient';

export async function listNotifications() {
  return apiClient('/admin/notifications', {
    method: 'GET',
  });
}