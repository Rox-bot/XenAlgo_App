import { supabase } from '@/integrations/supabase/client';

export interface Trade {
  id: string;
  symbol: string;
  action: 'BUY' | 'SELL';
  quantity: number;
  entry_price: number;
  exit_price?: number;
  entry_date: string;
  exit_date?: string;
  pnl?: number;
  emotion_before?: string;
  emotion_after?: string;
  reasoning?: string;
}

export interface UserBehaviorData {
  user_id: string;
  trades: Trade[];
  risk_tolerance: number; // 1-10 scale
  trading_experience: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  capital_amount: number;
  goals: string[]; // ["INCOME", "GROWTH", "PRESERVATION"]
}

export interface BehavioralAnalysis {
  user_id: string;
  risk_score: number;
  behavioral_patterns: string[];
  emotional_trends: Record<string, number>;
  performance_correlation: Record<string, number>;
  recommendations: string[];
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  confidence_score: number;
}

class TradingPsychologyAIService {
  private baseUrl: string;

  constructor() {
    // In production, this would be your Railway deployment URL
    this.baseUrl = process.env.REACT_APP_AI_SERVICE_URL || 'http://localhost:8000';
  }

  /**
   * Analyze user's trading behavior using AI
   */
  async analyzeBehavior(userId: string): Promise<BehavioralAnalysis> {
    try {
      // Fetch user's trades from Supabase
      const { data: trades, error } = await supabase
        .from('trades')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50); // Analyze last 50 trades

      if (error) {
        throw new Error(`Failed to fetch trades: ${error.message}`);
      }

      // Transform trades to match AI service format
          const transformedTrades: Trade[] = trades.map(trade => ({
      id: trade.id,
      symbol: trade.symbol,
      action: trade.trade_type as 'BUY' | 'SELL',
      quantity: trade.quantity,
      entry_price: trade.entry_price,
      exit_price: trade.exit_price,
      entry_date: trade.entry_date,
      exit_date: trade.exit_date,
      pnl: trade.exit_price ? (trade.exit_price - trade.entry_price) * trade.quantity : undefined,
      emotion_before: (trade as any).emotion_before,
      emotion_after: (trade as any).emotion_after,
      reasoning: trade.entry_reason
    })) as Trade[];

      // Get user profile data
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      // Prepare data for AI analysis
      const behaviorData: UserBehaviorData = {
        user_id: userId,
        trades: transformedTrades,
        risk_tolerance: (userProfile as any)?.risk_tolerance || 5,
        trading_experience: (userProfile as any)?.trading_experience || 'BEGINNER',
        capital_amount: (userProfile as any)?.capital_amount || 100000,
        goals: (userProfile as any)?.trading_goals || ['GROWTH']
      };

      // Call AI service
      const response = await fetch(`${this.baseUrl}/analyze-behavior`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(behaviorData)
      });

      if (!response.ok) {
        throw new Error(`AI service error: ${response.statusText}`);
      }

      const analysis: BehavioralAnalysis = await response.json();

      // Store analysis results in Supabase for tracking
      // await this.storeAnalysisResults(userId, analysis); // TODO: Add behavioral_analysis table

      return analysis;

    } catch (error) {
      console.error('Behavior analysis failed:', error);
      throw error;
    }
  }

  /**
   * Predict future behavioral patterns
   */
  async predictBehavior(userId: string): Promise<any> {
    try {
      const behaviorData = await this.prepareUserData(userId);

      const response = await fetch(`${this.baseUrl}/predict-behavior`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(behaviorData)
      });

      if (!response.ok) {
        throw new Error(`Prediction service error: ${response.statusText}`);
      }

      return await response.json();

    } catch (error) {
      console.error('Behavior prediction failed:', error);
      throw error;
    }
  }

  /**
   * Get AI service health status
   */
  async getServiceHealth(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      
      if (!response.ok) {
        throw new Error(`Health check failed: ${response.statusText}`);
      }

      return await response.json();

    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  }

  /**
   * Get model information
   */
  async getModelInfo(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/model-info`);
      
      if (!response.ok) {
        throw new Error(`Model info failed: ${response.statusText}`);
      }

      return await response.json();

    } catch (error) {
      console.error('Model info failed:', error);
      throw error;
    }
  }

  /**
   * Store analysis results in Supabase
   */
  private async storeAnalysisResults(userId: string, analysis: BehavioralAnalysis): Promise<void> {
    // TODO: Add behavioral_analysis table to Supabase
    console.log('Analysis results:', { userId, analysis });
  }

  /**
   * Prepare user data for AI analysis
   */
  private async prepareUserData(userId: string): Promise<UserBehaviorData> {
    // Fetch trades and user profile (same as analyzeBehavior)
    const { data: trades, error } = await supabase
      .from('trades')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      throw new Error(`Failed to fetch trades: ${error.message}`);
    }

    const transformedTrades: Trade[] = trades.map(trade => ({
      id: trade.id,
      symbol: trade.symbol,
      action: trade.trade_type,
      quantity: trade.quantity,
      entry_price: trade.entry_price,
      exit_price: trade.exit_price,
      entry_date: trade.entry_date,
      exit_date: trade.exit_date,
      pnl: trade.exit_price ? (trade.exit_price - trade.entry_price) * trade.quantity : undefined,
      emotion_before: trade.emotion_before,
      emotion_after: trade.emotion_after,
      reasoning: trade.entry_reason
    }));

    const { data: userProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    return {
      user_id: userId,
      trades: transformedTrades,
      risk_tolerance: userProfile?.risk_tolerance || 5,
      trading_experience: userProfile?.trading_experience || 'BEGINNER',
      capital_amount: userProfile?.capital_amount || 100000,
      goals: userProfile?.trading_goals || ['GROWTH']
    };
  }

  /**
   * Get behavioral analysis history
   */
  async getAnalysisHistory(userId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('behavioral_analysis')
        .select('*')
        .eq('user_id', userId)
        .order('analyzed_at', { ascending: false })
        .limit(10);

      if (error) {
        throw new Error(`Failed to fetch analysis history: ${error.message}`);
      }

      return data || [];

    } catch (error) {
      console.error('Failed to get analysis history:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const tradingPsychologyAI = new TradingPsychologyAIService(); 