import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  AlertTriangle, 
  Brain,
  Zap,
  Shield,
  DollarSign,
  Clock,
  BarChart3,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react';
import { 
  MarketConditions, 
  StrategyRecommendation,
  generateStrategyRecommendations,
  getMarketInsights,
  getVolatilityStrategies,
  getOutlookStrategies
} from '@/lib/optionRecommender';

export default function OptionStrategyRecommender() {
  const [marketConditions, setMarketConditions] = useState<MarketConditions>({
    outlook: 'NEUTRAL',
    volatility: 'MEDIUM',
    timeHorizon: 30,
    riskTolerance: 'MODERATE',
    capitalAvailable: 100000,
    underlying: 'NIFTY',
    currentPrice: 18000,
    supportLevel: 17500,
    resistanceLevel: 18500,
    marketSentiment: 'NEUTRAL'
  });

  // Generate recommendations based on market conditions
  const recommendations = useMemo(() => {
    return generateStrategyRecommendations(marketConditions);
  }, [marketConditions]);

  // Get market insights
  const marketInsights = useMemo(() => {
    return getMarketInsights(marketConditions);
  }, [marketConditions]);

  // Get strategy suggestions
  const volatilityStrategies = getVolatilityStrategies(marketConditions.volatility);
  const outlookStrategies = getOutlookStrategies(marketConditions.outlook);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getRiskColor = (risk: 'LOW' | 'MEDIUM' | 'HIGH') => {
    switch (risk) {
      case 'LOW': return 'text-green-600 bg-green-100';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-100';
      case 'HIGH': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">AI Option Strategy Recommender</h1>
          </div>
          <p className="text-muted-foreground">
            Tell us your market outlook and risk profile, and we'll recommend the best option hedging strategies for current conditions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Market Conditions Input */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Market Conditions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Market Outlook */}
                <div>
                  <Label>Market Outlook</Label>
                  <Select
                    value={marketConditions.outlook}
                    onValueChange={(value) => setMarketConditions(prev => ({ ...prev, outlook: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BULLISH">🐂 Bullish</SelectItem>
                      <SelectItem value="BEARISH">🐻 Bearish</SelectItem>
                      <SelectItem value="NEUTRAL">➡️ Neutral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Volatility */}
                <div>
                  <Label>Expected Volatility</Label>
                  <Select
                    value={marketConditions.volatility}
                    onValueChange={(value) => setMarketConditions(prev => ({ ...prev, volatility: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW">📉 Low</SelectItem>
                      <SelectItem value="MEDIUM">➡️ Medium</SelectItem>
                      <SelectItem value="HIGH">📈 High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Risk Tolerance */}
                <div>
                  <Label>Risk Tolerance</Label>
                  <Select
                    value={marketConditions.riskTolerance}
                    onValueChange={(value) => setMarketConditions(prev => ({ ...prev, riskTolerance: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CONSERVATIVE">🛡️ Conservative</SelectItem>
                      <SelectItem value="MODERATE">⚖️ Moderate</SelectItem>
                      <SelectItem value="AGGRESSIVE">⚡ Aggressive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Time Horizon */}
                <div>
                  <Label>Time Horizon (Days)</Label>
                  <Input
                    type="number"
                    value={marketConditions.timeHorizon}
                    onChange={(e) => setMarketConditions(prev => ({ ...prev, timeHorizon: Number(e.target.value) }))}
                  />
                </div>

                {/* Capital Available */}
                <div>
                  <Label>Capital Available</Label>
                  <Input
                    type="number"
                    value={marketConditions.capitalAvailable}
                    onChange={(e) => setMarketConditions(prev => ({ ...prev, capitalAvailable: Number(e.target.value) }))}
                  />
                </div>

                {/* Current Price */}
                <div>
                  <Label>Current Price</Label>
                  <Input
                    type="number"
                    value={marketConditions.currentPrice}
                    onChange={(e) => setMarketConditions(prev => ({ ...prev, currentPrice: Number(e.target.value) }))}
                  />
                </div>

                {/* Market Sentiment */}
                <div>
                  <Label>Market Sentiment</Label>
                  <Select
                    value={marketConditions.marketSentiment}
                    onValueChange={(value) => setMarketConditions(prev => ({ ...prev, marketSentiment: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FEAR">😨 Fear</SelectItem>
                      <SelectItem value="NEUTRAL">😐 Neutral</SelectItem>
                      <SelectItem value="GREED">😍 Greed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Market Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{marketInsights.summary}</p>
                
                {marketInsights.recommendations.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm mb-2">Recommendations:</h4>
                    <ul className="text-sm space-y-1">
                      {marketInsights.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {marketInsights.warnings.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm mb-2 text-red-600">Warnings:</h4>
                    <ul className="text-sm space-y-1">
                      {marketInsights.warnings.map((warning, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-red-500" />
                          {warning}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Strategy Recommendations */}
          <div className="lg:col-span-2 space-y-6">
            {/* Top Recommendation */}
            {recommendations.length > 0 && (
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-800">
                    <Zap className="w-5 h-5" />
                    🏆 Top Recommendation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold">{recommendations[0].strategy.name}</h3>
                      <Badge className={getRiskColor(recommendations[0].riskLevel)}>
                        {recommendations[0].riskLevel} Risk
                      </Badge>
                    </div>
                    
                    <p className="text-green-700">{recommendations[0].strategy.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Suitability Score</p>
                        <p className={`text-2xl font-bold ${getScoreColor(recommendations[0].suitabilityScore)}`}>
                          {(recommendations[0].suitabilityScore * 100).toFixed(0)}%
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Expected Return</p>
                        <p className="text-2xl font-bold text-green-500">
                          {formatCurrency(recommendations[0].expectedReturn)}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Max Loss</p>
                        <p className="text-2xl font-bold text-red-500">
                          {formatCurrency(recommendations[0].maxLoss)}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Win Probability</p>
                        <p className="text-2xl font-bold text-blue-500">
                          {(recommendations[0].probabilityOfProfit * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm mb-2">Why This Strategy:</h4>
                      <ul className="text-sm space-y-1">
                        {recommendations[0].reasoning.slice(0, 3).map((reason, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            {reason}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* All Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>All Strategy Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recommendations.map((rec, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:bg-muted/50">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-muted-foreground">#{index + 1}</span>
                          <h3 className="font-semibold">{rec.strategy.name}</h3>
                          <Badge className={getRiskColor(rec.riskLevel)}>
                            {rec.riskLevel}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <p className={`text-lg font-bold ${getScoreColor(rec.suitabilityScore)}`}>
                            {(rec.suitabilityScore * 100).toFixed(0)}%
                          </p>
                          <p className="text-xs text-muted-foreground">Match Score</p>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">{rec.strategy.description}</p>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Expected Return</p>
                          <p className="font-medium text-green-600">{formatCurrency(rec.expectedReturn)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Max Loss</p>
                          <p className="font-medium text-red-600">{formatCurrency(rec.maxLoss)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Win Rate</p>
                          <p className="font-medium text-blue-600">{(rec.probabilityOfProfit * 100).toFixed(1)}%</p>
                        </div>
                      </div>

                      <div className="mt-3">
                        <Progress value={rec.suitabilityScore * 100} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Strategy Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Volatility Strategies
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {volatilityStrategies.map((strategy, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                        <span className="text-sm">{strategy}</span>
                        <Badge variant="secondary">Volatility</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Outlook Strategies
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {outlookStrategies.map((strategy, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                        <span className="text-sm">{strategy}</span>
                        <Badge variant="secondary">Directional</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 