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
    const { buyerPersonas, companyInfo } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Canvas generator called with', buyerPersonas?.length || 0, 'personas');

    const systemPrompt = `Eres un experto en modelos de negocio social que ayuda a emprendedores a diseñar su Business Canvas.

Información de la empresa: ${JSON.stringify(companyInfo)}
Buyer Personas: ${JSON.stringify(buyerPersonas)}

TAREA: Genera un Business Canvas completo y coherente basándote en:
- Los buyer personas proporcionados (sus problemas, motivaciones, canales preferidos)
- La información de la empresa
- Mejores prácticas de negocios sociales

IMPORTANTE:
- Se específico y concreto, evita generalidades
- Conecta los problemas de los buyer personas con la solución
- La propuesta de valor debe resonar con las motivaciones de los personas
- Los canales deben alinearse con los canales preferidos de los personas
- Incluye elementos de impacto social/ambiental relevantes
- Usa lenguaje claro y accionable

Genera el canvas completo usando la función generate_canvas.`;

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
          { role: 'user', content: 'Genera un Business Canvas completo basándote en la información proporcionada.' }
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'generate_canvas',
              description: 'Genera un Business Canvas completo para un modelo de negocio social',
              parameters: {
                type: 'object',
                properties: {
                  mainProblems: {
                    type: 'string',
                    description: 'Principales problemas identificados que se buscan resolver'
                  },
                  alternativeSolutions: {
                    type: 'string',
                    description: 'Soluciones alternativas existentes en el mercado'
                  },
                  keyCharacteristics: {
                    type: 'string',
                    description: 'Características más importantes de la solución propuesta'
                  },
                  valueProposition: {
                    type: 'string',
                    description: 'Propuesta de valor única y diferenciadora'
                  },
                  differentialAdvantage: {
                    type: 'string',
                    description: 'Ventaja diferencial frente a competencia'
                  },
                  customerSegments: {
                    type: 'string',
                    description: 'Segmentos de clientes objetivo detallados'
                  },
                  earlyAdopters: {
                    type: 'string',
                    description: 'Early adopters o primeros usuarios'
                  },
                  keyActivities: {
                    type: 'string',
                    description: 'Actividades clave del negocio'
                  },
                  keyIndicators: {
                    type: 'string',
                    description: 'Indicadores clave para medir éxito'
                  },
                  distributionChannels: {
                    type: 'string',
                    description: 'Canales de distribución y comunicación'
                  },
                  reachStrategy: {
                    type: 'string',
                    description: 'Estrategia para alcanzar a los clientes'
                  },
                  costElements: {
                    type: 'string',
                    description: 'Elementos principales de costos'
                  },
                  monthlyExpenses: {
                    type: 'string',
                    description: 'Gastos mensuales estimados'
                  },
                  revenueGeneration: {
                    type: 'string',
                    description: 'Modelo de generación de ingresos'
                  },
                  profitMargin: {
                    type: 'string',
                    description: 'Margen de ganancia y sostenibilidad'
                  },
                  teamMembers: {
                    type: 'string',
                    description: 'Miembros clave del equipo'
                  },
                  keyRoles: {
                    type: 'string',
                    description: 'Roles clave necesarios'
                  },
                  socialImpact: {
                    type: 'string',
                    description: 'Impacto social esperado'
                  },
                  environmentalImpact: {
                    type: 'string',
                    description: 'Impacto ambiental esperado'
                  },
                  improvementMeasures: {
                    type: 'string',
                    description: 'Medidas de mejora continua'
                  }
                },
                required: [
                  'mainProblems', 'alternativeSolutions', 'keyCharacteristics',
                  'valueProposition', 'differentialAdvantage', 'customerSegments',
                  'earlyAdopters', 'keyActivities', 'keyIndicators',
                  'distributionChannels', 'reachStrategy', 'costElements',
                  'monthlyExpenses', 'revenueGeneration', 'profitMargin',
                  'teamMembers', 'keyRoles', 'socialImpact',
                  'environmentalImpact', 'improvementMeasures'
                ]
              }
            }
          }
        ],
        tool_choice: { type: 'function', function: { name: 'generate_canvas' } }
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

    const canvasData = JSON.parse(toolCall.function.arguments);
    console.log('Canvas generated successfully');

    return new Response(
      JSON.stringify({ canvas: canvasData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in canvas-generator function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});