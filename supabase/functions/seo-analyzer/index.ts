import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' };

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const { content, url, targetKeyword } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY not configured');

    const prompt = `Analiza el siguiente contenido para SEO${targetKeyword ? ` con keyword objetivo: "${targetKeyword}"` : ''}:

${content.slice(0, 5000)}

Responde en JSON:
{
  "overallScore": 75,
  "titleAnalysis": {"score": 80, "length": 55, "hasKeyword": true, "suggestions": ["sugerencia1"]},
  "metaAnalysis": {"score": 70, "length": 145, "hasKeyword": true, "suggestions": []},
  "contentAnalysis": {"score": 75, "wordCount": 1200, "keywordDensity": 2.1, "readabilityScore": 72, "headingsCount": 5, "suggestions": ["sugerencia1"]},
  "technicalSEO": {"score": 80, "issues": [{"type": "warning", "message": "Falta atributo alt en imágenes"}]},
  "keywords": {"primary": "${targetKeyword || 'keyword principal'}", "secondary": ["kw2", "kw3"], "lsiKeywords": ["relacionada1", "relacionada2"]},
  "competitors": {"averageWordCount": 1500, "suggestedWordCount": 1800, "topKeywords": ["kw1", "kw2"]},
  "recommendations": ["Recomendación 1", "Recomendación 2"]
}`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${LOVABLE_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'google/gemini-2.5-flash', messages: [{ role: 'user', content: prompt }] }),
    });

    if (!response.ok) throw new Error('AI gateway error');
    const data = await response.json();
    const respContent = data.choices?.[0]?.message?.content || '';
    const jsonMatch = respContent.match(/\{[\s\S]*\}/);
    const result = jsonMatch ? JSON.parse(jsonMatch[0]) : { overallScore: 50, titleAnalysis: { score: 50, length: 0, hasKeyword: false, suggestions: [] }, metaAnalysis: { score: 50, length: 0, hasKeyword: false, suggestions: [] }, contentAnalysis: { score: 50, wordCount: 0, keywordDensity: 0, readabilityScore: 50, headingsCount: 0, suggestions: [] }, technicalSEO: { score: 50, issues: [] }, keywords: { primary: '', secondary: [], lsiKeywords: [] }, competitors: { averageWordCount: 1000, suggestedWordCount: 1500, topKeywords: [] }, recommendations: [] };

    return new Response(JSON.stringify(result), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
