-- Create canvas_scenarios table for comparing different versions
CREATE TABLE public.canvas_scenarios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  canvas_data JSONB NOT NULL,
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.canvas_scenarios ENABLE ROW LEVEL SECURITY;

-- Users can manage their own scenarios
CREATE POLICY "Users can manage their own scenarios" 
ON public.canvas_scenarios 
FOR ALL 
USING (auth.uid() = user_id);

-- Create trigger for timestamps
CREATE TRIGGER update_canvas_scenarios_updated_at
BEFORE UPDATE ON public.canvas_scenarios
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();