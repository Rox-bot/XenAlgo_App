
import React, { useState, useCallback } from 'react';
import { Calculator, TrendingUp, PiggyBank, Home, Target, DollarSign, Percent, Clock, CreditCard, Building, Car, Wallet, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { useCurrency, currencies } from '@/contexts/CurrencyContext';

const Index = () => {
  const { currency, setCurrency } = useCurrency();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  const calculators = [
    {
      id: 'compound-interest',
      title: 'Compound Interest',
      description: 'See how your investments grow with compound interest over time',
      icon: TrendingUp,
      path: '/compound-interest',
      category: 'investing'
    },
    {
      id: 'loan-emi',
      title: 'Loan EMI',
      description: 'Calculate your monthly loan payments with part payment options',
      icon: Home,
      path: '/loan-emi',
      category: 'loans'
    },
    {
      id: 'sip',
      title: 'SIP Calculator',
      description: 'Plan your systematic investment with SIP increases',
      icon: PiggyBank,
      path: '/sip',
      category: 'investing'
    },
    {
      id: 'retirement',
      title: 'Retirement Planning',
      description: 'Calculate how much you need to save for retirement',
      icon: Target,
      path: '/retirement',
      category: 'planning'
    },
    {
      id: 'risk',
      title: 'Risk Management',
      description: 'Calculate optimal position sizing for trading',
      icon: Percent,
      path: '/risk',
      category: 'trading'
    },
    {
      id: 'mortgage',
      title: 'Mortgage Calculator',
      description: 'Calculate home loan payments with refinancing options',
      icon: Building,
      path: '/mortgage',
      category: 'loans'
    },
    {
      id: 'car-loan',
      title: 'Car Loan',
      description: 'Calculate auto loan payments and total costs',
      icon: Car,
      path: '/car-loan',
      category: 'loans'
    },
    {
      id: 'tax',
      title: 'Tax Calculator',
      description: 'Calculate income tax and optimize your tax planning',
      icon: DollarSign,
      path: '/tax',
      category: 'planning'
    },
    {
      id: 'inflation',
      title: 'Inflation Calculator',
      description: 'See how inflation affects your purchasing power',
      icon: Clock,
      path: '/inflation',
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

  const filteredCalculators = selectedCategory === 'all' 
    ? calculators 
    : calculators.filter(calc => calc.category === selectedCategory);

  // Memoized currency change handler
  const handleCurrencyChange = useCallback(async (value: string) => {
    try {
      setIsLoading(true);
      
      // Simulate currency change delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setCurrency(value);
      
      toast({
        title: "Currency Updated",
        description: `Currency changed to ${value}`,
        variant: "default",
      });
    } catch (error) {
      console.error('Error changing currency:', error);
      toast({
        title: "Currency Error",
        description: "Failed to change currency. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [setCurrency, toast]);

  // Memoized category change handler
  const handleCategoryChange = useCallback(async (value: string) => {
    try {
      setIsLoading(true);
      
      // Simulate category change delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      setSelectedCategory(value);
      
      toast({
        title: "Category Updated",
        description: `Showing ${value === 'all' ? 'all calculators' : value} calculators`,
        variant: "default",
      });
    } catch (error) {
      console.error('Error changing category:', error);
      toast({
        title: "Category Error",
        description: "Failed to change category. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Memoized calculator click handler
  const handleCalculatorClick = useCallback(async (calculatorId: string, calculatorPath: string) => {
    try {
      setIsLoading(true);
      
      // Simulate navigation delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: "Navigating",
        description: `Opening ${calculatorId} calculator...`,
        variant: "default",
      });
      
      // Navigate to calculator
      window.location.href = calculatorPath;
    } catch (error) {
      console.error('Error navigating to calculator:', error);
      toast({
        title: "Navigation Error",
        description: "Failed to open calculator. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return (
    <div className="min-h-screen bg-background-soft">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Financial Calculators
          </h1>
          <p className="text-lg text-primary max-w-3xl mx-auto mb-8">
            Comprehensive financial calculators to help you make informed decisions about 
            investing, loans, retirement planning, and more.
          </p>
          
          {/* Currency Selector */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="text-primary font-medium">Currency:</span>
            <Select value={currency} onValueChange={handleCurrencyChange} disabled={isLoading}>
              <SelectTrigger className="w-32 bg-background-pure border-border-light text-primary">
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

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => handleCategoryChange(category.id)}
                disabled={isLoading}
                className={`flex items-center gap-2 ${
                  selectedCategory === category.id 
                    ? 'bg-primary text-background-soft hover:bg-primary-light' 
                    : 'bg-background-pure border-primary text-primary hover:bg-background-ultra'
                }`}
                aria-label={`Filter by ${category.name}`}
              >
                <category.icon className="w-4 h-4" />
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Calculators Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCalculators.map((calc) => (
            <Card 
              key={calc.id} 
              className="bg-background-pure border border-border-light hover:shadow-lg transition-all duration-300 cursor-pointer"
              onClick={() => handleCalculatorClick(calc.id, calc.path)}
              role="button"
              tabIndex={0}
              aria-label={`Open ${calc.title} calculator`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCalculatorClick(calc.id, calc.path);
                }
              }}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <calc.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg text-primary">{calc.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-primary text-sm text-center">{calc.description}</p>
                <div className="mt-4 text-center">
                  <Button 
                    className="bg-primary text-background-soft hover:bg-primary-light"
                    disabled={isLoading}
                    aria-label={`Calculate with ${calc.title}`}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Loading...
                      </>
                    ) : (
                      <>
                        Calculate
                        <Calculator className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredCalculators.length === 0 && (
          <div className="text-center py-12">
            <Calculator className="w-16 h-16 mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-semibold text-primary mb-2">No Calculators Found</h3>
            <p className="text-primary mb-6">
              No calculators match the selected category. Try selecting a different category.
            </p>
            <Button 
              onClick={() => handleCategoryChange('all')}
              className="bg-primary text-background-soft hover:bg-primary-light"
            >
              Show All Calculators
            </Button>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-primary mb-4">
            Need More Financial Tools?
          </h2>
          <p className="text-primary mb-8 max-w-2xl mx-auto">
            Explore our comprehensive suite of trading tools, indicators, and educational resources 
            to enhance your financial journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/calculators">
              <Button className="bg-primary text-background-soft hover:bg-primary-light">
                View All Tools
                <Calculator className="w-4 h-4 ml-2" />
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
      </div>
    </div>
  );
};

export default Index;
