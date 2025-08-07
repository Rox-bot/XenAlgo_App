import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Trading Education Topics
const TRADING_EDUCATION_TOPICS = [
  // Technical Indicators
  "Bollinger Bands: Complete Guide to Volatility Trading",
  "MACD Indicator: Master the Momentum Oscillator", 
  "RSI (Relative Strength Index): Overbought and Oversold Signals",
  "Moving Averages: Simple vs Exponential - Which to Use?",
  "Stochastic Oscillator: Timing Your Entries Perfectly",
  "Williams %R: Advanced Momentum Analysis",
  "ADX Indicator: Measuring Trend Strength",
  "Fibonacci Retracements: Golden Ratio in Trading",
  
  // Trading Strategies
  "Swing Trading Strategies: 5-Day to 2-Week Holds",
  "Day Trading Techniques: Intraday Profit Strategies", 
  "Scalping Strategies: Quick Profits in Minutes",
  "Position Trading: Long-Term Market Analysis",
  "Breakout Trading: Catching the Big Moves",
  "Pullback Trading: Buying the Dips",
  "Range Trading: Profiting from Sideways Markets",
  
  // Market Analysis
  "Support and Resistance: Key Levels Every Trader Must Know",
  "Volume Analysis: The Hidden Market Indicator",
  "Market Psychology: Understanding Fear and Greed", 
  "Price Action Trading: Reading Candlestick Patterns",
  "Chart Patterns: Head and Shoulders, Triangles, Flags",
  "Market Structure: Higher Highs, Lower Lows",
  "Trend Analysis: Identifying Market Direction",
  
  // Risk Management
  "Position Sizing: The Key to Long-Term Success",
  "Stop Loss Strategies: Protecting Your Capital",
  "Risk-Reward Ratios: The 1:2 Rule",
  "Portfolio Management: Diversification Strategies", 
  "Money Management: Never Risk More Than 2%",
  "Drawdown Management: Surviving Losing Streaks",
  
  // Options Trading
  "Options Basics: Calls, Puts, and Strike Prices",
  "Implied Volatility: The Options Trader's Friend",
  "Options Strategies: Covered Calls and Protective Puts",
  "Iron Condors: Profiting from Sideways Markets",
  "Butterfly Spreads: Limited Risk, High Reward",
  "Options Greeks: Delta, Gamma, Theta, Vega"
]

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    return new Response(
      JSON.stringify({
        topics: TRADING_EDUCATION_TOPICS,
        total_topics: TRADING_EDUCATION_TOPICS.length,
        categories: {
          "Technical Indicators": 8,
          "Trading Strategies": 7,
          "Market Analysis": 7,
          "Risk Management": 6,
          "Options Trading": 6
        }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error getting topics:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to get topics' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
}) 