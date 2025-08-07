import { getRealTrendingStocks, getRealStockData, StockData } from './realStockAPIs';
import { getDhanHQTrendingStocks, getDhanHQStockData, DhanHQStockData, DhanHQTrendingStock } from './dhanHQAPI';

// Export the real API functions
export { getRealTrendingStocks, getRealStockData };

// Main function to get trending stocks (no mock fallback)
export const getTrendingStocks = async () => {
  try {
    console.log('🔄 Fetching DhanHQ trending stocks...');
    const dhanhqStocks = await getDhanHQTrendingStocks();
    
    if (dhanhqStocks && dhanhqStocks.length > 0) {
      console.log(`✅ Found ${dhanhqStocks.length} DhanHQ trending stocks`);
      return dhanhqStocks;
    } else {
      console.log('⚠️ No DhanHQ stocks found, trying real API...');
      const realStocks = await getRealTrendingStocks();
      
      if (realStocks && realStocks.length > 0) {
        console.log(`✅ Found ${realStocks.length} real trending stocks`);
        return realStocks;
      } else {
        throw new Error('No trending stocks available from any API source');
      }
    }
  } catch (error) {
    console.error('❌ Error fetching DhanHQ trending stocks:', error);
    console.log('🔄 Falling back to real API...');
    try {
      const realStocks = await getRealTrendingStocks();
      if (realStocks && realStocks.length > 0) {
        return realStocks;
      } else {
        throw new Error('No trending stocks available from any API source');
      }
    } catch (realError) {
      console.error('❌ Error fetching real trending stocks:', realError);
      throw new Error('Failed to fetch trending stocks from all available sources');
    }
  }
};

// Main function to get stock data (no mock fallback)
export const getStockData = async (symbol: string): Promise<StockData> => {
  try {
    console.log(`🔄 Fetching DhanHQ data for ${symbol}...`);
    const dhanhqData = await getDhanHQStockData(symbol);
    
    if (dhanhqData && dhanhqData.symbol) {
      console.log(`✅ Found DhanHQ data for ${symbol}`);
      return dhanhqData;
    } else {
      console.log(`⚠️ No DhanHQ data found for ${symbol}, trying real API...`);
      const realData = await getRealStockData(symbol);
      
      if (realData && realData.symbol) {
        console.log(`✅ Found real data for ${symbol}`);
        return realData;
      } else {
        throw new Error(`No data available for ${symbol} from any API source`);
      }
    }
  } catch (error) {
    console.error(`❌ Error fetching DhanHQ data for ${symbol}:`, error);
    console.log(`🔄 Falling back to real API for ${symbol}...`);
    try {
      const realData = await getRealStockData(symbol);
      if (realData && realData.symbol) {
        return realData;
      } else {
        throw new Error(`No data available for ${symbol} from any API source`);
      }
    } catch (realError) {
      console.error(`❌ Error fetching real data for ${symbol}:`, realError);
      throw new Error(`Failed to fetch data for ${symbol} from all available sources`);
    }
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
      // Continue with other symbols even if one fails
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
          return stock; // Return stock without additional data
        }
      })
    );
    
    return stocksWithData;
  } catch (error) {
    console.error('Error getting trending stocks with data:', error);
    throw new Error('Failed to fetch trending stocks with additional data');
  }
}; 