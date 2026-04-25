import { apiClient } from './apiClient';

export async function getDashboardSummary() {
  return apiClient('/admin/dashboard/summary', {
    method: 'GET',
  });
}