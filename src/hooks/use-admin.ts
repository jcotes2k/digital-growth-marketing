import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { AdminStats, UserWithDetails, ToolUsageStat, AffiliateWithDetails, PayoutWithDetails } from '@/types/admin';

export const useAdmin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<UserWithDetails[]>([]);
  const [affiliates, setAffiliates] = useState<AffiliateWithDetails[]>([]);
  const [payouts, setPayouts] = useState<PayoutWithDetails[]>([]);
  const [toolUsage, setToolUsage] = useState<ToolUsageStat[]>([]);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setIsAdmin(false);
      setIsLoading(false);
      return;
    }

    const { data } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();

    const adminStatus = !!data;
    setIsAdmin(adminStatus);
    
    if (adminStatus) {
      await loadAdminData();
    }
    
    setIsLoading(false);
  };

  const loadAdminData = async () => {
    await Promise.all([
      loadStats(),
      loadUsers(),
      loadAffiliates(),
      loadPayouts(),
      loadToolUsage(),
    ]);
  };

  const loadStats = async () => {
    // Get total users count
    const { count: totalUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    // Get subscriptions with plans
    const { data: subscriptions } = await supabase
      .from('user_subscriptions')
      .select('plan, is_trial, is_active');

    const usersByPlan: Record<string, number> = { free: 0, pro: 0, premium: 0, gold: 0 };
    let activeTrials = 0;

    subscriptions?.forEach(sub => {
      usersByPlan[sub.plan] = (usersByPlan[sub.plan] || 0) + 1;
      if (sub.is_trial && sub.is_active) activeTrials++;
    });

    // Get affiliates count
    const { count: totalAffiliates } = await supabase
      .from('affiliates')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    // Get pending payouts
    const { data: pendingPayoutsData } = await supabase
      .from('affiliate_payouts')
      .select('amount')
      .eq('status', 'pending');

    const pendingPayouts = pendingPayoutsData?.reduce((sum, p) => sum + p.amount, 0) || 0;

    // Get total commissions
    const { data: commissionsData } = await supabase
      .from('affiliate_referrals')
      .select('commission_amount, status');

    const totalCommissions = commissionsData?.reduce((sum, r) => sum + r.commission_amount, 0) || 0;
    const totalPendingCommissions = commissionsData?.filter(r => r.status === 'pending')
      .reduce((sum, r) => sum + r.commission_amount, 0) || 0;

    setStats({
      totalUsers: totalUsers || 0,
      usersByPlan,
      activeTrials,
      totalAffiliates: totalAffiliates || 0,
      pendingPayouts,
      totalCommissions,
      totalPendingCommissions,
    });
  };

  const loadUsers = async () => {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (!profiles) return;

    const { data: subscriptions } = await supabase
      .from('user_subscriptions')
      .select('*');

    const { data: usageData } = await supabase
      .from('tool_usage')
      .select('user_id');

    const usageCount = new Map<string, number>();
    usageData?.forEach(u => {
      usageCount.set(u.user_id, (usageCount.get(u.user_id) || 0) + 1);
    });

    const usersWithDetails: UserWithDetails[] = profiles.map(profile => {
      const sub = subscriptions?.find(s => s.user_id === profile.user_id);
      return {
        id: profile.id,
        user_id: profile.user_id,
        email: profile.email,
        full_name: profile.full_name,
        company_name: profile.company_name,
        business_sector: profile.business_sector,
        whatsapp: profile.whatsapp,
        plan: sub?.plan || 'free',
        is_trial: sub?.is_trial || false,
        is_active: sub?.is_active || false,
        created_at: profile.created_at,
        tool_usage_count: usageCount.get(profile.user_id) || 0,
      };
    });

    setUsers(usersWithDetails);
  };

  const loadAffiliates = async () => {
    const { data: affiliatesData } = await supabase
      .from('affiliates')
      .select('*')
      .order('created_at', { ascending: false });

    if (!affiliatesData) return;

    const { data: profiles } = await supabase
      .from('profiles')
      .select('user_id, email, full_name');

    const { data: referrals } = await supabase
      .from('affiliate_referrals')
      .select('affiliate_id');

    const referralCount = new Map<string, number>();
    referrals?.forEach(r => {
      referralCount.set(r.affiliate_id, (referralCount.get(r.affiliate_id) || 0) + 1);
    });

    const affiliatesWithDetails: AffiliateWithDetails[] = affiliatesData.map(aff => {
      const profile = profiles?.find(p => p.user_id === aff.user_id);
      return {
        ...aff,
        email: profile?.email,
        full_name: profile?.full_name,
        referral_count: referralCount.get(aff.id) || 0,
      };
    });

    setAffiliates(affiliatesWithDetails);
  };

  const loadPayouts = async () => {
    const { data: payoutsData } = await supabase
      .from('affiliate_payouts')
      .select('*')
      .order('requested_at', { ascending: false });

    if (!payoutsData) return;

    const { data: affiliatesData } = await supabase
      .from('affiliates')
      .select('id, affiliate_code, user_id');

    const { data: profiles } = await supabase
      .from('profiles')
      .select('user_id, email, full_name');

    const payoutsWithDetails: PayoutWithDetails[] = payoutsData.map(payout => {
      const aff = affiliatesData?.find(a => a.id === payout.affiliate_id);
      const profile = profiles?.find(p => p.user_id === aff?.user_id);
      return {
        ...payout,
        affiliate_name: profile?.full_name,
        affiliate_email: profile?.email,
        affiliate_code: aff?.affiliate_code,
      };
    });

    setPayouts(payoutsWithDetails);
  };

  const loadToolUsage = async () => {
    const { data: usageData } = await supabase
      .from('tool_usage')
      .select('tool_name, user_id');

    if (!usageData) return;

    const toolStats = new Map<string, { count: number; users: Set<string> }>();
    usageData.forEach(u => {
      if (!toolStats.has(u.tool_name)) {
        toolStats.set(u.tool_name, { count: 0, users: new Set() });
      }
      const stat = toolStats.get(u.tool_name)!;
      stat.count++;
      stat.users.add(u.user_id);
    });

    const stats: ToolUsageStat[] = Array.from(toolStats.entries())
      .map(([tool_name, data]) => ({
        tool_name,
        usage_count: data.count,
        unique_users: data.users.size,
      }))
      .sort((a, b) => b.usage_count - a.usage_count);

    setToolUsage(stats);
  };

  const updatePayoutStatus = async (payoutId: string, status: 'completed' | 'failed', notes?: string) => {
    const { error } = await supabase
      .from('affiliate_payouts')
      .update({ 
        status, 
        processed_at: new Date().toISOString(),
        admin_notes: notes 
      })
      .eq('id', payoutId);

    if (!error) {
      await loadPayouts();
      await loadStats();
    }
    return !error;
  };

  const toggleAffiliateStatus = async (affiliateId: string, isActive: boolean) => {
    const { error } = await supabase
      .from('affiliates')
      .update({ is_active: isActive })
      .eq('id', affiliateId);

    if (!error) {
      await loadAffiliates();
    }
    return !error;
  };

  return {
    isAdmin,
    isLoading,
    stats,
    users,
    affiliates,
    payouts,
    toolUsage,
    loadAdminData,
    updatePayoutStatus,
    toggleAffiliateStatus,
  };
};
