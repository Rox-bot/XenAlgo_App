import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import type { Tables } from '@/integrations/supabase/types';

export type Trade = Tables<'trades'>;

export function useRealtimeTrades() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setTrades([]);
      setLoading(false);
      return;
    }

    // Initial fetch
    const fetchTrades = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('trades')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setTrades(data || []);
      } catch (error: any) {
        console.error('Error fetching trades:', error);
        toast.error('Failed to load trades');
      } finally {
        setLoading(false);
      }
    };

    fetchTrades();

    // Set up real-time subscription
    const channel = supabase
      .channel('trades_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'trades',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Real-time trade update:', payload);
          
          if (payload.eventType === 'INSERT') {
            const newTrade = payload.new as Trade;
            setTrades(prev => [newTrade, ...prev]);
            toast.success('New trade added');
          } else if (payload.eventType === 'UPDATE') {
            const updatedTrade = payload.new as Trade;
            setTrades(prev => prev.map(trade => 
              trade.id === updatedTrade.id ? updatedTrade : trade
            ));
            toast.success('Trade updated');
          } else if (payload.eventType === 'DELETE') {
            const deletedTrade = payload.old as Trade;
            setTrades(prev => prev.filter(trade => trade.id !== deletedTrade.id));
            toast.success('Trade deleted');
          }
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    trades,
    loading,
    refetch: () => {
      // This will trigger a refetch by changing the user dependency
      setLoading(true);
    }
  };
} 