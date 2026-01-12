export type PaymentMethod = 'bank' | 'nequi' | 'daviplata';
export type ReferralStatus = 'pending' | 'approved' | 'paid';
export type PayoutStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface Affiliate {
  id: string;
  user_id: string;
  affiliate_code: string;
  payment_method: PaymentMethod | null;
  bank_name: string | null;
  account_number: string | null;
  account_holder: string | null;
  nequi_phone: string | null;
  daviplata_phone: string | null;
  commission_rate: number;
  total_earned: number;
  pending_payout: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AffiliateReferral {
  id: string;
  affiliate_id: string;
  referred_user_id: string;
  referred_plan: string;
  payment_amount: number;
  commission_amount: number;
  status: ReferralStatus;
  created_at: string;
  updated_at: string;
}

export interface AffiliatePayout {
  id: string;
  affiliate_id: string;
  amount: number;
  payment_method: PaymentMethod;
  payment_details: Record<string, any> | null;
  status: PayoutStatus;
  admin_notes: string | null;
  requested_at: string;
  processed_at: string | null;
  created_at: string;
}

export interface AffiliateStats {
  totalReferrals: number;
  pendingReferrals: number;
  approvedReferrals: number;
  paidReferrals: number;
  totalEarned: number;
  pendingPayout: number;
}
