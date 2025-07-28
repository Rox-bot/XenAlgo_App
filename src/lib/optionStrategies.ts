import { calculateOptionPrice, OptionPricingParams } from './optionPricing';

export interface OptionLeg {
  id: string;
  symbol: string;
  strike: number;
  expiry: Date;
  type: 'CALL' | 'PUT';
  action: 'BUY' | 'SELL';
  quantity: number;
  price?: number; // Market price if available
}

export interface OptionStrategy {
  id: string;
  name: string;
  description: string;
  category: 'INCOME' | 'DIRECTIONAL' | 'VOLATILITY' | 'HEDGING';
  legs: OptionLeg[];
  maxProfit: number;
  maxLoss: number;
  breakEvenPoints: number[];
  riskProfile: 'LOW' | 'MEDIUM' | 'HIGH';
  marginRequired: number;
}

export interface StrategyPayout {
  spotPrice: number;
  profit: number;
  loss: number;
  netPnl: number;
}

// Predefined strategy templates
export const STRATEGY_TEMPLATES = {
  IRON_CONDOR: {
    name: 'Iron Condor',
    description: 'Sell OTM call and put spreads for income',
    category: 'INCOME' as const,
    riskProfile: 'MEDIUM' as const,
    legs: [
      { type: 'CALL', action: 'SELL', description: 'Sell OTM Call' },
      { type: 'CALL', action: 'BUY', description: 'Buy Higher Strike Call' },
      { type: 'PUT', action: 'SELL', description: 'Sell OTM Put' },
      { type: 'PUT', action: 'BUY', description: 'Buy Lower Strike Put' }
    ]
  },
  BUTTERFLY_SPREAD: {
    name: 'Butterfly Spread',
    description: 'Limited risk, limited reward strategy',
    category: 'VOLATILITY' as const,
    riskProfile: 'LOW' as const,
    legs: [
      { type: 'CALL', action: 'BUY', description: 'Buy Lower Strike Call' },
      { type: 'CALL', action: 'SELL', description: 'Sell Middle Strike Call (x2)' },
      { type: 'CALL', action: 'BUY', description: 'Buy Higher Strike Call' }
    ]
  },
  STRADDLE: {
    name: 'Straddle',
    description: 'Buy both call and put at same strike',
    category: 'VOLATILITY' as const,
    riskProfile: 'HIGH' as const,
    legs: [
      { type: 'CALL', action: 'BUY', description: 'Buy ATM Call' },
      { type: 'PUT', action: 'BUY', description: 'Buy ATM Put' }
    ]
  },
  STRANGLE: {
    name: 'Strangle',
    description: 'Buy OTM call and put for cheaper volatility play',
    category: 'VOLATILITY' as const,
    riskProfile: 'MEDIUM' as const,
    legs: [
      { type: 'CALL', action: 'BUY', description: 'Buy OTM Call' },
      { type: 'PUT', action: 'BUY', description: 'Buy OTM Put' }
    ]
  },
  BULL_CALL_SPREAD: {
    name: 'Bull Call Spread',
    description: 'Limited risk bullish strategy',
    category: 'DIRECTIONAL' as const,
    riskProfile: 'LOW' as const,
    legs: [
      { type: 'CALL', action: 'BUY', description: 'Buy Lower Strike Call' },
      { type: 'CALL', action: 'SELL', description: 'Sell Higher Strike Call' }
    ]
  },
  BEAR_PUT_SPREAD: {
    name: 'Bear Put Spread',
    description: 'Limited risk bearish strategy',
    category: 'DIRECTIONAL' as const,
    riskProfile: 'LOW' as const,
    legs: [
      { type: 'PUT', action: 'BUY', description: 'Buy Higher Strike Put' },
      { type: 'PUT', action: 'SELL', description: 'Sell Lower Strike Put' }
    ]
  }
};

// Calculate strategy P&L at different spot prices
export function calculateStrategyPayout(
  strategy: OptionStrategy,
  spotPrices: number[],
  currentSpot: number,
  volatility: number = 0.3,
  riskFreeRate: number = 0.05
): StrategyPayout[] {
  return spotPrices.map(spotPrice => {
    let totalPnl = 0;
    
    strategy.legs.forEach(leg => {
      const timeToExpiry = (leg.expiry.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 365);
      
      if (timeToExpiry <= 0) {
        // Option expired, calculate intrinsic value
        const intrinsicValue = leg.type === 'CALL' 
          ? Math.max(0, spotPrice - leg.strike)
          : Math.max(0, leg.strike - spotPrice);
        
        const optionValue = leg.price || intrinsicValue;
        const pnl = (leg.action === 'BUY' ? 1 : -1) * leg.quantity * (optionValue - (leg.price || 0));
        totalPnl += pnl;
      } else {
        // Option not expired, use Black-Scholes
        const params: OptionPricingParams = {
          spotPrice,
          strikePrice: leg.strike,
          timeToExpiry,
          riskFreeRate,
          volatility
        };
        
        const prices = calculateOptionPrice(params);
        const optionPrice = leg.type === 'CALL' ? prices.callPrice : prices.putPrice;
        const pnl = (leg.action === 'BUY' ? 1 : -1) * leg.quantity * (optionPrice - (leg.price || 0));
        totalPnl += pnl;
      }
    });
    
    return {
      spotPrice,
      profit: Math.max(0, totalPnl),
      loss: Math.max(0, -totalPnl),
      netPnl: totalPnl
    };
  });
}

// Calculate strategy risk metrics
export function calculateStrategyRisk(strategy: OptionStrategy): {
  maxProfit: number;
  maxLoss: number;
  breakEvenPoints: number[];
  probabilityOfProfit: number;
} {
  // Generate a range of spot prices for analysis
  const minStrike = Math.min(...strategy.legs.map(leg => leg.strike));
  const maxStrike = Math.max(...strategy.legs.map(leg => leg.strike));
  const range = maxStrike - minStrike;
  
  const spotPrices = [];
  for (let i = minStrike - range; i <= maxStrike + range; i += range / 100) {
    spotPrices.push(i);
  }
  
  const payouts = calculateStrategyPayout(strategy, spotPrices, spotPrices[0]);
  
  const maxProfit = Math.max(...payouts.map(p => p.profit));
  const maxLoss = Math.max(...payouts.map(p => p.loss));
  
  // Find break-even points (where net P&L = 0)
  const breakEvenPoints = [];
  for (let i = 1; i < payouts.length; i++) {
    if ((payouts[i - 1].netPnl <= 0 && payouts[i].netPnl >= 0) ||
        (payouts[i - 1].netPnl >= 0 && payouts[i].netPnl <= 0)) {
      breakEvenPoints.push(payouts[i].spotPrice);
    }
  }
  
  // Calculate probability of profit (simplified)
  const profitablePayouts = payouts.filter(p => p.netPnl > 0);
  const probabilityOfProfit = profitablePayouts.length / payouts.length;
  
  return {
    maxProfit,
    maxLoss,
    breakEvenPoints,
    probabilityOfProfit
  };
}

// Validate strategy legs
export function validateStrategy(strategy: OptionStrategy): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (strategy.legs.length < 2) {
    errors.push('Strategy must have at least 2 legs');
  }
  
  // Check for balanced positions (for spreads)
  const callLegs = strategy.legs.filter(leg => leg.type === 'CALL');
  const putLegs = strategy.legs.filter(leg => leg.type === 'PUT');
  
  const callNet = callLegs.reduce((sum, leg) => 
    sum + (leg.action === 'BUY' ? leg.quantity : -leg.quantity), 0);
  const putNet = putLegs.reduce((sum, leg) => 
    sum + (leg.action === 'BUY' ? leg.quantity : -leg.quantity), 0);
  
  if (Math.abs(callNet) > 1 || Math.abs(putNet) > 1) {
    errors.push('Strategy has unbalanced positions');
  }
  
  // Check for valid strikes
  const strikes = strategy.legs.map(leg => leg.strike);
  if (new Set(strikes).size !== strikes.length) {
    errors.push('All legs must have different strike prices');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
} 