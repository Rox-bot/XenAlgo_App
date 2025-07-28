import * as math from 'mathjs';

// Option pricing using Black-Scholes model
export interface OptionPricingParams {
  spotPrice: number;      // Current stock price
  strikePrice: number;    // Strike price
  timeToExpiry: number;   // Time to expiry in years
  riskFreeRate: number;   // Risk-free interest rate (default 0.05)
  volatility: number;     // Implied volatility
}

export interface OptionGreeks {
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
  rho: number;
}

export interface OptionPrice {
  callPrice: number;
  putPrice: number;
  greeks: {
    call: OptionGreeks;
    put: OptionGreeks;
  };
}

// Standard normal distribution functions
function normalCDF(x: number): number {
  return 0.5 * (1 + math.erf(x / Math.sqrt(2)));
}

function normalPDF(x: number): number {
  return (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * x * x);
}

// Calculate d1 and d2 for Black-Scholes
function calculateD1D2(params: OptionPricingParams): { d1: number; d2: number } {
  const { spotPrice, strikePrice, timeToExpiry, riskFreeRate, volatility } = params;
  
  const d1 = (Math.log(spotPrice / strikePrice) + (riskFreeRate + 0.5 * volatility * volatility) * timeToExpiry) / (volatility * Math.sqrt(timeToExpiry));
  const d2 = d1 - volatility * Math.sqrt(timeToExpiry);
  
  return { d1, d2 };
}

// Black-Scholes option pricing
export function calculateOptionPrice(params: OptionPricingParams): OptionPrice {
  const { spotPrice, strikePrice, timeToExpiry, riskFreeRate, volatility } = params;
  const { d1, d2 } = calculateD1D2(params);
  
  // Call option price
  const callPrice = spotPrice * normalCDF(d1) - strikePrice * Math.exp(-riskFreeRate * timeToExpiry) * normalCDF(d2);
  
  // Put option price (using put-call parity)
  const putPrice = callPrice - spotPrice + strikePrice * Math.exp(-riskFreeRate * timeToExpiry);
  
  // Calculate Greeks
  const callGreeks = calculateCallGreeks(params, d1, d2);
  const putGreeks = calculatePutGreeks(params, d1, d2);
  
  return {
    callPrice,
    putPrice,
    greeks: {
      call: callGreeks,
      put: putGreeks
    }
  };
}

// Calculate Greeks for call options
function calculateCallGreeks(params: OptionPricingParams, d1: number, d2: number): OptionGreeks {
  const { spotPrice, strikePrice, timeToExpiry, riskFreeRate, volatility } = params;
  
  const delta = normalCDF(d1);
  const gamma = normalPDF(d1) / (spotPrice * volatility * Math.sqrt(timeToExpiry));
  const theta = (-spotPrice * normalPDF(d1) * volatility) / (2 * Math.sqrt(timeToExpiry)) - riskFreeRate * strikePrice * Math.exp(-riskFreeRate * timeToExpiry) * normalCDF(d2);
  const vega = spotPrice * normalPDF(d1) * Math.sqrt(timeToExpiry);
  const rho = strikePrice * timeToExpiry * Math.exp(-riskFreeRate * timeToExpiry) * normalCDF(d2);
  
  return { delta, gamma, theta, vega, rho };
}

// Calculate Greeks for put options
function calculatePutGreeks(params: OptionPricingParams, d1: number, d2: number): OptionGreeks {
  const { spotPrice, strikePrice, timeToExpiry, riskFreeRate, volatility } = params;
  
  const delta = normalCDF(d1) - 1;
  const gamma = normalPDF(d1) / (spotPrice * volatility * Math.sqrt(timeToExpiry));
  const theta = (-spotPrice * normalPDF(d1) * volatility) / (2 * Math.sqrt(timeToExpiry)) + riskFreeRate * strikePrice * Math.exp(-riskFreeRate * timeToExpiry) * normalCDF(-d2);
  const vega = spotPrice * normalPDF(d1) * Math.sqrt(timeToExpiry);
  const rho = -strikePrice * timeToExpiry * Math.exp(-riskFreeRate * timeToExpiry) * normalCDF(-d2);
  
  return { delta, gamma, theta, vega, rho };
}

// Calculate implied volatility using Newton-Raphson method
export function calculateImpliedVolatility(
  optionPrice: number,
  isCall: boolean,
  spotPrice: number,
  strikePrice: number,
  timeToExpiry: number,
  riskFreeRate: number = 0.05,
  tolerance: number = 0.0001,
  maxIterations: number = 100
): number {
  let volatility = 0.3; // Initial guess
  
  for (let i = 0; i < maxIterations; i++) {
    const params: OptionPricingParams = {
      spotPrice,
      strikePrice,
      timeToExpiry,
      riskFreeRate,
      volatility
    };
    
    const price = isCall ? calculateOptionPrice(params).callPrice : calculateOptionPrice(params).putPrice;
    const vega = isCall ? calculateCallGreeks(params, calculateD1D2(params).d1, calculateD1D2(params).d2).vega : calculatePutGreeks(params, calculateD1D2(params).d1, calculateD1D2(params).d2).vega;
    
    const diff = optionPrice - price;
    
    if (Math.abs(diff) < tolerance) {
      return volatility;
    }
    
    volatility = volatility + diff / vega;
    
    // Ensure volatility stays positive
    if (volatility <= 0) {
      volatility = 0.01;
    }
  }
  
  return volatility;
}

// Calculate time to expiry in years
export function calculateTimeToExpiry(expiryDate: Date): number {
  const now = new Date();
  const diffInMs = expiryDate.getTime() - now.getTime();
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
  return diffInDays / 365; // Convert to years
}

// Calculate option chain data for a given stock
export function generateOptionChain(
  spotPrice: number,
  expiryDate: Date,
  strikes: number[],
  volatility: number = 0.3,
  riskFreeRate: number = 0.05
) {
  const timeToExpiry = calculateTimeToExpiry(expiryDate);
  
  return strikes.map(strike => {
    const params: OptionPricingParams = {
      spotPrice,
      strikePrice: strike,
      timeToExpiry,
      riskFreeRate,
      volatility
    };
    
    const prices = calculateOptionPrice(params);
    
    return {
      strike,
      callPrice: prices.callPrice,
      putPrice: prices.putPrice,
      callGreeks: prices.greeks.call,
      putGreeks: prices.greeks.put,
      timeToExpiry,
      volatility
    };
  });
} 