export interface Competitor {
  name: string;
  website: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  pricing?: string;
  targetAudience?: string;
  marketPosition?: string;
}

export interface CompetitorAnalysis {
  id: string;
  competitors: Competitor[];
  industryOverview: string;
  marketGaps: string[];
  recommendations: string[];
  competitiveAdvantages: string[];
  threats: string[];
  opportunities: string[];
  swotAnalysis?: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  createdAt: Date;
}

export interface CompetitorAnalysisRequest {
  industry: string;
  businessDescription: string;
  targetMarket: string;
  competitorUrls?: string[];
  analysisDepth: 'basic' | 'detailed' | 'comprehensive';
}