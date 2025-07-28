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

// Define subscription tiers
export const SUBSCRIPTION_TIERS: Record<string, SubscriptionTier> = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    currency: 'INR',
    features: {
      tradingJournal: true,
      basicAnalytics: true,
      calculators: true,
      basicIndicators: true,
      communityAccess: false,
      advancedAnalytics: false,
      unlimitedTrades: false,
      tradeCategories: false,
      exportData: false,
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
    },
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    price: 999,
    currency: 'INR',
    features: {
      tradingJournal: true,
      basicAnalytics: true,
      calculators: true,
      basicIndicators: true,
      communityAccess: true,
      advancedAnalytics: true,
      unlimitedTrades: true,
      tradeCategories: true,
      exportData: true,
      prioritySupport: true,
      customReports: true,
      apiAccess: true,
    },
    limits: {
      monthlyTrades: 100,
      tradeCategories: 10,
      exportLimit: 50,
      apiCalls: 1000,
      storageLimit: '1GB',
    },
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 1999,
    currency: 'INR',
    features: {
      tradingJournal: true,
      basicAnalytics: true,
      calculators: true,
      basicIndicators: true,
      communityAccess: true,
      advancedAnalytics: true,
      unlimitedTrades: true,
      tradeCategories: true,
      exportData: true,
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