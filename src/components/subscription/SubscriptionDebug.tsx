import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useRealtimeTrades } from '@/hooks/useRealtimeTrades';

export function SubscriptionDebug() {
  const { subscription, currentUsage, getLimit, isUnlimited, hasFeature, refetch } = useSubscription();
  const { trades } = useRealtimeTrades();

  // Calculate current month trades manually for comparison
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  
  const currentMonthTrades = trades.filter(trade => {
    const tradeDate = new Date(trade.created_at);
    return tradeDate >= startOfMonth && tradeDate <= endOfMonth;
  });

  // Calculate P&L for each trade
  const calculatePnL = (trade: any) => {
    if (!trade.entry_price || !trade.quantity) return 0;
    
    if (trade.status === 'CLOSED' && trade.exit_price) {
      const multiplier = trade.trade_type === 'LONG' ? 1 : -1;
      return (trade.exit_price - trade.entry_price) * trade.quantity * multiplier;
    }
    
    return 0; // Open trades show 0 for now
  };

  const totalPnL = trades.reduce((sum, trade) => sum + calculatePnL(trade), 0);
  const closedTradesPnL = trades.filter(t => t.status === 'CLOSED').reduce((sum, trade) => sum + calculatePnL(trade), 0);

  const handleRefresh = async () => {
    await refetch();
  };

  return (
    <Card className="border-orange-500">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-orange-600">🔧 Debug Info (Remove Later)</CardTitle>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium mb-2">Subscription Context</h4>
            <div className="space-y-1 text-sm">
              <p><strong>Subscription:</strong> {subscription ? 'Yes' : 'No'}</p>
              <p><strong>Tier:</strong> {subscription?.tier || 'None'}</p>
              <p><strong>Status:</strong> {subscription?.status || 'None'}</p>
              <p><strong>Monthly Limit:</strong> {getLimit('monthlyTrades')}</p>
              <p><strong>Is Unlimited:</strong> {isUnlimited('monthlyTrades') ? 'Yes' : 'No'}</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Usage Tracking</h4>
            <div className="space-y-1 text-sm">
              <p><strong>Context Monthly Trades:</strong> {currentUsage.monthlyTrades}</p>
              <p><strong>Manual Calculation:</strong> {currentMonthTrades.length}</p>
              <p><strong>Total Trades:</strong> {trades.length}</p>
              <p><strong>Categories:</strong> {currentUsage.categories}</p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">P&L Debug</h4>
          <div className="space-y-1 text-sm">
            <p><strong>Total P&L (All Trades):</strong> ₹{totalPnL.toLocaleString()}</p>
            <p><strong>Closed Trades P&L:</strong> ₹{closedTradesPnL.toLocaleString()}</p>
            <p><strong>Open Trades:</strong> {trades.filter(t => t.status === 'OPEN').length}</p>
            <p><strong>Closed Trades:</strong> {trades.filter(t => t.status === 'CLOSED').length}</p>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Date Range</h4>
          <div className="space-y-1 text-sm">
            <p><strong>Start of Month:</strong> {startOfMonth.toISOString()}</p>
            <p><strong>End of Month:</strong> {endOfMonth.toISOString()}</p>
            <p><strong>Current Time:</strong> {now.toISOString()}</p>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Recent Trades with P&L</h4>
          <div className="space-y-1 text-sm">
            {trades.slice(0, 5).map((trade, index) => (
              <div key={trade.id} className="flex justify-between items-center">
                <span>{trade.symbol} ({trade.trade_type})</span>
                <span>{new Date(trade.created_at).toLocaleDateString()}</span>
                <span className={calculatePnL(trade) >= 0 ? 'text-green-500' : 'text-red-500'}>
                  ₹{calculatePnL(trade).toLocaleString()}
                </span>
                <Badge variant={trade.created_at >= startOfMonth.toISOString() && trade.created_at <= endOfMonth.toISOString() ? 'default' : 'secondary'}>
                  {trade.created_at >= startOfMonth.toISOString() && trade.created_at <= endOfMonth.toISOString() ? 'This Month' : 'Other Month'}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 