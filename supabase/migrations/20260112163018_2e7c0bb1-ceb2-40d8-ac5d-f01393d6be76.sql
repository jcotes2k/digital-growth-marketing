-- Create enum types for affiliate system
CREATE TYPE public.payment_method AS ENUM ('bank', 'nequi', 'daviplata');
CREATE TYPE public.referral_status AS ENUM ('pending', 'approved', 'paid');
CREATE TYPE public.payout_status AS ENUM ('pending', 'processing', 'completed', 'failed');

-- Create affiliates table
CREATE TABLE public.affiliates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  affiliate_code TEXT NOT NULL UNIQUE,
  payment_method public.payment_method,
  bank_name TEXT,
  account_number TEXT,
  account_holder TEXT,
  nequi_phone TEXT,
  daviplata_phone TEXT,
  commission_rate NUMERIC(5,4) NOT NULL DEFAULT 0.10,
  total_earned NUMERIC(12,2) NOT NULL DEFAULT 0,
  pending_payout NUMERIC(12,2) NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create affiliate referrals table
CREATE TABLE public.affiliate_referrals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  affiliate_id UUID NOT NULL REFERENCES public.affiliates(id) ON DELETE CASCADE,
  referred_user_id UUID NOT NULL,
  referred_plan TEXT NOT NULL,
  payment_amount NUMERIC(12,2) NOT NULL,
  commission_amount NUMERIC(12,2) NOT NULL,
  status public.referral_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create affiliate payouts table
CREATE TABLE public.affiliate_payouts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  affiliate_id UUID NOT NULL REFERENCES public.affiliates(id) ON DELETE CASCADE,
  amount NUMERIC(12,2) NOT NULL,
  payment_method public.payment_method NOT NULL,
  payment_details JSONB,
  status public.payout_status NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  requested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add referred_by column to user_subscriptions
ALTER TABLE public.user_subscriptions 
ADD COLUMN referred_by TEXT;

-- Enable RLS on all tables
ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_payouts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for affiliates
CREATE POLICY "Users can view their own affiliate profile"
  ON public.affiliates FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own affiliate profile"
  ON public.affiliates FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own affiliate profile"
  ON public.affiliates FOR UPDATE
  USING (auth.uid() = user_id);

-- Admins can view all affiliates
CREATE POLICY "Admins can view all affiliates"
  ON public.affiliates FOR SELECT
  USING (public.is_admin(auth.uid()));

-- RLS Policies for affiliate_referrals
CREATE POLICY "Affiliates can view their own referrals"
  ON public.affiliate_referrals FOR SELECT
  USING (
    affiliate_id IN (
      SELECT id FROM public.affiliates WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all referrals"
  ON public.affiliate_referrals FOR ALL
  USING (public.is_admin(auth.uid()));

-- RLS Policies for affiliate_payouts
CREATE POLICY "Affiliates can view their own payouts"
  ON public.affiliate_payouts FOR SELECT
  USING (
    affiliate_id IN (
      SELECT id FROM public.affiliates WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Affiliates can request payouts"
  ON public.affiliate_payouts FOR INSERT
  WITH CHECK (
    affiliate_id IN (
      SELECT id FROM public.affiliates WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all payouts"
  ON public.affiliate_payouts FOR ALL
  USING (public.is_admin(auth.uid()));

-- Create triggers for updated_at
CREATE TRIGGER update_affiliates_updated_at
  BEFORE UPDATE ON public.affiliates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_affiliate_referrals_updated_at
  BEFORE UPDATE ON public.affiliate_referrals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster lookups
CREATE INDEX idx_affiliates_code ON public.affiliates(affiliate_code);
CREATE INDEX idx_affiliates_user ON public.affiliates(user_id);
CREATE INDEX idx_referrals_affiliate ON public.affiliate_referrals(affiliate_id);
CREATE INDEX idx_referrals_status ON public.affiliate_referrals(status);
CREATE INDEX idx_payouts_affiliate ON public.affiliate_payouts(affiliate_id);
CREATE INDEX idx_payouts_status ON public.affiliate_payouts(status);