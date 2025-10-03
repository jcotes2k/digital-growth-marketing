export interface ContentScore {
  overall: number;
  seo: number;
  readability: number;
  engagement: number;
  details: {
    seo: {
      hasKeywords: boolean;
      optimalLength: boolean;
      hasHashtags: boolean;
      score: number;
    };
    readability: {
      avgWordLength: number;
      avgSentenceLength: number;
      hasParagraphs: boolean;
      score: number;
    };
    engagement: {
      hasEmojis: boolean;
      hasCallToAction: boolean;
      hasQuestions: boolean;
      hasNumbers: boolean;
      score: number;
    };
  };
  suggestions: string[];
}

export const analyzeContentQuality = (
  content: string,
  hashtags: string[] = []
): ContentScore => {
  const suggestions: string[] = [];
  
  // SEO Analysis
  const wordCount = content.trim().split(/\s+/).length;
  const hasKeywords = wordCount >= 10; // Simplified keyword detection
  const optimalLength = wordCount >= 50 && wordCount <= 300;
  const hasHashtags = hashtags.length >= 3;
  
  let seoScore = 0;
  if (hasKeywords) seoScore += 33;
  if (optimalLength) seoScore += 34;
  else if (wordCount < 50) suggestions.push('Considera agregar más contenido (mínimo 50 palabras)');
  else if (wordCount > 300) suggestions.push('El contenido es muy largo, considera dividirlo');
  
  if (hasHashtags) seoScore += 33;
  else suggestions.push('Agrega hashtags relevantes para mejor alcance');
  
  // Readability Analysis
  const words = content.split(/\s+/);
  const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const avgSentenceLength = words.length / (sentences.length || 1);
  const hasParagraphs = content.includes('\n\n') || content.split('\n').length > 2;
  
  let readabilityScore = 0;
  if (avgWordLength < 6) readabilityScore += 40;
  else if (avgWordLength < 8) readabilityScore += 25;
  else suggestions.push('Usa palabras más simples para mejor comprensión');
  
  if (avgSentenceLength < 20) readabilityScore += 40;
  else if (avgSentenceLength < 30) readabilityScore += 25;
  else suggestions.push('Acorta las oraciones para mejor legibilidad');
  
  if (hasParagraphs) readabilityScore += 20;
  else suggestions.push('Divide el texto en párrafos para facilitar la lectura');
  
  // Engagement Analysis
  const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;
  const hasEmojis = emojiRegex.test(content);
  
  const callToActionWords = ['compra', 'descubre', 'aprende', 'únete', 'regístrate', 'descarga', 
                              'visita', 'conoce', 'prueba', 'contáctanos', 'suscríbete', 'dale click'];
  const hasCallToAction = callToActionWords.some(word => 
    content.toLowerCase().includes(word)
  );
  
  const hasQuestions = content.includes('?');
  const hasNumbers = /\d+/.test(content);
  
  let engagementScore = 0;
  if (hasEmojis) engagementScore += 25;
  else suggestions.push('Agrega emojis para mayor engagement visual');
  
  if (hasCallToAction) engagementScore += 30;
  else suggestions.push('Incluye un llamado a la acción claro');
  
  if (hasQuestions) engagementScore += 25;
  else suggestions.push('Las preguntas aumentan la interacción');
  
  if (hasNumbers) engagementScore += 20;
  else suggestions.push('Los números y datos captan más atención');
  
  // Overall Score
  const overall = Math.round((seoScore + readabilityScore + engagementScore) / 3);
  
  return {
    overall,
    seo: seoScore,
    readability: readabilityScore,
    engagement: engagementScore,
    details: {
      seo: {
        hasKeywords,
        optimalLength,
        hasHashtags,
        score: seoScore,
      },
      readability: {
        avgWordLength: Math.round(avgWordLength * 10) / 10,
        avgSentenceLength: Math.round(avgSentenceLength * 10) / 10,
        hasParagraphs,
        score: readabilityScore,
      },
      engagement: {
        hasEmojis,
        hasCallToAction,
        hasQuestions,
        hasNumbers,
        score: engagementScore,
      },
    },
    suggestions: suggestions.slice(0, 3), // Top 3 suggestions
  };
};

export const getScoreColor = (score: number): string => {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  if (score >= 40) return 'text-orange-600';
  return 'text-red-600';
};

export const getScoreBadgeVariant = (score: number): 'default' | 'secondary' | 'destructive' | 'outline' => {
  if (score >= 80) return 'default';
  if (score >= 60) return 'secondary';
  if (score >= 40) return 'outline';
  return 'destructive';
};

export const getScoreLabel = (score: number): string => {
  if (score >= 80) return 'Excelente';
  if (score >= 60) return 'Bueno';
  if (score >= 40) return 'Mejorable';
  return 'Necesita mejoras';
};
