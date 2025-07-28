
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Target, Clock, DollarSign, ChevronDown, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Progress } from '@/components/ui/progress';

const RetirementCalculator = () => {
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(65);
  const [currentSavings, setCurrentSavings] = useState(50000);
  const [monthlyContribution, setMonthlyContribution] = useState(1000);
  const [expectedReturn, setExpectedReturn] = useState(8);
  const [retirementExpenses, setRetirementExpenses] = useState(5000);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const [results, setResults] = useState({
    totalAtRetirement: 0,
    monthlyIncomeGenerated: 0,
    yearsToRetirement: 0,
    totalContributions: 0,
    shortfall: 0,
    chartData: [],
    isOnTrack: false
  });

  useEffect(() => {
    calculateRetirement();
  }, [currentAge, retirementAge, currentSavings, monthlyContribution, expectedReturn, retirementExpenses]);

  const calculateRetirement = () => {
    const yearsToRetirement = retirementAge - currentAge;
    const monthsToRetirement = yearsToRetirement * 12;
    const monthlyRate = expectedReturn / 100 / 12;
    
    // Future value of current savings
    const futureValueOfCurrentSavings = currentSavings * Math.pow(1 + expectedReturn / 100, yearsToRetirement);
    
    // Future value of monthly contributions (annuity)
    const futureValueOfContributions = monthlyContribution * 
      (((Math.pow(1 + monthlyRate, monthsToRetirement) - 1) / monthlyRate) * (1 + monthlyRate));
    
    const totalAtRetirement = futureValueOfCurrentSavings + futureValueOfContributions;
    
    // Calculate monthly income that can be generated (using 4% withdrawal rule)
    const monthlyIncomeGenerated = (totalAtRetirement * 0.04) / 12;
    
    const totalContributions = currentSavings + (monthlyContribution * monthsToRetirement);
    const shortfall = Math.max(0, retirementExpenses - monthlyIncomeGenerated);
    const isOnTrack = monthlyIncomeGenerated >= retirementExpenses;

    // Generate chart data
    const chartData = [];
    let cumulativeSavings = currentSavings;
    let cumulativeContributions = currentSavings;

    for (let year = 0; year <= yearsToRetirement; year++) {
      if (year > 0) {
        // Compound existing savings
        cumulativeSavings = cumulativeSavings * (1 + expectedReturn / 100) + (monthlyContribution * 12);
        cumulativeContributions += monthlyContribution * 12;
      }

      chartData.push({
        age: currentAge + year,
        savings: Math.round(cumulativeSavings),
        contributions: Math.round(cumulativeContributions),
        interest: Math.round(cumulativeSavings - cumulativeContributions)
      });
    }

    setResults({
      totalAtRetirement: Math.round(totalAtRetirement),
      monthlyIncomeGenerated: Math.round(monthlyIncomeGenerated),
      yearsToRetirement,
      totalContributions: Math.round(totalContributions),
      shortfall: Math.round(shortfall),
      chartData,
      isOnTrack
    });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(value);
  };

  const progressPercentage = results.shortfall > 0 
    ? (results.monthlyIncomeGenerated / retirementExpenses) * 100
    : 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Retirement Planning Calculator</h2>
        <p className="text-gray-600">Plan your retirement and see if you're on track to meet your goals</p>
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
                    <h4 className="font-semibold">Enter Your Ages</h4>
                    <p className="text-sm text-gray-600">Current age and when you plan to retire</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <h4 className="font-semibold">Current Savings & Contributions</h4>
                    <p className="text-sm text-gray-600">What you have saved and what you'll save monthly</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <h4 className="font-semibold">Expected Return</h4>
                    <p className="text-sm text-gray-600">Long-term stock market average is ~7-10%</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">4</div>
                  <div>
                    <h4 className="font-semibold">Retirement Expenses</h4>
                    <p className="text-sm text-gray-600">Monthly expenses you'll need in retirement</p>
                  </div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm text-green-800">
                    <strong>Rule of Thumb:</strong> You'll need 70-90% of your current income in retirement
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Controls */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                Retirement Planning Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Current Age</Label>
                  <Input
                    type="number"
                    value={currentAge}
                    onChange={(e) => setCurrentAge(Number(e.target.value))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Retirement Age</Label>
                  <Input
                    type="number"
                    value={retirementAge}
                    onChange={(e) => setRetirementAge(Number(e.target.value))}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label>Current Savings</Label>
                  <Input
                    type="number"
                    value={currentSavings}
                    onChange={(e) => setCurrentSavings(Number(e.target.value))}
                    className="w-32"
                  />
                </div>
                <Slider
                  value={[currentSavings]}
                  onValueChange={(value) => setCurrentSavings(value[0])}
                  max={500000}
                  min={0}
                  step={1000}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>$0</span>
                  <span>$500,000</span>
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
                  <span>$0</span>
                  <span>$5,000</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label>Expected Return (%)</Label>
                  <Input
                    type="number"
                    value={expectedReturn}
                    onChange={(e) => setExpectedReturn(Number(e.target.value))}
                    className="w-32"
                    step="0.1"
                  />
                </div>
                <Slider
                  value={[expectedReturn]}
                  onValueChange={(value) => setExpectedReturn(value[0])}
                  max={15}
                  min={3}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>3%</span>
                  <span>15%</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label>Monthly Retirement Expenses</Label>
                  <Input
                    type="number"
                    value={retirementExpenses}
                    onChange={(e) => setRetirementExpenses(Number(e.target.value))}
                    className="w-32"
                  />
                </div>
                <Slider
                  value={[retirementExpenses]}
                  onValueChange={(value) => setRetirementExpenses(value[0])}
                  max={15000}
                  min={1000}
                  step={100}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>$1,000</span>
                  <span>$15,000</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {/* Progress Indicator */}
          <Card className={`${results.isOnTrack ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-200' : 'bg-gradient-to-br from-orange-50 to-red-50 border-orange-200'}`}>
            <CardContent className="pt-6">
              <div className="text-center mb-4">
                <h3 className={`text-lg font-semibold mb-2 ${results.isOnTrack ? 'text-green-800' : 'text-orange-800'}`}>
                  {results.isOnTrack ? '🎉 You\'re on track!' : '⚠️ Needs adjustment'}
                </h3>
                <Progress value={Math.min(progressPercentage, 100)} className="mb-2" />
                <p className="text-sm text-gray-600">
                  {progressPercentage.toFixed(0)}% of retirement goal covered
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 gap-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="pt-6">
                <div className="text-center">
                  <DollarSign className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-blue-700 font-medium">Total at Retirement</p>
                  <p className="text-3xl font-bold text-blue-800">{formatCurrency(results.totalAtRetirement)}</p>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Clock className="h-6 w-6 text-green-600 mx-auto mb-2" />
                    <p className="text-xs text-green-700 font-medium">Monthly Income</p>
                    <p className="text-lg font-bold text-green-800">{formatCurrency(results.monthlyIncomeGenerated)}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Target className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                    <p className="text-xs text-purple-700 font-medium">Years to Go</p>
                    <p className="text-lg font-bold text-purple-800">{results.yearsToRetirement}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {results.shortfall > 0 && (
              <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-red-700 font-medium">Monthly Shortfall</p>
                    <p className="text-2xl font-bold text-red-800">{formatCurrency(results.shortfall)}</p>
                    <p className="text-xs text-red-600 mt-1">Consider increasing your monthly contributions</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Growth Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Retirement Savings Growth
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={results.chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="age" 
                      label={{ value: 'Age', position: 'insideBottom', offset: -5 }} 
                    />
                    <YAxis 
                      tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip 
                      formatter={(value, name) => [
                        formatCurrency(value), 
                        name === 'contributions' ? 'Total Contributions' : 
                        name === 'interest' ? 'Interest Earned' : 'Total Savings'
                      ]}
                      labelFormatter={(age) => `Age ${age}`}
                    />
                    <Area
                      type="monotone"
                      dataKey="contributions"
                      stackId="1"
                      stroke="#3b82f6"
                      fill="#dbeafe"
                      name="contributions"
                    />
                    <Area
                      type="monotone"
                      dataKey="interest"
                      stackId="1"
                      stroke="#10b981"
                      fill="#d1fae5"
                      name="interest"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RetirementCalculator;
