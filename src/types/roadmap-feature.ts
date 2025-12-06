export type FeaturePriority = 'must_have' | 'should_have' | 'could_have' | 'wont_have' | 'backlog';
export type FeatureStatus = 'planned' | 'in_progress' | 'completed' | 'cancelled';
export type FeatureEffort = 'small' | 'medium' | 'large' | 'xlarge';

export interface RoadmapFeature {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  priority: FeaturePriority;
  priority_score: number | null;
  estimated_effort: FeatureEffort | null;
  estimated_timeline: string | null;
  start_date: string | null;
  end_date: string | null;
  status: FeatureStatus;
  tags: string[] | null;
  linked_performance_id: string | null;
  engagement_impact: number | null;
  ai_generated: boolean;
  ai_reasoning: string | null;
  created_at: string;
  updated_at: string;
}

export interface GeneratedFeature {
  title: string;
  description: string;
  estimated_effort: FeatureEffort;
  priority_score: number;
  tags: string[];
  reasoning: string;
}

export interface PrioritizedFeature {
  id: string;
  priority: FeaturePriority;
  priority_score: number;
  reasoning: string;
}
