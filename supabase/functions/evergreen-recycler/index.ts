import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const { userId, action, contentIds } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${LOVABLE_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'Eres un experto en reciclaje de contenido evergreen. Responde en JSON.' },
          { role: 'user', content: action === 'analyze' 
            ? `Genera 5 contenidos evergreen simulados para reciclar: { "content": [{ "id": "1", "title": "Guía de Marketing", "originalContent": "contenido", "platform": "LinkedIn", "originalDate": "Hace 3 meses", "performance": { "likes": 150, "comments": 25, "shares": 10, "engagementRate": 4.5 }, "recycleScore": 85, "suggestedUpdates": ["Actualizar datos"], "bestTimeToRepost": "Martes 9:00 AM" }] }`
            : `Recicla estos contenidos: ${JSON.stringify(contentIds)}. Responde: { "recycledContent": [{ "id": "1", "updatedContent": "contenido actualizado" }] }` }
        ]
      }),
    });

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || '{}';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const result = jsonMatch ? JSON.parse(jsonMatch[0]) : {};

    return new Response(JSON.stringify(result), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
