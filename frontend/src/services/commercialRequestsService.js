import { apiClient } from './apiClient';

export async function listCommercialRequests() {
  return apiClient('/admin/commercial-requests', {
    method: 'GET',
  });
}

export async function getCommercialRequestDetail(id) {
  return apiClient(`/admin/commercial-requests/${id}`, {
    method: 'GET',
  });
}