import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { 
  Affiliate, 
  AffiliateReferral, 
  AffiliatePayout, 
  AffiliateStats,
  PaymentMethod 
} from '@/types/affiliate';

export function useAffiliate() {
  const [affiliate, setAffiliate] = useState<Affiliate | null>(null);
  const [referrals, setReferrals] = useState<AffiliateReferral[]>([]);
  const [payouts, setPayouts] = useState<AffiliatePayout[]>([]);
  const [stats, setStats] = useState<AffiliateStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();

  const loadAffiliateData = useCallback(async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        setIsLoading(false);
        return;
      }
      setUser(authUser);

      // Load affiliate profile
      const { data: affiliateData } = await supabase
        .from('affiliates')
        .select('*')
        .eq('user_id', authUser.id)
        .maybeSingle();

      if (affiliateData) {
        setAffiliate(affiliateData as unknown as Affiliate);

        // Load referrals
        const { data: referralsData } = await supabase
          .from('affiliate_referrals')
          .select('*')
          .eq('affiliate_id', affiliateData.id)
          .order('created_at', { ascending: false });

        if (referralsData) {
          setReferrals(referralsData as unknown as AffiliateReferral[]);
        }

        // Load payouts
        const { data: payoutsData } = await supabase
          .from('affiliate_payouts')
          .select('*')
          .eq('affiliate_id', affiliateData.id)
          .order('requested_at', { ascending: false });

        if (payoutsData) {
          setPayouts(payoutsData as unknown as AffiliatePayout[]);
        }

        // Calculate stats
        const pendingReferrals = referralsData?.filter(r => r.status === 'pending').length || 0;
        const approvedReferrals = referralsData?.filter(r => r.status === 'approved').length || 0;
        const paidReferrals = referralsData?.filter(r => r.status === 'paid').length || 0;

        setStats({
          totalReferrals: referralsData?.length || 0,
          pendingReferrals,
          approvedReferrals,
          paidReferrals,
          totalEarned: affiliateData.total_earned || 0,
          pendingPayout: affiliateData.pending_payout || 0,
        });
      }
    } catch (error) {
      console.error('Error loading affiliate data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAffiliateData();
  }, [loadAffiliateData]);

  const generateAffiliateCode = (name: string): string => {
    const baseName = name.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `${baseName}${randomNum}`;
  };

  const registerAsAffiliate = async (customCode?: string) => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'Debes iniciar sesión primero',
        variant: 'destructive',
      });
      return false;
    }

    try {
      const code = customCode || generateAffiliateCode(user.email || 'USER');

      const { data, error } = await supabase
        .from('affiliates')
        .insert({
          user_id: user.id,
          affiliate_code: code,
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          toast({
            title: 'Error',
            description: 'Ese código ya está en uso. Prueba con otro.',
            variant: 'destructive',
          });
        } else {
          throw error;
        }
        return false;
      }

      setAffiliate(data as unknown as Affiliate);
      toast({
        title: '¡Bienvenido al programa de afiliados!',
        description: `Tu código es: ${code}`,
      });
      return true;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  const updatePaymentInfo = async (
    paymentMethod: PaymentMethod,
    paymentDetails: {
      bank_name?: string;
      account_number?: string;
      account_holder?: string;
      nequi_phone?: string;
      daviplata_phone?: string;
    }
  ) => {
    if (!affiliate) return false;

    try {
      const { error } = await supabase
        .from('affiliates')
        .update({
          payment_method: paymentMethod,
          ...paymentDetails,
        })
        .eq('id', affiliate.id);

      if (error) throw error;

      await loadAffiliateData();
      toast({
        title: 'Información actualizada',
        description: 'Tus datos de pago han sido guardados.',
      });
      return true;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  const requestPayout = async (amount: number) => {
    if (!affiliate || !affiliate.payment_method) {
      toast({
        title: 'Error',
        description: 'Configura tu método de pago primero.',
        variant: 'destructive',
      });
      return false;
    }

    if (amount > affiliate.pending_payout) {
      toast({
        title: 'Error',
        description: 'No tienes suficiente saldo pendiente.',
        variant: 'destructive',
      });
      return false;
    }

    if (amount < 10) {
      toast({
        title: 'Error',
        description: 'El monto mínimo de retiro es $10 USD.',
        variant: 'destructive',
      });
      return false;
    }

    try {
      const paymentDetails: Record<string, string> = {};
      if (affiliate.payment_method === 'bank') {
        paymentDetails.bank_name = affiliate.bank_name || '';
        paymentDetails.account_number = affiliate.account_number || '';
        paymentDetails.account_holder = affiliate.account_holder || '';
      } else if (affiliate.payment_method === 'nequi') {
        paymentDetails.phone = affiliate.nequi_phone || '';
      } else if (affiliate.payment_method === 'daviplata') {
        paymentDetails.phone = affiliate.daviplata_phone || '';
      }

      const { error } = await supabase
        .from('affiliate_payouts')
        .insert({
          affiliate_id: affiliate.id,
          amount,
          payment_method: affiliate.payment_method,
          payment_details: paymentDetails,
        });

      if (error) throw error;

      await loadAffiliateData();
      toast({
        title: 'Solicitud enviada',
        description: 'Tu solicitud de pago está siendo procesada.',
      });
      return true;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  const getAffiliateLink = () => {
    if (!affiliate) return '';
    const baseUrl = window.location.origin;
    return `${baseUrl}/register?ref=${affiliate.affiliate_code}`;
  };

  const copyLinkToClipboard = async () => {
    const link = getAffiliateLink();
    if (!link) return;

    try {
      await navigator.clipboard.writeText(link);
      toast({
        title: '¡Copiado!',
        description: 'El link ha sido copiado al portapapeles.',
      });
    } catch {
      toast({
        title: 'Error',
        description: 'No se pudo copiar el link.',
        variant: 'destructive',
      });
    }
  };

  return {
    affiliate,
    referrals,
    payouts,
    stats,
    isLoading,
    user,
    registerAsAffiliate,
    updatePaymentInfo,
    requestPayout,
    getAffiliateLink,
    copyLinkToClipboard,
    refreshData: loadAffiliateData,
  };
}

// Utility function to save referral code from URL
export function saveReferralCode() {
  const params = new URLSearchParams(window.location.search);
  const refCode = params.get('ref');
  if (refCode) {
    localStorage.setItem('affiliate_ref_code', refCode);
    console.log('Referral code saved:', refCode);
  }
}

// Utility function to get saved referral code
export function getSavedReferralCode(): string | null {
  return localStorage.getItem('affiliate_ref_code');
}

// Utility function to clear referral code after use
export function clearReferralCode() {
  localStorage.removeItem('affiliate_ref_code');
}
