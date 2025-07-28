import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import type { Tables } from '@/integrations/supabase/types';
import { 
  hasFeature, 
  getLimit, 
  isUnlimited, 
  canAddTrade, 
  canCreateCategory,
  getUpgradeMessage,
  DEFAULT_SUBSCRIPTION,
  type UserSubscription 
} from '@/lib/subscription';

interface SubscriptionContextType {
  subscription: UserSubscription | null;
  loading: boolean;
  hasFeature: (feature: string) => boolean;
  getLimit: (limit: string) => number;
  isUnlimited: (limit: string) => boolean;
  canAddTrade: (currentMonthTrades: number) => boolean;
  canCreateCategory: (currentCategories: number) => boolean;
  getUpgradeMessage: (feature: string) => string;
  currentUsage: {
    monthlyTrades: number;
    categories: number;
  };
  refetch: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUsage, setCurrentUsage] = useState({
    monthlyTrades: 0,
    categories: 0,
  });

  const createDefaultSubscription = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .insert([{
          user_id: userId,
          tier_id: 'free',
          status: 'active',
          start_date: new Date().toISOString(),
          end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          features: DEFAULT_SUBSCRIPTION.features,
          limits: DEFAULT_SUBSCRIPTION.limits,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error creating default subscription:', error);
      return null;
    }
  };

  const loadSubscription = async () => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setSubscription({
          tier: data.tier_id,
          status: data.status as any,
          startDate: data.start_date,
          endDate: data.end_date,
          features: data.features as any,
          limits: data.limits as any,
        });
      } else {
        // If no subscription exists, create one
        const newSubscription = await createDefaultSubscription(user.id);
        if (newSubscription) {
          setSubscription({
            tier: newSubscription.tier_id,
            status: newSubscription.status as any,
            startDate: newSubscription.start_date,
            endDate: newSubscription.end_date,
            features: newSubscription.features as any,
            limits: newSubscription.limits as any,
          });
        } else {
          // Fallback to default subscription
          setSubscription(DEFAULT_SUBSCRIPTION);
        }
      }
    } catch (error: any) {
      console.error('Error loading subscription:', error);
      // On error, use default free subscription
      setSubscription(DEFAULT_SUBSCRIPTION);
    } finally {
      setLoading(false);
    }
  };

  const loadUsage = async () => {
    if (!user) return;

    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      
      // Get monthly trades count for current month
      const { data: tradesData } = await supabase
        .from('trades')
        .select('id')
        .eq('user_id', user.id)
        .gte('created_at', startOfMonth.toISOString())
        .lte('created_at', endOfMonth.toISOString());

      // Get categories count
      const { data: categoriesData } = await supabase
        .from('trade_categories')
        .select('id')
        .eq('user_id', user.id);

      setCurrentUsage({
        monthlyTrades: tradesData?.length || 0,
        categories: categoriesData?.length || 0,
      });

      console.log('Usage tracking:', {
        user: user.id,
        monthlyTrades: tradesData?.length || 0,
        startOfMonth: startOfMonth.toISOString(),
        endOfMonth: endOfMonth.toISOString(),
        tradesData: tradesData
      });
    } catch (error: any) {
      console.error('Error loading usage:', error);
    }
  };

  useEffect(() => {
    if (user) {
      loadSubscription();
      loadUsage();
    } else {
      setSubscription(null);
      setCurrentUsage({ monthlyTrades: 0, categories: 0 });
      setLoading(false);
    }
  }, [user]);

  const contextValue: SubscriptionContextType = {
    subscription,
    loading,
    hasFeature: (feature: string) => subscription ? hasFeature(subscription, feature) : false,
    getLimit: (limit: string) => subscription ? getLimit(subscription, limit) : 0,
    isUnlimited: (limit: string) => subscription ? isUnlimited(subscription, limit) : false,
    canAddTrade: (currentMonthTrades: number) => subscription ? canAddTrade(subscription, currentMonthTrades) : false,
    canCreateCategory: (currentCategories: number) => subscription ? canCreateCategory(subscription, currentCategories) : false,
    getUpgradeMessage: (feature: string) => subscription ? getUpgradeMessage(subscription.tier, feature) : 'Feature not available',
    currentUsage,
    refetch: async () => {
      await loadSubscription();
      await loadUsage();
    },
  };

  return (
    <SubscriptionContext.Provider value={contextValue}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
} 