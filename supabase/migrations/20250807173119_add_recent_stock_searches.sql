-- Create recent_stock_searches table
CREATE TABLE IF NOT EXISTS recent_stock_searches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_recent_stock_searches_user_symbol 
ON recent_stock_searches(user_id, symbol);

CREATE INDEX IF NOT EXISTS idx_recent_stock_searches_created_at 
ON recent_stock_searches(created_at DESC);

-- Enable RLS
ALTER TABLE recent_stock_searches ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (only if they don't exist)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'recent_stock_searches' AND policyname = 'Users can view their own recent searches') THEN
    CREATE POLICY "Users can view their own recent searches" ON recent_stock_searches
      FOR SELECT USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'recent_stock_searches' AND policyname = 'Users can insert their own recent searches') THEN
    CREATE POLICY "Users can insert their own recent searches" ON recent_stock_searches
      FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'recent_stock_searches' AND policyname = 'Users can update their own recent searches') THEN
    CREATE POLICY "Users can update their own recent searches" ON recent_stock_searches
      FOR UPDATE USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'recent_stock_searches' AND policyname = 'Users can delete their own recent searches') THEN
    CREATE POLICY "Users can delete their own recent searches" ON recent_stock_searches
      FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;
