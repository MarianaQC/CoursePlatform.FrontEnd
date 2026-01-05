import { apiClient } from '@/lib/api-client';
import { AuthResponse, LoginRequest, RegisterRequest } from '@/types/api';

export const authService = {
  async login(data: LoginRequest) {
    return apiClient.post<AuthResponse>('/auth/login', data);
  },

  async register(data: RegisterRequest) {
    return apiClient.post<AuthResponse>('/auth/register', data);
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getStoredUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  },

  getStoredToken() {
    return localStorage.getItem('token');
  },

  isAuthenticated() {
    const token = this.getStoredToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiration = payload.exp * 1000;
      return Date.now() < expiration;
    } catch {
      return false;
    }
  },

  storeAuthData(authResponse: AuthResponse) {
    localStorage.setItem('token', authResponse.token);
    localStorage.setItem('user', JSON.stringify({
      email: authResponse.email,
      fullName: authResponse.fullName,
      roles: authResponse.roles,
    }));
  },
};
