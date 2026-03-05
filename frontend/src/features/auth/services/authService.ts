import { api } from '../../../lib/api';
import { AuthApiResponse, LoginCredentials, RegisterData } from '../types/auth.types';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthApiResponse> {
    const response = await api.post<AuthApiResponse>('/api/auth/login', credentials);
    return response.data;
  },

  async register(data: RegisterData): Promise<{ id: string; name: string; email: string }> {
    const response = await api.post('/api/auth/register', data);
    return response.data;
  },
};
