import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const { topic, format, duration, style, guestName } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY not configured');

    const prompt = `Genera un guión de podcast profesional:
- Tema: ${topic}
- Formato: ${format}
- Duración: ${duration} minutos
- Estilo: ${style}
${guestName ? `- Invitado: ${guestName}` : ''}

Responde en JSON:
{
  "title": "título del episodio",
  "intro": "introducción del episodio",
  "segments": [{"title": "nombre", "duration": "5 min", "content": "contenido", "talkingPoints": ["punto1", "punto2"]}],
  ${format === 'interview' ? '"interviewQuestions": ["pregunta1", "pregunta2"],' : ''}
  "outro": "cierre del episodio",
  "showNotes": "notas del show para descripción"
}`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${LOVABLE_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'google/gemini-2.5-flash', messages: [{ role: 'user', content: prompt }] }),
    });

    if (!response.ok) {
      if (response.status === 429) return new Response(JSON.stringify({ error: 'Rate limit' }), { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      throw new Error('AI gateway error');
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const result = jsonMatch ? JSON.parse(jsonMatch[0]) : { title: topic, intro: '', segments: [], outro: '', showNotes: '' };

    return new Response(JSON.stringify(result), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
