import React from 'react';
import { TrendingUp, Zap, Target, Droplets, CheckCircle, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const Indicators = () => {
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
        'Trend Wave Analysis',
        'Strategic Precision'
      ],
      icon: Target
    },
    {
      id: 'liquidity-trader',
      title: 'LIQUIDITY TRADER',
      headline: 'Unveiling Market Depths: Navigating with Liquidity Trader',
      description: 'In the intricate tapestry of financial markets, staying ahead is an art. Liquidity Trader is your gateway to mastering this art by deciphering liquidity zones and strategically positioning yourself in anticipation of institutional moves.',
      features: [
        {
          title: 'Decoding Liquidity Zones',
          description: 'Reveals critical areas where institutional presence is strongest.'
        },
        {
          title: 'Anticipating Institutional Moves',
          description: 'Stay ahead of big players with predictive liquidity analysis.'
        },
        {
          title: 'Tactical Entry and Exit Points',
          description: 'Precision timing based on liquidity flow patterns.'
        },
        {
          title: 'Real-Time Institutional Insights',
          description: 'Live window into institutional trading activities.'
        },
        {
          title: 'Adaptable to Market Conditions',
          description: 'Flexible design that adjusts to changing market liquidity.'
        },
        {
          title: 'Elevate Your Trading Precision',
          description: 'Trade with confidence using institutional-grade intelligence.'
        }
      ],
      benefits: [
        'Institutional Intelligence',
        'Liquidity Mapping',
        'Precision Entry'
      ],
      icon: Droplets
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary via-primary/90 to-secondary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">PREMIUM INDICATORS</h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Professional trading indicators designed for serious traders
          </p>
          <div className="flex items-center justify-center gap-2 text-lg">
            <TrendingUp className="h-6 w-6" />
            <span>Advanced • Precise • Profitable</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 space-y-20">
        {indicators.map((indicator, index) => (
          <div key={indicator.id} className="space-y-8">
            {/* Indicator Header */}
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <indicator.icon className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-4xl font-bold text-primary">{indicator.title}</h2>
              </div>
              <h3 className="text-2xl font-semibold text-foreground max-w-4xl mx-auto">
                {indicator.headline}
              </h3>
              <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                {indicator.description}
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Key Features */}
              <div>
                <h4 className="text-2xl font-bold mb-6 text-foreground">Key Features</h4>
                <div className="space-y-6">
                  {indicator.features.map((feature, idx) => (
                    <div key={idx} className="space-y-2">
                      <h5 className="text-lg font-semibold text-primary flex items-center gap-2">
                        <CheckCircle className="h-5 w-5" />
                        {feature.title}
                      </h5>
                      <p className="text-muted-foreground ml-7">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Benefits & CTA */}
              <div>
                <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-8 space-y-6">
                  <h4 className="text-2xl font-bold text-foreground">Why Choose {indicator.title}?</h4>
                  <div className="space-y-3">
                    {indicator.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        <span className="font-medium">{benefit}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">How it Works:</p>
                      <p className="text-sm">
                        {indicator.title} calculates critical indicators and employs advanced algorithms 
                        to determine optimal entry and exit points with precision timing.
                      </p>
                    </div>
                    
                    <Button className="w-full" size="lg">
                      Get {indicator.title}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    
                    <div className="text-center space-y-1">
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        7-Day Money Back Guarantee
                      </Badge>
                      <p className="text-xs text-muted-foreground">Instant access upon purchase</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            {index < indicators.length - 1 && (
              <div className="border-t border-border my-16"></div>
            )}
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Trading?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of successful traders using XenAlgo indicators
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              View All Packages
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
              Try Free Demo
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Indicators;