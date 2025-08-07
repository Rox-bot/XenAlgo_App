export interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  currency: string;
  features: {
    [key: string]: any;
  };
  limits: {
    [key: string]: number | string;
  };
}

export interface UserSubscription {
  tier: string;
  status: 'active' | 'inactive' | 'cancelled' | 'expired';
  startDate: string;
  endDate: string;
  features: {
    [key: string]: any;
  };
  limits: {
    [key: string]: number | string;
  };
}

// Define subscription tiers based on user requirements
export const SUBSCRIPTION_TIERS: Record<string, SubscriptionTier> = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    currency: 'INR',
    features: {
      // Trading Journal
      tradingJournal: true,
      basicAnalytics: true,
      tradeCategories: false,
      exportData: false,
      
      // Calculators
      calculators: true,
      
      // Indicators
      basicIndicators: true,
      premiumIndicators: false,
      aiIndicators: false,
      
      // Courses
      basicCourses: false,
      premiumCourses: false,
      
      // AI Psychology Buddy
      aiPsychologyPool: false,
      aiPsychologyPersonal: false,
      
      // Other Features
      communityAccess: false,
      prioritySupport: false,
      customReports: false,
      apiAccess: false,
    },
    limits: {
      monthlyTrades: 15,
      tradeCategories: 0,
      exportLimit: 0,
      apiCalls: 0,
      storageLimit: '10MB',
      indicatorAccess: 'free',
      courseAccess: 'none',
    },
  },
  basic: {
    id: 'basic',
    name: 'Basic',
    price: 499, // ₹X for 100 trades
    currency: 'INR',
    features: {
      // Trading Journal
      tradingJournal: true,
      basicAnalytics: true,
      tradeCategories: true,
      exportData: true,
      
      // Calculators
      calculators: true,
      
      // Indicators
      basicIndicators: true,
      premiumIndicators: true,
      aiIndicators: false,
      
      // Courses
      basicCourses: true,
      premiumCourses: false,
      
      // AI Psychology Buddy
      aiPsychologyPool: false,
      aiPsychologyPersonal: false,
      
      // Other Features
      communityAccess: true,
      prioritySupport: false,
      customReports: false,
      apiAccess: false,
    },
    limits: {
      monthlyTrades: 100,
      tradeCategories: 5,
      exportLimit: 10,
      apiCalls: 100,
      storageLimit: '100MB',
      indicatorAccess: 'basic',
      courseAccess: 'basic',
    },
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    price: 1499, // ₹Y for unlimited trades
    currency: 'INR',
    features: {
      // Trading Journal
      tradingJournal: true,
      basicAnalytics: true,
      tradeCategories: true,
      exportData: true,
      
      // Calculators
      calculators: true,
      
      // Indicators
      basicIndicators: true,
      premiumIndicators: true,
      aiIndicators: true,
      
      // Courses
      basicCourses: true,
      premiumCourses: true,
      
      // AI Psychology Buddy
      aiPsychologyPool: true,
      aiPsychologyPersonal: false, // Requires 100+ trades
      
      // Other Features
      communityAccess: true,
      prioritySupport: true,
      customReports: true,
      apiAccess: true,
    },
    limits: {
      monthlyTrades: -1, // Unlimited
      tradeCategories: -1, // Unlimited
      exportLimit: -1, // Unlimited
      apiCalls: 5000,
      storageLimit: '1GB',
      indicatorAccess: 'premium',
      courseAccess: 'premium',
    },
  },
  elite: {
    id: 'elite',
    name: 'Elite',
    price: 2999,
    currency: 'INR',
    features: {
      // Trading Journal
      tradingJournal: true,
      basicAnalytics: true,
      tradeCategories: true,
      exportData: true,
      
      // Calculators
      calculators: true,
      
      // Indicators
      basicIndicators: true,
      premiumIndicators: true,
      aiIndicators: true,
      
      // Courses
      basicCourses: true,
      premiumCourses: true,
      
      // AI Psychology Buddy
      aiPsychologyPool: true,
      aiPsychologyPersonal: true, // Personal AI model
      
      // Other Features
      communityAccess: true,
      prioritySupport: true,
      customReports: true,
      apiAccess: true,
      whiteLabel: true,
      customIntegrations: true,
    },
    limits: {
      monthlyTrades: -1, // Unlimited
      tradeCategories: -1, // Unlimited
      exportLimit: -1, // Unlimited
      apiCalls: -1, // Unlimited
      storageLimit: '10GB',
      indicatorAccess: 'elite',
      courseAccess: 'elite',
    },
  },
};

// Default subscription for new users
export const DEFAULT_SUBSCRIPTION: UserSubscription = {
  tier: 'free',
  status: 'active',
  startDate: new Date().toISOString(),
  endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
  features: SUBSCRIPTION_TIERS.free.features,
  limits: SUBSCRIPTION_TIERS.free.limits,
};

// Utility functions
export function hasFeature(subscription: UserSubscription, feature: string): boolean {
  return subscription.features[feature] === true;
}

export function getLimit(subscription: UserSubscription, limit: string): number {
  const value = subscription.limits[limit];
  return typeof value === 'number' ? value : 0;
}

export function isUnlimited(subscription: UserSubscription, limit: string): boolean {
  return getLimit(subscription, limit) === -1;
}

export function canAddTrade(subscription: UserSubscription, currentMonthTrades: number): boolean {
  const monthlyLimit = getLimit(subscription, 'monthlyTrades');
  return isUnlimited(subscription, 'monthlyTrades') || currentMonthTrades < monthlyLimit;
}

export function canCreateCategory(subscription: UserSubscription, currentCategories: number): boolean {
  const categoryLimit = getLimit(subscription, 'tradeCategories');
  return isUnlimited(subscription, 'tradeCategories') || currentCategories < categoryLimit;
}

export function canAccessIndicator(subscription: UserSubscription, indicatorAccess: 'free' | 'premium' | 'ai'): boolean {
  const userAccess = subscription.limits.indicatorAccess;
  
  switch (indicatorAccess) {
    case 'free':
      return true;
    case 'premium':
      return userAccess === 'basic' || userAccess === 'premium' || userAccess === 'elite';
    case 'ai':
      return userAccess === 'premium' || userAccess === 'elite';
    default:
      return false;
  }
}

export function canAccessCourse(subscription: UserSubscription, courseAccess: 'basic' | 'premium'): boolean {
  const userAccess = subscription.limits.courseAccess;
  
  switch (courseAccess) {
    case 'basic':
      return userAccess === 'basic' || userAccess === 'premium' || userAccess === 'elite';
    case 'premium':
      return userAccess === 'premium' || userAccess === 'elite';
    default:
      return false;
  }
}

export function canAccessAIPsychology(subscription: UserSubscription, type: 'pool' | 'personal', tradeCount: number = 0): boolean {
  if (type === 'pool') {
    return hasFeature(subscription, 'aiPsychologyPool');
  } else if (type === 'personal') {
    return hasFeature(subscription, 'aiPsychologyPersonal') && tradeCount >= 100;
  }
  return false;
}

export function getUpgradeMessage(currentTier: string, feature: string): string {
  const tiers = Object.values(SUBSCRIPTION_TIERS);
  const currentTierData = tiers.find(t => t.id === currentTier);
  const nextTier = tiers.find(t => t.id !== currentTier && t.price > (currentTierData?.price || 0));
  
  if (!nextTier) return 'Feature not available';
  
  return `Upgrade to ${nextTier.name} (₹${nextTier.price}/month) to access this feature`;
}

export function getTierByPrice(price: number): SubscriptionTier | null {
  return Object.values(SUBSCRIPTION_TIERS).find(tier => tier.price === price) || null;
}

// Trading Journal specific functions
export function getTradingJournalUpgradeMessage(currentTrades: number): string {
  if (currentTrades < 15) {
    return 'You have free trades remaining';
  } else if (currentTrades < 100) {
    return 'Upgrade to Basic (₹499/month) for 100 trades';
  } else {
    return 'Upgrade to Premium (₹1499/month) for unlimited trades';
  }
}

export function getTradingJournalStatus(currentTrades: number, subscription: UserSubscription): {
  canAdd: boolean;
  message: string;
  upgradeRequired: boolean;
} {
  const monthlyLimit = getLimit(subscription, 'monthlyTrades');
  const canAdd = isUnlimited(subscription, 'monthlyTrades') || currentTrades < monthlyLimit;
  
  if (canAdd) {
    return {
      canAdd: true,
      message: `You can add ${isUnlimited(subscription, 'monthlyTrades') ? 'unlimited' : monthlyLimit - currentTrades} more trades this month`,
      upgradeRequired: false
    };
  } else {
    return {
      canAdd: false,
      message: 'Monthly trade limit reached. Upgrade to add more trades.',
      upgradeRequired: true
    };
  }
} 