export interface AdminStats {
  totalUsers: number;
  usersByPlan: Record<string, number>;
  activeTrials: number;
  totalAffiliates: number;
  pendingPayouts: number;
  totalCommissions: number;
  totalPendingCommissions: number;
}

export interface UserWithDetails {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  company_name: string | null;
  business_sector: string;
  plan: string;
  is_trial: boolean;
  is_active: boolean;
  created_at: string;
  whatsapp: string;
  tool_usage_count: number;
}

export interface ToolUsageStat {
  tool_name: string;
  usage_count: number;
  unique_users: number;
}

export interface AffiliateWithDetails {
  id: string;
  user_id: string;
  affiliate_code: string;
  commission_rate: number;
  total_earned: number;
  pending_payout: number;
  is_active: boolean;
  created_at: string;
  email?: string;
  full_name?: string;
  referral_count?: number;
}

export interface PayoutWithDetails {
  id: string;
  affiliate_id: string;
  amount: number;
  payment_method: 'bank' | 'nequi' | 'daviplata';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  requested_at: string;
  processed_at: string | null;
  admin_notes: string | null;
  payment_details: any;
  affiliate_name?: string;
  affiliate_email?: string;
  affiliate_code?: string;
}
