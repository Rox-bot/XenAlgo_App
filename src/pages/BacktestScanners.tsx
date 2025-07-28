import React from 'react';
import { TrendingUp, BarChart3, Calendar, Target, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const BacktestScanners = () => {
  const backtestTools = [
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
  ];

  const sampleResults = [
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
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary/80">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-primary-foreground">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Backtest Swing Scanners
            </h1>
            <p className="text-xl mb-8 text-primary-foreground/90">
              Test your trading strategies with historical data and optimize your performance
            </p>
          </div>
        </div>
      </section>

      {/* Backtest Tools */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Backtest Tools</h2>
            <p className="text-muted-foreground">
              Comprehensive backtesting tools to validate your trading strategies
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {backtestTools.map((tool) => (
              <Card key={tool.id} className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
                  <div className="flex items-center gap-4">
                    <tool.icon className="h-12 w-12 text-primary" />
                    <div>
                      <CardTitle className="text-2xl">{tool.title}</CardTitle>
                      <p className="text-muted-foreground mt-2">{tool.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {/* Features */}
                    <div>
                      <h4 className="font-semibold mb-3">Key Features:</h4>
                      <ul className="space-y-2">
                        {tool.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Timeframes */}
                    <div>
                      <h4 className="font-semibold mb-3">Available Timeframes:</h4>
                      <div className="flex flex-wrap gap-2">
                        {tool.timeframes.map((timeframe) => (
                          <Badge key={timeframe} variant="secondary">
                            {timeframe}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Performance Metrics */}
                    <div>
                      <h4 className="font-semibold mb-3">Sample Performance:</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                          <div className="text-lg font-bold text-green-600">
                            {tool.metrics.avgReturn}
                          </div>
                          <div className="text-xs text-muted-foreground">Avg Return</div>
                        </div>
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                          <div className="text-lg font-bold text-blue-600">
                            {tool.metrics.successRate}
                          </div>
                          <div className="text-xs text-muted-foreground">Success Rate</div>
                        </div>
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                          <div className="text-lg font-bold text-red-600">
                            {tool.metrics.maxDrawdown}
                          </div>
                          <div className="text-xs text-muted-foreground">Max Drawdown</div>
                        </div>
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                          <div className="text-lg font-bold text-purple-600">
                            {tool.metrics.profitFactor}
                          </div>
                          <div className="text-xs text-muted-foreground">Profit Factor</div>
                        </div>
                      </div>
                    </div>

                    <Button className="w-full" size="lg">
                      <Target className="mr-2 h-4 w-4" />
                      Back Test Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Use Our Backtest Tools?</h2>
            <p className="text-muted-foreground">
              Make data-driven decisions with comprehensive historical analysis
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Calendar className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Historical Data Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Access years of historical market data to test your strategies across different market conditions
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <TrendingUp className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Get detailed performance metrics including returns, drawdowns, and success rates
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <TrendingDown className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Risk Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
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
            <h2 className="text-3xl font-bold mb-4">Recent Backtest Results</h2>
            <p className="text-muted-foreground">
              See how our scanners have performed recently
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Latest Backtest Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sampleResults.map((result, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-sm font-medium">{result.date}</div>
                        <Badge variant="secondary" className="mt-1">
                          {result.status}
                        </Badge>
                      </div>
                      <div>
                        <h4 className="font-medium">{result.scanner}</h4>
                        <p className="text-sm text-muted-foreground">
                          {result.trades} trades • {result.winners} winners • {result.losers} losers
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">
                        {result.avgReturn}
                      </div>
                      <div className="text-sm text-muted-foreground">Avg Return</div>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Start Backtesting Today</h2>
          <p className="text-xl mb-8 text-primary-foreground/90">
            Test your strategies with historical data and improve your trading performance
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg">
              Try Free Backtest
            </Button>
            <Button variant="outline" size="lg" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
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