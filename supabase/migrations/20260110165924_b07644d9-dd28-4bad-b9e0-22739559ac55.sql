-- Agregar campos de trial a user_subscriptions
ALTER TABLE public.user_subscriptions 
ADD COLUMN IF NOT EXISTS is_trial boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS trial_code text;

-- Crear tabla de códigos de trial
CREATE TABLE public.trial_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  plan public.subscription_plan DEFAULT 'gold',
  duration_days integer DEFAULT 7,
  max_uses integer DEFAULT NULL,
  current_uses integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  expires_at timestamp with time zone DEFAULT NULL
);

-- Habilitar RLS
ALTER TABLE public.trial_codes ENABLE ROW LEVEL SECURITY;

-- Política para leer códigos activos (cualquier usuario autenticado)
CREATE POLICY "Anyone can read active trial codes"
ON public.trial_codes
FOR SELECT
USING (is_active = true);

-- Política para que admins gestionen códigos
CREATE POLICY "Admins can manage trial codes"
ON public.trial_codes
FOR ALL
USING (public.is_admin(auth.uid()));

-- Insertar código demo por defecto
INSERT INTO public.trial_codes (code, plan, duration_days, max_uses)
VALUES ('DEMO7DIAS', 'gold', 7, NULL);