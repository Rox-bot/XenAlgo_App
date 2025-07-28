import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { TrendingUp, DollarSign, Clock, Percent } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import CalculatorLayout from '@/components/layout/CalculatorLayout';
import { useCurrency } from '@/contexts/CurrencyContext';

const SIPPage = () => {
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
  const [annualReturn, setAnnualReturn] = useState(12);
  const [investmentPeriod, setInvestmentPeriod] = useState(10);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const { formatCurrency } = useCurrency();

  const [results, setResults] = useState({
    totalInvestment: 0,
    totalReturns: 0,
    maturityAmount: 0,
    chartData: [],
    pieData: [],
    yearlyBreakdown: []
  });

  useEffect(() => {
    calculateSIP();
  }, [monthlyInvestment, annualReturn, investmentPeriod]);

  const calculateSIP = () => {
    const monthlyRate = annualReturn / 100 / 12;
    const totalMonths = investmentPeriod * 12;
    
    // SIP calculation using compound interest formula
    const maturityAmount = monthlyInvestment * (((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate));
    const totalInvestment = monthlyInvestment * totalMonths;
    const totalReturns = maturityAmount - totalInvestment;

    // Generate chart data
    const chartData = [];
    const yearlyBreakdown = [];
    
    for (let year = 0; year <= investmentPeriod; year++) {
      const months = year * 12;
      let yearMaturity = 0;
      let yearInvestment = monthlyInvestment * months;
      
      if (months > 0) {
        yearMaturity = monthlyInvestment * (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
      }

      chartData.push({
        year,
        investment: yearInvestment,
        returns: yearMaturity - yearInvestment,
        total: yearMaturity
      });

      if (year > 0) {
        yearlyBreakdown.push({
          year,
          investment: monthlyInvestment * 12,
          returns: yearMaturity - (yearMaturity - monthlyInvestment * (((Math.pow(1 + monthlyRate, months - 12) - 1) / monthlyRate) * (1 + monthlyRate))),
          total: yearMaturity
        });
      }
    }

    const pieData = [
      { name: 'Total Investment', value: totalInvestment, color: '#8B5CF6' },
      { name: 'Capital Gains', value: totalReturns, color: '#06D6A0' }
    ];

    setResults({
      totalInvestment,
      totalReturns,
      maturityAmount,
      chartData,
      pieData,
      yearlyBreakdown
    });
  };

  return (
    <CalculatorLayout title="SIP Calculator">
      <div className="space-y-8">
        {/* Calculator Section with Summary Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calculator Inputs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                SIP Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Monthly Investment: {formatCurrency(monthlyInvestment)}</Label>
                <Slider
                  value={[monthlyInvestment]}
                  onValueChange={(value) => setMonthlyInvestment(value[0])}
                  max={100000}
                  min={500}
                  step={500}
                  className="w-full"
                />
                <Input
                  type="number"
                  value={monthlyInvestment}
                  onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                  className="mt-1"
                />
              </div>

              <div className="space-y-2">
                <Label>Expected Annual Return: {annualReturn}%</Label>
                <Slider
                  value={[annualReturn]}
                  onValueChange={(value) => setAnnualReturn(value[0])}
                  max={30}
                  min={1}
                  step={0.5}
                  className="w-full"
                />
                <Input
                  type="number"
                  value={annualReturn}
                  onChange={(e) => setAnnualReturn(Number(e.target.value))}
                  className="mt-1"
                />
              </div>

              <div className="space-y-2">
                <Label>Investment Period: {investmentPeriod} years</Label>
                <Slider
                  value={[investmentPeriod]}
                  onValueChange={(value) => setInvestmentPeriod(value[0])}
                  max={40}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <Input
                  type="number"
                  value={investmentPeriod}
                  onChange={(e) => setInvestmentPeriod(Number(e.target.value))}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Summary Cards and First Chart */}
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-muted-foreground">Total Investment</span>
                  </div>
                  <p className="text-2xl font-bold text-primary">{formatCurrency(results.totalInvestment)}</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-500/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                    <span className="text-sm font-medium text-muted-foreground">Capital Gains</span>
                  </div>
                  <p className="text-2xl font-bold text-emerald-500">{formatCurrency(results.totalReturns)}</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium text-muted-foreground">Maturity Amount</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-500">{formatCurrency(results.maturityAmount)}</p>
                </CardContent>
              </Card>
            </div>

            {/* Investment vs Returns Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Investment vs Returns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={results.pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {results.pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Growth Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Investment Growth Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={results.chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                    <XAxis 
                      dataKey="year" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickFormatter={(value) => `${formatCurrency(value).replace(/\.\d+/, '')}`}
                    />
                    <Tooltip 
                      formatter={(value, name) => [formatCurrency(value as number), name]}
                      labelStyle={{ color: 'hsl(var(--foreground))' }}
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="investment"
                      stackId="1"
                      stroke="#8B5CF6"
                      fill="#8B5CF6"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="returns"
                      stackId="1"
                      stroke="#06D6A0"
                      fill="#06D6A0"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Yearly Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Yearly Investment Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={results.yearlyBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                    <XAxis 
                      dataKey="year" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickFormatter={(value) => `${formatCurrency(value).replace(/\.\d+/, '')}`}
                    />
                    <Tooltip 
                      formatter={(value, name) => [formatCurrency(value as number), name]}
                      labelStyle={{ color: 'hsl(var(--foreground))' }}
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px'
                      }}
                    />
                    <Bar dataKey="investment" fill="#8B5CF6" />
                    <Bar dataKey="returns" fill="#06D6A0" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </CalculatorLayout>
  );
};

export default SIPPage;