-- Add behavioral_analysis table
CREATE TABLE public.behavioral_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  risk_score DECIMAL(3,2) NOT NULL,
  behavioral_patterns JSONB NOT NULL DEFAULT '[]',
  emotional_trends JSONB NOT NULL DEFAULT '{}',
  performance_correlation JSONB NOT NULL DEFAULT '{}',
  recommendations JSONB NOT NULL DEFAULT '[]',
  risk_level VARCHAR(10) NOT NULL CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH')),
  confidence_score DECIMAL(3,2) NOT NULL,
  analyzed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_behavioral_analysis_user_id ON public.behavioral_analysis(user_id);
CREATE INDEX idx_behavioral_analysis_analyzed_at ON public.behavioral_analysis(analyzed_at);

-- Add RLS policies
ALTER TABLE public.behavioral_analysis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own behavioral analysis" ON public.behavioral_analysis
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own behavioral analysis" ON public.behavioral_analysis
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Add columns to profiles table for trading psychology
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS risk_tolerance INTEGER DEFAULT 5,
ADD COLUMN IF NOT EXISTS trading_experience VARCHAR(20) DEFAULT 'BEGINNER' CHECK (trading_experience IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED')),
ADD COLUMN IF NOT EXISTS capital_amount DECIMAL(15,2) DEFAULT 100000,
ADD COLUMN IF NOT EXISTS trading_goals JSONB DEFAULT '["GROWTH"]';

-- Add columns to trades table for emotions
ALTER TABLE public.trades 
ADD COLUMN IF NOT EXISTS emotion_before VARCHAR(50),
ADD COLUMN IF NOT EXISTS emotion_after VARCHAR(50);

-- Create function to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for behavioral_analysis
CREATE TRIGGER update_behavioral_analysis_updated_at 
    BEFORE UPDATE ON public.behavioral_analysis 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 