import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, DollarSign, Clock, Percent, Calculator } from 'lucide-react';
import CalculatorLayout from '@/components/layout/CalculatorLayout';
import { useCurrency } from '@/contexts/CurrencyContext';

const CompoundInterestPage = () => {
  const [initialAmount, setInitialAmount] = useState(10000);
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [annualRate, setAnnualRate] = useState(8);
  const [years, setYears] = useState(10);
  const { formatCurrency } = useCurrency();

  const [results, setResults] = useState({
    finalAmount: 0,
    totalContributions: 0,
    totalInterest: 0,
    chartData: [],
    pieData: [],
    yearlyBreakdown: []
  });

  useEffect(() => {
    calculateCompoundInterest();
  }, [initialAmount, monthlyContribution, annualRate, years]);

  const calculateCompoundInterest = () => {
    const monthlyRate = annualRate / 100 / 12;
    const totalMonths = years * 12;
    let balance = initialAmount;
    const chartData = [];
    const yearlyBreakdown = [];
    let totalContributions = initialAmount;

    // Add initial point
    chartData.push({
      year: 0,
      withoutContributions: initialAmount,
      withContributions: initialAmount,
      totalContributions: initialAmount,
      totalInterest: 0
    });

    for (let year = 1; year <= years; year++) {
      const monthsElapsed = year * 12;
      
      // Calculate with contributions
      let balanceWithContributions = initialAmount;
      for (let month = 1; month <= monthsElapsed; month++) {
        balanceWithContributions = balanceWithContributions * (1 + monthlyRate) + monthlyContribution;
      }
      
      // Calculate without contributions (initial amount only)
      const balanceWithoutContributions = initialAmount * Math.pow(1 + monthlyRate, monthsElapsed);
      
      const yearlyTotalContributions = initialAmount + (monthlyContribution * monthsElapsed);
      const yearlyInterest = balanceWithContributions - yearlyTotalContributions;

      chartData.push({
        year,
        withoutContributions: balanceWithoutContributions,
        withContributions: balanceWithContributions,
        totalContributions: yearlyTotalContributions,
        totalInterest: yearlyInterest
      });

      yearlyBreakdown.push({
        year,
        totalContributions: yearlyTotalContributions,
        totalInterest: yearlyInterest,
        balance: balanceWithContributions
      });
    }

    const finalAmount = chartData[chartData.length - 1].withContributions;
    totalContributions = initialAmount + (monthlyContribution * totalMonths);
    const totalInterest = finalAmount - totalContributions;

    const pieData = [
      { name: 'Principal + Contributions', value: totalContributions, color: '#8B5CF6' },
      { name: 'Interest Earned', value: totalInterest, color: '#06D6A0' }
    ];

    setResults({
      finalAmount,
      totalContributions,
      totalInterest,
      chartData,
      pieData,
      yearlyBreakdown
    });
  };

  return (
    <CalculatorLayout title="Compound Interest Calculator">
      <div className="space-y-8">
        {/* Calculator Row: Inputs + Summary Cards + One Chart */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Calculator Inputs */}
          <div className="xl:col-span-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-primary" />
                  Investment Parameters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label>Initial Investment</Label>
                    <Input
                      type="number"
                      value={initialAmount}
                      onChange={(e) => setInitialAmount(Number(e.target.value))}
                      className="w-32"
                    />
                  </div>
                  <Slider
                    value={[initialAmount]}
                    onValueChange={(value) => setInitialAmount(value[0])}
                    max={1000000}
                    min={1000}
                    step={1000}
                    className="w-full"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label>Monthly Contribution</Label>
                    <Input
                      type="number"
                      value={monthlyContribution}
                      onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                      className="w-32"
                    />
                  </div>
                  <Slider
                    value={[monthlyContribution]}
                    onValueChange={(value) => setMonthlyContribution(value[0])}
                    max={50000}
                    min={0}
                    step={500}
                    className="w-full"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label>Annual Interest Rate (%)</Label>
                    <Input
                      type="number"
                      value={annualRate}
                      onChange={(e) => setAnnualRate(Number(e.target.value))}
                      className="w-32"
                    />
                  </div>
                  <Slider
                    value={[annualRate]}
                    onValueChange={(value) => setAnnualRate(value[0])}
                    max={30}
                    min={1}
                    step={0.1}
                    className="w-full"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label>Time Period (Years)</Label>
                    <Input
                      type="number"
                      value={years}
                      onChange={(e) => setYears(Number(e.target.value))}
                      className="w-32"
                    />
                  </div>
                  <Slider
                    value={[years]}
                    onValueChange={(value) => setYears(value[0])}
                    max={50}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary Cards */}
          <div className="xl:col-span-4 space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground font-medium">Final Amount</p>
                    <p className="text-2xl font-bold text-foreground">{formatCurrency(results.finalAmount)}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-500/20">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <DollarSign className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground font-medium">Total Invested</p>
                    <p className="text-2xl font-bold text-foreground">{formatCurrency(results.totalContributions)}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Percent className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground font-medium">Interest Earned</p>
                    <p className="text-2xl font-bold text-foreground">{formatCurrency(results.totalInterest)}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* First Chart */}
          <div className="xl:col-span-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Investment Growth Over Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={results.chartData}>
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
                      <Line
                        type="monotone"
                        dataKey="withContributions"
                        stroke="#8B5CF6"
                        strokeWidth={3}
                        dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="withoutContributions"
                        stroke="#06D6A0"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={{ fill: '#06D6A0', strokeWidth: 2, r: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-emerald-500" />
                Investment Composition
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={results.pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
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

          {/* Yearly Growth Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-500" />
                Yearly Growth Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={results.yearlyBreakdown}>
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
                      dataKey="totalContributions"
                      stackId="1"
                      stroke="#8B5CF6"
                      fill="#8B5CF6"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="totalInterest"
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
        </div>
      </div>
    </CalculatorLayout>
  );
};

export default CompoundInterestPage;