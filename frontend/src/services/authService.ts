import api from './api';
import type {
  LoginPayload,
  RegisterPayload,
  Token,
  User,
} from '../types/user.types';

export const authService = {
  async register(payload: RegisterPayload): Promise<User> {
    const { data } = await api.post<User>('/auth/register', payload);
    return data;
  },

  async login(payload: LoginPayload): Promise<Token> {
    const { data } = await api.post<Token>('/auth/login', payload);
    return data;
  },

  async me(): Promise<User> {
    const { data } = await api.get<User>('/auth/me');
    return data;
  },

  async updateProfile(payload: {
    full_name?: string | null;
    preferred_language?: 'en' | 'ny';
  }): Promise<User> {
    const { data } = await api.patch<User>('/auth/me/profile', payload);
    return data;
  },

  async changeEmail(payload: { new_email: string; password: string }): Promise<User> {
    const { data } = await api.patch<User>('/auth/me/email', payload);
    return data;
  },

  async changePassword(payload: {
    current_password: string;
    new_password: string;
  }): Promise<{ detail: string }> {
    const { data } = await api.patch<{ detail: string }>('/auth/me/password', payload);
    return data;
  },
};