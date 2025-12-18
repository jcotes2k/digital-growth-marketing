import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PLAN_PRICES: Record<string, { amount: number; name: string }> = {
  pro: { amount: 19, name: 'Plan PRO' },
  premium: { amount: 39, name: 'Plan PREMIUM' },
  gold: { amount: 1, name: 'Plan GOLD - Promoción' },
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, plan, userEmail, userName } = await req.json();

    if (!userId || !plan || !userEmail) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: userId, plan, userEmail' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const planConfig = PLAN_PRICES[plan];
    if (!planConfig) {
      return new Response(
        JSON.stringify({ error: 'Invalid plan selected' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const publicKey = Deno.env.get('EPAYCO_PUBLIC_KEY');
    const privateKey = Deno.env.get('EPAYCO_PRIVATE_KEY');
    const pCustId = Deno.env.get('EPAYCO_P_CUST_ID');

    if (!publicKey || !privateKey || !pCustId) {
      console.error('Missing ePayco credentials');
      return new Response(
        JSON.stringify({ error: 'Payment configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate unique invoice number
    const invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // ePayco checkout configuration
    const checkoutData = {
      publicKey,
      pCustId,
      name: planConfig.name,
      description: `Suscripción mensual - ${planConfig.name}`,
      invoice: invoiceNumber,
      currency: 'USD',
      amount: planConfig.amount.toString(),
      taxBase: '0',
      tax: '0',
      country: 'CO',
      lang: 'es',
      external: 'false',
      confirmation: `${Deno.env.get('SUPABASE_URL')}/functions/v1/epayco-webhook`,
      response: `${req.headers.get('origin') || 'https://gwvfdnahoexxjgbghpfo.lovable.app'}/payment/response`,
      nameClient: userName || 'Cliente',
      email: userEmail,
      extra1: userId,
      extra2: plan,
      extra3: invoiceNumber,
      test: Deno.env.get('EPAYCO_TEST_MODE') === 'true' ? 'true' : 'false',
    };

    console.log('ePayco session created for:', { userId, plan, email: userEmail, invoice: invoiceNumber });

    return new Response(
      JSON.stringify({ 
        success: true, 
        checkoutData,
        invoice: invoiceNumber
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error creating ePayco session:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to create payment session' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});