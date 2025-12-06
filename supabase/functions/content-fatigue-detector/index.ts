import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const { userId } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${LOVABLE_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'Eres un analista de fatiga de contenido. Genera un análisis simulado de fatiga de temas. Responde en JSON.' },
          { role: 'user', content: `Genera un análisis de fatiga de contenido con estos campos: { "analysis": { "overallFatigueScore": 45, "topicAnalysis": [{ "topic": "Marketing Digital", "frequency": 70, "fatigueLevel": "alto", "lastUsed": "Hace 2 días", "recommendation": "Reducir frecuencia" }], "formatAnalysis": [{ "format": "Carrusel", "usage": 60, "saturation": 50 }], "recommendations": ["Diversificar temas"], "pivotSuggestions": [{ "fromTopic": "SEO", "toTopic": "IA en Marketing", "reason": "Mayor interés actual" }] } }` }
        ]
      }),
    });

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || '{}';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const result = jsonMatch ? JSON.parse(jsonMatch[0]) : { analysis: {} };

    return new Response(JSON.stringify(result), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
