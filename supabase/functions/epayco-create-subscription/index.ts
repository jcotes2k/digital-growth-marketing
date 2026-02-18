import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Plan IDs and prices (these should match what's configured in ePayco)
const PLAN_CONFIG = {
  pro: { id: 'plan_pro_monthly', name: 'Plan Pro', price: 39, interval: 'month' },
  premium: { id: 'plan_premium_monthly', name: 'Plan Premium', price: 69, interval: 'month' },
  gold: { id: 'plan_gold_monthly', name: 'Plan Gold', price: 89, interval: 'month' },
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      userId,
      userEmail,
      userName,
      plan,
      cardNumber,
      cardExpYear,
      cardExpMonth,
      cardCvc,
      docType,
      docNumber,
      phone,
    } = await req.json();

    console.log('Creating subscription for user:', userId, 'plan:', plan);

    // Validate plan
    const planConfig = PLAN_CONFIG[plan as keyof typeof PLAN_CONFIG];
    if (!planConfig) {
      throw new Error(`Invalid plan: ${plan}`);
    }

    // Get ePayco credentials
    const publicKey = Deno.env.get('EPAYCO_PUBLIC_KEY');
    const privateKey = Deno.env.get('EPAYCO_PRIVATE_KEY');

    if (!publicKey || !privateKey) {
      throw new Error('ePayco credentials not configured');
    }

    // Create auth header for ePayco REST API
    const authString = btoa(`${publicKey}:${privateKey}`);
    const authHeader = `Basic ${authString}`;

    // Step 1: Create token for the card
    console.log('Step 1: Creating card token...');
    const tokenResponse = await fetch('https://secure.payco.co/token/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify({
        'card[number]': cardNumber,
        'card[exp_year]': cardExpYear,
        'card[exp_month]': cardExpMonth,
        'card[cvc]': cardCvc,
      }),
    });

    const tokenData = await tokenResponse.json();
    console.log('Token response:', JSON.stringify(tokenData, null, 2));

    if (!tokenData.success || !tokenData.id) {
      throw new Error(tokenData.message || 'Failed to create card token');
    }

    const tokenId = tokenData.id;
    const cardLastFour = cardNumber.slice(-4);
    const cardBrand = tokenData.card?.type || 'unknown';

    // Step 2: Create or get customer
    console.log('Step 2: Creating customer...');
    const customerResponse = await fetch('https://api.secure.payco.co/payment/v1/customer/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify({
        token_card: tokenId,
        name: userName,
        email: userEmail,
        phone: phone,
        default: true,
        doc_type: docType || 'CC',
        doc_number: docNumber,
      }),
    });

    const customerData = await customerResponse.json();
    console.log('Customer response:', JSON.stringify(customerData, null, 2));

    if (!customerData.success || !customerData.data?.customerId) {
      throw new Error(customerData.message || 'Failed to create customer');
    }

    const customerId = customerData.data.customerId;

    // Step 3: Create subscription
    console.log('Step 3: Creating subscription...');
    const subscriptionResponse = await fetch('https://api.secure.payco.co/recurring/v1/subscription/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify({
        id_plan: planConfig.id,
        customer: customerId,
        token_card: tokenId,
        doc_type: docType || 'CC',
        doc_number: docNumber,
        url_confirmation: `${Deno.env.get('SUPABASE_URL')}/functions/v1/epayco-subscription-webhook`,
        method_confirmation: 'POST',
      }),
    });

    const subscriptionData = await subscriptionResponse.json();
    console.log('Subscription response:', JSON.stringify(subscriptionData, null, 2));

    if (!subscriptionData.success || !subscriptionData.data?.subscriptionId) {
      throw new Error(subscriptionData.message || 'Failed to create subscription');
    }

    const subscriptionId = subscriptionData.data.subscriptionId;

    // Step 4: Save to database
    console.log('Step 4: Saving to database...');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Calculate period dates
    const now = new Date();
    const periodEnd = new Date();
    periodEnd.setMonth(periodEnd.getMonth() + 1);

    // Insert epayco subscription record
    const { error: subscriptionError } = await supabase
      .from('epayco_subscriptions')
      .insert({
        user_id: userId,
        epayco_subscription_id: subscriptionId,
        epayco_customer_id: customerId,
        epayco_token_id: tokenId,
        plan: plan,
        status: 'active',
        current_period_start: now.toISOString(),
        current_period_end: periodEnd.toISOString(),
        card_last_four: cardLastFour,
        card_brand: cardBrand,
      });

    if (subscriptionError) {
      console.error('Error saving subscription:', subscriptionError);
      throw new Error('Failed to save subscription to database');
    }

    // Update user_subscriptions table
    const { error: userSubError } = await supabase
      .from('user_subscriptions')
      .upsert({
        user_id: userId,
        plan: plan,
        is_active: true,
        is_trial: false,
        started_at: now.toISOString(),
        expires_at: periodEnd.toISOString(),
        updated_at: now.toISOString(),
      }, {
        onConflict: 'user_id'
      });

    if (userSubError) {
      console.error('Error updating user subscription:', userSubError);
    }

    // Process affiliate commission for first payment
    await processAffiliateCommission(supabase, userId, plan, planConfig.price);

    console.log('Subscription created successfully:', subscriptionId);

    return new Response(
      JSON.stringify({
        success: true,
        subscriptionId,
        customerId,
        plan: planConfig.name,
        price: planConfig.price,
        nextBillingDate: periodEnd.toISOString(),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error creating subscription:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Failed to create subscription' 
      }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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
