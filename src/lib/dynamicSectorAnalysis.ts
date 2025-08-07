// Dynamic Sector Analysis for Indian Stock Market
// Analyzes sectors based on performance metrics and returns top stocks

import { makeProxyRequest, shouldUseProxy, API_CONFIG } from './apiConfig';

// Types for dynamic sector analysis
export interface SectorPerformance {
  sector: string;
  avgChangePercent: number;
  avgVolume: number;
  totalMarketCap: number;
  stockCount: number;
  performanceScore: number;
  topStocks: any[];
}

export interface DynamicSectorResult {
  topSectors: SectorPerformance[];
  allSectorData: SectorPerformance[];
  topStocks: any[];
  totalStocks: number;
  totalSectors: number;
}

// Extended stock list for comprehensive sector coverage
const EXTENDED_INDIAN_STOCKS = [
  // Technology (8 stocks)
  'TCS', 'INFY', 'WIPRO', 'HCLTECH', 'TECHM', 'MINDTREE', 'LTI', 'MPHASIS',
  
  // Banking & Financial (8 stocks)
  'HDFCBANK', 'ICICIBANK', 'SBIN', 'KOTAKBANK', 'AXISBANK', 'INDUSINDBK', 'PNB', 'BANKBARODA',
  
  // Oil & Gas (8 stocks)
  'RELIANCE', 'ONGC', 'BPCL', 'HPCL', 'IOC', 'GAIL', 'OIL', 'PETRONET',
  
  // Pharmaceuticals (8 stocks)
  'SUNPHARMA', 'DRREDDY', 'CIPLA', 'DIVISLAB', 'APOLLOHOSP', 'BIOCON', 'ALKEM', 'TORRENTPHARMA',
  
  // Automobiles (8 stocks)
  'MARUTI', 'TATAMOTORS', 'M&M', 'HEROMOTOCO', 'BAJAJ-AUTO', 'ASHOKLEY', 'EICHERMOT', 'TVSMOTOR',
  
  // Consumer Goods (8 stocks)
  'HINDUNILVR', 'ITC', 'NESTLEIND', 'BRITANNIA', 'DABUR', 'MARICO', 'COLPAL', 'GODREJCP',
  
  // Metals & Mining (8 stocks)
  'TATASTEEL', 'JSWSTEEL', 'HINDALCO', 'VEDL', 'COALINDIA', 'NMDC', 'HINDCOPPER', 'NATIONALUM',
  
  // Power & Energy (8 stocks)
  'NTPC', 'POWERGRID', 'TATAPOWER', 'ADANIPOWER', 'CESC', 'TORRENTPOWER', 'NHPC', 'SJVN'
];

// Sector classification mapping
const SECTOR_MAPPING: { [key: string]: string } = {
  // Technology
  'TCS': 'Technology', 'INFY': 'Technology', 'WIPRO': 'Technology', 'HCLTECH': 'Technology',
  'TECHM': 'Technology', 'MINDTREE': 'Technology', 'LTI': 'Technology', 'MPHASIS': 'Technology',
  
  // Banking & Financial
  'HDFCBANK': 'Banking', 'ICICIBANK': 'Banking', 'SBIN': 'Banking', 'KOTAKBANK': 'Banking',
  'AXISBANK': 'Banking', 'INDUSINDBK': 'Banking', 'PNB': 'Banking', 'BANKBARODA': 'Banking',
  
  // Oil & Gas
  'RELIANCE': 'Oil & Gas', 'ONGC': 'Oil & Gas', 'BPCL': 'Oil & Gas', 'HPCL': 'Oil & Gas',
  'IOC': 'Oil & Gas', 'GAIL': 'Oil & Gas', 'OIL': 'Oil & Gas', 'PETRONET': 'Oil & Gas',
  
  // Pharmaceuticals
  'SUNPHARMA': 'Pharmaceuticals', 'DRREDDY': 'Pharmaceuticals', 'CIPLA': 'Pharmaceuticals',
  'DIVISLAB': 'Pharmaceuticals', 'APOLLOHOSP': 'Pharmaceuticals', 'BIOCON': 'Pharmaceuticals',
  'ALKEM': 'Pharmaceuticals', 'TORRENTPHARMA': 'Pharmaceuticals',
  
  // Automobiles
  'MARUTI': 'Automobiles', 'TATAMOTORS': 'Automobiles', 'M&M': 'Automobiles',
  'HEROMOTOCO': 'Automobiles', 'BAJAJ-AUTO': 'Automobiles', 'ASHOKLEY': 'Automobiles',
  'EICHERMOT': 'Automobiles', 'TVSMOTOR': 'Automobiles',
  
  // Consumer Goods
  'HINDUNILVR': 'Consumer Goods', 'ITC': 'Consumer Goods', 'NESTLEIND': 'Consumer Goods',
  'BRITANNIA': 'Consumer Goods', 'DABUR': 'Consumer Goods', 'MARICO': 'Consumer Goods',
  'COLPAL': 'Consumer Goods', 'GODREJCP': 'Consumer Goods',
  
  // Metals & Mining
  'TATASTEEL': 'Metals & Mining', 'JSWSTEEL': 'Metals & Mining', 'HINDALCO': 'Metals & Mining',
  'VEDL': 'Metals & Mining', 'COALINDIA': 'Metals & Mining', 'NMDC': 'Metals & Mining',
  'HINDCOPPER': 'Metals & Mining', 'NATIONALUM': 'Metals & Mining',
  
  // Power & Energy
  'NTPC': 'Power & Energy', 'POWERGRID': 'Power & Energy', 'TATAPOWER': 'Power & Energy',
  'ADANIPOWER': 'Power & Energy', 'CESC': 'Power & Energy', 'TORRENTPOWER': 'Power & Energy',
  'NHPC': 'Power & Energy', 'SJVN': 'Power & Energy'
};

// Get stock data from DhanHQ via proxy
const getStockDataFromProxy = async (symbol: string) => {
  try {
    const data = await makeProxyRequest('/dhanhq/quote', {
      method: 'POST',
      body: JSON.stringify({ symbol }),
    });
    return data;
  } catch (error) {
    console.error(`Error fetching data for ${symbol}:`, error);
    return null;
  }
};

// Get all stocks with sector classification for dynamic analysis
export const getAllStocksWithSectors = async (): Promise<any[]> => {
  try {
    // Use proxy service for sector analysis
    if (shouldUseProxy()) {
      console.log('🔄 Fetching sector analysis from proxy...');
      const data = await makeProxyRequest('/dhanhq/sectors/analysis', {
        method: 'POST',
        body: JSON.stringify({}),
      });
      
      if (data && data.topStocks) {
        console.log(`✅ Received ${data.topStocks.length} stocks from ${data.totalSectors} sectors`);
        return data.topStocks;
      }
    }
    
    // Fallback to individual stock fetching
    const allStocks: any[] = [];
    
    console.log(`🔄 Fetching data for ${EXTENDED_INDIAN_STOCKS.length} stocks across sectors...`);
    
    for (const symbol of EXTENDED_INDIAN_STOCKS) {
      try {
        const stockData = await getStockDataFromProxy(symbol);
        if (stockData) {
          const sector = SECTOR_MAPPING[symbol] || stockData.sector || 'Others';
          
          allStocks.push({
            symbol: stockData.symbol,
            price: stockData.price,
            change: stockData.change,
            changePercent: stockData.changePercent,
            volume: stockData.volume,
            marketCap: stockData.marketCap,
            mentions: 0, // Will be calculated from real data if available
            timestamp: stockData.timestamp,
            companyName: stockData.companyName,
            sector: sector
          });
        }
        
        // Add delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Error fetching data for ${symbol}:`, error);
      }
    }
    
    console.log(`✅ Successfully fetched ${allStocks.length} stocks`);
    return allStocks;
  } catch (error) {
    console.error('Error in getAllStocksWithSectors:', error);
    throw error;
  }
};

// Calculate sector performance metrics
export const calculateSectorPerformance = (stocks: any[]): SectorPerformance[] => {
  const sectorGroups: { [sector: string]: any[] } = {};
  
  // Group stocks by sector
  stocks.forEach(stock => {
    const sector = stock.sector || 'Others';
    if (!sectorGroups[sector]) {
      sectorGroups[sector] = [];
    }
    sectorGroups[sector].push(stock);
  });
  
  // Calculate performance metrics for each sector
  const sectorPerformances: SectorPerformance[] = Object.entries(sectorGroups).map(([sector, sectorStocks]) => {
    const avgChangePercent = sectorStocks.reduce((sum, stock) => sum + stock.changePercent, 0) / sectorStocks.length;
    const avgVolume = sectorStocks.reduce((sum, stock) => sum + stock.volume, 0) / sectorStocks.length;
    const totalMarketCap = sectorStocks.reduce((sum, stock) => sum + stock.marketCap, 0);
    
    // Sort stocks within sector by performance
    const topStocks = sectorStocks
      .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
      .slice(0, 3);
    
    // Calculate performance score (weighted combination)
    const performanceScore = (
      (Math.abs(avgChangePercent) * 0.4) + // 40% weight to volatility
      (avgVolume / 1000000 * 0.3) + // 30% weight to volume (normalized)
      (totalMarketCap / 1000000000000 * 0.3) // 30% weight to market cap (normalized)
    );
    
    return {
      sector,
      avgChangePercent,
      avgVolume,
      totalMarketCap,
      stockCount: sectorStocks.length,
      performanceScore,
      topStocks
    };
  });
  
  // Sort sectors by performance score
  return sectorPerformances.sort((a, b) => b.performanceScore - a.performanceScore);
};

// Get top 3 sectors with their top 3 stocks
export const getTopSectorStocks = async (): Promise<DynamicSectorResult> => {
  try {
    console.log('🔄 Starting dynamic sector analysis...');
    
    // Try proxy service first
    if (shouldUseProxy()) {
      try {
        console.log('🔄 Using proxy service for sector analysis...');
        const data = await makeProxyRequest('/dhanhq/sectors/analysis', {
          method: 'POST',
          body: JSON.stringify({}),
        });
        
        if (data && data.topSectors && data.topStocks) {
          console.log(`✅ Received sector analysis: ${data.totalSectors} sectors, ${data.totalStocks} stocks`);
          console.log(' Top 3 Performing Sectors:');
          data.topSectors.forEach((sector: any, index: number) => {
            console.log(`${index + 1}. ${sector.sector}: Score ${sector.performanceScore.toFixed(2)}`);
            console.log(`   Top stocks: ${sector.topStocks.map((s: any) => s.symbol).join(', ')}`);
          });
          
          return {
            topSectors: data.topSectors,
            allSectorData: data.allSectorData || data.topSectors,
            topStocks: data.topStocks,
            totalStocks: data.totalStocks || data.topStocks.length,
            totalSectors: data.totalSectors || data.topSectors.length
          };
        }
      } catch (proxyError) {
        console.error('Proxy service failed, falling back to client-side analysis:', proxyError);
      }
    }
    
    // Fallback to client-side analysis
    const allStocks = await getAllStocksWithSectors();
    
    console.log(`✅ Fetched ${allStocks.length} stocks across ${new Set(allStocks.map(s => s.sector)).size} sectors`);
    
    const sectorPerformances = calculateSectorPerformance(allStocks);
    const topSectors = sectorPerformances.slice(0, 3);
    
    // Flatten top 3 stocks from each of the top 3 sectors
    const topStocks = topSectors.flatMap(sector => sector.topStocks);
    
    console.log(' Top 3 Performing Sectors:');
    topSectors.forEach((sector, index) => {
      console.log(`${index + 1}. ${sector.sector}: Score ${sector.performanceScore.toFixed(2)}`);
      console.log(`   Avg Change: ${sector.avgChangePercent.toFixed(2)}%`);
      console.log(`   Top stocks: ${sector.topStocks.map(s => s.symbol).join(', ')}`);
    });
    
    return {
      topSectors,
      allSectorData: sectorPerformances,
      topStocks,
      totalStocks: allStocks.length,
      totalSectors: sectorPerformances.length
    };
  } catch (error) {
    console.error('Error getting top sector stocks:', error);
    throw new Error('Failed to fetch and analyze sector data');
  }
};

// Get stocks by specific sector
export const getStocksBySector = async (sector: string, limit: number = 10): Promise<any[]> => {
  try {
    const allStocks = await getAllStocksWithSectors();
    const sectorStocks = allStocks.filter(stock => 
      stock.sector?.toLowerCase() === sector.toLowerCase()
    );
    
    return sectorStocks
      .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
      .slice(0, limit);
  } catch (error) {
    console.error(`Error getting stocks for sector ${sector}:`, error);
    return [];
  }
};

// Get sector-wise trending stocks
export const getSectorTrending = async (sector: string): Promise<any[]> => {
  try {
    const allStocks = await getAllStocksWithSectors();
    return allStocks.filter(stock => 
      stock.sector?.toLowerCase().includes(sector.toLowerCase())
    );
  } catch (error) {
    console.error('Error getting sector trending stocks:', error);
    return [];
  }
}; 