export interface ApprovalWorkflow {
  id: string;
  post_id: string;
  requester_id: string;
  approver_id?: string;
  status: 'pending' | 'approved' | 'rejected' | 'revision_requested';
  feedback?: string;
  created_at: string;
  updated_at: string;
  approved_at?: string;
}

export interface ApprovalWithPost extends ApprovalWorkflow {
  post: {
    title: string;
    content: string;
    platform: string;
    scheduled_date: string;
  };
}