import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' };

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const { content, topic, targetQuestions } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY not configured');

    const prompt = `Analiza este contenido para AEO (AI Engine Optimization) - optimización para aparecer en respuestas de IA como ChatGPT, Perplexity, Claude:

Tema: ${topic}
Contenido: ${content.slice(0, 5000)}
${targetQuestions?.length ? `Preguntas objetivo: ${targetQuestions.join(', ')}` : ''}

Responde en JSON:
{
  "overallScore": 70,
  "aiReadinessScore": 75,
  "structureAnalysis": {"score": 70, "hasDirectAnswers": true, "hasClearStructure": true, "hasFactualClaims": false, "suggestions": ["Agregar datos estadísticos"]},
  "questionOptimization": {"score": 65, "targetQuestions": ["¿Qué es X?", "¿Cómo funciona Y?"], "missingQuestions": ["¿Por qué es importante?"]},
  "contentQuality": {"score": 75, "authoritySignals": ["Citas de expertos"], "missingSignals": ["Estudios de caso"], "citationOpportunities": ["Agregar fuente para estadística"]},
  "snippetOptimization": {"score": 70, "potentialSnippets": [{"type": "definición", "content": "X es...", "question": "¿Qué es X?"}], "improvements": ["Usar formato de lista"]},
  "voiceSearchOptimization": {"score": 60, "conversationalKeywords": ["cómo hacer", "qué es"], "longTailQueries": ["cómo mejorar mi estrategia de marketing"]},
  "entityOptimization": {"entities": [{"name": "Marketing Digital", "type": "Concepto", "confidence": 0.9}], "missingEntities": ["Google Analytics"]},
  "recommendations": [{"priority": "high", "action": "Agregar respuestas directas al inicio", "impact": "Alto impacto en citaciones de IA"}]
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
    const result = jsonMatch ? JSON.parse(jsonMatch[0]) : { overallScore: 50, aiReadinessScore: 50, structureAnalysis: { score: 50, hasDirectAnswers: false, hasClearStructure: false, hasFactualClaims: false, suggestions: [] }, questionOptimization: { score: 50, targetQuestions: [], missingQuestions: [] }, contentQuality: { score: 50, authoritySignals: [], missingSignals: [], citationOpportunities: [] }, snippetOptimization: { score: 50, potentialSnippets: [], improvements: [] }, voiceSearchOptimization: { score: 50, conversationalKeywords: [], longTailQueries: [] }, entityOptimization: { entities: [], missingEntities: [] }, recommendations: [] };

    return new Response(JSON.stringify(result), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
