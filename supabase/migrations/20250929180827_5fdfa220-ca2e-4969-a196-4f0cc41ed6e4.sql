-- Create sentiment_analysis table
CREATE TABLE public.sentiment_analysis (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  platform TEXT NOT NULL,
  content TEXT NOT NULL,
  sentiment TEXT NOT NULL CHECK (sentiment IN ('positive', 'negative', 'neutral')),
  sentiment_score NUMERIC(3, 2),
  keywords TEXT[],
  analyzed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  source_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.sentiment_analysis ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own sentiment analysis"
ON public.sentiment_analysis
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create sentiment analysis"
ON public.sentiment_analysis
FOR INSERT
WITH CHECK (auth.uid() = user_id);