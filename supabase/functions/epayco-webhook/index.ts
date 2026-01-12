import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    console.log('ePayco webhook received:', JSON.stringify(data, null, 2));

    // Extract ePayco response fields
    const {
      x_ref_payco,
      x_transaction_id,
      x_amount,
      x_currency_code,
      x_cod_response,
      x_response,
      x_response_reason_text,
      x_extra1: userId,
      x_extra2: plan,
      x_extra3: invoiceNumber,
    } = data;

    if (!userId || !plan) {
      console.error('Missing user data in webhook:', { userId, plan });
      return new Response(
        JSON.stringify({ error: 'Missing user data' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Map ePayco response codes to status
    // 1 = Approved, 2 = Rejected, 3 = Pending, 4 = Failed
    let status = 'pending';
    if (x_cod_response === '1') {
      status = 'approved';
    } else if (x_cod_response === '2' || x_cod_response === '4') {
      status = 'rejected';
    } else if (x_cod_response === '3') {
      status = 'pending';
    }

    // Upsert payment transaction
    const { error: transactionError } = await supabase
      .from('payment_transactions')
      .upsert({
        user_id: userId,
        epayco_ref: x_ref_payco || x_transaction_id,
        plan: plan,
        amount: parseFloat(x_amount || '0'),
        currency: x_currency_code || 'USD',
        status: status,
        response_data: data,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'epayco_ref'
      });

    if (transactionError) {
      console.error('Error saving transaction:', transactionError);
    }

    // If payment approved, update user subscription and process affiliate commission
    if (status === 'approved') {
      console.log('Payment approved, updating subscription for user:', userId, 'to plan:', plan);

      // Calculate expiration (1 month from now)
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 1);

      const { error: subscriptionError } = await supabase
        .from('user_subscriptions')
        .upsert({
          user_id: userId,
          plan: plan,
          is_active: true,
          started_at: new Date().toISOString(),
          expires_at: expiresAt.toISOString(),
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id'
        });

      if (subscriptionError) {
        console.error('Error updating subscription:', subscriptionError);
      } else {
        console.log('Subscription updated successfully');
      }

      // Process affiliate commission
      await processAffiliateCommission(supabase, userId, plan, parseFloat(x_amount || '0'));
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        status,
        message: x_response_reason_text || x_response 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing webhook:', error);
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
    console.log('Processing affiliate commission for referral code:', referralCode);

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

    console.log(`Calculating commission: ${amount} x ${commissionRate} = ${commissionAmount}`);

    // Create referral record
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
      console.log(`Commission of $${commissionAmount} credited to affiliate ${affiliate.affiliate_code}`);
    }
  } catch (error) {
    console.error('Error processing affiliate commission:', error);
  }
}
