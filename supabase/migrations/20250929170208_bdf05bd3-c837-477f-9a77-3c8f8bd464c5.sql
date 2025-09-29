-- Crear tabla para el calendario editorial
CREATE TABLE public.editorial_calendar (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  content_type TEXT NOT NULL,
  platform TEXT NOT NULL,
  scheduled_date DATE NOT NULL,
  scheduled_time TIME,
  status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'published', 'cancelled')),
  tags TEXT[],
  notes TEXT,
  generated_by_ai BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.editorial_calendar ENABLE ROW LEVEL SECURITY;

-- Crear políticas para acceso de usuarios
CREATE POLICY "Users can view their own content" 
ON public.editorial_calendar 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own content" 
ON public.editorial_calendar 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own content" 
ON public.editorial_calendar 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own content" 
ON public.editorial_calendar 
FOR DELETE 
USING (auth.uid() = user_id);

-- Crear función para actualizar timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Crear trigger para actualización automática de timestamps
CREATE TRIGGER update_editorial_calendar_updated_at
BEFORE UPDATE ON public.editorial_calendar
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Crear índices para mejorar rendimiento
CREATE INDEX idx_editorial_calendar_user_id ON public.editorial_calendar(user_id);
CREATE INDEX idx_editorial_calendar_scheduled_date ON public.editorial_calendar(scheduled_date);
CREATE INDEX idx_editorial_calendar_status ON public.editorial_calendar(status);