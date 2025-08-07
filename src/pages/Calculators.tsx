import React, { useState, useMemo, useCallback } from 'react';
import { Calculator, TrendingUp, PiggyBank, Home, Target, DollarSign, Percent, Clock, CreditCard, Building, Car, Wallet, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from 'react-router-dom';
import { useCurrency, currencies } from '@/contexts/CurrencyContext';
import { toast } from 'sonner';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const Calculators = () => {
  const { currency, setCurrency } = useCurrency();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  const calculators = [
    {
      id: 'compound-interest',
      title: 'Compound Interest',
      description: 'See how your investments grow with compound interest over time',
      icon: TrendingUp,
      path: '/calculators/compound-interest',
      category: 'investing'
    },
    {
      id: 'loan-emi',
      title: 'Loan EMI',
      description: 'Calculate your monthly loan payments with part payment options',
      icon: Home,
      path: '/calculators/loan-emi',
      category: 'loans'
    },
    {
      id: 'sip',
      title: 'SIP Calculator',
      description: 'Plan your systematic investment with SIP increases',
      icon: PiggyBank,
      path: '/calculators/sip',
      category: 'investing'
    },
    {
      id: 'retirement',
      title: 'Retirement Planning',
      description: 'Calculate how much you need to save for retirement',
      icon: Target,
      path: '/calculators/retirement',
      category: 'planning'
    },
    {
      id: 'risk',
      title: 'Risk Management',
      description: 'Calculate optimal position sizing for trading',
      icon: Percent,
      path: '/calculators/risk',
      category: 'trading'
    },
    {
      id: 'mortgage',
      title: 'Mortgage Calculator',
      description: 'Calculate home loan payments with refinancing options',
      icon: Building,
      path: '/calculators/mortgage',
      category: 'loans'
    },
    {
      id: 'car-loan',
      title: 'Car Loan',
      description: 'Calculate auto loan payments and total costs',
      icon: Car,
      path: '/calculators/car-loan',
      category: 'loans'
    },
    {
      id: 'tax',
      title: 'Tax Calculator',
      description: 'Calculate income tax and optimize your tax planning',
      icon: DollarSign,
      path: '/calculators/tax',
      category: 'planning'
    },
    {
      id: 'inflation',
      title: 'Inflation Calculator',
      description: 'See how inflation affects your purchasing power',
      icon: Clock,
      path: '/calculators/inflation',
      category: 'planning'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Calculators', icon: Calculator },
    { id: 'investing', name: 'Investing', icon: TrendingUp },
    { id: 'loans', name: 'Loans', icon: DollarSign },
    { id: 'planning', name: 'Planning', icon: Target },
    { id: 'trading', name: 'Trading', icon: Percent }
  ];

  // Memoized filtered calculators for better performance
  const filteredCalculators = useMemo(() => {
    try {
      return selectedCategory === 'all' 
        ? calculators 
        : calculators.filter(calc => calc.category === selectedCategory);
    } catch (error) {
      console.error('Error filtering calculators:', error);
      return calculators;
    }
  }, [selectedCategory]);

  // Enhanced currency selection with error handling
  const handleCurrencyChange = useCallback((value: string) => {
    try {
      setIsLoading(true);
      const selectedCurrency = currencies.find(c => c.code === value);
      if (selectedCurrency) {
        setCurrency(selectedCurrency);
        toast.success(`Currency changed to ${selectedCurrency.code}`);
      } else {
        toast.error('Invalid currency selected');
      }
    } catch (error) {
      console.error('Error changing currency:', error);
      toast.error('Failed to change currency');
    } finally {
      setIsLoading(false);
    }
  }, [setCurrency]);

  // Enhanced category selection with error handling
  const handleCategoryChange = useCallback((categoryId: string) => {
    try {
      setSelectedCategory(categoryId);
    } catch (error) {
      console.error('Error changing category:', error);
      toast.error('Failed to change category');
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="bg-gradient-to-br from-background via-background-soft to-background-ultra">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-background-soft">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center">
              <div className="flex items-center justify-between mb-8">
                <div></div> {/* Spacer */}
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-background-soft" />
                  <Select
                    value={currency.code}
                    onValueChange={handleCurrencyChange}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="w-32 bg-background-soft/20 border-background-soft/30 text-background-soft focus:border-background-soft focus:ring-2 focus:ring-background-soft/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background-pure border border-border-light">
                      {currencies.map((curr) => (
                        <SelectItem key={curr.code} value={curr.code} className="text-primary hover:bg-background-ultra">
                          {curr.symbol} {curr.code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in text-background-soft">
                Premium Calculators
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-background-soft/90 animate-fade-in">
                Advanced financial calculators with smart features and insights
              </p>
              <div className="flex items-center justify-center gap-2 text-lg animate-fade-in text-background-soft">
                <Calculator className="h-6 w-6" />
                <span>Professional • Intelligent • Precise</span>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Category Filter */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 justify-center" role="tablist" aria-label="Calculator categories">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-primary text-background-soft shadow-lg scale-105'
                      : 'bg-background-pure text-primary hover:bg-background-ultra shadow-md border border-border-light'
                  }`}
                  role="tab"
                  aria-selected={selectedCategory === category.id}
                  aria-label={`Filter by ${category.name}`}
                >
                  <category.icon className="h-4 w-4" />
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Calculator Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8" role="grid" aria-label="Available calculators">
            {filteredCalculators.map((calc) => (
              <Link key={calc.id} to={calc.path} aria-label={`Open ${calc.title} calculator`}>
                <Card className="cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 border-border-light bg-background-pure hover:bg-background-ultra">
                  <CardHeader className="text-center">
                    <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-primary/10 text-primary">
                      <calc.icon className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-lg text-primary">{calc.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-primary text-sm text-center">{calc.description}</p>
                    <div className="mt-4 text-center">
                      <Button variant="outline" size="sm" className="border-border-light text-primary hover:bg-background-ultra">
                        Open Calculator
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Coming Soon Section */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-center mb-8 text-primary">More Calculators Coming Soon</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: 'Options Calculator', description: 'Calculate options premiums and Greeks', icon: TrendingUp },
                { title: 'Portfolio Optimizer', description: 'Optimize your investment portfolio', icon: PiggyBank },
                { title: 'Debt Consolidation', description: 'Calculate debt consolidation benefits', icon: CreditCard }
              ].map((calc, index) => (
                <Card key={index} className="opacity-60 border-dashed border-border-light bg-background-pure">
                  <CardHeader className="text-center">
                    <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-background-ultra text-primary">
                      <calc.icon className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-lg text-primary">{calc.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-primary text-sm text-center">{calc.description}</p>
                    <div className="mt-4 text-center">
                      <Button variant="ghost" size="sm" disabled className="text-primary">
                        Coming Soon...
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Calculators;