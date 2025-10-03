-- Create table for generated content history
CREATE TABLE public.generated_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  style TEXT NOT NULL,
  platform TEXT,
  hashtags TEXT[],
  score_data JSONB,
  topic TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.generated_content ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own generated content"
ON public.generated_content
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own generated content"
ON public.generated_content
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own generated content"
ON public.generated_content
FOR DELETE
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_generated_content_updated_at
BEFORE UPDATE ON public.generated_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster queries
CREATE INDEX idx_generated_content_user_id ON public.generated_content(user_id);
CREATE INDEX idx_generated_content_created_at ON public.generated_content(created_at DESC);