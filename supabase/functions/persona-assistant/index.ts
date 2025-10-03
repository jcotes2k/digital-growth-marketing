import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, companyInfo } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Persona assistant called with', messages.length, 'messages');

    // System prompt para el asistente
    const systemPrompt = `Eres un experto asistente de creación de buyer personas. Tu trabajo es hacer preguntas inteligentes y contextuales para entender profundamente el perfil del cliente ideal del usuario.

Información de la empresa: ${JSON.stringify(companyInfo)}

DIRECTRICES:
1. Haz preguntas una a la vez, enfocadas y específicas
2. Adapta las preguntas según las respuestas previas
3. Profundiza en aspectos importantes (motivaciones, miedos, proceso de compra)
4. Usa un tono amigable y conversacional
5. Después de 6-8 intercambios, ofrece generar el buyer persona completo
6. Cuando el usuario pida generar el persona, usa la función generate_persona

Estructura de un buyer persona completo:
- Demografía: nombre, título, área funcional, edad, ubicación, bio
- Personalidad: extrovert, thinking, control, practical, conservative (escala 1-10)
- Motivaciones: incentivo, miedos, logros, crecimiento, poder, social
- Canales preferidos: medios tradicionales, online/redes, email/teléfono, referidos, presencial
- Objetivos de negocio, personales y de trabajo
- Proceso de compra típico
- Creencias y comportamientos
- Influencias en la decisión
- Tipos de contenido que consume

Empieza preguntando sobre el rol o industria del buyer persona que quieren crear.`;

    const allMessages: Message[] = [
      { role: 'system', content: systemPrompt },
      ...messages
    ];

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: allMessages,
        tools: [
          {
            type: 'function',
            function: {
              name: 'generate_persona',
              description: 'Genera un buyer persona completo basado en la conversación',
              parameters: {
                type: 'object',
                properties: {
                  personaName: { type: 'string', description: 'Nombre ficticio del persona' },
                  title: { type: 'string', description: 'Cargo o título profesional' },
                  functionalArea: { type: 'string', description: 'Área funcional' },
                  age: { type: 'string', description: 'Rango de edad' },
                  location: { type: 'string', description: 'Ubicación geográfica' },
                  bio: { type: 'string', description: 'Biografía de 2-3 oraciones' },
                  personality: {
                    type: 'object',
                    properties: {
                      extrovert: { type: 'number', minimum: 1, maximum: 10 },
                      thinking: { type: 'number', minimum: 1, maximum: 10 },
                      control: { type: 'number', minimum: 1, maximum: 10 },
                      practical: { type: 'number', minimum: 1, maximum: 10 },
                      conservative: { type: 'number', minimum: 1, maximum: 10 }
                    },
                    required: ['extrovert', 'thinking', 'control', 'practical', 'conservative']
                  },
                  motivations: {
                    type: 'object',
                    properties: {
                      incentive: { type: 'string' },
                      fear: { type: 'string' },
                      achievement: { type: 'string' },
                      growth: { type: 'string' },
                      power: { type: 'string' },
                      social: { type: 'string' }
                    },
                    required: ['incentive', 'fear', 'achievement', 'growth', 'power', 'social']
                  },
                  preferredChannels: {
                    type: 'object',
                    properties: {
                      traditionalMedia: { type: 'boolean' },
                      onlineSocialMobile: { type: 'boolean' },
                      emailPhone: { type: 'boolean' },
                      referrals: { type: 'boolean' },
                      faceToFacePhysical: { type: 'boolean' }
                    },
                    required: ['traditionalMedia', 'onlineSocialMobile', 'emailPhone', 'referrals', 'faceToFacePhysical']
                  },
                  goals: { type: 'string', description: 'Objetivos principales' },
                  pains: { type: 'string', description: 'Dolores y frustraciones' },
                  businessObjectives: { type: 'string', description: 'Objetivos de negocio' },
                  personalObjectives: { type: 'string', description: 'Objetivos personales' },
                  workObjectives: { type: 'string', description: 'Objetivos laborales' },
                  buyingProcess: { type: 'string', description: 'Proceso de compra' },
                  decision_factors: { type: 'string', description: 'Factores de decisión' },
                  content_types_sought: { type: 'string', description: 'Tipos de contenido que busca' }
                },
                required: ['personaName', 'title', 'personality', 'motivations', 'preferredChannels']
              }
            }
          }
        ],
        tool_choice: 'auto'
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
    console.log('AI response received');

    // Si la IA usó tool calling para generar el persona
    if (data.choices[0].message.tool_calls) {
      const toolCall = data.choices[0].message.tool_calls[0];
      const personaData = JSON.parse(toolCall.function.arguments);
      
      return new Response(
        JSON.stringify({ 
          message: '¡Perfecto! He generado tu buyer persona basándome en nuestra conversación.',
          persona: personaData,
          completed: true
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Respuesta normal del chatbot
    return new Response(
      JSON.stringify({ 
        message: data.choices[0].message.content,
        completed: false
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in persona-assistant function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});