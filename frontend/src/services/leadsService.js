import { apiClient } from './apiClient';

export async function listLeads() {
  return apiClient('/admin/leads', {
    method: 'GET',
  });
}

export async function getLeadDetail(id) {
  return apiClient(`/admin/leads/${id}`, {
    method: 'GET',
  });
}