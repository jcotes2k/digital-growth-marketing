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
  order: number;
}