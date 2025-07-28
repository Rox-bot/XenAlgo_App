import { useMemo } from 'react';
import { useRealtimeTrades } from '@/hooks/useRealtimeTrades';

interface PerformanceData {
  date: string;
  pnl: number;
  cumulative: number;
  trades: number;
}

export function usePerformanceData(period: '7d' | '30d' | '90d' | '1y') {
  const { trades } = useRealtimeTrades();

  const performanceData = useMemo(() => {
    const now = new Date();
    const daysToShow = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '1y': 365,
    }[period];

    const startDate = new Date(now.getTime() - daysToShow * 24 * 60 * 60 * 1000);
    
    // Create date range
    const dates: string[] = [];
    for (let i = 0; i < daysToShow; i++) {
      const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
      dates.push(date.toISOString().split('T')[0]);
    }

    // Calculate P&L for each trade
    const calculatePnL = (trade: any) => {
      if (!trade.entry_price || !trade.quantity) return 0;
      
      // For closed trades, use exit price
      if (trade.status === 'CLOSED' && trade.exit_price) {
        const multiplier = trade.trade_type === 'LONG' ? 1 : -1;
        return (trade.exit_price - trade.entry_price) * trade.quantity * multiplier;
      }
      
      // For open trades, use current market price (we'll use entry price as placeholder)
      // In a real app, you'd fetch current market prices
      if (trade.status === 'OPEN') {
        // For now, we'll show unrealized P&L as 0 to avoid confusion
        // You can implement real-time price fetching here
        return 0;
      }
      
      return 0;
    };

    // Filter trades within the period (both open and closed)
    const relevantTrades = trades.filter(trade => {
      const tradeDate = new Date(trade.created_at);
      return tradeDate >= startDate;
    });

    // Group trades by date
    const tradesByDate = new Map<string, { pnl: number; count: number }>();
    
    relevantTrades.forEach(trade => {
      const date = trade.created_at.split('T')[0];
      const pnl = calculatePnL(trade);
      
      const existing = tradesByDate.get(date) || { pnl: 0, count: 0 };
      tradesByDate.set(date, {
        pnl: existing.pnl + pnl,
        count: existing.count + 1,
      });
    });

    // Generate performance data
    let cumulative = 0;
    const data: PerformanceData[] = dates.map(date => {
      const dayData = tradesByDate.get(date) || { pnl: 0, count: 0 };
      cumulative += dayData.pnl;
      
      return {
        date,
        pnl: dayData.pnl,
        cumulative,
        trades: dayData.count,
      };
    });

    return data;
  }, [trades, period]);

  const summary = useMemo(() => {
    const totalPnL = performanceData.reduce((sum, item) => sum + item.pnl, 0);
    const totalTrades = performanceData.reduce((sum, item) => sum + item.trades, 0);
    const avgDailyPnL = performanceData.length > 0 ? totalPnL / performanceData.length : 0;
    
    // Calculate best and worst days (only days with trades)
    const daysWithTrades = performanceData.filter(item => item.trades > 0);
    const bestDay = daysWithTrades.length > 0 ? Math.max(...daysWithTrades.map(item => item.pnl)) : 0;
    const worstDay = daysWithTrades.length > 0 ? Math.min(...daysWithTrades.map(item => item.pnl)) : 0;
    
    // Calculate win rate based on days with positive P&L
    const winningDays = performanceData.filter(item => item.pnl > 0).length;
    const daysWithActivity = performanceData.filter(item => item.trades > 0).length;
    const winRate = daysWithActivity > 0 ? (winningDays / daysWithActivity) * 100 : 0;

    return {
      totalPnL,
      totalTrades,
      avgDailyPnL,
      bestDay,
      worstDay,
      winRate,
      isPositive: totalPnL >= 0,
    };
  }, [performanceData]);

  return {
    performanceData,
    summary,
  };
} 