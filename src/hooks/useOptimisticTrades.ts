import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import type { Tables } from '@/integrations/supabase/types';
import { validateForm, tradeSchema } from '@/lib/validation';

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

export function useOptimisticTrades() {
  const { user } = useAuth();
  const [optimisticTrades, setOptimisticTrades] = useState<Trade[]>([]);
  const [pendingOperations, setPendingOperations] = useState<Set<string>>(new Set());

  const addTradeOptimistically = useCallback(async (tradeData: TradeFormData) => {
    if (!user) return;

    // Validate the data
    const validation = validateForm(tradeSchema, tradeData);
    if (!validation.success) {
      const errors = 'errors' in validation ? validation.errors : ['Invalid trade data'];
      toast.error(errors[0] || 'Invalid trade data');
      return;
    }

    // Create optimistic trade
    const optimisticTrade: Trade = {
      id: `temp-${Date.now()}`,
      user_id: user.id,
      symbol: tradeData.symbol,
      trade_type: tradeData.trade_type,
      entry_price: tradeData.entry_price,
      quantity: tradeData.quantity,
      entry_date: tradeData.entry_date,
      exit_price: tradeData.exit_price || null,
      exit_date: tradeData.exit_date || null,
      status: tradeData.status || 'OPEN',
      stop_loss: tradeData.stop_loss || null,
      take_profit: tradeData.take_profit || null,
      setup_type: tradeData.setup_type || null,
      entry_reason: tradeData.entry_reason || null,
      exit_reason: tradeData.exit_reason || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Add to optimistic state immediately
    setOptimisticTrades(prev => [optimisticTrade, ...prev]);
    setPendingOperations(prev => new Set(prev).add(optimisticTrade.id));

    try {
      // Make API call
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

      // Remove from optimistic state and pending operations
      setOptimisticTrades(prev => prev.filter(t => t.id !== optimisticTrade.id));
      setPendingOperations(prev => {
        const newSet = new Set(prev);
        newSet.delete(optimisticTrade.id);
        return newSet;
      });

      toast.success('Trade added successfully');
      return data;
    } catch (error: any) {
      // Remove from optimistic state on error
      setOptimisticTrades(prev => prev.filter(t => t.id !== optimisticTrade.id));
      setPendingOperations(prev => {
        const newSet = new Set(prev);
        newSet.delete(optimisticTrade.id);
        return newSet;
      });

      console.error('Error adding trade:', error);
      toast.error('Failed to add trade');
      throw error;
    }
  }, [user]);

  const updateTradeOptimistically = useCallback(async (id: string, updates: Partial<TradeFormData>) => {
    if (!user) return;

    // Create optimistic update
    const optimisticUpdate = {
      id,
      ...updates,
      updated_at: new Date().toISOString(),
    };

    // Update optimistic state immediately
    setOptimisticTrades(prev => prev.map(trade => 
      trade.id === id ? { ...trade, ...optimisticUpdate } : trade
    ));
    setPendingOperations(prev => new Set(prev).add(id));

    try {
      // Make API call
      const { data, error } = await supabase
        .from('trades')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      // Remove from pending operations
      setPendingOperations(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });

      toast.success('Trade updated successfully');
      return data;
    } catch (error: any) {
      // Revert optimistic update on error
      setOptimisticTrades(prev => prev.map(trade => 
        trade.id === id ? { ...trade, ...updates } : trade
      ));
      setPendingOperations(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });

      console.error('Error updating trade:', error);
      toast.error('Failed to update trade');
      throw error;
    }
  }, [user]);

  const deleteTradeOptimistically = useCallback(async (id: string) => {
    if (!user) return;

    // Store the trade for potential rollback
    const tradeToDelete = optimisticTrades.find(t => t.id === id);

    // Remove from optimistic state immediately
    setOptimisticTrades(prev => prev.filter(t => t.id !== id));
    setPendingOperations(prev => new Set(prev).add(id));

    try {
      // Make API call
      const { error } = await supabase
        .from('trades')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      // Remove from pending operations
      setPendingOperations(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });

      toast.success('Trade deleted successfully');
    } catch (error: any) {
      // Restore trade on error
      if (tradeToDelete) {
        setOptimisticTrades(prev => [tradeToDelete, ...prev]);
      }
      setPendingOperations(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });

      console.error('Error deleting trade:', error);
      toast.error('Failed to delete trade');
      throw error;
    }
  }, [user, optimisticTrades]);

  const isPending = useCallback((id: string) => {
    return pendingOperations.has(id);
  }, [pendingOperations]);

  return {
    optimisticTrades,
    addTradeOptimistically,
    updateTradeOptimistically,
    deleteTradeOptimistically,
    isPending,
    pendingOperations,
  };
} 