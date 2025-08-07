import React, { useState, useCallback, useMemo } from 'react';
import { TrendingUp, BarChart3, Calendar, Target, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const BacktestScanners = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  // Memoized backtest tools data
  const backtestTools = useMemo(() => [
    {
      id: 1,
      title: "Swing Scanners",
      description: "This tool will help you to backtest the scans from various scanners for Swing Trades",
      icon: TrendingUp,
      features: [
        "Historical data analysis for swing trading patterns",
        "Performance metrics over different time periods",
        "Risk-reward analysis for swing positions",
        "Success rate calculations",
        "Drawdown analysis"
      ],
      timeframes: ["1 Week", "1 Month", "3 Months", "6 Months", "1 Year"],
      metrics: {
        avgReturn: "12.5%",
        successRate: "68%",
        maxDrawdown: "8.2%",
        profitFactor: "1.85"
      }
    },
    {
      id: 2,
      title: "BTST Scanners",
      description: "This tool will help you to backtest the scans from various scanners for BTST Trades",
      icon: BarChart3,
      features: [
        "Buy Today Sell Tomorrow strategy testing",
        "Gap up/down performance analysis",
        "Overnight risk assessment",
        "Volume and momentum indicators",
        "Market sentiment analysis"
      ],
      timeframes: ["1 Week", "2 Weeks", "1 Month", "3 Months", "6 Months"],
      metrics: {
        avgReturn: "3.2%",
        successRate: "72%",
        maxDrawdown: "4.1%",
        profitFactor: "2.1"
      }
    }
  ], []);

  // Memoized sample results
  const sampleResults = useMemo(() => [
    {
      date: "2024-12-15",
      scanner: "Swing Scanner",
      trades: 23,
      winners: 16,
      losers: 7,
      avgReturn: "15.2%",
      status: "Completed"
    },
    {
      date: "2024-12-14",
      scanner: "BTST Scanner",
      trades: 18,
      winners: 13,
      losers: 5,
      avgReturn: "4.8%",
      status: "Completed"
    },
    {
      date: "2024-12-13",
      scanner: "Swing Scanner",
      trades: 31,
      winners: 19,
      losers: 12,
      avgReturn: "11.7%",
      status: "Completed"
    }
  ], []);

  // Memoized backtest handler
  const handleBacktest = useCallback(async (toolId: number, toolName: string) => {
    try {
      setIsLoading(`tool-${toolId}`);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Backtest Started",
        description: `${toolName} backtest is now running with historical data...`,
        variant: "default",
      });
    } catch (error) {
      console.error('Error starting backtest:', error);
      toast({
        title: "Backtest Failed",
        description: "Failed to start backtest. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(null);
    }
  }, [toast]);

  // Memoized view details handler
  const handleViewDetails = useCallback(async (resultId: number) => {
    try {
      setIsLoading(`result-${resultId}`);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Details Loaded",
        description: "Backtest details have been loaded successfully.",
        variant: "default",
      });
    } catch (error) {
      console.error('Error loading details:', error);
      toast({
        title: "Error",
        description: "Failed to load details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(null);
    }
  }, [toast]);

  return (
    <div className="min-h-screen bg-background-soft">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-luxury-gold text-background-soft">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Backtest Swing Scanners
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Test your trading strategies with historical data and optimize your performance
            </p>
          </div>
        </div>
      </section>

      {/* Backtest Tools */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-primary">Backtest Tools</h2>
            <p className="text-primary">
              Comprehensive backtesting tools to validate your trading strategies
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {backtestTools.map((tool) => (
              <Card key={tool.id} className="overflow-hidden bg-background-pure border border-border-light">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-luxury-gold/10">
                  <div className="flex items-center gap-4">
                    <tool.icon className="h-12 w-12 text-primary" />
                    <div>
                      <CardTitle className="text-2xl text-primary">{tool.title}</CardTitle>
                      <p className="text-primary mt-2">{tool.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {/* Features */}
                    <div>
                      <h4 className="font-semibold mb-3 text-primary">Key Features:</h4>
                      <ul className="space-y-2">
                        {tool.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                            <span className="text-primary">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Timeframes */}
                    <div>
                      <h4 className="font-semibold mb-3 text-primary">Available Timeframes:</h4>
                      <div className="flex flex-wrap gap-2">
                        {tool.timeframes.map((timeframe) => (
                          <Badge key={timeframe} variant="secondary" className="bg-background-pure border border-border-light text-primary">
                            {timeframe}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Performance Metrics */}
                    <div>
                      <h4 className="font-semibold mb-3 text-primary">Sample Performance:</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-background-ultra rounded-lg border border-border-light">
                          <div className="text-lg font-bold text-success">
                            {tool.metrics.avgReturn}
                          </div>
                          <div className="text-xs text-primary">Avg Return</div>
                        </div>
                        <div className="text-center p-3 bg-background-ultra rounded-lg border border-border-light">
                          <div className="text-lg font-bold text-info">
                            {tool.metrics.successRate}
                          </div>
                          <div className="text-xs text-primary">Success Rate</div>
                        </div>
                        <div className="text-center p-3 bg-background-ultra rounded-lg border border-border-light">
                          <div className="text-lg font-bold text-error">
                            {tool.metrics.maxDrawdown}
                          </div>
                          <div className="text-xs text-primary">Max Drawdown</div>
                        </div>
                        <div className="text-center p-3 bg-background-ultra rounded-lg border border-border-light">
                          <div className="text-lg font-bold text-luxury-gold">
                            {tool.metrics.profitFactor}
                          </div>
                          <div className="text-xs text-primary">Profit Factor</div>
                        </div>
                      </div>
                    </div>

                    <Button 
                      className="w-full bg-primary text-background-soft hover:bg-primary-light" 
                      size="lg"
                      onClick={() => handleBacktest(tool.id, tool.title)}
                      disabled={isLoading === `tool-${tool.id}`}
                      aria-label={`Start backtest for ${tool.title}`}
                    >
                      {isLoading === `tool-${tool.id}` ? (
                        <>
                          <div className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          Starting...
                        </>
                      ) : (
                        <>
                          <Target className="mr-2 h-4 w-4" />
                          Back Test Now
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background-pure border-t border-border-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-primary">Why Use Our Backtest Tools?</h2>
            <p className="text-primary">
              Make data-driven decisions with comprehensive historical analysis
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-background-pure border border-border-light">
              <CardHeader>
                <Calendar className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-primary">Historical Data Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-primary">
                  Access years of historical market data to test your strategies across different market conditions
                </p>
              </CardContent>
            </Card>

            <Card className="bg-background-pure border border-border-light">
              <CardHeader>
                <TrendingUp className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-primary">Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-primary">
                  Get detailed performance metrics including returns, drawdowns, and success rates
                </p>
              </CardContent>
            </Card>

            <Card className="bg-background-pure border border-border-light">
              <CardHeader>
                <TrendingDown className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-primary">Risk Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-primary">
                  Comprehensive risk assessment including maximum drawdown and risk-reward ratios
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Recent Results */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-primary">Recent Backtest Results</h2>
            <p className="text-primary">
              See how our scanners have performed recently
            </p>
          </div>

          <Card className="bg-background-pure border border-border-light">
            <CardHeader>
              <CardTitle className="text-primary">Latest Backtest Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sampleResults.map((result, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-border-light rounded-lg bg-background-ultra">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-sm font-medium text-primary">{result.date}</div>
                        <Badge variant="secondary" className="mt-1 bg-background-pure border border-border-light text-primary">
                          {result.status}
                        </Badge>
                      </div>
                      <div>
                        <h4 className="font-medium text-primary">{result.scanner}</h4>
                        <p className="text-sm text-primary">
                          {result.trades} trades • {result.winners} winners • {result.losers} losers
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-success">
                        {result.avgReturn}
                      </div>
                      <div className="text-sm text-primary">Avg Return</div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="bg-background-pure border-primary text-primary hover:bg-background-ultra"
                      onClick={() => handleViewDetails(index)}
                      disabled={isLoading === `result-${index}`}
                      aria-label={`View details for ${result.scanner} backtest`}
                    >
                      {isLoading === `result-${index}` ? (
                        <>
                          <div className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          Loading...
                        </>
                      ) : (
                        "View Details"
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-background-soft">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Start Backtesting Today</h2>
          <p className="text-xl mb-8 opacity-90">
            Test your strategies with historical data and improve your trading performance
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="secondary" 
              size="lg"
              className="bg-background-soft text-primary hover:bg-background-pure"
              aria-label="Try free backtest"
            >
              Try Free Backtest
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="bg-transparent border-background-soft text-background-soft hover:bg-background-soft hover:text-primary"
              aria-label="Learn more about backtesting"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BacktestScanners;