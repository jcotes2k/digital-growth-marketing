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
    const { metricsData, comparisons } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Analyzing trends with AI...');

    const systemPrompt = `Eres un experto analista de marketing digital especializado en redes sociales y contenido viral. 
Analiza los datos de rendimiento proporcionados y genera insights accionables, predicciones y recomendaciones estratégicas.
Debes ser específico, práctico y basarte en los datos reales proporcionados.`;

    const userPrompt = `Analiza los siguientes datos de rendimiento de contenido:

MÉTRICAS DETALLADAS:
${JSON.stringify(metricsData, null, 2)}

COMPARACIONES POR ESTILO:
${JSON.stringify(comparisons, null, 2)}

Genera un análisis completo que incluya:
1. Identificación de patrones y tendencias claras en los datos
2. Predicciones de rendimiento basadas en el historial
3. Recomendaciones específicas sobre qué tipo de contenido crear
4. Sugerencias sobre los mejores momentos y días para publicar (basado en patrones de engagement)
5. Insights sobre qué está funcionando y qué no

Sé específico con números, porcentajes y ejemplos concretos de los datos.`;

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
          { role: 'user', content: userPrompt }
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'provide_trends_analysis',
              description: 'Proporciona un análisis estructurado de tendencias y predicciones',
              parameters: {
                type: 'object',
                properties: {
                  keyInsights: {
                    type: 'array',
                    description: 'Insights principales identificados en los datos',
                    items: {
                      type: 'object',
                      properties: {
                        title: { type: 'string' },
                        description: { type: 'string' },
                        impact: { type: 'string', enum: ['high', 'medium', 'low'] }
                      },
                      required: ['title', 'description', 'impact']
                    }
                  },
                  predictions: {
                    type: 'array',
                    description: 'Predicciones basadas en el análisis de tendencias',
                    items: {
                      type: 'object',
                      properties: {
                        contentType: { type: 'string' },
                        expectedEngagement: { type: 'string' },
                        confidence: { type: 'string', enum: ['high', 'medium', 'low'] },
                        reasoning: { type: 'string' }
                      },
                      required: ['contentType', 'expectedEngagement', 'confidence', 'reasoning']
                    }
                  },
                  recommendations: {
                    type: 'array',
                    description: 'Recomendaciones accionables para mejorar el rendimiento',
                    items: {
                      type: 'object',
                      properties: {
                        action: { type: 'string' },
                        reason: { type: 'string' },
                        priority: { type: 'string', enum: ['high', 'medium', 'low'] },
                        expectedImpact: { type: 'string' }
                      },
                      required: ['action', 'reason', 'priority', 'expectedImpact']
                    }
                  },
                  bestTimes: {
                    type: 'object',
                    description: 'Mejores momentos para publicar basados en patrones',
                    properties: {
                      daysOfWeek: {
                        type: 'array',
                        items: { type: 'string' }
                      },
                      timeRanges: {
                        type: 'array',
                        items: { type: 'string' }
                      },
                      reasoning: { type: 'string' }
                    },
                    required: ['daysOfWeek', 'timeRanges', 'reasoning']
                  },
                  topPerformers: {
                    type: 'object',
                    description: 'Elementos de mejor rendimiento',
                    properties: {
                      contentStyles: {
                        type: 'array',
                        items: { type: 'string' }
                      },
                      platforms: {
                        type: 'array',
                        items: { type: 'string' }
                      },
                      characteristics: {
                        type: 'array',
                        items: { type: 'string' }
                      }
                    },
                    required: ['contentStyles', 'platforms', 'characteristics']
                  }
                },
                required: ['keyInsights', 'predictions', 'recommendations', 'bestTimes', 'topPerformers']
              }
            }
          }
        ],
        tool_choice: { type: 'function', function: { name: 'provide_trends_analysis' } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Límite de solicitudes excedido. Intenta nuevamente en unos minutos.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Créditos agotados. Por favor añade créditos a tu workspace de Lovable.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log('AI response received');

    // Extract tool call result
    const toolCall = data.choices[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      throw new Error('No tool call in AI response');
    }

    const analysis = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in trends-analyzer:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Error analyzing trends' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
