import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const { userId, timeRange } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${LOVABLE_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'Eres un analista de atribución de revenue. Genera datos de ROI realistas. Responde en JSON.' },
          { role: 'user', content: `Genera un reporte de atribución de revenue para ${timeRange}: { "overview": { "totalRevenue": 125000, "totalCost": 25000, "overallROI": 400, "topPerformingContent": [{ "contentId": "1", "title": "Guía Completa", "platform": "LinkedIn", "publishDate": "15 Nov 2024", "metrics": { "views": 50000, "clicks": 2500, "conversions": 75, "revenue": 45000 }, "roi": 500, "costPerConversion": 100, "attributionPath": ["Post LinkedIn", "Landing Page", "Email", "Compra"] }], "revenueByPlatform": [{ "platform": "LinkedIn", "revenue": 60000, "percentage": 48 }], "revenueByContentType": [{ "type": "Guías", "revenue": 50000, "percentage": 40 }], "monthlyTrend": [{ "month": "Oct", "revenue": 35000, "growth": 15 }] } }` }
        ]
      }),
    });

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || '{}';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const result = jsonMatch ? JSON.parse(jsonMatch[0]) : { overview: {} };

    return new Response(JSON.stringify(result), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
