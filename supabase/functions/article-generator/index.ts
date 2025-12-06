import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' };

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const { topic, platform, length, tone, keywords, targetAudience } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY not configured');

    const wordCounts = { short: '500-800', medium: '1000-1500', long: '2000+' };

    const prompt = `Genera un artículo profesional optimizado para SEO:
- Tema: ${topic}
- Plataforma: ${platform}
- Longitud: ${wordCounts[length as keyof typeof wordCounts]} palabras
- Tono: ${tone}
- Keywords: ${keywords?.join(', ') || 'N/A'}
- Audiencia: ${targetAudience || 'General'}

Responde en JSON:
{
  "title": "título optimizado SEO (<60 chars)",
  "metaDescription": "meta description (<160 chars)",
  "keywords": ["keyword1", "keyword2"],
  "outline": [{"heading": "H2 título", "subheadings": ["H3 sub1"]}],
  "introduction": "párrafo introductorio engaging",
  "body": "cuerpo del artículo completo con headers ## y ###",
  "conclusion": "párrafo de conclusión",
  "cta": "llamado a la acción"
}`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${LOVABLE_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'google/gemini-2.5-flash', messages: [{ role: 'user', content: prompt }] }),
    });

    if (!response.ok) throw new Error('AI gateway error');
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const result = jsonMatch ? JSON.parse(jsonMatch[0]) : { title: topic, metaDescription: '', keywords: [], outline: [], introduction: '', body: content, conclusion: '', cta: '' };

    return new Response(JSON.stringify(result), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
