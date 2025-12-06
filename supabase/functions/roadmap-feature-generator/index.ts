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
    const { targetAudience, businessContext, featureCount = 5 } = await req.json();

    console.log('Generating features for:', { targetAudience, businessContext, featureCount });

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = `Eres un experto en desarrollo de productos y roadmaps. Tu tarea es generar funcionalidades innovadoras y prácticas para un producto digital basándote en el contexto proporcionado.

Debes generar exactamente ${featureCount} funcionalidades que sean:
- Relevantes para la audiencia objetivo
- Implementables en un producto digital
- Con diferentes niveles de esfuerzo (small, medium, large, xlarge)
- Con scores de prioridad del 1 al 10

Responde SIEMPRE usando la función suggest_features.`;

    const userPrompt = `Genera ${featureCount} funcionalidades para un producto con este contexto:

**Audiencia Objetivo:**
${targetAudience || 'No especificada'}

**Contexto del Negocio:**
${businessContext || 'No especificado'}

Genera funcionalidades innovadoras, prácticas y bien descritas.`;

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
              name: 'suggest_features',
              description: 'Retorna una lista de funcionalidades sugeridas para el producto.',
              parameters: {
                type: 'object',
                properties: {
                  features: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        title: { type: 'string', description: 'Título corto y descriptivo de la funcionalidad' },
                        description: { type: 'string', description: 'Descripción detallada de qué hace y por qué es útil' },
                        estimated_effort: { 
                          type: 'string', 
                          enum: ['small', 'medium', 'large', 'xlarge'],
                          description: 'Esfuerzo estimado de implementación'
                        },
                        priority_score: { 
                          type: 'number', 
                          description: 'Score de prioridad del 1 al 10'
                        },
                        tags: { 
                          type: 'array', 
                          items: { type: 'string' },
                          description: 'Etiquetas relevantes (ej: UX, Backend, Analytics)'
                        },
                        reasoning: { 
                          type: 'string', 
                          description: 'Razonamiento de por qué esta funcionalidad es importante'
                        }
                      },
                      required: ['title', 'description', 'estimated_effort', 'priority_score', 'tags', 'reasoning']
                    }
                  }
                },
                required: ['features']
              }
            }
          }
        ],
        tool_choice: { type: 'function', function: { name: 'suggest_features' } }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'Payment required. Please add funds.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log('AI response:', JSON.stringify(data, null, 2));

    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      throw new Error('No tool call response from AI');
    }

    const parsedResult = JSON.parse(toolCall.function.arguments);
    const features = parsedResult.features || [];

    console.log('Generated features:', features.length);

    return new Response(JSON.stringify({ features }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in roadmap-feature-generator:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
