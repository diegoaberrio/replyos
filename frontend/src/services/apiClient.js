import { getAuthSession } from '../utils/storage';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

function buildHeaders(headers = {}, token) {
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  };
}

function getStoredAccessToken() {
  const session = getAuthSession();
  return session?.access_token ?? null;
}

export async function apiClient(path, options = {}) {
  const {
    token = getStoredAccessToken(),
    headers = {},
    body,
    ...restOptions
  } = options;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...restOptions,
    headers: buildHeaders(headers, token),
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw (
      data || {
        success: false,
        error: {
          code: 'HTTP_ERROR',
          message: 'Error de comunicación con la API.',
          details: null,
        },
      }
    );
  }

  return data;
}

export { API_BASE_URL };