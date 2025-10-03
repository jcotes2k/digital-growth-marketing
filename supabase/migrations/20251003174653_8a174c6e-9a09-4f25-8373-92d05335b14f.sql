-- Create content_ideas table
CREATE TABLE public.content_ideas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  platform TEXT NOT NULL,
  topic TEXT NOT NULL,
  suggested_format TEXT,
  trending_score NUMERIC,
  keywords TEXT[],
  generated_by_ai BOOLEAN DEFAULT true,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.content_ideas ENABLE ROW LEVEL SECURITY;

-- Users can manage their own content ideas
CREATE POLICY "Users can manage their own content ideas" 
ON public.content_ideas 
FOR ALL 
USING (auth.uid() = user_id);

-- Create trigger for timestamps
CREATE TRIGGER update_content_ideas_updated_at
BEFORE UPDATE ON public.content_ideas
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create platform_optimized_content table
CREATE TABLE public.platform_optimized_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  original_content TEXT NOT NULL,
  platform TEXT NOT NULL,
  optimized_content TEXT NOT NULL,
  hashtags TEXT[],
  optimal_length INTEGER,
  best_posting_time TEXT,
  engagement_prediction NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.platform_optimized_content ENABLE ROW LEVEL SECURITY;

-- Users can manage their own optimized content
CREATE POLICY "Users can manage their own optimized content" 
ON public.platform_optimized_content 
FOR ALL 
USING (auth.uid() = user_id);

-- Create trigger for timestamps
CREATE TRIGGER update_platform_optimized_content_updated_at
BEFORE UPDATE ON public.platform_optimized_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();