-- Create tool_usage table for tracking tool usage
CREATE TABLE public.tool_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  tool_name text NOT NULL,
  used_at timestamp with time zone DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now()
);

-- Create indexes for fast queries
CREATE INDEX idx_tool_usage_user_id ON public.tool_usage(user_id);
CREATE INDEX idx_tool_usage_tool_name ON public.tool_usage(tool_name);
CREATE INDEX idx_tool_usage_used_at ON public.tool_usage(used_at);

-- Enable RLS
ALTER TABLE public.tool_usage ENABLE ROW LEVEL SECURITY;

-- Users can insert their own usage
CREATE POLICY "Users can insert own usage" ON public.tool_usage
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Admins can view all usage
CREATE POLICY "Admins can view all usage" ON public.tool_usage
  FOR SELECT TO authenticated
  USING (public.is_admin(auth.uid()));

-- Users can view their own usage
CREATE POLICY "Users can view own usage" ON public.tool_usage
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Add admin policies to profiles table
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT TO authenticated
  USING (public.is_admin(auth.uid()));

-- Add admin policies to user_subscriptions table
CREATE POLICY "Admins can view all subscriptions" ON public.user_subscriptions
  FOR SELECT TO authenticated
  USING (public.is_admin(auth.uid()));

-- Add admin policy to update affiliate_payouts
CREATE POLICY "Admins can update all payouts" ON public.affiliate_payouts
  FOR UPDATE TO authenticated
  USING (public.is_admin(auth.uid()));

-- Insert admin role for digitalcoach@jaimecotes.com
DO $$
DECLARE
  admin_user_id uuid;
BEGIN
  SELECT id INTO admin_user_id FROM auth.users WHERE email = 'digitalcoach@jaimecotes.com' LIMIT 1;
  IF admin_user_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role) 
    VALUES (admin_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
END $$;