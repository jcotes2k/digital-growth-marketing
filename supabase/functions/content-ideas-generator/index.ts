import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { contentStrategy, count = 10 } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Content ideas generator called for', count, 'ideas');

    const systemPrompt = `Eres un experto estratega de contenido digital que genera ideas virales y relevantes.

Estrategia de contenido: ${JSON.stringify(contentStrategy)}

TAREA: Genera ${count} ideas de contenido específicas, creativas y accionables basándote en:
- Los temas principales de la estrategia
- La audiencia objetivo
- Los canales y formatos prioritarios
- El tono de comunicación definido
- Tendencias actuales en redes sociales

CRITERIOS:
- Ideas específicas (no genéricas como "consejos útiles")
- Títulos atractivos y clickeables
- Formatos variados (video, carrusel, infografía, historia, etc.)
- Trending score basado en relevancia actual
- Keywords relevantes para SEO/descubribilidad
- Adaptadas a cada plataforma específica

Usa la función generate_ideas para estructurar las ${count} ideas.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Genera ${count} ideas de contenido innovadoras y virales` }
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'generate_ideas',
              description: 'Genera múltiples ideas de contenido estructuradas',
              parameters: {
                type: 'object',
                properties: {
                  ideas: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        title: {
                          type: 'string',
                          description: 'Título atractivo y específico'
                        },
                        description: {
                          type: 'string',
                          description: 'Descripción detallada de qué trata el contenido'
                        },
                        platform: {
                          type: 'string',
                          enum: ['Instagram', 'TikTok', 'LinkedIn', 'Facebook', 'Twitter', 'YouTube'],
                          description: 'Plataforma más adecuada'
                        },
                        topic: {
                          type: 'string',
                          description: 'Tema principal (de la estrategia)'
                        },
                        suggestedFormat: {
                          type: 'string',
                          description: 'Formato sugerido (Reel, Carrusel, Video, Post, etc.)'
                        },
                        trendingScore: {
                          type: 'number',
                          minimum: 1,
                          maximum: 10,
                          description: 'Score de relevancia/viralidad actual (1-10)'
                        },
                        keywords: {
                          type: 'array',
                          items: { type: 'string' },
                          description: 'Keywords relevantes para descubribilidad'
                        }
                      },
                      required: ['title', 'description', 'platform', 'topic', 'suggestedFormat', 'trendingScore', 'keywords']
                    }
                  }
                },
                required: ['ideas']
              }
            }
          }
        ],
        tool_choice: { type: 'function', function: { name: 'generate_ideas' } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const toolCall = data.choices[0].message.tool_calls?.[0];
    
    if (!toolCall) {
      throw new Error('No tool call in AI response');
    }

    const result = JSON.parse(toolCall.function.arguments);
    console.log('Generated', result.ideas.length, 'content ideas');

    // Save ideas to database
    const authHeader = req.headers.get('Authorization');
    if (authHeader) {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseKey, {
        global: { headers: { Authorization: authHeader } }
      });

      const { data: userData } = await supabase.auth.getUser();
      if (userData.user) {
        const ideasToInsert = result.ideas.map((idea: any) => ({
          user_id: userData.user.id,
          title: idea.title,
          description: idea.description,
          platform: idea.platform,
          topic: idea.topic,
          suggested_format: idea.suggestedFormat,
          trending_score: idea.trendingScore,
          keywords: idea.keywords
        }));

        await supabase.from('content_ideas').insert(ideasToInsert);
      }
    }

    return new Response(
      JSON.stringify({ ideas: result.ideas }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in content-ideas-generator:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});