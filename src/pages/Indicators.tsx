import React, { useState, useCallback } from 'react';
import { TrendingUp, Zap, Target, Droplets, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Link } from 'react-router-dom';

const Indicators = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const indicators = [
    {
      id: 'trend-trader',
      title: 'TREND TRADER V2.0',
      headline: 'Unlocking Profit Potential with Trend Trader V2.0: A Strategic Approach to Trading Trends',
      description: 'In the dynamic world of trading, recognizing and capitalizing on market trends is paramount for success. Introducing Trend Trader V2.0, a powerful trading strategy designed for individuals who navigate markets with a focus on trends, often employing substantial stop-loss and target levels.',
      features: [
        {
          title: 'RSI Smoothing',
          description: 'Trend Trader V2.0 integrates the Relative Strength Index (RSI) with a customizable smoothing factor (SF), providing a refined view of market momentum.'
        },
        {
          title: 'QQE Crosses',
          description: 'Utilizing the Quantitative Qualitative Estimation (QQE) factor, the strategy identifies strategic entry and exit points.'
        },
        {
          title: 'Adaptive Algorithms',
          description: 'The algorithm employs adaptive algorithms to fine-tune its parameters, ensuring flexibility in response to varying market dynamics.'
        }
      ],
      benefits: [
        'Precision Timing',
        'Adaptability',
        'Automated Alerts'
      ],
      icon: TrendingUp
    },
    {
      id: 'advanced-scalper',
      title: 'ADVANCED SCALPER',
      headline: 'Unleash the Power of Micro Movements with Advanced Scalper',
      description: 'Welcome to the realm of Advanced Scalper, a cutting-edge indicator designed for nimble traders seeking to capitalize on micro-movements in the market. Crafted to perfection, this tool leverages volume spikes and buy-sell data, allowing you to dive into multiple trades within a day while maintaining effectiveness in capturing substantial reversal trends.',
      features: [
        {
          title: 'Precision Volume Analysis',
          description: 'Volume Spike Multiplier calibrated at 3.0 for optimal signal detection.'
        },
        {
          title: 'Swift Scalping, Grand Reversals',
          description: 'Tailored for rapid yet effective scalping while capturing major trend reversals.'
        },
        {
          title: 'Real-time Buy-Sell Insights',
          description: 'Intuitive signals with distinct shapes for clear market direction.'
        },
        {
          title: 'Adaptable to Dynamic Market Conditions',
          description: 'Responds intelligently to changes in volume dynamics and market volatility.'
        },
        {
          title: 'Elevate Your Scalping Game',
          description: 'Perfect for both seasoned scalpers and aspiring day traders.'
        }
      ],
      benefits: [
        'Micro Movement Capture',
        'Volume Intelligence',
        'Rapid Execution'
      ],
      icon: Zap
    },
    {
      id: 'swing-master',
      title: 'SWING MASTER',
      headline: 'Mastering Swings: Navigate the Market Waves with Swing Master',
      description: 'Swing Master V2.0 is not just an indicator; it\'s your compass in the dynamic seas of the financial markets. Tailored for traders with a strategic vision, Swing Master is your ally in holding positions for extended periods, typically spanning 10 to 12 days.',
      features: [
        {
          title: 'Extending Time, Expanding Opportunities',
          description: 'Designed specifically for 10-12 day position holds with optimal entry and exit timing.'
        },
        {
          title: 'Strategic Entry and Exit Points',
          description: 'Precision-based algorithm identifies high-probability swing opportunities.'
        },
        {
          title: 'Riding the Trend Waves',
          description: 'Provides insights into trend duration and intensity for better position management.'
        },
        {
          title: 'Dynamic Risk Management',
          description: 'Real-time risk assessment and position sizing recommendations.'
        },
        {
          title: 'Tailored for the Modern Trader',
          description: 'User-friendly interface with customizable parameters.'
        },
        {
          title: 'Elevate Your Swing Trading Experience',
          description: 'Comprehensive toolkit for swing trading mastery.'
        }
      ],
      benefits: [
        'Extended Position Management',
        'Strategic Timing',
        'Risk Optimization'
      ],
      icon: Target
    },
    {
      id: 'momentum-master',
      title: 'MOMENTUM MASTER',
      headline: 'Harnessing Market Momentum: Your Gateway to Profitable Trading',
      description: 'Momentum Master is a sophisticated indicator designed to capture and capitalize on market momentum. This powerful tool combines multiple technical analysis techniques to identify high-probability trading opportunities in trending markets.',
      features: [
        {
          title: 'Multi-Timeframe Analysis',
          description: 'Analyzes momentum across multiple timeframes for comprehensive market insight.'
        },
        {
          title: 'Momentum Divergence Detection',
          description: 'Identifies momentum divergences that often precede trend reversals.'
        },
        {
          title: 'Volume Confirmation',
          description: 'Uses volume analysis to confirm momentum signals and filter out false positives.'
        },
        {
          title: 'Adaptive Parameters',
          description: 'Automatically adjusts parameters based on market volatility and conditions.'
        },
        {
          title: 'Real-time Alerts',
          description: 'Instant notifications for momentum shifts and trading opportunities.'
        }
      ],
      benefits: [
        'Momentum Capture',
        'Divergence Detection',
        'Volume Confirmation'
      ],
      icon: Droplets
    }
  ];

  // Memoized indicator click handler
  const handleIndicatorClick = useCallback(async (indicatorId: string) => {
    try {
      setIsLoading(true);
      
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: "Indicator Selected",
        description: `Redirecting to ${indicatorId} details...`,
        variant: "default",
      });
      
      // Navigate to indicator detail page
      window.location.href = `/indicator/${indicatorId}`;
    } catch (error) {
      console.error('Error navigating to indicator:', error);
      toast({
        title: "Navigation Error",
        description: "Failed to navigate to indicator details.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Memoized purchase handler
  const handlePurchase = useCallback(async (indicatorId: string) => {
    try {
      setIsLoading(true);
      
      // Simulate purchase process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Purchase Successful",
        description: `You have successfully purchased ${indicatorId}!`,
        variant: "default",
      });
    } catch (error) {
      console.error('Error processing purchase:', error);
      toast({
        title: "Purchase Error",
        description: "Failed to process purchase. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return (
    <div className="min-h-screen bg-background-soft">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/10 via-background-pure to-background-soft">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              Professional Trading Indicators
            </h1>
            <p className="text-lg text-primary max-w-4xl mx-auto leading-relaxed">
              Discover our collection of advanced trading indicators designed to enhance your trading performance. 
              Each indicator is crafted with precision and tested for reliability across various market conditions.
            </p>
          </div>
        </div>
      </section>

      {/* Indicators Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {indicators.map((indicator) => (
              <Card key={indicator.id} className="bg-background-pure border border-border-light hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <indicator.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-primary">{indicator.title}</CardTitle>
                      <p className="text-sm text-primary">{indicator.headline}</p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <p className="text-primary leading-relaxed">
                    {indicator.description}
                  </p>
                  
                  {/* Features */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-primary">Key Features:</h4>
                    <div className="space-y-3">
                      {indicator.features.slice(0, 3).map((feature, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-primary">{feature.title}</p>
                            <p className="text-primary ml-7">{feature.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Benefits */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-primary">Benefits:</h4>
                    <div className="flex flex-wrap gap-2">
                      {indicator.benefits.map((benefit, index) => (
                        <Badge key={index} variant="outline" className="bg-background-ultra text-primary border-primary">
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {/* How it Works */}
                  <div className="bg-background-ultra p-4 rounded-lg">
                    <p className="text-sm text-primary">How it Works:</p>
                    <p className="text-primary mt-2">
                      The indicator analyzes market data in real-time, providing clear buy/sell signals 
                      with customizable parameters to suit your trading style.
                    </p>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Button
                      onClick={() => handleIndicatorClick(indicator.id)}
                      disabled={isLoading}
                      className="flex-1 bg-primary text-background-soft hover:bg-primary-light"
                      aria-label={`View details for ${indicator.title}`}
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          Loading...
                        </>
                      ) : (
                        <>
                          Learn More
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                    
                    <Button
                      onClick={() => handlePurchase(indicator.id)}
                      disabled={isLoading}
                      variant="outline"
                      className="flex-1 bg-background-pure border-primary text-primary hover:bg-background-ultra"
                      aria-label={`Purchase ${indicator.title}`}
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Purchase Now
                          <CheckCircle className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                  
                  {/* Instant Access Badge */}
                  <div className="text-center">
                    <Badge variant="success" className="bg-success/10 text-success border-success/20">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Instant access upon purchase
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-background-pure border-t border-border-light">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary mb-4">
            Ready to Transform Your Trading?
          </h2>
          <p className="text-primary mb-8 max-w-2xl mx-auto">
            Join thousands of traders who have already improved their performance with our professional indicators.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/indicator-store">
              <Button className="bg-primary text-background-soft hover:bg-primary-light">
                View All Indicators
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/courses">
              <Button variant="outline" className="bg-background-pure border-primary text-primary hover:bg-background-ultra">
                Learn Trading
                <Target className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Indicators;