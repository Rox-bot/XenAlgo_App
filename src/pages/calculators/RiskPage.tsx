import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { Shield, AlertTriangle, Target, TrendingDown } from 'lucide-react';
import CalculatorLayout from '@/components/layout/CalculatorLayout';
import { useCurrency } from '@/contexts/CurrencyContext';

const RiskPage = () => {
  const [currentAge, setCurrentAge] = useState(30);
  const [monthlyIncome, setMonthlyIncome] = useState(50000);
  const [dependents, setDependents] = useState(2);
  const [existingCoverage, setExistingCoverage] = useState(500000);
  const [riskTolerance, setRiskTolerance] = useState(5);
  const { formatCurrency } = useCurrency();

  const [results, setResults] = useState({
    recommendedCoverage: 0,
    coverageGap: 0,
    monthlyPremium: 0,
    totalPremiumCost: 0,
    chartData: [],
    pieData: [],
    riskBreakdown: []
  });

  useEffect(() => {
    calculateRisk();
  }, [currentAge, monthlyIncome, dependents, existingCoverage, riskTolerance]);

  const calculateRisk = () => {
    // Calculate recommended life insurance coverage
    const yearsToRetirement = 65 - currentAge;
    const incomeMultiplier = 10 + (dependents * 2);
    const recommendedCoverage = monthlyIncome * 12 * incomeMultiplier;
    const coverageGap = Math.max(0, recommendedCoverage - existingCoverage);
    
    // Estimate premium (simplified calculation)
    const premiumRate = 0.002 + (currentAge - 18) * 0.0001;
    const monthlyPremium = (coverageGap * premiumRate) / 12;
    const totalPremiumCost = monthlyPremium * 12 * yearsToRetirement;

    // Generate chart data for coverage over time
    const chartData = [];
    for (let year = 0; year <= 10; year++) {
      chartData.push({
        year: currentAge + year,
        recommendedCoverage: recommendedCoverage * (1 - year * 0.05),
        currentCoverage: existingCoverage,
        gap: Math.max(0, recommendedCoverage * (1 - year * 0.05) - existingCoverage)
      });
    }

    const pieData = [
      { name: 'Existing Coverage', value: existingCoverage, color: '#8B5CF6' },
      { name: 'Coverage Gap', value: coverageGap, color: '#EF4444' }
    ];

    const riskBreakdown = [
      { category: 'Low Risk', percentage: riskTolerance < 3 ? 60 : riskTolerance < 7 ? 40 : 20 },
      { category: 'Medium Risk', percentage: riskTolerance < 3 ? 30 : riskTolerance < 7 ? 40 : 30 },
      { category: 'High Risk', percentage: riskTolerance < 3 ? 10 : riskTolerance < 7 ? 20 : 50 }
    ];

    setResults({
      recommendedCoverage,
      coverageGap,
      monthlyPremium,
      totalPremiumCost,
      chartData,
      pieData,
      riskBreakdown
    });
  };

  return (
    <CalculatorLayout title="Risk Management Calculator">
      <div className="space-y-8">
        {/* Calculator Section with Summary Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calculator Inputs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Risk Assessment Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Current Age: {currentAge} years</Label>
                <Slider
                  value={[currentAge]}
                  onValueChange={(value) => setCurrentAge(value[0])}
                  max={60}
                  min={18}
                  step={1}
                  className="w-full"
                />
                <Input
                  type="number"
                  value={currentAge}
                  onChange={(e) => setCurrentAge(Number(e.target.value))}
                  className="mt-1"
                />
              </div>

              <div className="space-y-2">
                <Label>Monthly Income: {formatCurrency(monthlyIncome)}</Label>
                <Slider
                  value={[monthlyIncome]}
                  onValueChange={(value) => setMonthlyIncome(value[0])}
                  max={200000}
                  min={20000}
                  step={5000}
                  className="w-full"
                />
                <Input
                  type="number"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                  className="mt-1"
                />
              </div>

              <div className="space-y-2">
                <Label>Number of Dependents: {dependents}</Label>
                <Slider
                  value={[dependents]}
                  onValueChange={(value) => setDependents(value[0])}
                  max={6}
                  min={0}
                  step={1}
                  className="w-full"
                />
                <Input
                  type="number"
                  value={dependents}
                  onChange={(e) => setDependents(Number(e.target.value))}
                  className="mt-1"
                />
              </div>

              <div className="space-y-2">
                <Label>Existing Coverage: {formatCurrency(existingCoverage)}</Label>
                <Slider
                  value={[existingCoverage]}
                  onValueChange={(value) => setExistingCoverage(value[0])}
                  max={5000000}
                  min={0}
                  step={100000}
                  className="w-full"
                />
                <Input
                  type="number"
                  value={existingCoverage}
                  onChange={(e) => setExistingCoverage(Number(e.target.value))}
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
                    <Shield className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-muted-foreground">Recommended Coverage</span>
                  </div>
                  <p className="text-2xl font-bold text-primary">{formatCurrency(results.recommendedCoverage)}</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-500/10 to-red-500/5 border-red-500/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <span className="text-sm font-medium text-muted-foreground">Coverage Gap</span>
                  </div>
                  <p className="text-2xl font-bold text-red-500">{formatCurrency(results.coverageGap)}</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium text-muted-foreground">Monthly Premium</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-500">{formatCurrency(results.monthlyPremium)}</p>
                </CardContent>
              </Card>
            </div>

            {/* Coverage Gap Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Coverage Analysis</CardTitle>
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
          {/* Coverage Over Time */}
          <Card>
            <CardHeader>
              <CardTitle>Coverage Needs Over Time</CardTitle>
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
                      dataKey="recommendedCoverage"
                      stroke="#8B5CF6"
                      fill="#8B5CF6"
                      fillOpacity={0.6}
                    />
                    <Line
                      type="monotone"
                      dataKey="currentCoverage"
                      stroke="#06D6A0"
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Risk Allocation */}
          <Card>
            <CardHeader>
              <CardTitle>Risk Tolerance Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={results.riskBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                    <XAxis 
                      dataKey="category" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      label={{ value: 'Percentage', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip 
                      formatter={(value, name) => [`${value}%`, name]}
                      labelStyle={{ color: 'hsl(var(--foreground))' }}
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px'
                      }}
                    />
                    <Bar dataKey="percentage" fill="#8B5CF6" />
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

export default RiskPage;