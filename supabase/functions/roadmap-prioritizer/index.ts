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
    const { features, businessContext } = await req.json();

    console.log('Prioritizing features:', features?.length);

    if (!features || features.length === 0) {
      return new Response(JSON.stringify({ error: 'No features provided' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = `Eres un experto en priorización de productos usando el método MoSCoW.

Tu tarea es clasificar cada funcionalidad en una de estas categorías:
- must_have: Esencial, sin esto el producto no funciona o no tiene valor
- should_have: Importante pero no crítico para el lanzamiento inicial
- could_have: Deseable si hay tiempo y recursos, mejora la experiencia
- wont_have: No prioritario ahora, quizás en el futuro

Para cada funcionalidad, proporciona:
1. La categoría MoSCoW
2. Un score de prioridad del 1 al 10
3. Un razonamiento claro de tu decisión

Considera el contexto del negocio y el valor para el usuario al priorizar.`;

    const featuresDescription = features.map((f: any, i: number) => 
      `${i + 1}. "${f.title}": ${f.description}`
    ).join('\n');

    const userPrompt = `Prioriza estas funcionalidades usando el método MoSCoW:

${featuresDescription}

**Contexto del Negocio:**
${businessContext || 'Producto digital general'}

Usa la función prioritize_features para responder.`;

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
              name: 'prioritize_features',
              description: 'Retorna la priorización MoSCoW de cada funcionalidad.',
              parameters: {
                type: 'object',
                properties: {
                  prioritized_features: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        feature_index: { 
                          type: 'number', 
                          description: 'Índice de la funcionalidad (empezando en 0)'
                        },
                        priority: { 
                          type: 'string', 
                          enum: ['must_have', 'should_have', 'could_have', 'wont_have'],
                          description: 'Categoría MoSCoW asignada'
                        },
                        priority_score: { 
                          type: 'number', 
                          description: 'Score de prioridad del 1 al 10'
                        },
                        reasoning: { 
                          type: 'string', 
                          description: 'Razonamiento de la clasificación'
                        }
                      },
                      required: ['feature_index', 'priority', 'priority_score', 'reasoning']
                    }
                  }
                },
                required: ['prioritized_features']
              }
            }
          }
        ],
        tool_choice: { type: 'function', function: { name: 'prioritize_features' } }
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
    const prioritizedFeatures = parsedResult.prioritized_features || [];

    // Map the priorities back to the original features
    const result = features.map((feature: any, index: number) => {
      const prioritization = prioritizedFeatures.find((p: any) => p.feature_index === index);
      return {
        ...feature,
        priority: prioritization?.priority || 'backlog',
        priority_score: prioritization?.priority_score || 5,
        ai_reasoning: prioritization?.reasoning || ''
      };
    });

    console.log('Prioritized features:', result.length);

    return new Response(JSON.stringify({ features: result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in roadmap-prioritizer:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
