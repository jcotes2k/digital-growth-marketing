import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Plan prices for commission calculation
const PLAN_PRICES = {
  pro: 19,
  premium: 39,
  gold: 49,
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // ePayco sends data as form-urlencoded or JSON
    let data: Record<string, string>;
    const contentType = req.headers.get('content-type') || '';
    
    if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await req.formData();
      data = Object.fromEntries(formData.entries()) as Record<string, string>;
    } else {
      data = await req.json();
    }

    console.log('ePayco subscription webhook received:', JSON.stringify(data, null, 2));

    const {
      x_ref_payco,
      x_transaction_id,
      x_amount,
      x_cod_response,
      x_response,
      x_response_reason_text,
      x_id_invoice,
      x_subscription,
    } = data;

    // Create Supabase client with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Find the subscription by ePayco subscription ID
    const { data: subscription, error: subError } = await supabase
      .from('epayco_subscriptions')
      .select('*')
      .eq('epayco_subscription_id', x_subscription)
      .maybeSingle();

    if (subError || !subscription) {
      console.error('Subscription not found:', x_subscription, subError);
      return new Response(
        JSON.stringify({ error: 'Subscription not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Found subscription:', subscription.id, 'for user:', subscription.user_id);

    // Map ePayco response codes
    // 1 = Approved, 2 = Rejected, 3 = Pending, 4 = Failed
    const isApproved = x_cod_response === '1';
    const isFailed = x_cod_response === '2' || x_cod_response === '4';

    if (isApproved) {
      console.log('Payment approved for subscription:', subscription.id);

      // Calculate new period dates
      const now = new Date();
      const newPeriodEnd = new Date(subscription.current_period_end);
      newPeriodEnd.setMonth(newPeriodEnd.getMonth() + 1);

      // Update subscription period
      const { error: updateSubError } = await supabase
        .from('epayco_subscriptions')
        .update({
          current_period_start: subscription.current_period_end,
          current_period_end: newPeriodEnd.toISOString(),
          status: 'active',
          updated_at: now.toISOString(),
        })
        .eq('id', subscription.id);

      if (updateSubError) {
        console.error('Error updating subscription:', updateSubError);
      }

      // Update user_subscriptions expiration
      const { error: userSubError } = await supabase
        .from('user_subscriptions')
        .update({
          expires_at: newPeriodEnd.toISOString(),
          is_active: true,
          updated_at: now.toISOString(),
        })
        .eq('user_id', subscription.user_id);

      if (userSubError) {
        console.error('Error updating user subscription:', userSubError);
      }

      // Record payment transaction
      const { error: transactionError } = await supabase
        .from('payment_transactions')
        .insert({
          user_id: subscription.user_id,
          epayco_ref: x_ref_payco || x_transaction_id,
          plan: subscription.plan,
          amount: parseFloat(x_amount || '0'),
          currency: 'USD',
          status: 'approved',
          response_data: data,
        });

      if (transactionError) {
        console.error('Error recording transaction:', transactionError);
      }

      // Process monthly affiliate commission
      const planPrice = PLAN_PRICES[subscription.plan as keyof typeof PLAN_PRICES] || parseFloat(x_amount || '0');
      await processAffiliateCommission(supabase, subscription.user_id, subscription.plan, planPrice);

      console.log('Subscription renewed successfully until:', newPeriodEnd.toISOString());

    } else if (isFailed) {
      console.log('Payment failed for subscription:', subscription.id, 'Reason:', x_response_reason_text);

      // Mark subscription as past_due
      const { error: updateError } = await supabase
        .from('epayco_subscriptions')
        .update({
          status: 'past_due',
          updated_at: new Date().toISOString(),
        })
        .eq('id', subscription.id);

      if (updateError) {
        console.error('Error updating subscription status:', updateError);
      }

      // Record failed transaction
      await supabase
        .from('payment_transactions')
        .insert({
          user_id: subscription.user_id,
          epayco_ref: x_ref_payco || x_transaction_id,
          plan: subscription.plan,
          amount: parseFloat(x_amount || '0'),
          currency: 'USD',
          status: 'rejected',
          response_data: data,
        });
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        status: isApproved ? 'renewed' : isFailed ? 'failed' : 'pending',
        message: x_response_reason_text || x_response 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing subscription webhook:', error);
    return new Response(
      JSON.stringify({ error: 'Webhook processing failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function processAffiliateCommission(
  supabase: any,
  userId: string,
  plan: string,
  amount: number
) {
  try {
    // Get user's subscription to check if they were referred
    const { data: subscription } = await supabase
      .from('user_subscriptions')
      .select('referred_by')
      .eq('user_id', userId)
      .maybeSingle();

    if (!subscription?.referred_by) {
      console.log('No referral code found for user:', userId);
      return;
    }

    const referralCode = subscription.referred_by;
    console.log('Processing monthly affiliate commission for referral code:', referralCode);

    // Find the affiliate by code
    const { data: affiliate } = await supabase
      .from('affiliates')
      .select('*')
      .eq('affiliate_code', referralCode)
      .eq('is_active', true)
      .maybeSingle();

    if (!affiliate) {
      console.log('No active affiliate found for code:', referralCode);
      return;
    }

    // Calculate 10% commission
    const commissionRate = affiliate.commission_rate || 0.10;
    const commissionAmount = amount * commissionRate;

    console.log(`Monthly commission: ${amount} x ${commissionRate} = ${commissionAmount}`);

    // Create referral record for this month's payment
    const { error: referralError } = await supabase
      .from('affiliate_referrals')
      .insert({
        affiliate_id: affiliate.id,
        referred_user_id: userId,
        referred_plan: plan,
        payment_amount: amount,
        commission_amount: commissionAmount,
        status: 'approved',
      });

    if (referralError) {
      console.error('Error creating referral record:', referralError);
      return;
    }

    // Update affiliate's earnings
    const newTotalEarned = (affiliate.total_earned || 0) + commissionAmount;
    const newPendingPayout = (affiliate.pending_payout || 0) + commissionAmount;

    const { error: updateError } = await supabase
      .from('affiliates')
      .update({
        total_earned: newTotalEarned,
        pending_payout: newPendingPayout,
      })
      .eq('id', affiliate.id);

    if (updateError) {
      console.error('Error updating affiliate earnings:', updateError);
    } else {
      console.log(`Monthly commission of $${commissionAmount} credited to affiliate ${affiliate.affiliate_code}`);
    }
  } catch (error) {
    console.error('Error processing affiliate commission:', error);
  }
}
