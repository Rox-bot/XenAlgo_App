import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface JournalSettings {
  id: string;
  user_id: string;
  account_capital: number;
  default_risk_percentage: number;
  default_currency: string;
  created_at: string;
  updated_at: string;
}

export function useJournalSettings() {
  const [settings, setSettings] = useState<JournalSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchSettings = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_journal_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setSettings(data);
    } catch (error: any) {
      console.error('Error fetching journal settings:', error);
      toast.error('Failed to load journal settings');
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (updates: Partial<JournalSettings>) => {
    if (!user || !settings) return;

    try {
      const { data, error } = await supabase
        .from('user_journal_settings')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setSettings(data);
      toast.success('Settings updated successfully');
      return data;
    } catch (error: any) {
      console.error('Error updating settings:', error);
      toast.error('Failed to update settings');
      throw error;
    }
  };

  useEffect(() => {
    if (user) {
      fetchSettings();
    } else {
      setSettings(null);
      setLoading(false);
    }
  }, [user]);

  return {
    settings,
    loading,
    updateSettings,
    refetch: fetchSettings,
  };
}