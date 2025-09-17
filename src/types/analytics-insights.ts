export interface AnalyticsInsights {
  // Análisis de contenido por canal
  channelAnalytics: {
    facebook?: {
      topContent: string;
      engagement: string;
      bestFormat: string;
      optimalTiming: string;
    };
    instagram?: {
      topContent: string;
      engagement: string;
      bestFormat: string;
      optimalTiming: string;
    };
    tiktok?: {
      topContent: string;
      engagement: string;
      bestFormat: string;
      optimalTiming: string;
    };
    youtube?: {
      topContent: string;
      engagement: string;
      bestFormat: string;
      optimalTiming: string;
    };
    twitter?: {
      topContent: string;
      engagement: string;
      bestFormat: string;
      optimalTiming: string;
    };
    linkedin?: {
      topContent: string;
      engagement: string;
      bestFormat: string;
      optimalTiming: string;
    };
  };

  // Análisis de competencia
  competitorAnalysis: {
    competitor1: {
      name: string;
      content: string;
      interactions: string;
      activeFollowers: string;
      contentTypes: string;
      strengths: string;
      opportunities: string;
    };
    competitor2: {
      name: string;
      content: string;
      interactions: string;
      activeFollowers: string;
      contentTypes: string;
      strengths: string;
      opportunities: string;
    };
    competitor3: {
      name: string;
      content: string;
      interactions: string;
      activeFollowers: string;
      contentTypes: string;
      strengths: string;
      opportunities: string;
    };
  };

  // Hooks y hacks para contenido
  contentHooks: {
    hooks: string[];
    copyStrategies: string[];
    callToActions: string[];
    seoKeywords: string[];
    semKeywords: string[];
    contentHacks: string[];
  };
}