import { supabase } from '@/integrations/supabase/client';

export interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: number;
  peRatio: number;
  eps: number;
  roe: number;
  dividendYield: number;
  volume: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
}

export interface NewsItem {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: string;
}

export interface AnalysisResponse {
  summary: string;
  insights: string[];
  riskFactors: string[];
  recommendations: string[];
  dataSources: string[];
  lastUpdated: string;
}

export interface StockAnalysisResponse {
  success: boolean;
  symbol: string;
  stockData: StockData;
  newsData: NewsItem[];
  earningsData: any;
  analysis: AnalysisResponse;
}



export class StockAnalysisService {
  private static instance: StockAnalysisService;
  private cache = new Map<string, { data: StockAnalysisResponse; timestamp: number }>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  static getInstance(): StockAnalysisService {
    if (!StockAnalysisService.instance) {
      StockAnalysisService.instance = new StockAnalysisService();
    }
    return StockAnalysisService.instance;
  }

  async analyzeStock(query: string, symbol?: string): Promise<StockAnalysisResponse> {
    const cacheKey = symbol || this.extractSymbolFromQuery(query);
    
    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stock-analysis-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          query,
          symbol,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze stock');
      }

      const data: StockAnalysisResponse = await response.json();
      
      // Cache the result
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now(),
      });

      return data;
    } catch (error) {
      console.error('Stock analysis error:', error);
      throw error;
    }
  }

  private extractSymbolFromQuery(query: string): string {
    const symbolMatch = query.match(/\b[A-Z]{1,5}\b/);
    return symbolMatch ? symbolMatch[0] : '';
  }

  clearCache(symbol?: string) {
    if (symbol) {
      this.cache.delete(symbol);
    } else {
      this.cache.clear();
    }
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  }

  formatNumber(value: number): string {
    return new Intl.NumberFormat('en-US').format(value);
  }

  formatMarketCap(marketCap: number): string {
    if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(2)}T`;
    if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`;
    if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`;
    return this.formatCurrency(marketCap);
  }

  getPriceChangeColor(change: number): string {
    return change >= 0 ? 'text-green-600' : 'text-red-600';
  }

  getPriceChangeIcon(change: number): 'trending-up' | 'trending-down' {
    return change >= 0 ? 'trending-up' : 'trending-down';
  }

  validateSymbol(symbol: string): boolean {
    // Basic validation for stock symbols
    return /^[A-Z]{1,5}$/.test(symbol);
  }

  async getPopularStocks(): Promise<string[]> {
    // Return a list of popular stocks for suggestions
    return [
      'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX',
      'JPM', 'JNJ', 'PG', 'UNH', 'HD', 'DIS', 'PYPL', 'ADBE'
    ];
  }

  async getRecentSearches(): Promise<string[]> {
    try {
      const { data: searches } = await supabase
        .from('recent_stock_searches')
        .select('symbol')
        .order('created_at', { ascending: false })
        .limit(10);

      return searches?.map(s => s.symbol) || [];
    } catch (error) {
      console.error('Error fetching recent searches:', error);
      return [];
    }
  }

  async saveSearch(symbol: string): Promise<void> {
    try {
      await supabase
        .from('recent_stock_searches')
        .upsert({
          symbol: symbol.toUpperCase(),
          created_at: new Date().toISOString(),
        });
    } catch (error) {
      console.error('Error saving search:', error);
    }
  }
}

export const stockAnalysisService = StockAnalysisService.getInstance(); 