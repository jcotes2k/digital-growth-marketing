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
    const { canvas } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Canvas validator called');

    const systemPrompt = `Eres un experto consultor de negocios sociales que analiza modelos de negocio para evaluar su viabilidad.

Business Canvas a analizar: ${JSON.stringify(canvas)}

TAREA: Analiza el canvas de forma crítica pero constructiva, identificando:
1. **Fortalezas**: Qué está bien definido y es viable
2. **Debilidades**: Áreas que necesitan más desarrollo o claridad
3. **Riesgos**: Potenciales problemas o amenazas
4. **Oportunidades**: Áreas de mejora y optimización
5. **Score de viabilidad**: Calificación de 1-10 con justificación

CRITERIOS DE EVALUACIÓN:
- **Coherencia**: ¿Todas las partes del canvas están alineadas?
- **Realismo**: ¿Es factible con los recursos mencionados?
- **Impacto**: ¿El impacto social/ambiental es medible y significativo?
- **Sostenibilidad financiera**: ¿El modelo de ingresos es viable?
- **Propuesta de valor**: ¿Es clara y diferenciada?
- **Segmentación**: ¿Los clientes están bien definidos?

Usa la función validate_canvas para estructurar tu análisis.`;

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
          { role: 'user', content: 'Analiza este Business Canvas y proporciona feedback detallado.' }
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'validate_canvas',
              description: 'Proporciona análisis de viabilidad de un Business Canvas',
              parameters: {
                type: 'object',
                properties: {
                  viabilityScore: {
                    type: 'number',
                    minimum: 1,
                    maximum: 10,
                    description: 'Score de viabilidad de 1 a 10'
                  },
                  overallAssessment: {
                    type: 'string',
                    description: 'Evaluación general en 2-3 oraciones'
                  },
                  strengths: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        title: { type: 'string' },
                        description: { type: 'string' }
                      }
                    },
                    description: 'Lista de fortalezas identificadas'
                  },
                  weaknesses: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        title: { type: 'string' },
                        description: { type: 'string' },
                        suggestion: { type: 'string' }
                      }
                    },
                    description: 'Lista de debilidades con sugerencias de mejora'
                  },
                  risks: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        title: { type: 'string' },
                        severity: { type: 'string', enum: ['low', 'medium', 'high'] },
                        mitigation: { type: 'string' }
                      }
                    },
                    description: 'Riesgos identificados con estrategias de mitigación'
                  },
                  opportunities: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        title: { type: 'string' },
                        description: { type: 'string' },
                        impact: { type: 'string', enum: ['low', 'medium', 'high'] }
                      }
                    },
                    description: 'Oportunidades de mejora'
                  },
                  recommendations: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Recomendaciones prioritarias (máximo 5)'
                  }
                },
                required: ['viabilityScore', 'overallAssessment', 'strengths', 'weaknesses', 'risks', 'opportunities', 'recommendations']
              }
            }
          }
        ],
        tool_choice: { type: 'function', function: { name: 'validate_canvas' } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required. Please add credits to your account.' }),
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

    const validation = JSON.parse(toolCall.function.arguments);
    console.log('Canvas validation completed, score:', validation.viabilityScore);

    return new Response(
      JSON.stringify({ validation }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in canvas-validator function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});