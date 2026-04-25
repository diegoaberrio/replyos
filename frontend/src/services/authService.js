import { apiClient } from './apiClient';

export async function loginAdmin({ email, password }) {
  return apiClient('/admin/auth/login', {
    method: 'POST',
    token: null,
    body: {
      email,
      password,
    },
  });
}

export async function getMe(token) {
  return apiClient('/admin/auth/me', {
    method: 'GET',
    token,
  });
}

export async function logoutAdmin(token) {
  return apiClient('/admin/auth/logout', {
    method: 'POST',
    token,
    body: {},
  });
}