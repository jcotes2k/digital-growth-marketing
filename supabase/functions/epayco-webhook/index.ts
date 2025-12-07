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

    // If payment approved, update user subscription
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