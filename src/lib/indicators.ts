export interface Indicator {
  id: string;
  name: string;
  description: string;
  short_description: string;
  price: number;
  original_price?: number;
  category: string;
  tags: string[];
  image_url: string;
  preview_url: string;
  download_url: string;
  file_size: string;
  version: string;
  last_updated: string;
  author: string;
  rating: number;
  review_count: number;
  sales_count: number;
  is_featured: boolean;
  is_popular: boolean;
  is_new: boolean;
  features: string[];
  requirements: string[];
  installation_guide: string;
  usage_guide: string;
  support_email: string;
  status: 'active' | 'inactive' | 'draft';
}

export interface IndicatorCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  indicator_count: number;
}

export interface UserPurchase {
  id: string;
  user_id: string;
  indicator_id: string;
  purchase_date: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  download_count: number;
  last_download: string;
}

export interface IndicatorReview {
  id: string;
  user_id: string;
  indicator_id: string;
  rating: number;
  review: string;
  created_at: string;
  updated_at: string;
}

// Sample indicator data
export const SAMPLE_INDICATORS: Indicator[] = [
  {
    id: 'rsi-divergence-pro',
    name: 'RSI Divergence Pro',
    description: 'Advanced RSI divergence detection with multiple timeframes and alert system. Perfect for identifying trend reversals and momentum shifts.',
    short_description: 'Advanced RSI divergence detection with alerts',
    price: 499,
    original_price: 799,
    category: 'Momentum',
    tags: ['RSI', 'Divergence', 'Momentum', 'Alerts'],
    image_url: '/images/indicators/rsi-divergence-pro.png',
    preview_url: '/images/indicators/rsi-divergence-pro-preview.png',
    download_url: '/downloads/rsi-divergence-pro.pine',
    file_size: '15.2 KB',
    version: '2.1.0',
    last_updated: '2024-01-15',
    author: 'XenAlgo Team',
    rating: 4.8,
    review_count: 127,
    sales_count: 342,
    is_featured: true,
    is_popular: true,
    is_new: false,
    features: [
      'Multi-timeframe divergence detection',
      'Custom alert system',
      'Visual divergence markers',
      'Backtest results included',
      '24/7 support'
    ],
    requirements: [
      'TradingView Pro account',
      'Basic Pine Script knowledge',
      'Minimum screen resolution: 1920x1080'
    ],
    installation_guide: '1. Download the .pine file\n2. Open TradingView Pine Editor\n3. Paste the code\n4. Save and apply to chart',
    usage_guide: 'The indicator will automatically detect RSI divergences and display them on your chart. Configure alerts in the settings.',
    support_email: 'support@xenalgo.com',
    status: 'active'
  },
  {
    id: 'volume-profile-master',
    name: 'Volume Profile Master',
    description: 'Professional volume profile analysis tool with volume zones, POC detection, and volume-based support/resistance levels.',
    short_description: 'Professional volume profile analysis',
    price: 699,
    original_price: 999,
    category: 'Volume',
    tags: ['Volume', 'Profile', 'POC', 'Support', 'Resistance'],
    image_url: '/images/indicators/volume-profile-master.png',
    preview_url: '/images/indicators/volume-profile-master-preview.png',
    download_url: '/downloads/volume-profile-master.pine',
    file_size: '28.7 KB',
    version: '1.5.2',
    last_updated: '2024-01-10',
    author: 'XenAlgo Team',
    rating: 4.9,
    review_count: 89,
    sales_count: 156,
    is_featured: true,
    is_popular: false,
    is_new: false,
    features: [
      'Volume Profile analysis',
      'POC (Point of Control) detection',
      'Volume zones identification',
      'Support/Resistance levels',
      'Custom timeframes'
    ],
    requirements: [
      'TradingView Pro account',
      'Volume data access',
      'Basic technical analysis knowledge'
    ],
    installation_guide: '1. Download the .pine file\n2. Open TradingView Pine Editor\n3. Paste the code\n4. Save and apply to chart',
    usage_guide: 'Apply to any chart to see volume profile analysis. Configure timeframes and settings as needed.',
    support_email: 'support@xenalgo.com',
    status: 'active'
  },
  {
    id: 'smart-money-zones',
    name: 'Smart Money Zones',
    description: 'Identify institutional money movements with advanced order flow analysis and liquidity detection.',
    short_description: 'Institutional money flow detection',
    price: 899,
    category: 'Order Flow',
    tags: ['Smart Money', 'Order Flow', 'Institutional', 'Liquidity'],
    image_url: '/images/indicators/smart-money-zones.png',
    preview_url: '/images/indicators/smart-money-zones-preview.png',
    download_url: '/downloads/smart-money-zones.pine',
    file_size: '42.1 KB',
    version: '1.0.0',
    last_updated: '2024-01-20',
    author: 'XenAlgo Team',
    rating: 5.0,
    review_count: 23,
    sales_count: 45,
    is_featured: false,
    is_popular: false,
    is_new: true,
    features: [
      'Smart money detection',
      'Liquidity analysis',
      'Order flow visualization',
      'Institutional patterns',
      'Real-time alerts'
    ],
    requirements: [
      'TradingView Pro account',
      'Advanced trading knowledge',
      'Order flow data access'
    ],
    installation_guide: '1. Download the .pine file\n2. Open TradingView Pine Editor\n3. Paste the code\n4. Save and apply to chart',
    usage_guide: 'Apply to charts to identify smart money movements and institutional patterns.',
    support_email: 'support@xenalgo.com',
    status: 'active'
  }
];

export const INDICATOR_CATEGORIES: IndicatorCategory[] = [
  {
    id: 'momentum',
    name: 'Momentum',
    description: 'RSI, MACD, Stochastic and other momentum indicators',
    icon: '📈',
    indicator_count: 8
  },
  {
    id: 'volume',
    name: 'Volume',
    description: 'Volume profile, OBV, and volume-based indicators',
    icon: '📊',
    indicator_count: 5
  },
  {
    id: 'trend',
    name: 'Trend',
    description: 'Moving averages, trend lines, and trend detection',
    icon: '📉',
    indicator_count: 6
  },
  {
    id: 'order-flow',
    name: 'Order Flow',
    description: 'Smart money, institutional patterns, and order flow',
    icon: '💰',
    indicator_count: 3
  },
  {
    id: 'support-resistance',
    name: 'Support & Resistance',
    description: 'Pivot points, Fibonacci, and key level indicators',
    icon: '🎯',
    indicator_count: 4
  }
];

// Utility functions
export function getIndicatorById(id: string): Indicator | undefined {
  return SAMPLE_INDICATORS.find(indicator => indicator.id === id);
}

export function getIndicatorsByCategory(category: string): Indicator[] {
  return SAMPLE_INDICATORS.filter(indicator => indicator.category.toLowerCase() === category.toLowerCase());
}

export function getFeaturedIndicators(): Indicator[] {
  return SAMPLE_INDICATORS.filter(indicator => indicator.is_featured);
}

export function getPopularIndicators(): Indicator[] {
  return SAMPLE_INDICATORS.filter(indicator => indicator.is_popular);
}

export function getNewIndicators(): Indicator[] {
  return SAMPLE_INDICATORS.filter(indicator => indicator.is_new);
}

export function searchIndicators(query: string): Indicator[] {
  const lowercaseQuery = query.toLowerCase();
  return SAMPLE_INDICATORS.filter(indicator => 
    indicator.name.toLowerCase().includes(lowercaseQuery) ||
    indicator.description.toLowerCase().includes(lowercaseQuery) ||
    indicator.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
} 