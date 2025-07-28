import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface IndicatorProps {
  data: any[];
  type: 'rsi' | 'macd' | 'bollinger' | 'moving-average';
  height?: number;
}

const TechnicalIndicators: React.FC<IndicatorProps> = ({ data, type, height = 200 }) => {
  const calculateRSI = (prices: number[], period: number = 14) => {
    const rsiData = [];
    for (let i = period; i < prices.length; i++) {
      let gains = 0;
      let losses = 0;
      
      for (let j = i - period + 1; j <= i; j++) {
        const change = prices[j] - prices[j - 1];
        if (change > 0) gains += change;
        else losses += Math.abs(change);
      }
      
      const avgGain = gains / period;
      const avgLoss = losses / period;
      const rs = avgGain / avgLoss;
      const rsi = 100 - (100 / (1 + rs));
      
      rsiData.push({
        date: data[i]?.date,
        rsi: rsi,
        overbought: 70,
        oversold: 30
      });
    }
    return rsiData;
  };

  const calculateMACD = (prices: number[], fastPeriod: number = 12, slowPeriod: number = 26, signalPeriod: number = 9) => {
    const ema12 = calculateEMA(prices, fastPeriod);
    const ema26 = calculateEMA(prices, slowPeriod);
    const macdLine = ema12.map((value, index) => value - ema26[index]);
    const signalLine = calculateEMA(macdLine, signalPeriod);
    const histogram = macdLine.map((value, index) => value - signalLine[index]);
    
    return macdLine.map((macd, index) => ({
      date: data[index + slowPeriod]?.date,
      macd: macd,
      signal: signalLine[index],
      histogram: histogram[index]
    }));
  };

  const calculateEMA = (prices: number[], period: number) => {
    const ema = [];
    const multiplier = 2 / (period + 1);
    
    // First EMA is SMA
    let sum = 0;
    for (let i = 0; i < period; i++) {
      sum += prices[i];
    }
    ema.push(sum / period);
    
    // Calculate EMA
    for (let i = period; i < prices.length; i++) {
      const newEMA = (prices[i] * multiplier) + (ema[ema.length - 1] * (1 - multiplier));
      ema.push(newEMA);
    }
    
    return ema;
  };

  const calculateBollingerBands = (prices: number[], period: number = 20, stdDev: number = 2) => {
    const bands = [];
    
    for (let i = period - 1; i < prices.length; i++) {
      const slice = prices.slice(i - period + 1, i + 1);
      const sma = slice.reduce((sum, price) => sum + price, 0) / period;
      
      const variance = slice.reduce((sum, price) => sum + Math.pow(price - sma, 2), 0) / period;
      const standardDeviation = Math.sqrt(variance);
      
      bands.push({
        date: data[i]?.date,
        middle: sma,
        upper: sma + (standardDeviation * stdDev),
        lower: sma - (standardDeviation * stdDev)
      });
    }
    
    return bands;
  };

  const renderIndicator = () => {
    const prices = data.map(d => d.close);
    
    switch (type) {
      case 'rsi':
        const rsiData = calculateRSI(prices);
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={rsiData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="rsi" stroke="#8884d8" strokeWidth={2} />
              <Line type="monotone" dataKey="overbought" stroke="#ff0000" strokeDasharray="5 5" />
              <Line type="monotone" dataKey="oversold" stroke="#ff0000" strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        );
        
      case 'macd':
        const macdData = calculateMACD(prices);
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={macdData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="macd" stroke="#8884d8" strokeWidth={2} />
              <Line type="monotone" dataKey="signal" stroke="#ff7300" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        );
        
      case 'bollinger':
        const bbData = calculateBollingerBands(prices);
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={bbData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="middle" stroke="#8884d8" strokeWidth={2} />
              <Line type="monotone" dataKey="upper" stroke="#82ca9d" strokeDasharray="5 5" />
              <Line type="monotone" dataKey="lower" stroke="#82ca9d" strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        );
        
      case 'moving-average':
        const sma20 = calculateEMA(prices, 20);
        const sma50 = calculateEMA(prices, 50);
        const maData = sma50.map((sma50Value, index) => ({
          date: data[index + 50]?.date,
          sma20: sma20[index + 30] || null,
          sma50: sma50Value
        }));
        
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={maData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="sma20" stroke="#8884d8" strokeWidth={2} />
              <Line type="monotone" dataKey="sma50" stroke="#ff7300" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        );
        
      default:
        return <div>Indicator not found</div>;
    }
  };

  return (
    <div className="w-full" style={{ height }}>
      {renderIndicator()}
    </div>
  );
};

export default TechnicalIndicators; 