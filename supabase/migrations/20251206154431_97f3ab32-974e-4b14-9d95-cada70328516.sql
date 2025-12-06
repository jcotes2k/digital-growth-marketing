-- Create product_roadmap_features table for storing roadmap features
CREATE TABLE public.product_roadmap_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT NOT NULL DEFAULT 'backlog',
  priority_score NUMERIC,
  estimated_effort TEXT,
  estimated_timeline TEXT,
  start_date DATE,
  end_date DATE,
  status TEXT DEFAULT 'planned',
  tags TEXT[],
  linked_performance_id UUID REFERENCES public.content_performance(id) ON DELETE SET NULL,
  engagement_impact NUMERIC,
  ai_generated BOOLEAN DEFAULT false,
  ai_reasoning TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.product_roadmap_features ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own features"
ON public.product_roadmap_features
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own features"
ON public.product_roadmap_features
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own features"
ON public.product_roadmap_features
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own features"
ON public.product_roadmap_features
FOR DELETE
USING (auth.uid() = user_id);

-- Index for performance
CREATE INDEX idx_roadmap_features_user_priority ON public.product_roadmap_features(user_id, priority);

-- Trigger for updated_at
CREATE TRIGGER update_roadmap_features_updated_at
BEFORE UPDATE ON public.product_roadmap_features
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();