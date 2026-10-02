import api from './api';
import type { User, UserRole } from '../types/user.types';

export interface DashboardStats {
  total_users: number;
  active_users: number;
  total_predictions: number;
  predictions_today: number;
  top_diseases: { disease: string; count: number }[];
  recent_users: {
    id: number;
    email: string;
    full_name: string | null;
    role: string;
    created_at: string;
  }[];
}

export interface ActivityPoint {
  date: string;
  predictions: number;
}

export interface UserListResponse {
  total: number;
  users: User[];
}

export const adminService = {
  async stats(): Promise<DashboardStats> {
    const { data } = await api.get<DashboardStats>('/admin/stats');
    return data;
  },

  async activity(days = 14): Promise<ActivityPoint[]> {
    const { data } = await api.get<ActivityPoint[]>('/admin/activity', {
      params: { days },
    });
    return data;
  },

  async listUsers(params: {
    q?: string;
    role?: UserRole;
    is_active?: boolean;
    limit?: number;
    offset?: number;
  } = {}): Promise<UserListResponse> {
    const { data } = await api.get<UserListResponse>('/admin/users', { params });
    return data;
  },

  async updateUser(
    userId: number,
    payload: { role?: UserRole; is_active?: boolean }
  ): Promise<User> {
    const { data } = await api.patch<User>(`/admin/users/${userId}`, payload);
    return data;
  },

  async deleteUser(userId: number): Promise<void> {
    await api.delete(`/admin/users/${userId}`);
  },
};