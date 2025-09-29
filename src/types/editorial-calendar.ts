export interface EditorialCalendarItem {
  id: string;
  user_id: string;
  title: string;
  content: string;
  content_type: string;
  platform: string;
  scheduled_date: string;
  scheduled_time?: string;
  status: 'planned' | 'published' | 'cancelled';
  tags?: string[];
  notes?: string;
  generated_by_ai?: boolean;
  created_at: string;
  updated_at: string;
}