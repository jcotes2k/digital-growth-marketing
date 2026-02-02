import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { contentType, topic, tone, audience, strategy, adaptTo, existingContent } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Platform-specific guidelines
    const platformGuidelines: Record<string, any> = {
      instagram: { maxChars: 2200, tone: 'visual y engaging', hashtags: '20-30', emoji: 'alto uso', format: 'narrativo con saltos de línea' },
      linkedin: { maxChars: 3000, tone: 'profesional e informativo', hashtags: '3-5', emoji: 'uso moderado', format: 'estructura profesional con bullets' },
      twitter: { maxChars: 280, tone: 'conciso y directo', hashtags: '1-2', emoji: 'uso moderado', format: 'mensaje corto y potente' },
      facebook: { maxChars: 500, tone: 'conversacional y cercano', hashtags: '1-3', emoji: 'uso moderado', format: 'párrafos cortos y fáciles de leer' },
      tiktok: { maxChars: 2200, tone: 'muy casual y trending', hashtags: '3-5 trending', emoji: 'alto uso', format: 'hook inmediato, estilo joven' }
    };

    let systemPrompt = '';
    let userPrompt = '';

    if (adaptTo && existingContent) {
      // Adaptation mode
      const platform = platformGuidelines[adaptTo.toLowerCase()];
      systemPrompt = `Eres un experto en marketing de contenido especializado en ${adaptTo}.
Adapta contenido existente siguiendo las mejores prácticas de esta plataforma.
Responde siempre en español.`;

      userPrompt = `Adapta este contenido para ${adaptTo}:

"${existingContent}"

Características de ${adaptTo}:
- Límite de caracteres: ${platform.maxChars}
- Tono: ${platform.tone}
- Hashtags: ${platform.hashtags}
- Uso de emojis: ${platform.emoji}
- Formato: ${platform.format}

Genera UNA versión optimizada que:
1. Respete el límite de caracteres (${platform.maxChars} máximo)
2. Use el tono apropiado para ${adaptTo}
3. Incluya hashtags relevantes según la plataforma
4. Adapte el formato para maximizar engagement en ${adaptTo}
5. Mantenga el mensaje central pero optimizado para la plataforma`;
    } else {
      // Original generation mode
      systemPrompt = `Eres un experto en marketing digital y creación de contenido. 
Usa la información estratégica proporcionada para crear contenido altamente personalizado y efectivo.
Responde siempre en español y mantén un tono profesional pero creativo.

Debes generar 3-5 variantes del contenido solicitado, cada una con un estilo diferente pero manteniendo el objetivo.
Cada variante debe tener un estilo único: uno más formal, otro más casual, otro más persuasivo, etc.`;

      userPrompt = `Genera 3-5 variantes de ${contentType} sobre: ${topic}`;
    
    if (tone) {
      userPrompt += `\nTono base: ${tone} (pero varía el estilo en cada variante)`;
    }
    
    if (audience) {
      userPrompt += `\nAudiencia objetivo: ${audience}`;
    }
    
      if (strategy) {
        userPrompt += `\nEstrategia de contenido: ${JSON.stringify(strategy, null, 2)}`;
      }

      userPrompt += `\n\nGenera entre 3 y 5 variantes diferentes del contenido:
      - Cada variante debe tener un estilo único (ej: profesional, cercano, urgente, educativo, inspirador)
      - Si es para redes sociales, incluye hashtags relevantes en cada variante
      - Si es un email, incluye asunto atractivo diferente para cada variante
      - Si es un blog post, estructura con encabezados y párrafos bien organizados
      - Indica para qué plataforma o uso es mejor cada variante`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "generate_content_variants",
              description: "Genera múltiples variantes de contenido con diferentes estilos",
              parameters: {
                type: "object",
                properties: {
                  variants: {
                    type: "array",
                    minItems: adaptTo ? 1 : 3,
                    maxItems: adaptTo ? 1 : 5,
                    items: {
                      type: "object",
                      properties: {
                        content: {
                          type: "string",
                          description: "El contenido completo de esta variante"
                        },
                        style: {
                          type: "string",
                          description: "Estilo usado (ej: profesional, casual, persuasivo, educativo, urgente)"
                        },
                        hashtags: {
                          type: "array",
                          items: { type: "string" },
                          description: "Hashtags sugeridos para esta variante"
                        },
                        bestFor: {
                          type: "string",
                          description: "Para qué plataforma o uso es mejor esta variante"
                        }
                      },
                      required: ["content", "style", "hashtags", "bestFor"],
                      additionalProperties: false
                    }
                  }
                },
                required: ["variants"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "generate_content_variants" } }
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
    
    // Extract tool call response
    const toolCall = data.choices[0].message.tool_calls?.[0];
    if (!toolCall) {
      throw new Error("No tool call in response");
    }
    
    const variantsData = JSON.parse(toolCall.function.arguments);
    
    // Add IDs and character counts to variants
    const variants = variantsData.variants.map((variant: any, index: number) => ({
      id: `variant-${index + 1}`,
      content: variant.content,
      style: variant.style,
      characterCount: variant.content.length,
      hashtags: variant.hashtags || [],
      bestFor: variant.bestFor,
      isFavorite: false
    }));

    return new Response(JSON.stringify({ variants }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Content generator error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});