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
    const { prompt, style, platform, formatType, width, height, aspectRatio } = await req.json();
    
    console.log('Generating image with:', { prompt, style, platform, formatType, width, height, aspectRatio });
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Style descriptions
    const styleEnhancements: Record<string, string> = {
      'fotografia': 'Fotografía profesional de alta calidad, iluminación natural, 8K, ultra realista',
      'ilustracion': 'Ilustración digital profesional, estilo moderno, colores vibrantes, arte digital',
      'minimalista': 'Estilo minimalista, diseño limpio, colores sólidos, composición simple y elegante',
      'abstracto': 'Arte abstracto moderno, formas geométricas, colores vibrantes, composición dinámica',
      'corporativo': 'Imagen corporativa profesional, estilo business, colores sobrios, alta calidad',
      'creativo': 'Diseño creativo e innovador, colores llamativos, composición única y artística'
    };

    // Platform-specific styling
    const platformStyles: Record<string, string> = {
      instagram: 'Optimizado para Instagram, visualmente impactante, estética de redes sociales, atractivo y moderno',
      facebook: 'Optimizado para Facebook, contenido atractivo y compartible, mensaje claro',
      linkedin: 'Profesional para LinkedIn, estética corporativa, apropiado para negocios, refinado',
      twitter: 'Optimizado para Twitter/X, llamativo, visuales impactantes, alto contraste',
      tiktok: 'Estilo TikTok, dinámico, juvenil, moderno, llamativo',
      youtube: 'Estilo miniatura YouTube, digno de clic, texto compatible, alto contraste',
      pinterest: 'Optimizado para Pinterest, composición vertical, inspirador, guardable'
    };

    // Build enhanced prompt
    let enhancedPrompt = prompt;
    
    // Add style enhancement
    if (style && styleEnhancements[style]) {
      enhancedPrompt += `. ${styleEnhancements[style]}`;
    }

    // Add platform-specific instructions
    if (platform && platformStyles[platform]) {
      enhancedPrompt += `. ${platformStyles[platform]}`;
    }

    // Add aspect ratio instruction
    if (aspectRatio) {
      enhancedPrompt += `. Imagen con relación de aspecto ${aspectRatio}`;
    } else if (width && height) {
      const ratio = width > height ? 'horizontal/paisaje' : height > width ? 'vertical/retrato' : 'cuadrada';
      enhancedPrompt += `. Orientación ${ratio}`;
    }

    // Add dimension context
    if (width && height) {
      enhancedPrompt += `. Optimizado para ${width}x${height} píxeles`;
    }

    enhancedPrompt += '. Alta calidad, resultado profesional.';

    console.log('Enhanced prompt:', enhancedPrompt);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image-preview",
        messages: [
          {
            role: "user",
            content: enhancedPrompt
          }
        ],
        modalities: ["image", "text"]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add funds to your Lovable AI workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageUrl) {
      throw new Error("No image was generated");
    }

    return new Response(JSON.stringify({ 
      imageUrl,
      prompt: enhancedPrompt,
      platform,
      formatType,
      width,
      height
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Image generator error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
