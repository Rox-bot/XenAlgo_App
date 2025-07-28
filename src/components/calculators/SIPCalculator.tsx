
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PiggyBank, TrendingUp, Target, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Switch } from '@/components/ui/switch';

const SIPCalculator = () => {
  const [monthlyAmount, setMonthlyAmount] = useState(1000);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [timePeriod, setTimePeriod] = useState(15);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [enableSIPIncrease, setEnableSIPIncrease] = useState(false);
  const [sipIncreaseRate, setSipIncreaseRate] = useState(10);
  const [sipIncreaseFrequency, setSipIncreaseFrequency] = useState(1);

  const [results, setResults] = useState({
    maturityAmount: 0,
    totalInvestment: 0,
    wealthGained: 0,
    chartData: [],
    withIncrease: {
      maturityAmount: 0,
      totalInvestment: 0,
      wealthGained: 0,
      additionalWealth: 0
    }
  });

  useEffect(() => {
    calculateSIP();
  }, [monthlyAmount, expectedReturn, timePeriod, enableSIPIncrease, sipIncreaseRate, sipIncreaseFrequency]);

  const calculateSIP = () => {
    const monthlyRate = expectedReturn / 100 / 12;
    const totalMonths = timePeriod * 12;
    
    // Regular SIP calculation
    const maturityAmount = monthlyAmount * (((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate));
    const totalInvestment = monthlyAmount * totalMonths;
    const wealthGained = maturityAmount - totalInvestment;

    // SIP with increase calculation
    let withIncrease = {
      maturityAmount: maturityAmount,
      totalInvestment: totalInvestment,
      wealthGained: wealthGained,
      additionalWealth: 0
    };

    if (enableSIPIncrease) {
      let currentSIP = monthlyAmount;
      let totalInvested = 0;
      let totalValue = 0;
      
      for (let month = 1; month <= totalMonths; month++) {
        // Increase SIP annually
        if (month > 1 && (month - 1) % (sipIncreaseFrequency * 12) === 0) {
          currentSIP = currentSIP * (1 + sipIncreaseRate / 100);
        }
        
        totalInvested += currentSIP;
        
        // Calculate future value for this month's investment
        const remainingMonths = totalMonths - month + 1;
        const futureValue = currentSIP * Math.pow(1 + monthlyRate, remainingMonths - 1);
        totalValue += futureValue;
      }
      
      withIncrease = {
        maturityAmount: totalValue,
        totalInvestment: totalInvested,
        wealthGained: totalValue - totalInvested,
        additionalWealth: totalValue - maturityAmount
      };
    }

    // Generate chart data
    const chartData = [];
    let cumulativeInvestment = 0;
    let cumulativeAmount = 0;
    let cumulativeInvestmentWithIncrease = 0;
    let cumulativeAmountWithIncrease = 0;
    let currentSIPForChart = monthlyAmount;

    for (let month = 1; month <= totalMonths; month++) {
      // Regular SIP
      cumulativeInvestment += monthlyAmount;
      cumulativeAmount = monthlyAmount * (((Math.pow(1 + monthlyRate, month) - 1) / monthlyRate) * (1 + monthlyRate));
      
      // SIP with increase
      if (enableSIPIncrease && month > 1 && (month - 1) % (sipIncreaseFrequency * 12) === 0) {
        currentSIPForChart = currentSIPForChart * (1 + sipIncreaseRate / 100);
      }
      
      cumulativeInvestmentWithIncrease += currentSIPForChart;
      
      // Calculate cumulative value with increase
      let tempValue = 0;
      let tempSIP = monthlyAmount;
      for (let i = 1; i <= month; i++) {
        if (i > 1 && (i - 1) % (sipIncreaseFrequency * 12) === 0) {
          tempSIP = tempSIP * (1 + sipIncreaseRate / 100);
        }
        const remainingMonths = month - i + 1;
        tempValue += tempSIP * Math.pow(1 + monthlyRate, remainingMonths - 1);
      }
      cumulativeAmountWithIncrease = tempValue;
      
      if (month % 12 === 0 || month === 1) {
        const year = Math.ceil(month / 12);
        chartData.push({
          year,
          investment: Math.round(cumulativeInvestment),
          maturity: Math.round(cumulativeAmount),
          investmentWithIncrease: Math.round(cumulativeInvestmentWithIncrease),
          maturityWithIncrease: Math.round(cumulativeAmountWithIncrease)
        });
      }
    }

    setResults({
      maturityAmount: Math.round(maturityAmount),
      totalInvestment: Math.round(totalInvestment),
      wealthGained: Math.round(wealthGained),
      chartData,
      withIncrease
    });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">SIP Calculator</h2>
        <p className="text-gray-600">Plan your systematic investment with smart SIP increases</p>
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
          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <h4 className="font-semibold">Set Monthly Investment</h4>
                    <p className="text-sm text-gray-600">Amount you can invest every month consistently</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <h4 className="font-semibold">Enable SIP Increase</h4>
                    <p className="text-sm text-gray-600">Gradually increase your SIP amount to beat inflation and boost returns</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <h4 className="font-semibold">Compare Results</h4>
                    <p className="text-sm text-gray-600">See how step-up SIP can significantly boost your wealth</p>
                  </div>
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
                <PiggyBank className="h-5 w-5 text-purple-600" />
                SIP Investment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label>Monthly Investment</Label>
                  <Input
                    type="number"
                    value={monthlyAmount}
                    onChange={(e) => setMonthlyAmount(Number(e.target.value))}
                    className="w-32"
                  />
                </div>
                <Slider
                  value={[monthlyAmount]}
                  onValueChange={(value) => setMonthlyAmount(value[0])}
                  max={10000}
                  min={100}
                  step={100}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>$100</span>
                  <span>$10,000</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label>Expected Annual Return (%)</Label>
                  <Input
                    type="number"
                    value={expectedReturn}
                    onChange={(e) => setExpectedReturn(Number(e.target.value))}
                    className="w-32"
                    step="0.5"
                  />
                </div>
                <Slider
                  value={[expectedReturn]}
                  onValueChange={(value) => setExpectedReturn(value[0])}
                  max={25}
                  min={5}
                  step={0.5}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>5%</span>
                  <span>25%</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label>Time Period (Years)</Label>
                  <Input
                    type="number"
                    value={timePeriod}
                    onChange={(e) => setTimePeriod(Number(e.target.value))}
                    className="w-32"
                  />
                </div>
                <Slider
                  value={[timePeriod]}
                  onValueChange={(value) => setTimePeriod(value[0])}
                  max={40}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>1 year</span>
                  <span>40 years</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SIP Increase Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                SIP Step-Up Options
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="sip-increase"
                  checked={enableSIPIncrease}
                  onCheckedChange={setEnableSIPIncrease}
                />
                <Label htmlFor="sip-increase">Enable SIP Increase</Label>
              </div>

              {enableSIPIncrease && (
                <>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label>Annual Increase Rate (%)</Label>
                      <Input
                        type="number"
                        value={sipIncreaseRate}
                        onChange={(e) => setSipIncreaseRate(Number(e.target.value))}
                        className="w-32"
                      />
                    </div>
                    <Slider
                      value={[sipIncreaseRate]}
                      onValueChange={(value) => setSipIncreaseRate(value[0])}
                      max={30}
                      min={5}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>5%</span>
                      <span>30%</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label>Increase Frequency (Years)</Label>
                      <Input
                        type="number"
                        value={sipIncreaseFrequency}
                        onChange={(e) => setSipIncreaseFrequency(Number(e.target.value))}
                        className="w-32"
                      />
                    </div>
                    <Slider
                      value={[sipIncreaseFrequency]}
                      onValueChange={(value) => setSipIncreaseFrequency(value[0])}
                      max={5}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>Every year</span>
                      <span>Every 5 years</span>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 gap-4">
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Target className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm text-purple-700 font-medium">Maturity Amount</p>
                  <p className="text-3xl font-bold text-purple-800">
                    {formatCurrency(enableSIPIncrease ? results.withIncrease.maturityAmount : results.maturityAmount)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <PiggyBank className="h-6 w-6 text-slate-600 mx-auto mb-2" />
                    <p className="text-xs text-slate-700 font-medium">Total Invested</p>
                    <p className="text-lg font-bold text-slate-800">
                      {formatCurrency(enableSIPIncrease ? results.withIncrease.totalInvestment : results.totalInvestment)}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <TrendingUp className="h-6 w-6 text-gray-600 mx-auto mb-2" />
                    <p className="text-xs text-gray-700 font-medium">Wealth Gained</p>
                    <p className="text-lg font-bold text-gray-800">
                      {formatCurrency(enableSIPIncrease ? results.withIncrease.wealthGained : results.wealthGained)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {enableSIPIncrease && (
              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-green-700 font-medium mb-2">Step-Up SIP Benefits</p>
                    <p className="text-xs text-green-600">Additional Wealth Created</p>
                    <p className="text-2xl font-bold text-green-800">{formatCurrency(results.withIncrease.additionalWealth)}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Growth Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                SIP Growth Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={results.chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="year" 
                      label={{ value: 'Years', position: 'insideBottom', offset: -5 }} 
                    />
                    <YAxis 
                      tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip 
                      formatter={(value, name) => [
                        formatCurrency(value), 
                        name === 'investment' ? 'Regular Investment' : 
                        name === 'maturity' ? 'Regular Maturity' : 
                        name === 'investmentWithIncrease' ? 'Step-Up Investment' : 'Step-Up Maturity'
                      ]}
                      labelFormatter={(year) => `Year ${year}`}
                    />
                    <Area
                      type="monotone"
                      dataKey="investment"
                      stackId="1"
                      stroke="#64748b"
                      fill="#f1f5f9"
                      name="investment"
                    />
                    <Area
                      type="monotone"
                      dataKey="maturity"
                      stackId="1"
                      stroke="#64748b"
                      fill="#e2e8f0"
                      name="maturity"
                    />
                    {enableSIPIncrease && (
                      <>
                        <Area
                          type="monotone"
                          dataKey="investmentWithIncrease"
                          stackId="2"
                          stroke="#8b5cf6"
                          fill="#f3e8ff"
                          name="investmentWithIncrease"
                        />
                        <Area
                          type="monotone"
                          dataKey="maturityWithIncrease"
                          stackId="2"
                          stroke="#8b5cf6"
                          fill="#e9d5ff"
                          name="maturityWithIncrease"
                        />
                      </>
                    )}
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

export default SIPCalculator;
