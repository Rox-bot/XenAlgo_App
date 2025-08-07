-- Create user_purchases table
CREATE TABLE IF NOT EXISTS user_purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  indicator_id TEXT NOT NULL,
  purchase_date TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  amount INTEGER NOT NULL, -- Amount in paise
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')) NOT NULL,
  payment_id TEXT,
  download_count INTEGER DEFAULT 0 NOT NULL,
  last_download TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_purchases_user_id ON user_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_user_purchases_indicator_id ON user_purchases(indicator_id);
CREATE INDEX IF NOT EXISTS idx_user_purchases_status ON user_purchases(status);

-- Create RLS policies
ALTER TABLE user_purchases ENABLE ROW LEVEL SECURITY;

-- Users can view their own purchases
CREATE POLICY "Users can view their own purchases" ON user_purchases
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own purchases
CREATE POLICY "Users can insert their own purchases" ON user_purchases
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own purchases
CREATE POLICY "Users can update their own purchases" ON user_purchases
  FOR UPDATE USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_purchases_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_user_purchases_updated_at
  BEFORE UPDATE ON user_purchases
  FOR EACH ROW
  EXECUTE FUNCTION update_user_purchases_updated_at(); 