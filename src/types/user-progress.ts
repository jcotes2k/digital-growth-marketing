export type SubscriptionPlan = 'free' | 'pro' | 'premium';

export interface UserSubscription {
  id: string;
  user_id: string;
  plan: SubscriptionPlan;
  started_at: string;
  expires_at?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  phase: string;
  completed: boolean;
  completed_at?: string;
  progress_data?: any;
  created_at: string;
  updated_at: string;
}

export interface PhaseConfig {
  id: string;
  name: string;
  description: string;
  requires?: string[]; // Array of phase IDs that must be completed first
  requiredPlan: SubscriptionPlan; // Minimum plan required to access this phase
  order: number;
}