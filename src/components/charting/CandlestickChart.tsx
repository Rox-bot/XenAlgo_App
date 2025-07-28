import React from 'react';
import { ResponsiveContainer, ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, Bar } from 'recharts';

interface CandlestickData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface CandlestickChartProps {
  data: CandlestickData[];
  height?: number;
}

const CandlestickChart: React.FC<CandlestickChartProps> = ({ data, height = 400 }) => {
  // Transform data for candlestick visualization
  const chartData = data.map(item => ({
    ...item,
    // For candlestick visualization using bars
    body: item.close - item.open,
    bodyStart: Math.min(item.open, item.close),
    bodyEnd: Math.max(item.open, item.close),
    isGreen: item.close >= item.open,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <div className="font-semibold">{label}</div>
          <div className="space-y-1 text-sm">
            <div>Open: ₹{data.open?.toFixed(2)}</div>
            <div>High: ₹{data.high?.toFixed(2)}</div>
            <div>Low: ₹{data.low?.toFixed(2)}</div>
            <div>Close: ₹{data.close?.toFixed(2)}</div>
            <div>Volume: {data.volume?.toLocaleString()}</div>
            <div className={`font-medium ${data.isGreen ? 'text-green-600' : 'text-red-600'}`}>
              {data.isGreen ? '+' : ''}{(data.close - data.open).toFixed(2)} ({(data.close - data.open) / data.open * 100}%)
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12, fill: '#9CA3AF' }}
            tickFormatter={(value) => new Date(value).toLocaleDateString()}
          />
          <YAxis 
            domain={['dataMin - 5', 'dataMax + 5']}
            tick={{ fontSize: 12, fill: '#9CA3AF' }}
          />
          <Tooltip content={<CustomTooltip />} />
          
          {/* Candlestick bodies */}
          <Bar
            dataKey="body"
            fill="#8884d8"
            stroke="#8884d8"
            strokeWidth={1}
            fillOpacity={0.8}
          />
          
          {/* High-Low lines (simplified representation) */}
          {chartData.map((entry, index) => (
            <line
              key={index}
              x1={index * (100 / chartData.length) + (100 / chartData.length) / 2}
              x2={index * (100 / chartData.length) + (100 / chartData.length) / 2}
              y1={((entry.high - entry.low) / (entry.high - entry.low)) * 100}
              y2={100}
              stroke="#8884d8"
              strokeWidth={1}
            />
          ))}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CandlestickChart; 