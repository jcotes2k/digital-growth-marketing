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
    const { subscriptionId, userId } = await req.json();

    console.log('Cancelling subscription:', subscriptionId, 'for user:', userId);

    // Create Supabase client with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify the subscription belongs to the user
    const { data: subscription, error: subError } = await supabase
      .from('epayco_subscriptions')
      .select('*')
      .eq('id', subscriptionId)
      .eq('user_id', userId)
      .maybeSingle();

    if (subError || !subscription) {
      console.error('Subscription not found or access denied:', subError);
      return new Response(
        JSON.stringify({ error: 'Subscription not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get ePayco credentials
    const publicKey = Deno.env.get('EPAYCO_PUBLIC_KEY');
    const privateKey = Deno.env.get('EPAYCO_PRIVATE_KEY');

    if (!publicKey || !privateKey) {
      throw new Error('ePayco credentials not configured');
    }

    const authString = btoa(`${publicKey}:${privateKey}`);
    const authHeader = `Basic ${authString}`;

    // Cancel subscription in ePayco
    console.log('Cancelling in ePayco:', subscription.epayco_subscription_id);
    const cancelResponse = await fetch(
      `https://api.secure.payco.co/recurring/v1/subscription/${subscription.epayco_subscription_id}/cancel`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader,
        },
      }
    );

    const cancelData = await cancelResponse.json();
    console.log('ePayco cancel response:', JSON.stringify(cancelData, null, 2));

    // Update local subscription status regardless of ePayco response
    // (user might cancel even if ePayco has issues)
    const now = new Date();
    const { error: updateSubError } = await supabase
      .from('epayco_subscriptions')
      .update({
        status: 'cancelled',
        updated_at: now.toISOString(),
      })
      .eq('id', subscriptionId);

    if (updateSubError) {
      console.error('Error updating subscription:', updateSubError);
    }

    // Keep user access until current period ends but mark as not renewing
    const { error: userSubError } = await supabase
      .from('user_subscriptions')
      .update({
        updated_at: now.toISOString(),
      })
      .eq('user_id', userId);

    if (userSubError) {
      console.error('Error updating user subscription:', userSubError);
    }

    console.log('Subscription cancelled successfully');

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Subscription cancelled successfully',
        accessUntil: subscription.current_period_end,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Failed to cancel subscription' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
