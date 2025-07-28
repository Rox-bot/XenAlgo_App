import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Brain, 
  BarChart3, 
  Zap, 
  DollarSign, 
  CheckCircle, 
  Star, 
  Shield, 
  Clock, 
  Users,
  TrendingUp,
  Target,
  Calculator,
  BookOpen,
  AlertTriangle,
  LineChart,
  Settings,
  Smartphone,
  Globe,
  Award,
  Play,
  Sparkles,
  ArrowUpRight,
  BarChart,
  PieChart,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const Home = () => {
  const heroFeatures = [
    { icon: Brain, text: "AI-Powered Strategy Recommender" },
    { icon: BarChart3, text: "Advanced Trading Analytics" },
    { icon: Calculator, text: "Financial Calculators Suite" },
    { icon: Target, text: "Option Strategy Simulator" }
  ];

  const platformFeatures = [
    {
      category: "Trading Tools",
      features: [
        {
          icon: TrendingUp,
          title: "Trading Journal",
          description: "Track trades, analyze performance, and optimize strategies with detailed analytics",
          link: "/trading-journal",
          badge: "Popular",
          gradient: "from-blue-500 to-cyan-500"
        },
        {
          icon: Brain,
          title: "AI Strategy Recommender",
          description: "Get intelligent option strategy recommendations based on market conditions",
          link: "/option-recommender",
          badge: "New",
          gradient: "from-purple-500 to-pink-500"
        },
        {
          icon: Target,
          title: "Option Simulator",
          description: "Build and test option strategies with real-time P&L visualization",
          link: "/option-simulator",
          badge: "Advanced",
          gradient: "from-green-500 to-emerald-500"
        },
        {
          icon: BarChart3,
          title: "Trading Analytics",
          description: "Comprehensive performance analysis with charts and insights",
          link: "/trading-journal/analytics",
          gradient: "from-orange-500 to-red-500"
        }
      ]
    },
    {
      category: "Financial Tools",
      features: [
        {
          icon: Calculator,
          title: "Financial Calculators",
          description: "EMI, SIP, Retirement, Tax, and more financial planning tools",
          link: "/calculators",
          gradient: "from-indigo-500 to-purple-500"
        },
        {
          icon: AlertTriangle,
          title: "Market Screeners",
          description: "Find stocks based on technical indicators and fundamental data",
          link: "/screeners",
          gradient: "from-yellow-500 to-orange-500"
        },
        {
          icon: LineChart,
          title: "Technical Indicators",
          description: "Advanced charting with 50+ technical indicators",
          link: "/indicators",
          gradient: "from-teal-500 to-cyan-500"
        },
        {
          icon: BookOpen,
          title: "Educational Courses",
          description: "Learn trading strategies and market analysis",
          link: "/courses",
          gradient: "from-pink-500 to-rose-500"
        }
      ]
    }
  ];

  const pricingPlans = [
    {
      name: "Free",
      price: "₹0",
      period: "/month",
      features: [
        "15 monthly trades",
        "Basic calculators",
        "Limited indicators",
        "Community support"
      ],
      popular: false,
      cta: "Get Started Free",
      gradient: "from-gray-400 to-gray-600"
    },
    {
      name: "Premium",
      price: "₹1,999",
      period: "/month",
      features: [
        "100 monthly trades",
        "All calculators",
        "Advanced indicators",
        "AI strategy recommender",
        "Option simulator",
        "Priority support"
      ],
      popular: true,
      cta: "Start Premium Trial",
      gradient: "from-blue-500 to-purple-600"
    },
    {
      name: "Pro",
      price: "₹4,999",
      period: "/month",
      features: [
        "Unlimited trades",
        "All features",
        "Custom strategies",
        "API access",
        "Dedicated support",
        "Advanced analytics"
      ],
      popular: false,
      cta: "Go Pro",
      gradient: "from-purple-500 to-pink-600"
    }
  ];

  const testimonials = [
    {
      name: "Rahul Sharma",
      role: "Software Engineer, Accenture",
      content: "The AI strategy recommender is game-changing! It helped me identify the perfect option strategies for different market conditions.",
      rating: 5,
      avatar: "RS"
    },
    {
      name: "Sameera Bhatnagar",
      role: "Product Manager, Make My Trip",
      content: "The trading journal with real-time analytics has completely transformed my trading approach. The P&L tracking is incredibly accurate.",
      rating: 5,
      avatar: "SB"
    },
    {
      name: "Aman Patel",
      role: "Financial Analyst, Eclerx",
      content: "The option simulator is brilliant! I can test complex strategies before deploying them. The Greeks calculation is spot-on.",
      rating: 5,
      avatar: "AP"
    },
    {
      name: "Kiara Mishra",
      role: "Manager, Infosys",
      content: "The freemium model is perfect for beginners. I started with the free plan and upgraded as I learned more.",
      rating: 5,
      avatar: "KM"
    }
  ];

  const stats = [
    { number: "50,000+", label: "Active Traders", icon: Users },
    { number: "₹2.5Cr+", label: "Trading Volume", icon: DollarSign },
    { number: "95%", label: "Success Rate", icon: Award },
    { number: "24/7", label: "Support Available", icon: Clock }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary/90 to-secondary text-primary-foreground py-32 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-secondary/20" />
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-accent/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute top-40 right-20 w-32 h-32 bg-accent/10 rounded-full blur-2xl animate-pulse delay-1000" />
        <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-accent/30 rounded-full blur-lg animate-pulse delay-500" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Sparkles className="h-6 w-6 text-accent" />
              <Badge variant="secondary" className="bg-accent/20 text-accent border-accent/30">
                AI-Powered Trading Platform
              </Badge>
            </div>
            
            <h1 className="text-6xl lg:text-7xl font-bold leading-tight mb-8">
              Master the Markets with{" "}
              <span className="bg-gradient-to-r from-accent to-accent/80 bg-clip-text text-transparent">
                XenAlgo
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl opacity-90 mb-12 max-w-3xl mx-auto leading-relaxed">
              AI-powered trading tools, advanced analytics, and intelligent strategy recommendations for modern traders.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {heroFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm rounded-full px-4 py-2 border border-primary-foreground/20">
                  <feature.icon className="h-4 w-4 text-accent" />
                  <span className="text-sm font-medium">{feature.text}</span>
                </div>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                  Start Trading Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 text-lg px-8 py-6 rounded-full backdrop-blur-sm"
                onClick={() => {
                  const pricingSection = document.getElementById('pricing-section');
                  pricingSection?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary/10 to-primary/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="h-8 w-8 text-primary" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Everything You Need to Trade Successfully
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Professional-grade tools for modern traders
            </p>
          </div>
          
          <Tabs defaultValue="trading" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-12 bg-muted/50 p-1 rounded-xl">
              <TabsTrigger value="trading" className="rounded-lg">Trading Tools</TabsTrigger>
              <TabsTrigger value="financial" className="rounded-lg">Financial Tools</TabsTrigger>
            </TabsList>
            
            {platformFeatures.map((category) => (
              <TabsContent key={category.category} value={category.category.toLowerCase().replace(' ', '')}>
                <div className="grid md:grid-cols-2 gap-8">
                  {category.features.map((feature, index) => (
                    <Card key={index} className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 bg-gradient-to-br from-background to-muted/50 overflow-hidden">
                      <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                      <CardHeader className="relative">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg`}>
                              <feature.icon className="h-7 w-7 text-white" />
                            </div>
                            <div>
                              <CardTitle className="text-xl">{feature.title}</CardTitle>
                              {feature.badge && (
                                <Badge variant="secondary" className="mt-2 bg-gradient-to-r from-accent/20 to-accent/10 text-accent border-accent/30">
                                  {feature.badge}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <Link to={feature.link}>
                            <Button variant="ghost" size="sm" className="group-hover:bg-accent/10 group-hover:text-accent transition-colors">
                              <ArrowUpRight className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </CardHeader>
                      <CardContent className="relative">
                        <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              How XenAlgo Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to trading success
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: "1",
                title: "Analyze Market Conditions",
                description: "Input your market outlook, risk tolerance, and capital. Our AI analyzes current conditions.",
                icon: BarChart,
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                step: "2",
                title: "Get AI Recommendations",
                description: "Receive intelligent strategy recommendations optimized for your profile and market conditions.",
                icon: Brain,
                gradient: "from-purple-500 to-pink-500"
              },
              {
                step: "3",
                title: "Execute & Track",
                description: "Execute trades with confidence and track performance with detailed analytics and insights.",
                icon: Activity,
                gradient: "from-green-500 to-emerald-500"
              }
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-8">
                  <div className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-2xl font-semibold mb-4">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing-section" className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Choose Your Plan
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Start free, upgrade as you grow
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`relative group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 ${
                plan.popular ? 'border-primary shadow-xl scale-105' : 'border-border'
              }`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-primary to-primary/80 text-white border-0">
                    Most Popular
                  </Badge>
                )}
                <div className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-lg`} />
                <CardHeader className="text-center relative">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="flex items-baseline justify-center gap-1 mt-4">
                    <span className="text-5xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 relative">
                  <ul className="space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className={`w-full py-6 text-lg rounded-xl ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70' 
                      : 'bg-muted hover:bg-muted/80'
                  }`}>
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              What Our Traders Say
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of successful traders
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-gradient-to-br from-background to-muted/50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mb-6 leading-relaxed">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="text-sm font-semibold text-primary">{testimonial.avatar}</span>
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary via-primary/90 to-secondary text-primary-foreground relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-secondary/20" />
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-5xl font-bold mb-6">
            Ready to Transform Your Trading?
          </h2>
          <p className="text-xl opacity-90 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join thousands of traders who are already using XenAlgo to make smarter trading decisions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                Start Trading Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 text-lg px-8 py-6 rounded-full backdrop-blur-sm">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;