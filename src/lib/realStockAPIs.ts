import { makeProxyRequest, shouldUseProxy, API_CONFIG } from './apiConfig';

// Types for stock data
export interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  peRatio: number;
  eps: number;
  timestamp: string;
}

export interface TrendingStockReal {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  mentions?: number;
  timestamp: string;
}

export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: {
    name: string;
  };
}

export interface TechnicalData {
  symbol: string;
  rsi: number;
  macd: {
    macd: number;
    signal: number;
    histogram: number;
  };
  sma: {
    '20': number;
    '50': number;
    '200': number;
  };
}



// Alpha Vantage API through proxy
export const getAlphaVantageData = async (symbol: string): Promise<TechnicalData> => {
  try {
    if (shouldUseProxy()) {
      // Use proxy service
      const data = await makeProxyRequest(API_CONFIG.PROXY_SERVICE.endpoints.alphaVantage, {
        method: 'POST',
        body: JSON.stringify({ symbol }),
      });
      return data;
    } else {
      // Direct API call (fallback)
      const apiKey = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;
      if (!apiKey) {
        throw new Error('Alpha Vantage API key not configured');
      }

      const response = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`);
      if (!response.ok) {
        throw new Error(`Alpha Vantage API error: ${response.status}`);
      }
      const data = await response.json();
      
      // Process the data to extract technical indicators
      return {
        symbol,
        rsi: 0, // Will be calculated from real data
        macd: {
          macd: 0,
          signal: 0,
          histogram: 0,
        },
        sma: {
          '20': 0,
          '50': 0,
          '200': 0,
        },
      };
    }
  } catch (error) {
    console.error('Alpha Vantage API error:', error);
    throw error;
  }
};

// News API through proxy
export const getStockNews = async (symbol: string, limit: number = 10): Promise<NewsArticle[]> => {
  try {
    if (shouldUseProxy()) {
      // Use proxy service
      const data = await makeProxyRequest(API_CONFIG.PROXY_SERVICE.endpoints.news, {
        method: 'POST',
        body: JSON.stringify({ symbol, limit }),
      });
      return data.articles || [];
    } else {
      // Direct API call (fallback)
      const apiKey = import.meta.env.VITE_NEWS_API_KEY;
      if (!apiKey) {
        throw new Error('News API key not configured');
      }

      const response = await fetch(`https://newsapi.org/v2/everything?q=${symbol}&language=en&sortBy=publishedAt&pageSize=${limit}&apiKey=${apiKey}`);
      if (!response.ok) {
        throw new Error(`News API error: ${response.status}`);
      }
      const data = await response.json();
      return data.articles || [];
    }
  } catch (error) {
    console.error('News API error:', error);
    throw new Error(`Failed to fetch news for ${symbol}: ${error.message}`);
  }
};

// Get comprehensive stock data
export const getRealStockData = async (symbol: string): Promise<StockData> => {
  try {
    // Get basic quote data from DhanHQ
    const quoteData = await makeProxyRequest(API_CONFIG.PROXY_SERVICE.endpoints.dhanhq.quote, {
      method: 'POST',
      body: JSON.stringify({ symbol }),
    });
    
    // Get news
    const news = await getStockNews(symbol, 5);
    
    // Get technical data
    const technicalData = await getAlphaVantageData(symbol);
    
    return {
      symbol,
      price: quoteData.price || 0,
      change: quoteData.change || 0,
      changePercent: quoteData.changePercent || 0,
      volume: quoteData.volume || 0,
      marketCap: quoteData.marketCap || 0,
      peRatio: quoteData.peRatio || 0,
      eps: quoteData.eps || 0,
      timestamp: quoteData.timestamp || new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error getting real stock data:', error);
    throw error;
  }
};

// Get trending stocks from DhanHQ (Indian markets)
export const getDhanHQTrendingStocks = async (): Promise<TrendingStockReal[]> => {
  try {
    if (shouldUseProxy()) {
      // Use proxy service for trending stocks
      const data = await makeProxyRequest(API_CONFIG.PROXY_SERVICE.endpoints.trendingStocks, {
        method: 'POST',
        body: JSON.stringify({ limit: 10 }),
      });
      return data.trending_stocks || [];
    } else {
      // Direct API call (fallback)
      const popularIndianStocks = ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK', 'HINDUNILVR', 'ITC', 'SBIN', 'BHARTIARTL', 'KOTAKBANK'];
      const trendingStocks: TrendingStockReal[] = [];
      
      for (const symbol of popularIndianStocks) {
        try {
          const stockData = await getRealStockData(symbol);
          trendingStocks.push({
            symbol: stockData.symbol,
            price: stockData.price,
            change: stockData.change,
            changePercent: stockData.changePercent,
            volume: stockData.volume,
            marketCap: stockData.marketCap,
            timestamp: stockData.timestamp,
          });
        } catch (error) {
          console.error(`Error fetching data for ${symbol}:`, error);
        }
      }
      
      return trendingStocks;
    }
  } catch (error) {
    console.error('Error getting DhanHQ trending stocks:', error);
    return [];
  }
};

// Get trending stocks from Reddit
export const getRedditTrendingStocks = async (): Promise<TrendingStockReal[]> => {
  try {
    if (shouldUseProxy()) {
      // Use proxy service
      const data = await makeProxyRequest(API_CONFIG.PROXY_SERVICE.endpoints.reddit, {
        method: 'POST',
      });
      
      // Get real data for trending symbols
      const trendingStocks: TrendingStockReal[] = [];
      for (const stock of data.trending_stocks || []) {
        try {
          const stockData = await getRealStockData(stock.symbol);
          trendingStocks.push({
            ...stockData,
            mentions: stock.mentions,
          });
        } catch (error) {
          console.error(`Error fetching data for ${stock.symbol}:`, error);
        }
      }
      
      return trendingStocks;
    } else {
      // Direct API call (fallback)
      const response = await fetch('https://www.reddit.com/r/wallstreetbets/hot.json?limit=25');
      if (!response.ok) {
        throw new Error(`Reddit API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Extract stock mentions from titles
      const stockMentions: { [key: string]: number } = {};
      for (const post of data.data.children) {
        const title = post.data.title.toUpperCase();
        const words = title.split(' ');
        for (const word of words) {
          if (word.length <= 5 && word.match(/^[A-Z]+$/)) {
            stockMentions[word] = (stockMentions[word] || 0) + 1;
          }
        }
      }
      
      // Get top mentions
      const topMentions = Object.entries(stockMentions)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10);
      
      // Get real data for top mentions
      const trendingStocks: TrendingStockReal[] = [];
      for (const [symbol, mentions] of topMentions) {
        try {
          const stockData = await getRealStockData(symbol);
          trendingStocks.push({
            ...stockData,
            mentions,
          });
        } catch (error) {
          console.error(`Error fetching data for ${symbol}:`, error);
        }
      }
      
      return trendingStocks;
    }
  } catch (error) {
    console.error('Error getting Reddit trending stocks:', error);
    return [];
  }
};

// Get combined trending stocks
export const getRealTrendingStocks = async (): Promise<TrendingStockReal[]> => {
  try {
    const [dhanhqStocks, redditStocks] = await Promise.all([
      getDhanHQTrendingStocks(),
      getRedditTrendingStocks(),
    ]);
    
    // Combine and deduplicate
    const allStocks = [...dhanhqStocks, ...redditStocks];
    const uniqueStocks = new Map<string, TrendingStockReal>();
    
    for (const stock of allStocks) {
      if (!uniqueStocks.has(stock.symbol)) {
        uniqueStocks.set(stock.symbol, stock);
      }
    }
    
    return Array.from(uniqueStocks.values()).slice(0, 20);
  } catch (error) {
    console.error('Error getting real trending stocks:', error);
    return [];
  }
}; 