import React from 'react';
import { BarChart3, TrendingUp, Building, Search, ArrowRight, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const Screeners = () => {
  const screeners = [
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
  ];

  const comingSoonScreeners = [
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
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary via-primary/90 to-secondary text-primary-foreground py-20">
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
            <Card key={scanner.id} className="relative overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105">
              {!scanner.available && (
                <Badge className="absolute top-4 right-4 bg-orange-500">Coming Soon</Badge>
              )}
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-primary/10 text-primary">
                  <scanner.icon className="h-8 w-8" />
                </div>
                <CardTitle className="text-xl">{scanner.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-center">{scanner.description}</p>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Features:</h4>
                  <ul className="space-y-1">
                    {scanner.features.map((feature, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Button 
                  className="w-full" 
                  variant={scanner.available ? "default" : "secondary"}
                  disabled={!scanner.available}
                >
                  {scanner.available ? (
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
        <div className="bg-muted/30 rounded-2xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">How Our Scanners Work</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold">Real-time Data Processing</h3>
              <p className="text-muted-foreground">
                Our scanners continuously analyze market data from multiple sources to identify opportunities.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold">Advanced Filtering</h3>
              <p className="text-muted-foreground">
                Apply sophisticated filters based on technical, fundamental, and volume criteria.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold">Actionable Results</h3>
              <p className="text-muted-foreground">
                Get curated lists of stocks that meet your specific trading criteria with detailed insights.
              </p>
            </div>
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">More Scanners Coming Soon</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {comingSoonScreeners.map((scanner, index) => (
              <Card key={index} className="opacity-60 border-dashed">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-muted text-muted-foreground">
                    <scanner.icon className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-lg">{scanner.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm text-center mb-4">{scanner.description}</p>
                  <Button variant="ghost" size="sm" disabled className="w-full">
                    <Clock className="mr-2 h-4 w-4" />
                    Coming Soon...
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Features Comparison */}
        <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-center mb-8">Scanner Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold">Real-time Updates</h3>
              <p className="text-sm text-muted-foreground">Live market data processing</p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold">Advanced Analytics</h3>
              <p className="text-sm text-muted-foreground">Sophisticated screening algorithms</p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto">
                <Search className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold">Custom Filters</h3>
              <p className="text-sm text-muted-foreground">Personalized screening criteria</p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mx-auto">
                <Building className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold">Institutional Data</h3>
              <p className="text-sm text-muted-foreground">Professional-grade insights</p>
            </div>
          </div>
        </div>
      </div>

      {/* TradingView Integration Footer */}
      <div className="bg-muted py-8">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-xl font-semibold mb-4">Track all markets on TradingView</h3>
          <p className="text-muted-foreground mb-4">
            Integrate our scanner results with TradingView for comprehensive market analysis
          </p>
          <Button variant="outline">
            Connect TradingView
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Screeners;