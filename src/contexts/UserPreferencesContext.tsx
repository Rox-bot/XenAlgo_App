import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import type { Tables } from '@/integrations/supabase/types';

type UserPreferences = Tables<'user_preferences'>;

interface UserPreferencesContextType {
  preferences: UserPreferences | null;
  loading: boolean;
  updatePreferences: (updates: Partial<UserPreferences>) => Promise<void>;
  setTheme: (theme: 'light' | 'dark' | 'system') => Promise<void>;
  toggleNotifications: () => Promise<void>;
}

const defaultPreferences: Omit<UserPreferences, 'id' | 'user_id' | 'created_at' | 'updated_at'> = {
  theme: 'system',
  currency: 'INR',
  language: 'en',
  notifications_enabled: true,
  email_notifications: true,
  push_notifications: false,
};

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

export function UserPreferencesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user preferences
  useEffect(() => {
    if (!user) {
      setPreferences(null);
      setLoading(false);
      return;
    }

    const loadPreferences = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
          throw error;
        }

        setPreferences(data || { ...defaultPreferences, user_id: user.id } as UserPreferences);
      } catch (error: any) {
        console.error('Error loading preferences:', error);
        setPreferences({ ...defaultPreferences, user_id: user.id } as UserPreferences);
      } finally {
        setLoading(false);
      }
    };

    loadPreferences();
  }, [user]);

  // Apply theme to document
  useEffect(() => {
    if (!preferences) return;

    const applyTheme = () => {
      const root = document.documentElement;
      const theme = preferences.theme === 'system' 
        ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        : preferences.theme;

      console.log('Applying theme:', theme, 'from preferences:', preferences.theme);
      
      root.classList.remove('light', 'dark');
      root.classList.add(theme);
      root.setAttribute('data-theme', theme);
      
      // Also set a CSS custom property for immediate effect
      root.style.setProperty('--current-theme', theme);
    };

    applyTheme();

    // Listen for system theme changes
    if (preferences.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', applyTheme);
      return () => mediaQuery.removeEventListener('change', applyTheme);
    }
  }, [preferences?.theme]);

  // Apply theme immediately when component mounts (for non-authenticated users)
  useEffect(() => {
    if (!user && !preferences) {
      const root = document.documentElement;
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      
      console.log('Applying default theme:', systemTheme);
      
      root.classList.remove('light', 'dark');
      root.classList.add(systemTheme);
      root.setAttribute('data-theme', systemTheme);
      root.style.setProperty('--current-theme', systemTheme);
    }
  }, [user, preferences]);

  const updatePreferences = async (updates: Partial<UserPreferences>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          ...updates,
        })
        .select()
        .single();

      if (error) throw error;

      setPreferences(data);
      toast.success('Preferences updated');
    } catch (error: any) {
      console.error('Error updating preferences:', error);
      toast.error('Failed to update preferences');
    }
  };

  const setTheme = async (theme: 'light' | 'dark' | 'system') => {
    await updatePreferences({ theme });
  };

  const toggleNotifications = async () => {
    if (!preferences) return;
    await updatePreferences({ 
      notifications_enabled: !preferences.notifications_enabled 
    });
  };

  const value = {
    preferences,
    loading,
    updatePreferences,
    setTheme,
    toggleNotifications,
  };

  return (
    <UserPreferencesContext.Provider value={value}>
      {children}
    </UserPreferencesContext.Provider>
  );
}

export function useUserPreferences() {
  const context = useContext(UserPreferencesContext);
  if (context === undefined) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }
  return context;
} 