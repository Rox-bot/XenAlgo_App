import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  AlertTriangle, 
  Plus, 
  Trash2,
  Play,
  Save,
  Download
} from 'lucide-react';
import { 
  OptionStrategy, 
  OptionLeg, 
  STRATEGY_TEMPLATES, 
  calculateStrategyPayout, 
  calculateStrategyRisk,
  validateStrategy 
} from '@/lib/optionStrategies';
import { generateOptionChain } from '@/lib/optionPricing';

export default function OptionSimulator() {
  const [currentSpot, setCurrentSpot] = useState(18000); // NIFTY example
  const [volatility, setVolatility] = useState(0.25);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [strategy, setStrategy] = useState<OptionStrategy>({
    id: '',
    name: '',
    description: '',
    category: 'INCOME',
    legs: [],
    maxProfit: 0,
    maxLoss: 0,
    breakEvenPoints: [],
    riskProfile: 'MEDIUM',
    marginRequired: 0
  });

  // Generate option chain for current spot
  const optionChain = useMemo(() => {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 30); // 30 days from now
    
    const strikes = [];
    for (let i = -10; i <= 10; i++) {
      strikes.push(currentSpot + i * 100);
    }
    
    return generateOptionChain(currentSpot, expiry, strikes, volatility);
  }, [currentSpot, volatility]);

  // Calculate strategy P&L
  const strategyAnalysis = useMemo(() => {
    if (strategy.legs.length === 0) return null;
    
    const spotPrices = [];
    const minStrike = Math.min(...strategy.legs.map(leg => leg.strike));
    const maxStrike = Math.max(...strategy.legs.map(leg => leg.strike));
    const range = maxStrike - minStrike;
    
    for (let i = minStrike - range; i <= maxStrike + range; i += range / 50) {
      spotPrices.push(i);
    }
    
    const payouts = calculateStrategyPayout(strategy, spotPrices, currentSpot, volatility);
    const riskMetrics = calculateStrategyRisk(strategy);
    
    return {
      payouts,
      riskMetrics,
      chartData: payouts.map(p => ({
        spotPrice: p.spotPrice,
        pnl: p.netPnl,
        profit: p.profit,
        loss: p.loss
      }))
    };
  }, [strategy, currentSpot, volatility]);

  // Handle template selection
  const handleTemplateSelect = (templateKey: string) => {
    const template = STRATEGY_TEMPLATES[templateKey as keyof typeof STRATEGY_TEMPLATES];
    if (!template) return;
    
    setSelectedTemplate(templateKey);
    setStrategy(prev => ({
      ...prev,
      name: template.name,
      description: template.description,
      category: template.category,
      riskProfile: template.riskProfile,
      legs: template.legs.map((leg, index) => ({
        id: `leg-${index}`,
        symbol: 'NIFTY',
        strike: currentSpot + (index - 1) * 100,
        expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        type: leg.type as 'CALL' | 'PUT',
        action: leg.action as 'BUY' | 'SELL',
        quantity: leg.type === 'CALL' && leg.action === 'SELL' && index === 1 ? 2 : 1
      }))
    }));
  };

  // Add new leg
  const addLeg = () => {
    const newLeg: OptionLeg = {
      id: `leg-${strategy.legs.length}`,
      symbol: 'NIFTY',
      strike: currentSpot,
      expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      type: 'CALL',
      action: 'BUY',
      quantity: 1
    };
    
    setStrategy(prev => ({
      ...prev,
      legs: [...prev.legs, newLeg]
    }));
  };

  // Update leg
  const updateLeg = (legId: string, updates: Partial<OptionLeg>) => {
    setStrategy(prev => ({
      ...prev,
      legs: prev.legs.map(leg => 
        leg.id === legId ? { ...leg, ...updates } : leg
      )
    }));
  };

  // Remove leg
  const removeLeg = (legId: string) => {
    setStrategy(prev => ({
      ...prev,
      legs: prev.legs.filter(leg => leg.id !== legId)
    }));
  };

  // Validate strategy
  const validation = validateStrategy(strategy);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Debug info
  console.log('Option Simulator Debug:', {
    currentSpot,
    volatility,
    strategyLegs: strategy.legs.length,
    optionChainLength: optionChain.length,
    strategyAnalysis: strategyAnalysis ? 'Available' : 'None'
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Option Strategy Simulator</h1>
          <p className="text-muted-foreground mt-2">Build and analyze option strategies with real-time P&L visualization</p>
        </div>

        {/* Quick Demo Section */}
        <Card className="mb-6 border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800">🚀 Quick Demo</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-green-700 mb-4">
              Try selecting a strategy template to see the P&L analysis in action!
            </p>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                onClick={() => handleTemplateSelect('BULL_CALL_SPREAD')}
                className="bg-green-600 hover:bg-green-700"
              >
                Try Bull Call Spread
              </Button>
              <Button 
                size="sm" 
                onClick={() => handleTemplateSelect('IRON_CONDOR')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Try Iron Condor
              </Button>
              <Button 
                size="sm" 
                onClick={() => handleTemplateSelect('STRADDLE')}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Try Straddle
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Strategy Builder */}
          <div className="lg:col-span-1 space-y-6">
            {/* Market Parameters */}
            <Card>
              <CardHeader>
                <CardTitle>Market Parameters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="spot-price">Spot Price</Label>
                  <Input
                    id="spot-price"
                    type="number"
                    value={currentSpot}
                    onChange={(e) => setCurrentSpot(Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="volatility">Volatility (%)</Label>
                  <Input
                    id="volatility"
                    type="number"
                    value={volatility * 100}
                    onChange={(e) => setVolatility(Number(e.target.value) / 100)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Strategy Templates */}
            <Card>
              <CardHeader>
                <CardTitle>Strategy Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(STRATEGY_TEMPLATES).map(([key, template]) => (
                      <SelectItem key={key} value={key}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Strategy Legs */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Strategy Legs</CardTitle>
                  <Button size="sm" onClick={addLeg}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Leg
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {strategy.legs.map((leg, index) => (
                  <div key={leg.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Leg {index + 1}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeLeg(leg.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label>Type</Label>
                        <Select
                          value={leg.type}
                          onValueChange={(value) => updateLeg(leg.id, { type: value as 'CALL' | 'PUT' })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="CALL">Call</SelectItem>
                            <SelectItem value="PUT">Put</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label>Action</Label>
                        <Select
                          value={leg.action}
                          onValueChange={(value) => updateLeg(leg.id, { action: value as 'BUY' | 'SELL' })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="BUY">Buy</SelectItem>
                            <SelectItem value="SELL">Sell</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label>Strike</Label>
                        <Input
                          type="number"
                          value={leg.strike}
                          onChange={(e) => updateLeg(leg.id, { strike: Number(e.target.value) })}
                        />
                      </div>
                      
                      <div>
                        <Label>Quantity</Label>
                        <Input
                          type="number"
                          value={leg.quantity}
                          onChange={(e) => updateLeg(leg.id, { quantity: Number(e.target.value) })}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                {strategy.legs.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No legs added. Select a template or add legs manually.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Analysis & Charts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Strategy Overview */}
            {strategyAnalysis && (
              <Card>
                <CardHeader>
                  <CardTitle>Strategy Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Max Profit</p>
                      <p className="text-2xl font-bold text-green-500">
                        {formatCurrency(strategyAnalysis.riskMetrics.maxProfit)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Max Loss</p>
                      <p className="text-2xl font-bold text-red-500">
                        {formatCurrency(strategyAnalysis.riskMetrics.maxLoss)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Probability of Profit</p>
                      <p className="text-2xl font-bold text-blue-500">
                        {(strategyAnalysis.riskMetrics.probabilityOfProfit * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Break-even Points</p>
                      <p className="text-lg font-semibold">
                        {strategyAnalysis.riskMetrics.breakEvenPoints.length}
                      </p>
                    </div>
                  </div>
                  
                  {!validation.isValid && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-600 font-medium">Strategy Issues:</p>
                      <ul className="text-sm text-red-600 mt-1">
                        {validation.errors.map((error, index) => (
                          <li key={index}>• {error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* P&L Chart */}
            {strategyAnalysis && (
              <Card>
                <CardHeader>
                  <CardTitle>P&L Chart</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={strategyAnalysis.chartData}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis 
                        dataKey="spotPrice" 
                        tickFormatter={(value) => value.toLocaleString()}
                      />
                      <YAxis 
                        tickFormatter={(value) => formatCurrency(value)}
                      />
                      <Tooltip 
                        formatter={(value) => [formatCurrency(Number(value)), 'P&L']}
                        labelFormatter={(label) => `Spot: ${Number(label).toLocaleString()}`}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="pnl" 
                        stroke="#10b981" 
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {/* Option Chain */}
            <Card>
              <CardHeader>
                <CardTitle>Option Chain</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Strike</th>
                        <th className="text-right p-2">Call Price</th>
                        <th className="text-right p-2">Put Price</th>
                        <th className="text-right p-2">Call Delta</th>
                        <th className="text-right p-2">Put Delta</th>
                      </tr>
                    </thead>
                    <tbody>
                      {optionChain.slice(0, 10).map((option) => (
                        <tr key={option.strike} className="border-b hover:bg-muted/50">
                          <td className="p-2 font-medium">{option.strike.toLocaleString()}</td>
                          <td className="p-2 text-right">{option.callPrice.toFixed(2)}</td>
                          <td className="p-2 text-right">{option.putPrice.toFixed(2)}</td>
                          <td className="p-2 text-right">{option.callGreeks.delta.toFixed(3)}</td>
                          <td className="p-2 text-right">{option.putGreeks.delta.toFixed(3)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 