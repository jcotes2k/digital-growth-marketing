-- Create table for content performance metrics
CREATE TABLE public.content_performance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  content_id UUID REFERENCES public.generated_content(id) ON DELETE CASCADE,
  calendar_id UUID REFERENCES public.editorial_calendar(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  reach INTEGER DEFAULT 0,
  engagement_rate NUMERIC(5,2),
  conversion_rate NUMERIC(5,2),
  notes TEXT,
  measured_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.content_performance ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own performance metrics"
ON public.content_performance
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own performance metrics"
ON public.content_performance
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own performance metrics"
ON public.content_performance
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own performance metrics"
ON public.content_performance
FOR DELETE
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_content_performance_updated_at
BEFORE UPDATE ON public.content_performance
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for faster queries
CREATE INDEX idx_content_performance_user_id ON public.content_performance(user_id);
CREATE INDEX idx_content_performance_content_id ON public.content_performance(content_id);
CREATE INDEX idx_content_performance_platform ON public.content_performance(platform);
CREATE INDEX idx_content_performance_measured_at ON public.content_performance(measured_at DESC);