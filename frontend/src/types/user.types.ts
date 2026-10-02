export type UserRole = 'user' | 'admin';

export interface User {
  id: number;
  email: string;
  full_name: string | null;
  role: UserRole;
  preferred_language: 'en' | 'ny';
  avatar_url: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Token {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

export interface LoginPayload {
  email: string;
  password: string;
  role: UserRole;
}

export interface RegisterPayload {
  email: string;
  password: string;
  full_name?: string;
  preferred_language?: 'en' | 'ny';
}