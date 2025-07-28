import { OptionStrategy, STRATEGY_TEMPLATES, calculateStrategyRisk } from './optionStrategies';
import { generateOptionChain } from './optionPricing';

export interface MarketConditions {
  outlook: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  volatility: 'HIGH' | 'MEDIUM' | 'LOW';
  timeHorizon: number; // days
  riskTolerance: 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE';
  capitalAvailable: number;
  underlying: string;
  currentPrice: number;
  supportLevel?: number;
  resistanceLevel?: number;
  marketSentiment: 'FEAR' | 'GREED' | 'NEUTRAL';
}

export interface StrategyRecommendation {
  strategy: OptionStrategy;
  score: number;
  reasoning: string[];
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  expectedReturn: number;
  maxLoss: number;
  probabilityOfProfit: number;
  marketConditionMatch: number;
  suitabilityScore: number;
}

export interface StrategyScore {
  strategyName: string;
  score: number;
  reasoning: string[];
  riskRewardRatio: number;
  marketConditionMatch: number;
}

// Strategy scoring weights
const SCORING_WEIGHTS = {
  marketOutlook: 0.25,
  volatility: 0.20,
  riskTolerance: 0.20,
  timeHorizon: 0.15,
  capitalEfficiency: 0.10,
  marketSentiment: 0.10
};

// Strategy suitability matrix
const STRATEGY_SUITABILITY = {
  IRON_CONDOR: {
    bestFor: {
      outlook: ['NEUTRAL'],
      volatility: ['MEDIUM', 'LOW'],
      riskTolerance: ['MODERATE'],
      timeHorizon: [30, 45, 60],
      marketSentiment: ['NEUTRAL']
    },
    avoidFor: {
      outlook: ['BULLISH', 'BEARISH'],
      volatility: ['HIGH'],
      riskTolerance: ['AGGRESSIVE'],
      marketSentiment: ['FEAR', 'GREED']
    }
  },
  BULL_CALL_SPREAD: {
    bestFor: {
      outlook: ['BULLISH'],
      volatility: ['MEDIUM', 'LOW'],
      riskTolerance: ['CONSERVATIVE', 'MODERATE'],
      timeHorizon: [30, 45],
      marketSentiment: ['GREED', 'NEUTRAL']
    },
    avoidFor: {
      outlook: ['BEARISH', 'NEUTRAL'],
      volatility: ['HIGH'],
      riskTolerance: ['AGGRESSIVE'],
      marketSentiment: ['FEAR']
    }
  },
  BEAR_PUT_SPREAD: {
    bestFor: {
      outlook: ['BEARISH'],
      volatility: ['MEDIUM', 'LOW'],
      riskTolerance: ['CONSERVATIVE', 'MODERATE'],
      timeHorizon: [30, 45],
      marketSentiment: ['FEAR', 'NEUTRAL']
    },
    avoidFor: {
      outlook: ['BULLISH', 'NEUTRAL'],
      volatility: ['HIGH'],
      riskTolerance: ['AGGRESSIVE'],
      marketSentiment: ['GREED']
    }
  },
  STRADDLE: {
    bestFor: {
      outlook: ['NEUTRAL'],
      volatility: ['HIGH'],
      riskTolerance: ['AGGRESSIVE'],
      timeHorizon: [7, 14, 30],
      marketSentiment: ['FEAR', 'GREED']
    },
    avoidFor: {
      outlook: ['BULLISH', 'BEARISH'],
      volatility: ['LOW'],
      riskTolerance: ['CONSERVATIVE'],
      marketSentiment: ['NEUTRAL']
    }
  },
  STRANGLE: {
    bestFor: {
      outlook: ['NEUTRAL'],
      volatility: ['HIGH', 'MEDIUM'],
      riskTolerance: ['MODERATE', 'AGGRESSIVE'],
      timeHorizon: [14, 30, 45],
      marketSentiment: ['FEAR', 'GREED']
    },
    avoidFor: {
      outlook: ['BULLISH', 'BEARISH'],
      volatility: ['LOW'],
      riskTolerance: ['CONSERVATIVE'],
      marketSentiment: ['NEUTRAL']
    }
  },
  BUTTERFLY_SPREAD: {
    bestFor: {
      outlook: ['NEUTRAL'],
      volatility: ['LOW', 'MEDIUM'],
      riskTolerance: ['CONSERVATIVE', 'MODERATE'],
      timeHorizon: [30, 45, 60],
      marketSentiment: ['NEUTRAL']
    },
    avoidFor: {
      outlook: ['BULLISH', 'BEARISH'],
      volatility: ['HIGH'],
      riskTolerance: ['AGGRESSIVE'],
      marketSentiment: ['FEAR', 'GREED']
    }
  }
};

// Calculate strategy score based on market conditions
function calculateStrategyScore(
  strategyKey: string,
  conditions: MarketConditions
): StrategyScore {
  const strategy = STRATEGY_SUITABILITY[strategyKey as keyof typeof STRATEGY_SUITABILITY];
  let score = 0;
  const reasoning: string[] = [];
  
  // Market outlook scoring
  if (strategy.bestFor.outlook.includes(conditions.outlook)) {
    score += SCORING_WEIGHTS.marketOutlook;
    reasoning.push(`✅ Perfect for ${conditions.outlook.toLowerCase()} outlook`);
  } else if (strategy.avoidFor.outlook.includes(conditions.outlook)) {
    score -= SCORING_WEIGHTS.marketOutlook;
    reasoning.push(`❌ Not suitable for ${conditions.outlook.toLowerCase()} outlook`);
  } else {
    score += SCORING_WEIGHTS.marketOutlook * 0.5;
    reasoning.push(`⚠️ Neutral for ${conditions.outlook.toLowerCase()} outlook`);
  }
  
  // Volatility scoring
  if (strategy.bestFor.volatility.includes(conditions.volatility)) {
    score += SCORING_WEIGHTS.volatility;
    reasoning.push(`✅ Optimal for ${conditions.volatility.toLowerCase()} volatility`);
  } else if (strategy.avoidFor.volatility.includes(conditions.volatility)) {
    score -= SCORING_WEIGHTS.volatility;
    reasoning.push(`❌ Poor choice for ${conditions.volatility.toLowerCase()} volatility`);
  } else {
    score += SCORING_WEIGHTS.volatility * 0.5;
    reasoning.push(`⚠️ Acceptable for ${conditions.volatility.toLowerCase()} volatility`);
  }
  
  // Risk tolerance scoring
  if (strategy.bestFor.riskTolerance.includes(conditions.riskTolerance)) {
    score += SCORING_WEIGHTS.riskTolerance;
    reasoning.push(`✅ Matches your ${conditions.riskTolerance.toLowerCase()} risk profile`);
  } else if (strategy.avoidFor.riskTolerance.includes(conditions.riskTolerance)) {
    score -= SCORING_WEIGHTS.riskTolerance;
    reasoning.push(`❌ Too risky for ${conditions.riskTolerance.toLowerCase()} profile`);
  } else {
    score += SCORING_WEIGHTS.riskTolerance * 0.5;
    reasoning.push(`⚠️ Moderate risk for ${conditions.riskTolerance.toLowerCase()} profile`);
  }
  
  // Time horizon scoring
  if (strategy.bestFor.timeHorizon.includes(conditions.timeHorizon)) {
    score += SCORING_WEIGHTS.timeHorizon;
    reasoning.push(`✅ Ideal for ${conditions.timeHorizon}-day horizon`);
  } else {
    score += SCORING_WEIGHTS.timeHorizon * 0.3;
    reasoning.push(`⚠️ Suboptimal for ${conditions.timeHorizon}-day horizon`);
  }
  
  // Market sentiment scoring
  if (strategy.bestFor.marketSentiment.includes(conditions.marketSentiment)) {
    score += SCORING_WEIGHTS.marketSentiment;
    reasoning.push(`✅ Perfect for ${conditions.marketSentiment.toLowerCase()} sentiment`);
  } else if (strategy.avoidFor.marketSentiment.includes(conditions.marketSentiment)) {
    score -= SCORING_WEIGHTS.marketSentiment;
    reasoning.push(`❌ Avoid in ${conditions.marketSentiment.toLowerCase()} sentiment`);
  } else {
    score += SCORING_WEIGHTS.marketSentiment * 0.5;
    reasoning.push(`⚠️ Neutral for ${conditions.marketSentiment.toLowerCase()} sentiment`);
  }
  
  // Capital efficiency scoring
  const capitalEfficiency = Math.min(conditions.capitalAvailable / 100000, 1);
  score += SCORING_WEIGHTS.capitalEfficiency * capitalEfficiency;
  reasoning.push(`💰 Capital efficiency: ${(capitalEfficiency * 100).toFixed(0)}%`);
  
  return {
    strategyName: strategyKey,
    score: Math.max(0, Math.min(1, score)), // Normalize to 0-1
    reasoning,
    riskRewardRatio: calculateRiskRewardRatio(strategyKey, conditions),
    marketConditionMatch: score
  };
}

// Calculate risk-reward ratio for a strategy
function calculateRiskRewardRatio(strategyKey: string, conditions: MarketConditions): number {
  // This would be calculated based on actual option pricing
  // For now, using simplified ratios
  const ratios = {
    IRON_CONDOR: 0.3, // Low risk, low reward
    BULL_CALL_SPREAD: 0.4, // Moderate risk, moderate reward
    BEAR_PUT_SPREAD: 0.4, // Moderate risk, moderate reward
    STRADDLE: 0.8, // High risk, high reward
    STRANGLE: 0.6, // Medium-high risk, medium-high reward
    BUTTERFLY_SPREAD: 0.2 // Very low risk, very low reward
  };
  
  return ratios[strategyKey as keyof typeof ratios] || 0.5;
}

// Generate strategy recommendations
export function generateStrategyRecommendations(
  conditions: MarketConditions
): StrategyRecommendation[] {
  const recommendations: StrategyRecommendation[] = [];
  
  // Calculate scores for all strategies
  const strategyScores = Object.keys(STRATEGY_SUITABILITY).map(strategyKey =>
    calculateStrategyScore(strategyKey, conditions)
  );
  
  // Sort by score (highest first)
  strategyScores.sort((a, b) => b.score - a.score);
  
  // Generate actual strategy objects for top recommendations
  strategyScores.slice(0, 5).forEach((score, index) => {
    const template = STRATEGY_TEMPLATES[score.strategyName as keyof typeof STRATEGY_TEMPLATES];
    if (!template) return;
    
    // Create strategy with appropriate parameters
    const strategy: OptionStrategy = {
      id: `rec-${index}`,
      name: template.name,
      description: template.description,
      category: template.category,
      legs: template.legs.map((leg, legIndex) => ({
        id: `leg-${index}-${legIndex}`,
        symbol: conditions.underlying,
        strike: conditions.currentPrice + (legIndex - 1) * 100,
        expiry: new Date(Date.now() + conditions.timeHorizon * 24 * 60 * 60 * 1000),
        type: leg.type as 'CALL' | 'PUT',
        action: leg.action as 'BUY' | 'SELL',
        quantity: leg.type === 'CALL' && leg.action === 'SELL' && legIndex === 1 ? 2 : 1
      })),
      maxProfit: 0,
      maxLoss: 0,
      breakEvenPoints: [],
      riskProfile: template.riskProfile,
      marginRequired: conditions.capitalAvailable * 0.1
    };
    
    // Calculate risk metrics
    const riskMetrics = calculateStrategyRisk(strategy);
    
    recommendations.push({
      strategy,
      score: score.score,
      reasoning: score.reasoning,
      riskLevel: score.score > 0.7 ? 'LOW' : score.score > 0.4 ? 'MEDIUM' : 'HIGH',
      expectedReturn: riskMetrics.maxProfit,
      maxLoss: riskMetrics.maxLoss,
      probabilityOfProfit: riskMetrics.probabilityOfProfit,
      marketConditionMatch: score.marketConditionMatch,
      suitabilityScore: score.score
    });
  });
  
  return recommendations;
}

// Get market condition insights
export function getMarketInsights(conditions: MarketConditions): {
  summary: string;
  recommendations: string[];
  warnings: string[];
} {
  const insights = {
    summary: '',
    recommendations: [] as string[],
    warnings: [] as string[]
  };
  
  // Generate summary
  insights.summary = `Based on your ${conditions.outlook.toLowerCase()} outlook with ${conditions.volatility.toLowerCase()} volatility, we recommend ${conditions.riskTolerance.toLowerCase()} risk strategies.`;
  
  // Generate recommendations
  if (conditions.outlook === 'NEUTRAL' && conditions.volatility === 'HIGH') {
    insights.recommendations.push('Consider volatility-based strategies like straddles or strangles');
  }
  
  if (conditions.riskTolerance === 'CONSERVATIVE') {
    insights.recommendations.push('Focus on defined-risk strategies with limited downside');
  }
  
  if (conditions.timeHorizon < 30) {
    insights.warnings.push('Short time horizons increase theta decay risk');
  }
  
  if (conditions.capitalAvailable < 50000) {
    insights.warnings.push('Limited capital may restrict strategy choices');
  }
  
  return insights;
}

// Get volatility-based strategy suggestions
export function getVolatilityStrategies(volatility: 'HIGH' | 'MEDIUM' | 'LOW'): string[] {
  const strategies = {
    HIGH: ['Straddle', 'Strangle', 'Iron Condor'],
    MEDIUM: ['Iron Condor', 'Butterfly Spread', 'Strangle'],
    LOW: ['Iron Condor', 'Butterfly Spread', 'Credit Spreads']
  };
  
  return strategies[volatility];
}

// Get outlook-based strategy suggestions
export function getOutlookStrategies(outlook: 'BULLISH' | 'BEARISH' | 'NEUTRAL'): string[] {
  const strategies = {
    BULLISH: ['Bull Call Spread', 'Covered Call', 'Cash Secured Put'],
    BEARISH: ['Bear Put Spread', 'Protective Put', 'Cash Secured Put'],
    NEUTRAL: ['Iron Condor', 'Butterfly Spread', 'Straddle']
  };
  
  return strategies[outlook];
} 