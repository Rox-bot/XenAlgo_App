import React, { useState, useMemo, useCallback } from 'react';
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
import { toast } from 'sonner';
import { 
  MarketConditions, 
  StrategyRecommendation,
  generateStrategyRecommendations,
  getMarketInsights,
  getVolatilityStrategies,
  getOutlookStrategies
} from '@/lib/optionRecommender';
import Navbar from '@/components/layout/Navbar';

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
  const [isLoading, setIsLoading] = useState(false);

  // Enhanced currency formatting with error handling
  const formatCurrency = useCallback((amount: number): string => {
    try {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
    } catch (error) {
      console.error('Error formatting currency:', error);
      return 'Invalid Amount';
    }
  }, []);

  // Enhanced risk color function with custom color system
  const getRiskColor = useCallback((risk: 'LOW' | 'MEDIUM' | 'HIGH'): string => {
    switch (risk) {
      case 'LOW': return 'text-success bg-success/10';
      case 'MEDIUM': return 'text-warning bg-warning/10';
      case 'HIGH': return 'text-error bg-error/10';
      default: return 'text-primary bg-primary/10';
    }
  }, []);

  // Enhanced score color function with custom color system
  const getScoreColor = useCallback((score: number): string => {
    if (score >= 0.8) return 'text-success';
    if (score >= 0.6) return 'text-warning';
    return 'text-error';
  }, []);

  // Enhanced market conditions update with error handling
  const handleMarketConditionChange = useCallback((field: keyof MarketConditions, value: any) => {
    try {
      setMarketConditions(prev => ({ ...prev, [field]: value }));
    } catch (error) {
      console.error('Error updating market conditions:', error);
      toast.error('Failed to update market conditions');
    }
  }, []);

  // Enhanced numeric input handling with validation
  const handleNumericInput = useCallback((field: keyof MarketConditions, value: string) => {
    try {
      const numValue = Number(value);
      if (isNaN(numValue) || numValue < 0) {
        toast.error('Please enter a valid positive number');
        return;
      }
      setMarketConditions(prev => ({ ...prev, [field]: numValue }));
    } catch (error) {
      console.error('Error updating numeric input:', error);
      toast.error('Failed to update value');
    }
  }, []);

  // Memoized recommendations with error handling
  const recommendations = useMemo(() => {
    try {
      setIsLoading(true);
      const recs = generateStrategyRecommendations(marketConditions);
      return recs;
    } catch (error) {
      console.error('Error generating recommendations:', error);
      toast.error('Failed to generate strategy recommendations');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [marketConditions]);

  // Memoized market insights with error handling
  const marketInsights = useMemo(() => {
    try {
      return getMarketInsights(marketConditions);
    } catch (error) {
      console.error('Error getting market insights:', error);
      toast.error('Failed to get market insights');
      return {
        summary: 'Unable to generate market insights at this time.',
        recommendations: [],
        warnings: []
      };
    }
  }, [marketConditions]);

  // Memoized strategy suggestions with error handling
  const volatilityStrategies = useMemo(() => {
    try {
      return getVolatilityStrategies(marketConditions.volatility);
    } catch (error) {
      console.error('Error getting volatility strategies:', error);
      return [];
    }
  }, [marketConditions.volatility]);

  const outlookStrategies = useMemo(() => {
    try {
      return getOutlookStrategies(marketConditions.outlook);
    } catch (error) {
      console.error('Error getting outlook strategies:', error);
      return [];
    }
  }, [marketConditions.outlook]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-primary">AI Option Strategy Recommender</h1>
          </div>
          <p className="text-primary">
            Tell us your market outlook and risk profile, and we'll recommend the best option hedging strategies for current conditions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Market Conditions Input */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-background-pure border border-border-light">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <BarChart3 className="w-5 h-5" />
                  Market Conditions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Market Outlook */}
                <div>
                  <Label className="text-primary">Market Outlook</Label>
                  <Select
                    value={marketConditions.outlook}
                    onValueChange={(value) => handleMarketConditionChange('outlook', value)}
                  >
                    <SelectTrigger className="bg-background-pure border-border-light text-primary">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background-pure border border-border-light">
                      <SelectItem value="BULLISH" className="text-primary hover:bg-background-ultra">🐂 Bullish</SelectItem>
                      <SelectItem value="BEARISH" className="text-primary hover:bg-background-ultra">🐻 Bearish</SelectItem>
                      <SelectItem value="NEUTRAL" className="text-primary hover:bg-background-ultra">➡️ Neutral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Volatility */}
                <div>
                  <Label className="text-primary">Expected Volatility</Label>
                  <Select
                    value={marketConditions.volatility}
                    onValueChange={(value) => handleMarketConditionChange('volatility', value)}
                  >
                    <SelectTrigger className="bg-background-pure border-border-light text-primary">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background-pure border border-border-light">
                      <SelectItem value="LOW" className="text-primary hover:bg-background-ultra">📉 Low</SelectItem>
                      <SelectItem value="MEDIUM" className="text-primary hover:bg-background-ultra">➡️ Medium</SelectItem>
                      <SelectItem value="HIGH" className="text-primary hover:bg-background-ultra">📈 High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Risk Tolerance */}
                <div>
                  <Label className="text-primary">Risk Tolerance</Label>
                  <Select
                    value={marketConditions.riskTolerance}
                    onValueChange={(value) => handleMarketConditionChange('riskTolerance', value)}
                  >
                    <SelectTrigger className="bg-background-pure border-border-light text-primary">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background-pure border border-border-light">
                      <SelectItem value="CONSERVATIVE" className="text-primary hover:bg-background-ultra">🛡️ Conservative</SelectItem>
                      <SelectItem value="MODERATE" className="text-primary hover:bg-background-ultra">⚖️ Moderate</SelectItem>
                      <SelectItem value="AGGRESSIVE" className="text-primary hover:bg-background-ultra">⚡ Aggressive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Time Horizon */}
                <div>
                  <Label className="text-primary">Time Horizon (Days)</Label>
                  <Input
                    type="number"
                    value={marketConditions.timeHorizon}
                    onChange={(e) => handleNumericInput('timeHorizon', e.target.value)}
                    className="bg-background-pure border-border-light text-primary placeholder:text-primary focus:border-primary focus:ring-2 focus:ring-primary/20"
                    aria-describedby="time-horizon-help"
                  />
                </div>

                {/* Capital Available */}
                <div>
                  <Label className="text-primary">Capital Available</Label>
                  <Input
                    type="number"
                    value={marketConditions.capitalAvailable}
                    onChange={(e) => handleNumericInput('capitalAvailable', e.target.value)}
                    className="bg-background-pure border-border-light text-primary placeholder:text-primary focus:border-primary focus:ring-2 focus:ring-primary/20"
                    aria-describedby="capital-help"
                  />
                </div>

                {/* Current Price */}
                <div>
                  <Label className="text-primary">Current Price</Label>
                  <Input
                    type="number"
                    value={marketConditions.currentPrice}
                    onChange={(e) => handleNumericInput('currentPrice', e.target.value)}
                    className="bg-background-pure border-border-light text-primary placeholder:text-primary focus:border-primary focus:ring-2 focus:ring-primary/20"
                    aria-describedby="price-help"
                  />
                </div>

                {/* Market Sentiment */}
                <div>
                  <Label className="text-primary">Market Sentiment</Label>
                  <Select
                    value={marketConditions.marketSentiment}
                    onValueChange={(value) => handleMarketConditionChange('marketSentiment', value)}
                  >
                    <SelectTrigger className="bg-background-pure border-border-light text-primary">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background-pure border border-border-light">
                      <SelectItem value="FEAR" className="text-primary hover:bg-background-ultra">😨 Fear</SelectItem>
                      <SelectItem value="NEUTRAL" className="text-primary hover:bg-background-ultra">😐 Neutral</SelectItem>
                      <SelectItem value="GREED" className="text-primary hover:bg-background-ultra">😍 Greed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Market Insights */}
            <Card className="bg-background-pure border border-border-light">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Brain className="w-5 h-5" />
                  AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-primary">{marketInsights.summary}</p>
                
                {marketInsights.recommendations.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm mb-2 text-primary">Recommendations:</h4>
                    <ul className="text-sm space-y-1">
                      {marketInsights.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-success" />
                          <span className="text-primary">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {marketInsights.warnings.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm mb-2 text-error">Warnings:</h4>
                    <ul className="text-sm space-y-1">
                      {marketInsights.warnings.map((warning, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-error" />
                          <span className="text-primary">{warning}</span>
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
            {/* Loading State */}
            {isLoading && (
              <Alert className="border-info bg-info/10">
                <Info className="h-4 w-4 text-info" />
                <AlertDescription className="text-primary">
                  Generating strategy recommendations...
                </AlertDescription>
              </Alert>
            )}

            {/* Top Recommendation */}
            {recommendations.length > 0 && (
              <Card className="border-success/20 bg-success/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-success">
                    <Zap className="w-5 h-5" />
                    🏆 Top Recommendation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-primary">{recommendations[0].strategy.name}</h3>
                      <Badge className={getRiskColor(recommendations[0].riskLevel)}>
                        {recommendations[0].riskLevel} Risk
                      </Badge>
                    </div>
                    
                    <p className="text-primary">{recommendations[0].strategy.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <p className="text-sm text-primary">Suitability Score</p>
                        <p className={`text-2xl font-bold ${getScoreColor(recommendations[0].suitabilityScore)}`}>
                          {(recommendations[0].suitabilityScore * 100).toFixed(0)}%
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-primary">Expected Return</p>
                        <p className="text-2xl font-bold text-success">
                          {formatCurrency(recommendations[0].expectedReturn)}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-primary">Max Loss</p>
                        <p className="text-2xl font-bold text-error">
                          {formatCurrency(recommendations[0].maxLoss)}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-primary">Win Probability</p>
                        <p className="text-2xl font-bold text-info">
                          {(recommendations[0].probabilityOfProfit * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm mb-2 text-primary">Why This Strategy:</h4>
                      <ul className="text-sm space-y-1">
                        {recommendations[0].reasoning.slice(0, 3).map((reason, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                            <span className="text-primary">{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* All Recommendations */}
            <Card className="bg-background-pure border border-border-light">
              <CardHeader>
                <CardTitle className="text-primary">All Strategy Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recommendations.map((rec, index) => (
                    <div key={index} className="border border-border-light rounded-lg p-4 hover:bg-background-ultra bg-background-pure">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-primary">#{index + 1}</span>
                          <h3 className="font-semibold text-primary">{rec.strategy.name}</h3>
                          <Badge className={getRiskColor(rec.riskLevel)}>
                            {rec.riskLevel}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <p className={`text-lg font-bold ${getScoreColor(rec.suitabilityScore)}`}>
                            {(rec.suitabilityScore * 100).toFixed(0)}%
                          </p>
                          <p className="text-xs text-primary">Match Score</p>
                        </div>
                      </div>
                      
                      <p className="text-sm text-primary mb-3">{rec.strategy.description}</p>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-primary">Expected Return</p>
                          <p className="font-medium text-success">{formatCurrency(rec.expectedReturn)}</p>
                        </div>
                        <div>
                          <p className="text-primary">Max Loss</p>
                          <p className="font-medium text-error">{formatCurrency(rec.maxLoss)}</p>
                        </div>
                        <div>
                          <p className="text-primary">Win Rate</p>
                          <p className="font-medium text-info">{(rec.probabilityOfProfit * 100).toFixed(1)}%</p>
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
              <Card className="bg-background-pure border border-border-light">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <TrendingUp className="w-5 h-5" />
                    Volatility Strategies
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {volatilityStrategies.map((strategy, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-background-ultra rounded">
                        <span className="text-sm text-primary">{strategy}</span>
                        <Badge variant="secondary" className="border-border-light text-primary">Volatility</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-background-pure border border-border-light">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <Target className="w-5 h-5" />
                    Outlook Strategies
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {outlookStrategies.map((strategy, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-background-ultra rounded">
                        <span className="text-sm text-primary">{strategy}</span>
                        <Badge variant="secondary" className="border-border-light text-primary">Directional</Badge>
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