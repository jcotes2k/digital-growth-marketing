import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const { category } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${LOVABLE_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'Eres un detector de tendencias pre-virales. Genera tendencias emergentes realistas. Responde en JSON.' },
          { role: 'user', content: `Genera 5 tendencias emergentes ${category ? 'en la categoría ' + category : ''}. Responde: { "trends": [{ "id": "1", "topic": "IA Generativa en Marketing", "category": "tecnología", "currentMentions": 15000, "growthRate": 45, "predictedPeak": "En 36 horas", "viralProbability": 82, "relatedHashtags": ["#AIMarketing", "#GenerativeAI"], "suggestedAngles": ["Cómo usar IA para crear contenido"], "platforms": ["LinkedIn", "Twitter"], "timeToAct": "6 horas" }] }` }
        ]
      }),
    });

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || '{}';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const result = jsonMatch ? JSON.parse(jsonMatch[0]) : { trends: [] };

    return new Response(JSON.stringify(result), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
