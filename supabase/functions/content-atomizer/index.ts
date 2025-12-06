import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const { content, formatCount, mode } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    const formats = mode === 'basic' 
      ? ['Tweet', 'Instagram Caption', 'LinkedIn Post', 'Facebook Post', 'Story Script']
      : ['Tweet', 'Tweet Thread', 'Instagram Caption', 'Instagram Carousel', 'Instagram Story', 'LinkedIn Post', 'LinkedIn Article Intro', 'Facebook Post', 'TikTok Script', 'YouTube Short Script', 'Email Subject', 'Newsletter Intro', 'Blog Teaser', 'Podcast Intro', 'WhatsApp Status'];

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${LOVABLE_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'Eres un experto en marketing de contenidos. Atomiza contenido en múltiples formatos optimizados. Responde en JSON.' },
          { role: 'user', content: `Atomiza este contenido en ${formatCount} formatos: ${formats.slice(0, formatCount).join(', ')}. Contenido: "${content}". Responde con JSON: { "atomizedContent": [{ "format": "nombre", "platform": "plataforma", "content": "contenido adaptado", "hashtags": ["#tag1"], "characterCount": 123 }] }` }
        ]
      }),
    });

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || '{}';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const result = jsonMatch ? JSON.parse(jsonMatch[0]) : { atomizedContent: [] };

    return new Response(JSON.stringify(result), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
