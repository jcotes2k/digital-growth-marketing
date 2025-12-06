import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, points, style, orientation } = await req.json();

    console.log('Generating infographic with:', { title, points, style, orientation });

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Build style description based on selected style
    const styleDescriptions: Record<string, string> = {
      corporate: 'professional, clean, business-oriented with dark blue and gray tones, formal typography',
      modern: 'contemporary, sleek design with gradient backgrounds, sans-serif fonts, subtle shadows',
      colorful: 'vibrant, dynamic with bright colors, playful elements, engaging visual hierarchy',
      minimal: 'clean, lots of white space, simple icons, elegant typography, limited color palette'
    };

    const orientationDesc = orientation === 'vertical' 
      ? 'vertical layout (9:16 aspect ratio) suitable for stories and pins'
      : 'horizontal layout (16:9 aspect ratio) suitable for posts and presentations';

    // Format the key points as a list
    const pointsList = points.map((point: string, index: number) => `${index + 1}. ${point}`).join('\n');

    const enhancedPrompt = `Create a professional infographic with the following specifications:

TITLE: "${title}"

KEY POINTS TO DISPLAY:
${pointsList}

STYLE: ${styleDescriptions[style] || styleDescriptions.modern}

LAYOUT: ${orientationDesc}

Design requirements:
- Clear visual hierarchy with the title prominently displayed at the top
- Each key point should be visually distinct with icons or illustrations
- Use appropriate spacing and alignment
- Include subtle decorative elements that match the ${style} style
- Make text readable and well-organized
- Add visual flow indicators connecting the points
- Professional infographic design suitable for social media sharing

The infographic should be visually appealing and easy to understand at a glance.`;

    console.log('Enhanced prompt:', enhancedPrompt);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image-preview',
        messages: [
          {
            role: 'user',
            content: enhancedPrompt
          }
        ],
        modalities: ['image', 'text']
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'Payment required. Please add credits to your workspace.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log('AI response received');

    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    
    if (!imageUrl) {
      throw new Error('No image was generated');
    }

    return new Response(JSON.stringify({ 
      imageUrl,
      prompt: enhancedPrompt,
      title,
      style,
      orientation
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in infographic-generator function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
