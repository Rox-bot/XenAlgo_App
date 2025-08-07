// Blog Automation Script
// Automatically generates and publishes daily blogs from trending stocks

import { getTrendingStocks, getStockData } from './trendingStocks';
import { generateDailyBlogs, type GeneratedBlog } from './aiBlogGenerator';

export interface BlogSchedule {
  time: string; // "09:00", "14:00", "18:00"
  blogType: 'technical' | 'news' | 'analysis';
  description: string;
}

export const DAILY_SCHEDULE: BlogSchedule[] = [
  {
    time: "09:00",
    blogType: "technical",
    description: "Morning technical analysis with key levels"
  },
  {
    time: "14:00", 
    blogType: "news",
    description: "Afternoon news analysis and market updates"
  },
  {
    time: "18:00",
    blogType: "analysis", 
    description: "Evening comprehensive analysis and outlook"
  }
];

export interface AutomationConfig {
  enabled: boolean;
  maxBlogsPerDay: number;
  autoPublish: boolean;
  schedule: BlogSchedule[];
  targetStocks: string[]; // Specific stocks to focus on
  excludeStocks: string[]; // Stocks to avoid
}

export const DEFAULT_CONFIG: AutomationConfig = {
  enabled: true,
  maxBlogsPerDay: 3,
  autoPublish: false, // Set to true for automatic publishing
  schedule: DAILY_SCHEDULE,
  targetStocks: [], // Empty = use trending stocks
  excludeStocks: []
};

// Main automation function
export const runDailyBlogAutomation = async (config: AutomationConfig = DEFAULT_CONFIG): Promise<GeneratedBlog[]> => {
  console.log('🚀 Starting daily blog automation...');
  
  if (!config.enabled) {
    console.log('❌ Automation is disabled');
    return [];
  }

  try {
    // 1. Get trending stocks
    console.log('📈 Fetching trending stocks...');
    const trendingStocks = await getTrendingStocks();
    
    // 2. Filter stocks based on config
    let targetStocks = trendingStocks;
    if (config.targetStocks.length > 0) {
      targetStocks = trendingStocks.filter(stock => 
        config.targetStocks.includes(stock.symbol)
      );
    }
    
    // Exclude unwanted stocks
    targetStocks = targetStocks.filter(stock => 
      !config.excludeStocks.includes(stock.symbol)
    );
    
    console.log(`✅ Found ${targetStocks.length} eligible stocks`);
    
    // 3. Get detailed data for top stocks
    const topStocks = targetStocks.slice(0, config.maxBlogsPerDay);
    console.log(`📊 Getting detailed data for ${topStocks.length} stocks...`);
    
    const stockDataPromises = topStocks.map(async (stock) => {
      try {
        return await getStockData(stock.symbol);
      } catch (error) {
        console.error(`❌ Failed to get data for ${stock.symbol}:`, error);
        return null;
      }
    });
    
    const stockDataResults = await Promise.all(stockDataPromises);
    const validStockData = stockDataResults.filter(data => data !== null);
    
    if (validStockData.length === 0) {
      console.log('❌ No valid stock data available');
      return [];
    }
    
    // 4. Generate blogs
    console.log(`🤖 Generating ${validStockData.length} blogs...`);
    const blogs = await generateDailyBlogs(validStockData);
    
    console.log(`✅ Generated ${blogs.length} blogs successfully`);
    
    // 5. Auto-publish if enabled
    if (config.autoPublish) {
      console.log('📤 Auto-publishing blogs...');
      for (const blog of blogs) {
        try {
          await publishBlog(blog);
          console.log(`✅ Published: ${blog.title}`);
        } catch (error) {
          console.error(`❌ Failed to publish ${blog.title}:`, error);
        }
      }
    }
    
    return blogs;
    
  } catch (error) {
    console.error('❌ Blog automation failed:', error);
    return [];
  }
};

// Publish blog to database/website
const publishBlog = async (blog: GeneratedBlog): Promise<void> => {
  // TODO: Implement actual publishing logic
  // This could involve:
  // 1. Saving to database
  // 2. Publishing to CMS
  // 3. Sending to social media
  // 4. Email notifications
  
  console.log(`📝 Publishing blog: ${blog.title}`);
  
  // Simulate publishing delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Update blog status
  blog.status = 'published';
  
  console.log(`✅ Blog published: ${blog.title}`);
};

// Check if it's time to run automation
export const shouldRunAutomation = (schedule: BlogSchedule[]): boolean => {
  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5); // "HH:MM"
  
  return schedule.some(item => item.time === currentTime);
};

// Get next scheduled time
export const getNextScheduledTime = (schedule: BlogSchedule[]): string => {
  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5);
  
  const sortedSchedule = schedule.sort((a, b) => a.time.localeCompare(b.time));
  const nextScheduled = sortedSchedule.find(item => item.time > currentTime);
  
  return nextScheduled?.time || sortedSchedule[0]?.time || '09:00';
};

// Monitor automation status
export const getAutomationStatus = (config: AutomationConfig) => {
  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5);
  const nextTime = getNextScheduledTime(config.schedule);
  
  return {
    enabled: config.enabled,
    currentTime,
    nextScheduledTime: nextTime,
    maxBlogsPerDay: config.maxBlogsPerDay,
    autoPublish: config.autoPublish,
    schedule: config.schedule
  };
};

// Manual trigger for testing
export const triggerManualGeneration = async (stockSymbols: string[] = []): Promise<GeneratedBlog[]> => {
  console.log('🔧 Manual blog generation triggered');
  
  const config: AutomationConfig = {
    ...DEFAULT_CONFIG,
    maxBlogsPerDay: stockSymbols.length || 3,
    autoPublish: false
  };
  
  if (stockSymbols.length > 0) {
    config.targetStocks = stockSymbols;
  }
  
  return await runDailyBlogAutomation(config);
};

// Export for use in components
export { DEFAULT_CONFIG }; 