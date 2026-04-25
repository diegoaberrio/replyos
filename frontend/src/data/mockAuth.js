export const mockAdminSession = {
  success: true,
  data: {
    access_token: 'mock-jwt-access-token',
    refresh_token: 'mock-jwt-refresh-token',
    user: {
      id: 'admin-replyos-001',
      full_name: 'Diego Berrio',
      email: 'admin@replyos.com',
      status: 'active',
    },
  },
  message: 'Login successful',
};