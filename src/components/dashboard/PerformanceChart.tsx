import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface PerformanceData {
  date: string;
  pnl: number;
  cumulative: number;
  trades: number;
}

interface PerformanceChartProps {
  data: PerformanceData[];
  period: '7d' | '30d' | '90d' | '1y';
}

export function PerformanceChart({ data, period }: PerformanceChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    switch (period) {
      case '7d':
        return date.toLocaleDateString('en-IN', { weekday: 'short' });
      case '30d':
        return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
      case '90d':
        return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
      case '1y':
        return date.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
      default:
        return date.toLocaleDateString('en-IN');
    }
  };

  const totalPnL = data.reduce((sum, item) => sum + item.pnl, 0);
  const isPositive = totalPnL >= 0;

  // Debug information
  console.log('PerformanceChart Debug:', {
    period,
    totalPnL,
    isPositive,
    dataPoints: data.length,
    sampleData: data.slice(0, 3),
    allData: data
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Performance Overview</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={isPositive ? 'default' : 'secondary'}>
              {isPositive ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {formatCurrency(totalPnL)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorPnl" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={isPositive ? '#10B981' : '#EF4444'}
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor={isPositive ? '#10B981' : '#EF4444'}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                className="text-xs"
                tick={{ fontSize: 12 }}
              />
              <YAxis
                tickFormatter={formatCurrency}
                className="text-xs"
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                formatter={(value: any, name: string) => [
                  formatCurrency(value),
                  name === 'cumulative' ? 'Cumulative P&L' : 'Daily P&L'
                ]}
                labelFormatter={(label) => formatDate(label)}
              />
              <Area
                type="monotone"
                dataKey="cumulative"
                stroke={isPositive ? '#10B981' : '#EF4444'}
                fill="url(#colorPnl)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Total Trades</p>
            <p className="text-lg font-semibold">
              {data.reduce((sum, item) => sum + item.trades, 0)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Avg Daily P&L</p>
            <p className={`text-lg font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(data.length > 0 ? totalPnL / data.length : 0)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Best Day</p>
            <p className="text-lg font-semibold text-green-600">
              {formatCurrency(Math.max(...data.map(item => item.pnl)))}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 