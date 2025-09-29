import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { industry, businessDescription, targetMarket, competitorUrls, analysisDepth } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = `Eres un experto analista de mercado y estratega competitivo. 
Tu especialidad es realizar análisis exhaustivos de la competencia y identificar oportunidades de mercado.
Proporciona análisis estructurados, insights accionables y recomendaciones estratégicas concretas.
Responde siempre en español de manera profesional y detallada.`;

    let userPrompt = `Realiza un análisis competitivo ${analysisDepth} para:

INFORMACIÓN DEL NEGOCIO:
- Industria: ${industry}
- Descripción del negocio: ${businessDescription}
- Mercado objetivo: ${targetMarket}`;

    if (competitorUrls && competitorUrls.length > 0) {
      userPrompt += `\n- URLs de competidores para analizar: ${competitorUrls.join(', ')}`;
    }

    userPrompt += `\n\nPROPORCIONA UN ANÁLISIS ESTRUCTURADO QUE INCLUYA:

1. **PANORAMA DE LA INDUSTRIA**: Estado actual del mercado, tendencias y tamaño

2. **ANÁLISIS DE COMPETIDORES** (identifica al menos 5-8 competidores principales):
   - Nombre y posicionamiento
   - Fortalezas y debilidades clave
   - Estrategias de precios
   - Audiencia objetivo
   - Presencia digital y marketing

3. **ANÁLISIS SWOT DEL MERCADO**:
   - Fortalezas del sector
   - Debilidades generales
   - Oportunidades identificadas
   - Amenazas del entorno

4. **BRECHAS DE MERCADO**: Oportunidades no cubiertas por la competencia

5. **VENTAJAS COMPETITIVAS POTENCIALES**: Cómo diferenciarse

6. **AMENAZAS COMPETITIVAS**: Riesgos a considerar

7. **RECOMENDACIONES ESTRATÉGICAS**: Acciones concretas para posicionarse

Estructura la respuesta en formato JSON con estas secciones claramente definidas para facilitar su procesamiento.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add funds to your Lovable AI workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const analysisResult = data.choices[0].message.content;

    return new Response(JSON.stringify({ analysis: analysisResult }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Competitor analyzer error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});