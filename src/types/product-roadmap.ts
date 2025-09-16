export interface ProductRoadmap {
  // ¿Para quién?
  targetAudience: string;
  
  // Debe tener
  mustHaveFeatures: string;
  userStories: string;
  
  // Debería tener
  shouldHaveFeatures: string;
  shortTermGoals: string;
  
  // Podría tener
  couldHaveFeatures: string;
  futureVision: string;
  
  // Backlog
  backlogFeatures: string;
  unclassifiedIdeas: string;
  
  // Alternativas
  marketAlternatives: string;
  competitorAnalysis: string;
}