import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { TrendingUp, DollarSign, AlertTriangle, Percent } from 'lucide-react';
import CalculatorLayout from '@/components/layout/CalculatorLayout';
import { useCurrency } from '@/contexts/CurrencyContext';

const InflationPage = () => {
  const [currentAmount, setCurrentAmount] = useState(100000);
  const [inflationRate, setInflationRate] = useState(6);
  const [timePeriod, setTimePeriod] = useState(10);
  const [targetAmount, setTargetAmount] = useState(200000);
  const { formatCurrency } = useCurrency();

  const [results, setResults] = useState({
    futureValue: 0,
    purchasingPowerLoss: 0,
    realValue: 0,
    yearsToTarget: 0,
    chartData: [],
    pieData: [],
    comparisonData: []
  });

  useEffect(() => {
    calculateInflation();
  }, [currentAmount, inflationRate, timePeriod, targetAmount]);

  const calculateInflation = () => {
    // Calculate future value with inflation
    const futureValue = currentAmount * Math.pow(1 + inflationRate / 100, timePeriod);
    
    // Calculate real purchasing power (what current amount will be worth)
    const realValue = currentAmount / Math.pow(1 + inflationRate / 100, timePeriod);
    
    // Purchasing power loss
    const purchasingPowerLoss = currentAmount - realValue;
    
    // Years needed to reach target amount due to inflation
    const yearsToTarget = Math.log(targetAmount / currentAmount) / Math.log(1 + inflationRate / 100);

    // Generate chart data for inflation impact over time
    const chartData = [];
    for (let year = 0; year <= timePeriod; year++) {
      const inflatedValue = currentAmount * Math.pow(1 + inflationRate / 100, year);
      const realPurchasingPower = currentAmount / Math.pow(1 + inflationRate / 100, year);
      
      chartData.push({
        year,
        nominalValue: currentAmount,
        inflatedValue,
        realValue: realPurchasingPower,
        purchasingPowerLoss: currentAmount - realPurchasingPower
      });
    }

    // Comparison with different inflation rates
    const comparisonData = [];
    for (let rate = 2; rate <= 10; rate += 2) {
      const futureVal = currentAmount * Math.pow(1 + rate / 100, timePeriod);
      const realVal = currentAmount / Math.pow(1 + rate / 100, timePeriod);
      
      comparisonData.push({
        rate: `${rate}%`,
        futureValue: futureVal,
        realValue: realVal,
        loss: currentAmount - realVal
      });
    }

    const pieData = [
      { name: 'Current Value', value: realValue, color: '#06D6A0' },
      { name: 'Purchasing Power Loss', value: purchasingPowerLoss, color: '#EF4444' }
    ];

    setResults({
      futureValue,
      purchasingPowerLoss,
      realValue,
      yearsToTarget,
      chartData,
      pieData,
      comparisonData
    });
  };

  return (
    <CalculatorLayout title="Inflation Calculator">
      <div className="space-y-8">
        {/* Calculator Section with Summary Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calculator Inputs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Inflation Impact Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Current Amount: {formatCurrency(currentAmount)}</Label>
                <Slider
                  value={[currentAmount]}
                  onValueChange={(value) => setCurrentAmount(value[0])}
                  max={1000000}
                  min={10000}
                  step={10000}
                  className="w-full"
                />
                <Input
                  type="number"
                  value={currentAmount}
                  onChange={(e) => setCurrentAmount(Number(e.target.value))}
                  className="mt-1"
                />
              </div>

              <div className="space-y-2">
                <Label>Inflation Rate: {inflationRate}%</Label>
                <Slider
                  value={[inflationRate]}
                  onValueChange={(value) => setInflationRate(value[0])}
                  max={15}
                  min={2}
                  step={0.5}
                  className="w-full"
                />
                <Input
                  type="number"
                  value={inflationRate}
                  onChange={(e) => setInflationRate(Number(e.target.value))}
                  className="mt-1"
                />
              </div>

              <div className="space-y-2">
                <Label>Time Period: {timePeriod} years</Label>
                <Slider
                  value={[timePeriod]}
                  onValueChange={(value) => setTimePeriod(value[0])}
                  max={30}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <Input
                  type="number"
                  value={timePeriod}
                  onChange={(e) => setTimePeriod(Number(e.target.value))}
                  className="mt-1"
                />
              </div>

              <div className="space-y-2">
                <Label>Target Amount: {formatCurrency(targetAmount)}</Label>
                <Slider
                  value={[targetAmount]}
                  onValueChange={(value) => setTargetAmount(value[0])}
                  max={2000000}
                  min={50000}
                  step={25000}
                  className="w-full"
                />
                <Input
                  type="number"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(Number(e.target.value))}
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
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-muted-foreground">Future Value</span>
                  </div>
                  <p className="text-2xl font-bold text-primary">{formatCurrency(results.futureValue)}</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-500/10 to-red-500/5 border-red-500/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <span className="text-sm font-medium text-muted-foreground">Purchasing Power Loss</span>
                  </div>
                  <p className="text-2xl font-bold text-red-500">{formatCurrency(results.purchasingPowerLoss)}</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-500/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-emerald-500" />
                    <span className="text-sm font-medium text-muted-foreground">Real Value</span>
                  </div>
                  <p className="text-2xl font-bold text-emerald-500">{formatCurrency(results.realValue)}</p>
                </CardContent>
              </Card>
            </div>

            {/* Value Breakdown Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Purchasing Power Impact</CardTitle>
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
          {/* Inflation Impact Over Time */}
          <Card>
            <CardHeader>
              <CardTitle>Inflation Impact Over Time</CardTitle>
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
                      dataKey="nominalValue"
                      stroke="#8B5CF6"
                      fill="#8B5CF6"
                      fillOpacity={0.6}
                    />
                    <Line
                      type="monotone"
                      dataKey="realValue"
                      stroke="#EF4444"
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Inflation Rate Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Impact of Different Inflation Rates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={results.comparisonData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                    <XAxis 
                      dataKey="rate" 
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
                    <Bar dataKey="realValue" fill="#06D6A0" />
                    <Bar dataKey="loss" fill="#EF4444" />
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

export default InflationPage;