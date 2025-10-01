export type AppRole = 'admin' | 'user';

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
  updated_at: string;
}
