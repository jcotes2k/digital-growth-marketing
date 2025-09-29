export interface TeamMember {
  id: string;
  workspace_owner: string;
  member_email: string;
  member_id?: string;
  role: 'admin' | 'editor' | 'viewer';
  status: 'pending' | 'active' | 'inactive';
  invited_at: string;
  accepted_at?: string;
  created_at: string;
  updated_at: string;
}

export interface TaskAssignment {
  id: string;
  post_id: string;
  assigned_to: string;
  assigned_by: string;
  status: 'pending' | 'in_progress' | 'completed';
  due_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface TaskWithPost extends TaskAssignment {
  post: {
    title: string;
    content: string;
    platform: string;
    scheduled_date: string;
  };
}