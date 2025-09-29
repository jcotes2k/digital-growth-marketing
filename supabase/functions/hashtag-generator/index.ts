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
    const { topic, platform, numberOfHashtags, contentType, audience } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = `Eres un experto en marketing digital y redes sociales, especializado en la creación y optimización de hashtags.
Tienes conocimiento profundo sobre:
- Algoritmos de cada plataforma social
- Hashtags trending y de nicho
- Mejores prácticas de engagement
- Estrategias de alcance orgánico
Responde siempre en español y proporciona hashtags específicos y accionables.`;

    const userPrompt = `Genera una estrategia de hashtags para:

INFORMACIÓN DEL CONTENIDO:
- Tema/Tópico: ${topic}
- Plataforma: ${platform}
- Tipo de contenido: ${contentType || 'general'}
- Audiencia objetivo: ${audience || 'general'}
- Número de hashtags solicitados: ${numberOfHashtags}

PROPORCIONA LA RESPUESTA EN EL SIGUIENTE FORMATO JSON:

{
  "trending": [
    {"hashtag": "#ejemplo1", "reach": "alto", "competition": "alta", "reason": "Popular en la plataforma actualmente"}
  ],
  "niche": [
    {"hashtag": "#ejemplo2", "reach": "medio", "competition": "media", "reason": "Específico del nicho"}
  ],
  "branded": [
    {"hashtag": "#ejemplo3", "reach": "bajo", "competition": "baja", "reason": "Único para la marca"}
  ],
  "recommendations": {
    "bestTime": "Mejor horario para publicar",
    "strategy": "Estrategia recomendada de uso",
    "tips": ["Consejo 1", "Consejo 2", "Consejo 3"]
  }
}

CRITERIOS:
1. **Hashtags Trending (${Math.ceil(numberOfHashtags * 0.3)})**:
   - Populares y con alto volumen de búsqueda
   - Alta competencia pero mayor alcance potencial
   - Actualizados y relevantes para la fecha actual

2. **Hashtags de Nicho (${Math.ceil(numberOfHashtags * 0.5)})**:
   - Específicos del tema y audiencia
   - Balance entre alcance y competencia
   - Mayor probabilidad de engagement genuino

3. **Hashtags Branded (${Math.ceil(numberOfHashtags * 0.2)})**:
   - Únicos y distintivos
   - Para construir comunidad
   - Menos competencia, más específicos

4. **Recomendaciones**:
   - Mejor momento para publicar en ${platform}
   - Estrategia de combinación de hashtags
   - Tips específicos para maximizar alcance

IMPORTANTE:
- Todos los hashtags deben incluir el símbolo #
- Considera las mejores prácticas específicas de ${platform}
- Proporciona razones claras para cada hashtag
- Asegúrate de que el JSON sea válido y parseable`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
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
    const generatedContent = data.choices[0].message.content;

    // Try to parse JSON from the response
    let parsedHashtags;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = generatedContent.match(/```json\n([\s\S]*?)\n```/) || 
                       generatedContent.match(/```\n([\s\S]*?)\n```/);
      const jsonString = jsonMatch ? jsonMatch[1] : generatedContent;
      parsedHashtags = JSON.parse(jsonString.trim());
    } catch (error) {
      console.error("Failed to parse JSON, returning raw content");
      parsedHashtags = { raw: generatedContent };
    }

    return new Response(JSON.stringify({ 
      hashtags: parsedHashtags,
      rawContent: generatedContent 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Hashtag generator error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});