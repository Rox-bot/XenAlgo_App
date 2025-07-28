import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import type { Tables } from '@/integrations/supabase/types';

export type Trade = Tables<'trades'>;

export interface TradeFormData {
  symbol: string;
  trade_type: 'LONG' | 'SHORT';
  entry_price: number;
  exit_price?: number;
  quantity: number;
  entry_date: string;
  exit_date?: string;
  status?: 'OPEN' | 'CLOSED' | 'CANCELLED';
  stop_loss?: number;
  take_profit?: number;
  setup_type?: string;
  entry_reason?: string;
  exit_reason?: string;
}

export function useTrades() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchTrades = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('trades')
        .select('*')
        .eq('user_id', user.id) // Filter by user_id
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTrades((data as Trade[]) || []);
    } catch (error: any) {
      console.error('Error fetching trades:', error);
      toast.error('Failed to load trades');
    } finally {
      setLoading(false);
    }
  };

  const addTrade = async (tradeData: TradeFormData) => {
    if (!user) {
      toast.error('You must be logged in to add trades');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('trades')
        .insert([{
          ...tradeData,
          user_id: user.id,
          status: tradeData.status || 'OPEN',
        }])
        .select()
        .single();

      if (error) throw error;
      
      setTrades(prev => [data as Trade, ...prev]);
      toast.success('Trade added successfully');
      return data;
    } catch (error: any) {
      console.error('Error adding trade:', error);
      toast.error(error.message || 'Failed to add trade');
      throw error;
    }
  };

  const updateTrade = async (id: string, updates: Partial<TradeFormData>) => {
    if (!user) {
      toast.error('You must be logged in to update trades');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('trades')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setTrades(prev => prev.map(trade => 
        trade.id === id ? data as Trade : trade
      ));
      toast.success('Trade updated successfully');
      return data;
    } catch (error: any) {
      console.error('Error updating trade:', error);
      toast.error(error.message || 'Failed to update trade');
      throw error;
    }
  };

  const deleteTrade = async (id: string) => {
    if (!user) {
      toast.error('You must be logged in to delete trades');
      return;
    }

    try {
      const { error } = await supabase
        .from('trades')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setTrades(prev => prev.filter(trade => trade.id !== id));
      toast.success('Trade deleted successfully');
    } catch (error: any) {
      console.error('Error deleting trade:', error);
      toast.error(error.message || 'Failed to delete trade');
      throw error;
    }
  };

  useEffect(() => {
    if (user) {
      fetchTrades();
    } else {
      setTrades([]);
      setLoading(false);
    }
  }, [user]);

  return {
    trades,
    loading,
    addTrade,
    updateTrade,
    deleteTrade,
    refetch: fetchTrades,
  };
}