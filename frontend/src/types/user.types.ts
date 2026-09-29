export interface User {
  id: string;
  phone?: string;
  email?: string;
  fullName?: string;
  preferredLanguage: 'en' | 'ny';
  createdAt: string;
}