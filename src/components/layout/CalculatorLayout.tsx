import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Calculator, ArrowLeft, Globe, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCurrency, currencies } from '@/contexts/CurrencyContext';

interface CalculatorLayoutProps {
  children: React.ReactNode;
  title: string;
}

const calculators = [
  { id: 'compound-interest', name: 'Compound Interest', path: '/compound-interest' },
  { id: 'loan-emi', name: 'Loan EMI', path: '/loan-emi' },
  { id: 'sip', name: 'SIP Calculator', path: '/sip' },
  { id: 'retirement', name: 'Retirement Planning', path: '/retirement' },
  { id: 'risk', name: 'Risk Management', path: '/risk' },
  { id: 'mortgage', name: 'Mortgage Calculator', path: '/mortgage' },
  { id: 'car-loan', name: 'Car Loan', path: '/car-loan' },
  { id: 'tax', name: 'Tax Calculator', path: '/tax' },
  { id: 'inflation', name: 'Inflation Calculator', path: '/inflation' },
];

const CalculatorLayout: React.FC<CalculatorLayoutProps> = ({ children, title }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currency, setCurrency } = useCurrency();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/20">
      {/* Top Navigation */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
              <div className="flex items-center gap-2">
                <Calculator className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">Xen Calculators</span>
              </div>
            </div>
            
            {/* Currency Selector */}
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <Select
                value={currency.code}
                onValueChange={(value) => {
                  const selectedCurrency = currencies.find(c => c.code === value);
                  if (selectedCurrency) {
                    setCurrency(selectedCurrency);
                  }
                }}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((curr) => (
                    <SelectItem key={curr.code} value={curr.code}>
                      {curr.symbol} {curr.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className={`flex-shrink-0 transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-80'}`}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  {!sidebarCollapsed && (
                    <h3 className="font-semibold text-lg text-foreground">Other Calculators</h3>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    className="p-2"
                  >
                    {sidebarCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
                  </Button>
                </div>
                <div className="space-y-2">
                  {calculators.map((calc) => (
                    <Link
                      key={calc.id}
                      to={calc.path}
                      className={`block p-3 rounded-lg transition-colors ${
                        location.pathname === calc.path
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-accent hover:text-accent-foreground'
                      }`}
                      title={sidebarCollapsed ? calc.name : undefined}
                    >
                      {sidebarCollapsed ? calc.name.charAt(0) : calc.name}
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-foreground mb-2">{title}</h1>
            </div>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default CalculatorLayout;