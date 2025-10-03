import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const platformGuidelines = {
  Instagram: {
    optimalLength: '2200 caracteres (caption), primer renglón crucial',
    bestTime: '11am-1pm y 7pm-9pm',
    hashtagLimit: '20-30 hashtags',
    tone: 'Visual, aspiracional, storytelling emocional'
  },
  TikTok: {
    optimalLength: '150 caracteres, 2-4 hashtags, hook en primeros 3 segundos',
    bestTime: '6pm-10pm',
    hashtagLimit: '3-5 hashtags',
    tone: 'Auténtico, entretenido, trending sounds/challenges'
  },
  LinkedIn: {
    optimalLength: '1300-2000 caracteres',
    bestTime: 'Martes-Jueves 9am-12pm',
    hashtagLimit: '3-5 hashtags profesionales',
    tone: 'Profesional, insights valiosos, thought leadership'
  },
  Facebook: {
    optimalLength: '40-80 caracteres (short) o 1000-2000 (long)',
    bestTime: '1pm-4pm',
    hashtagLimit: '1-2 hashtags',
    tone: 'Conversacional, comunitario, emocional'
  },
  Twitter: {
    optimalLength: '280 caracteres max, 120-150 óptimo',
    bestTime: '8am-10am y 6pm-9pm',
    hashtagLimit: '1-2 hashtags',
    tone: 'Conciso, actual, conversacional, con opinión'
  },
  YouTube: {
    optimalLength: 'Título: 60 caracteres, Descripción: primeros 157 caracteres críticos',
    bestTime: '2pm-4pm fines de semana',
    hashtagLimit: '5-8 hashtags en descripción',
    tone: 'Educativo, entretenido, SEO-optimizado'
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content, platforms, contentStrategy } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Platform optimizer called for platforms:', platforms);

    const results = [];

    for (const platform of platforms) {
      const guidelines = platformGuidelines[platform as keyof typeof platformGuidelines];
      
      const systemPrompt = `Eres un experto en optimización de contenido para ${platform}.

Contenido original: "${content}"

Estrategia de contenido: ${JSON.stringify(contentStrategy)}

GUÍAS DE ${platform.toUpperCase()}:
- Longitud óptima: ${guidelines.optimalLength}
- Mejor horario: ${guidelines.bestTime}
- Hashtags: ${guidelines.hashtagLimit}
- Tono: ${guidelines.tone}

TAREA: Adapta el contenido original para maximizar engagement en ${platform}, manteniendo la esencia del mensaje pero:
1. Ajustando la longitud y estructura según la plataforma
2. Usando el tono apropiado de ${platform}
3. Añadiendo hashtags relevantes y populares
4. Incluyendo CTAs efectivos para la plataforma
5. Optimizando para algoritmo de ${platform}

Usa la función optimize_content para estructurar la respuesta.`;

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
            { role: 'user', content: `Optimiza este contenido para ${platform}` }
          ],
          tools: [
            {
              type: 'function',
              function: {
                name: 'optimize_content',
                description: 'Optimiza contenido para una plataforma específica',
                parameters: {
                  type: 'object',
                  properties: {
                    optimizedContent: {
                      type: 'string',
                      description: 'Contenido optimizado para la plataforma'
                    },
                    hashtags: {
                      type: 'array',
                      items: { type: 'string' },
                      description: 'Hashtags relevantes y populares'
                    },
                    optimalLength: {
                      type: 'integer',
                      description: 'Longitud actual en caracteres'
                    },
                    bestPostingTime: {
                      type: 'string',
                      description: 'Mejor horario para publicar'
                    },
                    engagementPrediction: {
                      type: 'number',
                      minimum: 1,
                      maximum: 10,
                      description: 'Predicción de engagement (1-10)'
                    },
                    tips: {
                      type: 'array',
                      items: { type: 'string' },
                      description: 'Tips adicionales para maximizar engagement'
                    }
                  },
                  required: ['optimizedContent', 'hashtags', 'optimalLength', 'bestPostingTime', 'engagementPrediction', 'tips']
                }
              }
            }
          ],
          tool_choice: { type: 'function', function: { name: 'optimize_content' } }
        }),
      });

      if (!response.ok) {
        console.error(`Error optimizing for ${platform}:`, response.status);
        continue;
      }

      const data = await response.json();
      const toolCall = data.choices[0].message.tool_calls?.[0];
      
      if (toolCall) {
        const optimization = JSON.parse(toolCall.function.arguments);
        results.push({
          platform,
          ...optimization
        });
      }
    }

    // Save optimized content to database
    const authHeader = req.headers.get('Authorization');
    if (authHeader && results.length > 0) {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseKey, {
        global: { headers: { Authorization: authHeader } }
      });

      const { data: userData } = await supabase.auth.getUser();
      if (userData.user) {
        const contentToInsert = results.map(result => ({
          user_id: userData.user.id,
          original_content: content,
          platform: result.platform,
          optimized_content: result.optimizedContent,
          hashtags: result.hashtags,
          optimal_length: result.optimalLength,
          best_posting_time: result.bestPostingTime,
          engagement_prediction: result.engagementPrediction
        }));

        await supabase.from('platform_optimized_content').insert(contentToInsert);
      }
    }

    console.log('Optimized content for', results.length, 'platforms');

    return new Response(
      JSON.stringify({ optimizations: results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in platform-optimizer:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});