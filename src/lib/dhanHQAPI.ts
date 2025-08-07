// DhanHQ API Integration for Indian Stock Market Data
// DhanHQ provides reliable Indian market data without CORS issues

import { makeProxyRequest, shouldUseProxy, API_CONFIG } from './apiConfig';

// Types for DhanHQ data
export interface DhanHQStockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  peRatio: number;
  eps: number;
  timestamp: string;
  companyName?: string;
  sector?: string;
  exchange?: string;
}

export interface DhanHQTrendingStock {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  mentions?: number;
  timestamp: string;
  companyName?: string;
  sector?: string;
}

// DhanHQ API endpoints
const DHANHQ_BASE_URL = 'https://api.dhan.co';
const DHANHQ_QUOTE_URL = `${DHANHQ_BASE_URL}/quotes/v1/quote`;
const DHANHQ_SEARCH_URL = `${DHANHQ_BASE_URL}/instruments/v1/search`;

// Popular Indian stocks for trending
const POPULAR_INDIAN_STOCKS = [
  'RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK',
  'HINDUNILVR', 'ITC', 'SBIN', 'BHARTIARTL', 'KOTAKBANK',
  'AXISBANK', 'ASIANPAINT', 'MARUTI', 'HCLTECH', 'SUNPHARMA',
  'WIPRO', 'ULTRACEMCO', 'TITAN', 'BAJFINANCE', 'NESTLEIND'
];

// Get stock quote from DhanHQ
export const getDhanHQStockData = async (symbol: string): Promise<DhanHQStockData> => {
  try {
    if (shouldUseProxy()) {
      // Use proxy service (we'll add DhanHQ endpoint to proxy)
      const data = await makeProxyRequest('/dhanhq/quote', {
        method: 'POST',
        body: JSON.stringify({ symbol }),
      });
      return data;
    } else {
      // Direct API call (fallback)
      const response = await fetch(`${DHANHQ_QUOTE_URL}?symbols=${symbol}`, {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      if (!response.ok) {
        throw new Error(`DhanHQ API error: ${response.status}`);
      }
      
      const data = await response.json();
      const quote = data.data?.[0];
      
      if (!quote) {
        throw new Error('Stock not found');
      }
      
      return {
        symbol: quote.symbol,
        price: quote.lastPrice || 0,
        change: quote.change || 0,
        changePercent: quote.changePercent || 0,
        volume: quote.volume || 0,
        marketCap: quote.marketCap || 0,
        peRatio: quote.peRatio || 0,
        eps: quote.eps || 0,
        timestamp: new Date().toISOString(),
        companyName: quote.companyName,
        sector: quote.sector,
        exchange: quote.exchange
      };
    }
  } catch (error) {
    console.error('DhanHQ API error:', error);
    throw new Error(`Failed to fetch data for ${symbol}: ${error.message}`);
  }
};

// Get trending Indian stocks
export const getDhanHQTrendingStocks = async (): Promise<DhanHQTrendingStock[]> => {
  try {
    const stocks = [];
    
    // Get data for popular Indian stocks
    for (const symbol of POPULAR_INDIAN_STOCKS.slice(0, 10)) {
      try {
        const stockData = await getDhanHQStockData(symbol);
        stocks.push({
          symbol: stockData.symbol,
          price: stockData.price,
          change: stockData.change,
          changePercent: stockData.changePercent,
          volume: stockData.volume,
          marketCap: stockData.marketCap,
          mentions: 0, // Will be calculated from real data if available
          timestamp: stockData.timestamp,
          companyName: stockData.companyName,
          sector: stockData.sector
        });
      } catch (error) {
        console.error(`Error fetching data for ${symbol}:`, error);
      }
    }
    
    // Sort by change percentage (most volatile first)
    return stocks.sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent));
    
  } catch (error) {
    console.error('Error getting DhanHQ trending stocks:', error);
    throw new Error('Failed to fetch trending stocks');
  }
};

// Search for stocks by name or symbol
export const searchDhanHQStocks = async (query: string): Promise<DhanHQStockData[]> => {
  try {
    if (shouldUseProxy()) {
      const data = await makeProxyRequest('/dhanhq/search', {
        method: 'POST',
        body: JSON.stringify({ query }),
      });
      return data;
    } else {
      const response = await fetch(`${DHANHQ_SEARCH_URL}?query=${encodeURIComponent(query)}`, {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      if (!response.ok) {
        throw new Error(`DhanHQ search error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.results?.map((item: any) => ({
        symbol: item.symbol,
        price: item.lastPrice || 0,
        change: item.change || 0,
        changePercent: item.changePercent || 0,
        volume: item.volume || 0,
        marketCap: item.marketCap || 0,
        peRatio: item.peRatio || 0,
        eps: item.eps || 0,
        timestamp: new Date().toISOString(),
        companyName: item.companyName,
        sector: item.sector,
        exchange: item.exchange
      })) || [];
    }
  } catch (error) {
    console.error('DhanHQ search error:', error);
    return [];
  }
};

// Get sector-wise trending stocks
export const getDhanHQSectorTrending = async (sector: string): Promise<DhanHQTrendingStock[]> => {
  try {
    // This would require sector-specific API calls
    // For now, we'll filter from popular stocks
    const allStocks = await getDhanHQTrendingStocks();
    return allStocks.filter(stock => 
      stock.sector?.toLowerCase().includes(sector.toLowerCase())
    );
  } catch (error) {
    console.error('Error getting sector trending stocks:', error);
    return [];
  }
}; 