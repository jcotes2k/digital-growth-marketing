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
    const { template, variables, additionalContext } = await req.json();
    console.log('Generating post from template:', { template: template.name, variables });

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Construir el prompt con el template y las variables
    let variablesText = '';
    if (variables && Object.keys(variables).length > 0) {
      variablesText = '\n\nVariables del usuario:\n';
      for (const [key, value] of Object.entries(variables)) {
        variablesText += `- ${key}: ${value}\n`;
      }
    }

    const systemPrompt = `Eres un experto en marketing de contenidos y copywriting. Tu tarea es generar contenido para redes sociales basado en templates predefinidos.

IMPORTANTE: Debes devolver SOLO un objeto JSON válido sin markdown, sin comentarios, sin texto adicional.

El formato debe ser exactamente:
{
  "content": "texto del post",
  "hashtags": ["hashtag1", "hashtag2"],
  "suggestions": "sugerencias para mejorar",
  "bestTimeToPost": "mejor momento para publicar"
}`;

    const userPrompt = `Genera un post para ${template.platform} siguiendo este template:

NOMBRE: ${template.name}
TIPO: ${template.type}
ESTRUCTURA: ${template.structure}
TONO: ${template.tone}
LLAMADO A LA ACCIÓN: ${template.cta}

EJEMPLO DE REFERENCIA:
${template.example}
${variablesText}
${additionalContext ? `\nCONTEXTO ADICIONAL:\n${additionalContext}` : ''}

Genera un post original y creativo siguiendo la estructura del template, pero con contenido fresco y relevante. Incluye emojis apropiados para la plataforma. Asegúrate de que el contenido sea persuasivo y optimizado para ${template.platform}.`;

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
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    console.log('Raw AI response:', content);

    // Limpiar la respuesta del modelo
    let cleanedContent = content.trim();
    
    // Eliminar bloques de código markdown si existen
    if (cleanedContent.startsWith('```json')) {
      cleanedContent = cleanedContent.replace(/^```json\s*/, '').replace(/```\s*$/, '');
    } else if (cleanedContent.startsWith('```')) {
      cleanedContent = cleanedContent.replace(/^```\s*/, '').replace(/```\s*$/, '');
    }
    
    cleanedContent = cleanedContent.trim();

    let generatedPost;
    try {
      generatedPost = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', cleanedContent);
      throw new Error('Invalid JSON response from AI');
    }

    const result = {
      post: {
        platform: template.platform,
        ...generatedPost
      },
      template: template
    };

    console.log('Successfully generated post');
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in template-generator:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error instanceof Error ? error.stack : undefined
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
