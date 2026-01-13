-- Create epayco_subscriptions table for storing recurring subscription details
CREATE TABLE public.epayco_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  epayco_subscription_id TEXT NOT NULL,
  epayco_customer_id TEXT NOT NULL,
  epayco_token_id TEXT,
  plan TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  card_last_four TEXT,
  card_brand TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.epayco_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own subscriptions" 
ON public.epayco_subscriptions 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Create policies for admin access
CREATE POLICY "Admins can view all subscriptions" 
ON public.epayco_subscriptions 
FOR SELECT 
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update all subscriptions" 
ON public.epayco_subscriptions 
FOR UPDATE 
TO authenticated
USING (public.is_admin(auth.uid()));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_epayco_subscriptions_updated_at
BEFORE UPDATE ON public.epayco_subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster lookups
CREATE INDEX idx_epayco_subscriptions_user_id ON public.epayco_subscriptions(user_id);
CREATE INDEX idx_epayco_subscriptions_status ON public.epayco_subscriptions(status);