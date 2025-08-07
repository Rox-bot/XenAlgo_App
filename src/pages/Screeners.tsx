import React, { useState, useCallback, useMemo } from 'react';
import { BarChart3, TrendingUp, Building, Search, ArrowRight, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const Screeners = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  // Memoized screeners data
  const screeners = useMemo(() => [
    {
      id: 'volume-scanner',
      title: 'Daily Volume Scanner',
      description: 'This scanner will tell you which stocks are in the limelight.',
      icon: BarChart3,
      available: true,
      features: [
        'Real-time volume analysis',
        'Unusual volume alerts',
        'Market leaders identification',
        'Institutional activity tracking'
      ]
    },
    {
      id: 'fundamental-scanner',
      title: 'Fundamental Scanner',
      description: 'This scanner will tell you which stocks are fundamentally Good',
      icon: TrendingUp,
      available: true,
      features: [
        'P/E ratio analysis',
        'Revenue growth tracking',
        'Debt-to-equity ratios',
        'ROE and ROI metrics'
      ]
    },
    {
      id: 'technical-scanner',
      title: 'Technical Scanner',
      description: 'This scanner will tell you which stocks are good Technically.',
      icon: Search,
      available: false,
      features: [
        'Technical pattern recognition',
        'Moving average analysis',
        'Support and resistance levels',
        'Momentum indicators'
      ]
    },
    {
      id: 'institutional-scanner',
      title: 'Institutional Scanner',
      description: 'This scanner will tell you which stocks are favoured by the institutions',
      icon: Building,
      available: true,
      features: [
        'FII/DII holdings analysis',
        'Mutual fund investments',
        'Block deal tracking',
        'Institutional sentiment'
      ]
    }
  ], []);

  // Memoized coming soon screeners
  const comingSoonScreeners = useMemo(() => [
    {
      title: 'Options Scanner',
      description: 'Identify high-probability options trading opportunities',
      icon: TrendingUp
    },
    {
      title: 'Sector Scanner',
      description: 'Analyze sector-wise performance and opportunities',
      icon: BarChart3
    },
    {
      title: 'Momentum Scanner',
      description: 'Track stocks with strong momentum indicators',
      icon: Search
    }
  ], []);

  // Memoized scanner handler
  const handleScannerClick = useCallback(async (scannerId: string, scannerName: string) => {
    try {
      setIsLoading(scannerId);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Scanner Started",
        description: `${scannerName} is now analyzing the market...`,
        variant: "default",
      });
    } catch (error) {
      console.error('Error starting scanner:', error);
      toast({
        title: "Error",
        description: "Failed to start scanner. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(null);
    }
  }, [toast]);

  // Memoized TradingView connection handler
  const handleTradingViewConnect = useCallback(async () => {
    try {
      setIsLoading('tradingview');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "TradingView Connected",
        description: "Successfully connected to TradingView for enhanced analysis.",
        variant: "default",
      });
    } catch (error) {
      console.error('Error connecting to TradingView:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to TradingView. Please try again.",
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
      <div className="bg-gradient-to-r from-primary via-primary/90 to-luxury-gold text-background-soft py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Premium Scanners</h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Advanced market scanners to identify the best trading opportunities
          </p>
          <div className="flex items-center justify-center gap-2 text-lg">
            <Search className="h-6 w-6" />
            <span>Intelligent • Real-time • Comprehensive</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Main Scanners Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {screeners.map((scanner) => (
            <Card 
              key={scanner.id} 
              className="relative overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 bg-background-pure border border-border-light"
            >
              {!scanner.available && (
                <Badge className="absolute top-4 right-4 bg-warning text-background-soft">Coming Soon</Badge>
              )}
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-primary/10 text-primary">
                  <scanner.icon className="h-8 w-8" />
                </div>
                <CardTitle className="text-xl text-primary">{scanner.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-primary text-center">{scanner.description}</p>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-primary">Features:</h4>
                  <ul className="space-y-1">
                    {scanner.features.map((feature, idx) => (
                      <li key={idx} className="text-sm text-primary flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Button 
                  className={`w-full ${
                    scanner.available 
                      ? 'bg-primary text-background-soft hover:bg-primary-light' 
                      : 'bg-background-pure border border-border-light text-primary hover:bg-background-ultra'
                  }`}
                  variant={scanner.available ? "default" : "secondary"}
                  disabled={!scanner.available || isLoading === scanner.id}
                  onClick={() => scanner.available && handleScannerClick(scanner.id, scanner.title)}
                  aria-label={`${scanner.available ? 'Start' : 'Coming soon'} ${scanner.title} scanner`}
                >
                  {isLoading === scanner.id ? (
                    <>
                      <div className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Starting...
                    </>
                  ) : scanner.available ? (
                    <>
                      Scan Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      <Clock className="mr-2 h-4 w-4" />
                      Coming Soon...
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* How It Works Section */}
        <div className="bg-background-pure border border-border-light rounded-2xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-primary">How Our Scanners Work</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold text-primary">Real-time Data Processing</h3>
              <p className="text-primary">
                Our scanners continuously analyze market data from multiple sources to identify opportunities.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold text-primary">Advanced Filtering</h3>
              <p className="text-primary">
                Apply sophisticated filters based on technical, fundamental, and volume criteria.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold text-primary">Actionable Results</h3>
              <p className="text-primary">
                Get curated lists of stocks that meet your specific trading criteria with detailed insights.
              </p>
            </div>
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-primary">More Scanners Coming Soon</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {comingSoonScreeners.map((scanner, index) => (
              <Card key={index} className="opacity-60 border-dashed bg-background-pure border border-border-light">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-background-ultra text-primary">
                    <scanner.icon className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-lg text-primary">{scanner.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-primary text-sm text-center mb-4">{scanner.description}</p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    disabled 
                    className="w-full bg-background-pure border border-border-light text-primary hover:bg-background-ultra"
                    aria-label={`${scanner.title} coming soon`}
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    Coming Soon...
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Features Comparison */}
        <div className="bg-gradient-to-br from-primary/5 to-luxury-gold/5 rounded-2xl p-8 border border-border-light">
          <h2 className="text-3xl font-bold text-center mb-8 text-primary">Scanner Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mx-auto">
                <Clock className="h-6 w-6 text-success" />
              </div>
              <h3 className="font-semibold text-primary">Real-time Updates</h3>
              <p className="text-sm text-primary">Live market data processing</p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-info/10 flex items-center justify-center mx-auto">
                <TrendingUp className="h-6 w-6 text-info" />
              </div>
              <h3 className="font-semibold text-primary">Advanced Analytics</h3>
              <p className="text-sm text-primary">Sophisticated screening algorithms</p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-luxury-gold/10 flex items-center justify-center mx-auto">
                <Search className="h-6 w-6 text-luxury-gold" />
              </div>
              <h3 className="font-semibold text-primary">Custom Filters</h3>
              <p className="text-sm text-primary">Personalized screening criteria</p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center mx-auto">
                <Building className="h-6 w-6 text-warning" />
              </div>
              <h3 className="font-semibold text-primary">Institutional Data</h3>
              <p className="text-sm text-primary">Professional-grade insights</p>
            </div>
          </div>
        </div>
      </div>

      {/* TradingView Integration Footer */}
      <div className="bg-background-pure border-t border-border-light py-8">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-xl font-semibold mb-4 text-primary">Track all markets on TradingView</h3>
          <p className="text-primary mb-4">
            Integrate our scanner results with TradingView for comprehensive market analysis
          </p>
          <Button 
            variant="outline" 
            className="bg-background-pure border-primary text-primary hover:bg-background-ultra"
            onClick={handleTradingViewConnect}
            disabled={isLoading === 'tradingview'}
            aria-label="Connect to TradingView"
          >
            {isLoading === 'tradingview' ? (
              <>
                <div className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                Connect TradingView
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Screeners;