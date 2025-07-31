import { getRealTrendingStocks, getRealStockData, StockData } from './realStockAPIs';
import { getMockTrendingStocks, getMockStockData } from './mockStockData';

// Export the real API functions
export { getRealTrendingStocks, getRealStockData };

// Main function to get trending stocks (with fallback to mock data)
export const getTrendingStocks = async () => {
  try {
    console.log('🔄 Fetching real trending stocks...');
    const realStocks = await getRealTrendingStocks();
    
    if (realStocks && realStocks.length > 0) {
      console.log(`✅ Found ${realStocks.length} real trending stocks`);
      return realStocks;
    } else {
      console.log('⚠️ No real stocks found, using mock data');
      return getMockTrendingStocks();
    }
  } catch (error) {
    console.error('❌ Error fetching real trending stocks:', error);
    console.log('🔄 Falling back to mock data...');
    return getMockTrendingStocks();
  }
};

// Main function to get stock data (with fallback to mock data)
export const getStockData = async (symbol: string): Promise<StockData> => {
  try {
    console.log(`🔄 Fetching real data for ${symbol}...`);
    const realData = await getRealStockData(symbol);
    
    if (realData && realData.symbol) {
      console.log(`✅ Found real data for ${symbol}`);
      return realData;
    } else {
      console.log(`⚠️ No real data found for ${symbol}, using mock data`);
      return getMockStockData(symbol);
    }
  } catch (error) {
    console.error(`❌ Error fetching real data for ${symbol}:`, error);
    console.log(`🔄 Falling back to mock data for ${symbol}...`);
    return getMockStockData(symbol);
  }
};

// Get multiple stocks data
export const getMultipleStockData = async (symbols: string[]): Promise<StockData[]> => {
  const stockData: StockData[] = [];
  
  for (const symbol of symbols) {
    try {
      const data = await getStockData(symbol);
      stockData.push(data);
      
      // Add delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (error) {
      console.error(`Error fetching data for ${symbol}:`, error);
    }
  }
  
  return stockData;
};

// Get trending stocks with additional data
export const getTrendingStocksWithData = async () => {
  try {
    const trendingStocks = await getTrendingStocks();
    
    // Get additional data for each stock
    const stocksWithData = await Promise.all(
      trendingStocks.map(async (stock) => {
        try {
          const additionalData = await getStockData(stock.symbol);
          return {
            ...stock,
            ...additionalData,
          };
        } catch (error) {
          console.error(`Error getting additional data for ${stock.symbol}:`, error);
          return stock;
        }
      })
    );
    
    return stocksWithData;
  } catch (error) {
    console.error('Error getting trending stocks with data:', error);
    return getMockTrendingStocks();
  }
}; 