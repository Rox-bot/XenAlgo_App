-- Create user profiles table for additional user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Profiles are viewable by everyone" 
ON public.profiles 
FOR SELECT 
USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- User settings for journal (one-time setup)
CREATE TABLE public.user_journal_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  account_capital DECIMAL(15,2) NOT NULL DEFAULT 100000,
  default_risk_percentage DECIMAL(5,2) DEFAULT 2.0,
  default_currency VARCHAR(10) DEFAULT 'INR',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_journal_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for user_journal_settings
CREATE POLICY "Users can view their own journal settings" 
ON public.user_journal_settings 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own journal settings" 
ON public.user_journal_settings 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own journal settings" 
ON public.user_journal_settings 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Main trades table
CREATE TABLE public.trades (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  symbol VARCHAR(50) NOT NULL,
  trade_type VARCHAR(10) NOT NULL CHECK (trade_type IN ('LONG', 'SHORT')),
  entry_price DECIMAL(15,4) NOT NULL,
  quantity INTEGER NOT NULL,
  entry_date TIMESTAMP WITH TIME ZONE NOT NULL,
  exit_price DECIMAL(15,4) NULL,
  exit_date TIMESTAMP WITH TIME ZONE NULL,
  stop_loss DECIMAL(15,4) NULL,
  take_profit DECIMAL(15,4) NULL,
  setup_type VARCHAR(50) NULL,
  entry_reason TEXT NULL,
  exit_reason TEXT NULL,
  status VARCHAR(10) DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'CLOSED', 'CANCELLED')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.trades ENABLE ROW LEVEL SECURITY;

-- Create policies for trades
CREATE POLICY "Users can view their own trades" 
ON public.trades 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own trades" 
ON public.trades 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own trades" 
ON public.trades 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own trades" 
ON public.trades 
FOR DELETE 
USING (auth.uid() = user_id);

-- Trade images table
CREATE TABLE public.trade_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  trade_id UUID NOT NULL REFERENCES public.trades(id) ON DELETE CASCADE,
  image_path VARCHAR(255) NOT NULL,
  original_filename VARCHAR(255) NOT NULL,
  file_size INTEGER NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.trade_images ENABLE ROW LEVEL SECURITY;

-- Create policies for trade_images (users can only access images for their own trades)
CREATE POLICY "Users can view images for their own trades" 
ON public.trade_images 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.trades 
    WHERE trades.id = trade_images.trade_id 
    AND trades.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert images for their own trades" 
ON public.trade_images 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.trades 
    WHERE trades.id = trade_images.trade_id 
    AND trades.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete images for their own trades" 
ON public.trade_images 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.trades 
    WHERE trades.id = trade_images.trade_id 
    AND trades.user_id = auth.uid()
  )
);

-- Create indexes for better performance
CREATE INDEX idx_trades_user_id ON public.trades(user_id);
CREATE INDEX idx_trades_symbol ON public.trades(symbol);
CREATE INDEX idx_trades_status ON public.trades(status);
CREATE INDEX idx_trades_entry_date ON public.trades(entry_date);
CREATE INDEX idx_trade_images_trade_id ON public.trade_images(trade_id);

-- Create function to automatically create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'avatar_url'
  );
  
  -- Also create default journal settings
  INSERT INTO public.user_journal_settings (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to run the function when a user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_journal_settings_updated_at
  BEFORE UPDATE ON public.user_journal_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_trades_updated_at
  BEFORE UPDATE ON public.trades
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();