-- Create subscription tiers table
CREATE TABLE public.subscription_tiers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tier_id VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  price INTEGER NOT NULL DEFAULT 0,
  currency VARCHAR(10) NOT NULL DEFAULT 'INR',
  features JSONB NOT NULL DEFAULT '{}',
  limits JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user subscriptions table
CREATE TABLE public.user_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  tier_id VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'cancelled', 'expired')),
  start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  features JSONB NOT NULL DEFAULT '{}',
  limits JSONB NOT NULL DEFAULT '{}',
  payment_provider VARCHAR(50),
  payment_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create usage tracking table
CREATE TABLE public.usage_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  feature VARCHAR(50) NOT NULL,
  usage_count INTEGER NOT NULL DEFAULT 0,
  month_year VARCHAR(7) NOT NULL, -- Format: YYYY-MM
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, feature, month_year)
);

-- Enable RLS
ALTER TABLE public.subscription_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_tracking ENABLE ROW LEVEL SECURITY;

-- Create policies for subscription_tiers (read-only for all users)
CREATE POLICY "Anyone can view subscription tiers" 
ON public.subscription_tiers FOR SELECT 
USING (is_active = true);

-- Create policies for user_subscriptions
CREATE POLICY "Users can view their own subscription" 
ON public.user_subscriptions FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription" 
ON public.user_subscriptions FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscription" 
ON public.user_subscriptions FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create policies for usage_tracking
CREATE POLICY "Users can view their own usage" 
ON public.usage_tracking FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own usage" 
ON public.usage_tracking FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own usage" 
ON public.usage_tracking FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Insert default subscription tiers
INSERT INTO public.subscription_tiers (tier_id, name, price, currency, features, limits) VALUES
('free', 'Free', 0, 'INR', 
  '{"tradingJournal": true, "basicAnalytics": true, "calculators": true, "basicIndicators": true, "communityAccess": false, "advancedAnalytics": false, "unlimitedTrades": false, "tradeCategories": false, "exportData": false, "prioritySupport": false, "customReports": false, "apiAccess": false}',
  '{"monthlyTrades": 15, "tradeCategories": 0, "exportLimit": 0, "apiCalls": 0, "storageLimit": "10MB"}'
),
('premium', 'Premium', 999, 'INR',
  '{"tradingJournal": true, "basicAnalytics": true, "calculators": true, "basicIndicators": true, "communityAccess": true, "advancedAnalytics": true, "unlimitedTrades": true, "tradeCategories": true, "exportData": true, "prioritySupport": true, "customReports": true, "apiAccess": true}',
  '{"monthlyTrades": 100, "tradeCategories": 10, "exportLimit": 50, "apiCalls": 1000, "storageLimit": "1GB"}'
),
('pro', 'Pro', 1999, 'INR',
  '{"tradingJournal": true, "basicAnalytics": true, "calculators": true, "basicIndicators": true, "communityAccess": true, "advancedAnalytics": true, "unlimitedTrades": true, "tradeCategories": true, "exportData": true, "prioritySupport": true, "customReports": true, "apiAccess": true, "whiteLabel": true, "customIntegrations": true}',
  '{"monthlyTrades": -1, "tradeCategories": -1, "exportLimit": -1, "apiCalls": -1, "storageLimit": "10GB"}'
);

-- Create indexes
CREATE INDEX idx_user_subscriptions_user_id ON public.user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_tier_id ON public.user_subscriptions(tier_id);
CREATE INDEX idx_usage_tracking_user_id ON public.usage_tracking(user_id);
CREATE INDEX idx_usage_tracking_month_year ON public.usage_tracking(month_year);

-- Create triggers for updated_at
CREATE TRIGGER update_subscription_tiers_updated_at
  BEFORE UPDATE ON public.subscription_tiers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_subscriptions_updated_at
  BEFORE UPDATE ON public.user_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_usage_tracking_updated_at
  BEFORE UPDATE ON public.usage_tracking
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Update the handle_new_user function to create default subscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'avatar_url'
  );
  
  -- Create default journal settings
  INSERT INTO public.user_journal_settings (user_id)
  VALUES (NEW.id);
  
  -- Create default user preferences
  INSERT INTO public.user_preferences (user_id)
  VALUES (NEW.id);
  
  -- Create default subscription (free tier)
  INSERT INTO public.user_subscriptions (user_id, tier_id, end_date, features, limits)
  VALUES (
    NEW.id,
    'free',
    (now() + interval '1 year'),
    (SELECT features FROM public.subscription_tiers WHERE tier_id = 'free'),
    (SELECT limits FROM public.subscription_tiers WHERE tier_id = 'free')
  );
  
  RETURN NEW;
END;
$function$; 