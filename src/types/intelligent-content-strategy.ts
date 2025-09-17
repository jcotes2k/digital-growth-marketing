export interface IntelligentContentStrategy {
  // 1. Marca - Concepto Rector
  brandConcept: {
    valueProposition: string;
    keyDifferentiators: string;
    brandAttributes: string;
    customerPromise: string;
    creativeConceptPhrase: string;
  };

  // 2. KPIs (Key Performance Indicators)
  kpis: {
    priorityMetrics: string;
    relevantKpis: string[];
    numericObjectives: string;
  };

  // 3. Audiencia
  audience: {
    primaryBuyerPersona: string;
    archetypes: string;
    keyPublics: string;
    audienceProblemsNeeds: string;
  };

  // 4. Canales
  channels: {
    socialNetworks: string;
    platformContentFit: string;
    channelRoles: string;
    resourcePrioritization: string;
  };

  // 5. Ritmo
  rhythm: {
    publicationFrequency: string;
    networkDifferences: string;
    storiesReelsVideos: string;
    optimalTiming: string;
  };

  // 6. Marketing de Contenidos
  contentMarketing: {
    mainTopics: string;
    coreMessages: string;
    topicsToAvoid: string;
    valueContribution: string;
  };

  // 6B. Tono de Comunicación
  communicationTone: {
    brandPerception: string;
    languageStyle: string;
    emotionsToEvoke: string;
    voicePersonality: string;
  };

  // 7. Formatos
  formats: {
    primaryFormats: string;
    engagementFormats: string;
    contentReuse: string;
  };

  // 8. Presupuesto
  budget: {
    monthlyBudget: string;
    organicVsPaid: string;
    networkInvestment: string;
    toolsInvestment: string;
  };

  // 9. FAQs y Crisis
  faqsCrisis: {
    frequentQuestions: string;
    reputationRisks: string;
    crisisProtocol: string;
    responseTime: string;
  };

  // 10. Workflow
  workflow: {
    managementTools: string;
    editorialCalendar: string;
    teamWorkflow: string;
    analyticsTools: string;
    aiUsage: string;
  };
}