
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Percent, Shield, TrendingDown, ChevronDown, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const RiskCalculator = () => {
  const [accountBalance, setAccountBalance] = useState(10000);
  const [riskPerTrade, setRiskPerTrade] = useState(2);
  const [stopLossDistance, setStopLossDistance] = useState(5);
  const [entryPrice, setEntryPrice] = useState(100);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const [results, setResults] = useState({
    positionSize: 0,
    riskAmount: 0,
    stopLossPrice: 0,
    shares: 0,
    riskLevel: 'low'
  });

  useEffect(() => {
    calculateRisk();
  }, [accountBalance, riskPerTrade, stopLossDistance, entryPrice]);

  const calculateRisk = () => {
    // Calculate risk amount
    const riskAmount = accountBalance * (riskPerTrade / 100);
    
    // Calculate stop loss price
    const stopLossPrice = entryPrice - (entryPrice * stopLossDistance / 100);
    
    // Calculate position size (shares)
    const riskPerShare = entryPrice - stopLossPrice;
    const shares = Math.floor(riskAmount / riskPerShare);
    
    // Calculate total position size
    const positionSize = shares * entryPrice;
    
    // Determine risk level
    let riskLevel = 'low';
    if (riskPerTrade > 3) riskLevel = 'high';
    else if (riskPerTrade > 1.5) riskLevel = 'medium';

    setResults({
      positionSize: Math.round(positionSize),
      riskAmount: Math.round(riskAmount),
      stopLossPrice: Number(stopLossPrice.toFixed(2)),
      shares: shares,
      riskLevel
    });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(value);
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getRiskBgColor = (level) => {
    switch (level) {
      case 'low': return 'from-green-50 to-green-100 border-green-200';
      case 'medium': return 'from-yellow-50 to-yellow-100 border-yellow-200';
      case 'high': return 'from-red-50 to-red-100 border-red-200';
      default: return 'from-gray-50 to-gray-100 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Risk Management Calculator</h2>
        <p className="text-gray-600">Calculate optimal position sizing for trading with proper risk management</p>
      </div>

      {/* How to Use Guide */}
      <Collapsible open={isGuideOpen} onOpenChange={setIsGuideOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            How to Use This Calculator
            <ChevronDown className={`h-4 w-4 transition-transform ${isGuideOpen ? 'rotate-180' : ''}`} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <h4 className="font-semibold">Enter Account Balance</h4>
                    <p className="text-sm text-gray-600">Your total trading capital</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <h4 className="font-semibold">Set Risk Per Trade</h4>
                    <p className="text-sm text-gray-600">Recommended: 1-2% per trade. Never exceed 5%!</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <h4 className="font-semibold">Entry Price & Stop Loss</h4>
                    <p className="text-sm text-gray-600">Your planned entry price and stop loss distance</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">4</div>
                  <div>
                    <h4 className="font-semibold">Get Position Size</h4>
                    <p className="text-sm text-gray-600">Calculator shows exactly how many shares to buy</p>
                  </div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800">
                    <strong>Golden Rule:</strong> Never risk more than you can afford to lose. Consistency beats big wins!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Controls */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                Risk Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label>Account Balance</Label>
                  <Input
                    type="number"
                    value={accountBalance}
                    onChange={(e) => setAccountBalance(Number(e.target.value))}
                    className="w-32"
                  />
                </div>
                <Slider
                  value={[accountBalance]}
                  onValueChange={(value) => setAccountBalance(value[0])}
                  max={100000}
                  min={1000}
                  step={500}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>$1,000</span>
                  <span>$100,000</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label>Risk Per Trade (%)</Label>
                  <Input
                    type="number"
                    value={riskPerTrade}
                    onChange={(e) => setRiskPerTrade(Number(e.target.value))}
                    className="w-32"
                    step="0.1"
                  />
                </div>
                <Slider
                  value={[riskPerTrade]}
                  onValueChange={(value) => setRiskPerTrade(value[0])}
                  max={10}
                  min={0.5}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>0.5%</span>
                  <span>10%</span>
                </div>
                <div className="flex justify-center mt-2">
                  <div className="flex gap-2 text-xs">
                    <span className="text-green-600">●</span><span>0.5-1.5% (Conservative)</span>
                    <span className="text-yellow-600">●</span><span>1.5-3% (Moderate)</span>
                    <span className="text-red-600">●</span><span>3%+ (Aggressive)</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Entry Price ($)</Label>
                  <Input
                    type="number"
                    value={entryPrice}
                    onChange={(e) => setEntryPrice(Number(e.target.value))}
                    className="mt-1"
                    step="0.01"
                  />
                </div>
                <div>
                  <Label>Stop Loss Distance (%)</Label>
                  <Input
                    type="number"
                    value={stopLossDistance}
                    onChange={(e) => setStopLossDistance(Number(e.target.value))}
                    className="mt-1"
                    step="0.1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Risk Level Indicator */}
          <Card className={`bg-gradient-to-br ${getRiskBgColor(results.riskLevel)}`}>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  {results.riskLevel === 'high' ? (
                    <AlertTriangle className={`h-8 w-8 ${getRiskColor(results.riskLevel)}`} />
                  ) : (
                    <Shield className={`h-8 w-8 ${getRiskColor(results.riskLevel)}`} />
                  )}
                  <h3 className={`text-lg font-bold ${getRiskColor(results.riskLevel)} capitalize`}>
                    {results.riskLevel} Risk
                  </h3>
                </div>
                <p className="text-sm text-gray-600">
                  You are risking {formatCurrency(results.riskAmount)} per trade
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  ({riskPerTrade}% of your account)
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {/* Position Details */}
          <div className="grid grid-cols-1 gap-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Percent className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-blue-700 font-medium">Position Size</p>
                  <p className="text-3xl font-bold text-blue-800">{formatCurrency(results.positionSize)}</p>
                  <p className="text-sm text-blue-600 mt-1">{results.shares} shares</p>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <TrendingDown className="h-6 w-6 text-green-600 mx-auto mb-2" />
                    <p className="text-xs text-green-700 font-medium">Stop Loss Price</p>
                    <p className="text-lg font-bold text-green-800">${results.stopLossPrice}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Shield className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                    <p className="text-xs text-purple-700 font-medium">Max Risk</p>
                    <p className="text-lg font-bold text-purple-800">{formatCurrency(results.riskAmount)}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Trade Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Trade Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Entry Price:</p>
                    <p className="font-semibold">${entryPrice}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Stop Loss:</p>
                    <p className="font-semibold">${results.stopLossPrice}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Shares to Buy:</p>
                    <p className="font-semibold">{results.shares}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Total Investment:</p>
                    <p className="font-semibold">{formatCurrency(results.positionSize)}</p>
                  </div>
                </div>
              </div>
              
              <div className="text-center bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>If stopped out, you will lose exactly {formatCurrency(results.riskAmount)}</strong>
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  This represents {riskPerTrade}% of your account
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Risk Warnings */}
          {results.riskLevel === 'high' && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <strong>High Risk Warning:</strong> You're risking more than 3% per trade. 
                Consider reducing your risk to preserve capital for long-term success.
              </AlertDescription>
            </Alert>
          )}

          {results.positionSize > accountBalance * 0.8 && (
            <Alert className="border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <strong>Large Position:</strong> This trade uses {((results.positionSize / accountBalance) * 100).toFixed(0)}% 
                of your account. Consider diversifying across multiple positions.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default RiskCalculator;
