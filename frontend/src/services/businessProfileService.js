import { apiClient } from './apiClient';

export async function getBusinessProfile() {
  return apiClient('/admin/business-profile', {
    method: 'GET',
  });
}

export async function updateBusinessProfile(payload) {
  return apiClient('/admin/business-profile', {
    method: 'PUT',
    body: payload,
  });
}