
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, DollarSign, Clock, Percent } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';

const CompoundInterestCalculator = () => {
  const { currency } = useCurrency();
  const [initialAmount, setInitialAmount] = useState(10000);
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [annualRate, setAnnualRate] = useState(8);
  const [years, setYears] = useState(10);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const [results, setResults] = useState({
    finalAmount: 0,
    totalContributions: 0,
    totalInterest: 0,
    chartData: []
  });

  useEffect(() => {
    calculateCompoundInterest();
  }, [initialAmount, monthlyContribution, annualRate, years]);

  const calculateCompoundInterest = () => {
    const monthlyRate = annualRate / 100 / 12;
    const totalMonths = years * 12;
    let balance = initialAmount;
    const chartData = [];
    let totalContributions = initialAmount;

    // Add initial point
    chartData.push({
      year: 0,
      withoutContributions: initialAmount,
      withContributions: initialAmount,
      totalContributions: initialAmount,
      totalInterest: 0
    });

    for (let month = 1; month <= totalMonths; month++) {
      balance = balance * (1 + monthlyRate) + monthlyContribution;
      totalContributions += monthlyContribution;

      if (month % 12 === 0) {
        const year = month / 12;
        const withoutContributions = initialAmount * Math.pow(1 + annualRate / 100, year);
        const totalInterest = balance - totalContributions;
        
        chartData.push({
          year,
          withoutContributions: Math.round(withoutContributions),
          withContributions: Math.round(balance),
          totalContributions: Math.round(totalContributions),
          totalInterest: Math.round(totalInterest)
        });
      }
    }

    setResults({
      finalAmount: Math.round(balance),
      totalContributions: Math.round(totalContributions),
      totalInterest: Math.round(balance - totalContributions),
      chartData
    });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.code,
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Compound Interest Calculator</h2>
        <p className="text-gray-600">Watch your money grow with the power of compound interest</p>
      </div>

      {/* How to Use Guide */}
      <Collapsible open={isGuideOpen} onOpenChange={setIsGuideOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            How to Use This Calculator
            <ChevronDown className={`h-4 w-4 transition-transform ${isGuideOpen ? 'rotate-180' : ''}`} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <h4 className="font-semibold">Enter Your Initial Investment</h4>
                    <p className="text-sm text-gray-600">Start with the amount you have today to invest</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <h4 className="font-semibold">Set Monthly Contributions</h4>
                    <p className="text-sm text-gray-600">How much will you add each month? Even small amounts make a big difference!</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <h4 className="font-semibold">Choose Expected Return</h4>
                    <p className="text-sm text-gray-600">Historical stock market average is ~7-10%. Savings accounts are ~1-3%.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">4</div>
                  <div>
                    <h4 className="font-semibold">Select Time Horizon</h4>
                    <p className="text-sm text-gray-600">The longer you invest, the more compound interest works its magic!</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      {/* Calculator Input Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Input Controls */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
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
                  max={100000}
                  min={100}
                  step={100}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>{currency.symbol}100</span>
                  <span>{currency.symbol}100,000</span>
                </div>
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
                  max={5000}
                  min={0}
                  step={50}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>{currency.symbol}0</span>
                  <span>{currency.symbol}5,000</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label>Annual Return (%)</Label>
                  <Input
                    type="number"
                    value={annualRate}
                    onChange={(e) => setAnnualRate(Number(e.target.value))}
                    className="w-32"
                    step="0.1"
                  />
                </div>
                <Slider
                  value={[annualRate]}
                  onValueChange={(value) => setAnnualRate(value[0])}
                  max={20}
                  min={0.1}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>0.1%</span>
                  <span>20%</span>
                </div>
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
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>1 year</span>
                  <span>50 years</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Summary */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Final Amount</p>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(results.finalAmount)}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Interest</p>
                    <p className="text-2xl font-bold text-blue-600">{formatCurrency(results.totalInterest)}</p>
                  </div>
                  <Percent className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Total Contributions:</span>
                  <span className="font-semibold">{formatCurrency(results.totalContributions)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Interest Earned:</span>
                  <span className="font-semibold text-green-600">{formatCurrency(results.totalInterest)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(results.totalInterest / results.finalAmount) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500">
                  Interest makes up {((results.totalInterest / results.finalAmount) * 100).toFixed(1)}% of your final amount
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Charts Section */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Investment Growth Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={results.chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="year" 
                    tickFormatter={(year) => `Year ${year}`}
                  />
                  <YAxis 
                    tickFormatter={(value) => `${currency.symbol}${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    formatter={(value, name) => [formatCurrency(value), name === 'withContributions' ? 'With Monthly Contributions' : 'Initial Investment Only']}
                    labelFormatter={(year) => `Year ${year}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="withoutContributions"
                    stackId="1"
                    stroke="#f59e0b"
                    fill="#fef3c7"
                    name="Initial Investment Only"
                  />
                  <Area
                    type="monotone"
                    dataKey="withContributions"
                    stackId="2"
                    stroke="#10b981"
                    fill="#d1fae5"
                    name="With Monthly Contributions"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompoundInterestCalculator;
