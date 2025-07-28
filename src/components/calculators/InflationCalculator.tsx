
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Clock, TrendingDown, DollarSign, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const InflationCalculator = () => {
  const [currentAmount, setCurrentAmount] = useState(10000);
  const [inflationRate, setInflationRate] = useState(3.5);
  const [timePeriod, setTimePeriod] = useState(20);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const [results, setResults] = useState({
    futureValue: 0,
    purchasingPowerLoss: 0,
    realValue: 0,
    chartData: []
  });

  useEffect(() => {
    calculateInflation();
  }, [currentAmount, inflationRate, timePeriod]);

  const calculateInflation = () => {
    const futureValue = currentAmount * Math.pow(1 + inflationRate / 100, timePeriod);
    const realValue = currentAmount / Math.pow(1 + inflationRate / 100, timePeriod);
    const purchasingPowerLoss = ((currentAmount - realValue) / currentAmount) * 100;

    // Generate chart data
    const chartData = [];
    for (let year = 0; year <= timePeriod; year++) {
      const nominalValue = currentAmount;
      const inflatedValue = currentAmount * Math.pow(1 + inflationRate / 100, year);
      const realValueAtYear = currentAmount / Math.pow(1 + inflationRate / 100, year);
      
      chartData.push({
        year,
        nominalValue: Math.round(nominalValue),
        inflatedValue: Math.round(inflatedValue),
        realValue: Math.round(realValueAtYear)
      });
    }

    setResults({
      futureValue: Math.round(futureValue),
      purchasingPowerLoss: Math.round(purchasingPowerLoss * 100) / 100,
      realValue: Math.round(realValue),
      chartData
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
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Inflation Calculator</h2>
        <p className="text-gray-600">See how inflation affects your purchasing power over time</p>
      </div>

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
                    <h4 className="font-semibold">Enter Current Amount</h4>
                    <p className="text-sm text-gray-600">The amount of money you have today</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <h4 className="font-semibold">Set Inflation Rate</h4>
                    <p className="text-sm text-gray-600">Expected annual inflation rate (historical average: 3-4%)</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <h4 className="font-semibold">Choose Time Period</h4>
                    <p className="text-sm text-gray-600">How many years into the future to calculate</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-purple-600" />
                Inflation Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label>Current Amount</Label>
                  <Input
                    type="number"
                    value={currentAmount}
                    onChange={(e) => setCurrentAmount(Number(e.target.value))}
                    className="w-32"
                  />
                </div>
                <Slider
                  value={[currentAmount]}
                  onValueChange={(value) => setCurrentAmount(value[0])}
                  max={100000}
                  min={1000}
                  step={1000}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>$1,000</span>
                  <span>$100,000</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label>Inflation Rate (% per year)</Label>
                  <Input
                    type="number"
                    value={inflationRate}
                    onChange={(e) => setInflationRate(Number(e.target.value))}
                    className="w-32"
                    step="0.1"
                  />
                </div>
                <Slider
                  value={[inflationRate]}
                  onValueChange={(value) => setInflationRate(value[0])}
                  max={10}
                  min={0.5}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>0.5%</span>
                  <span>10%</span>
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

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-red-700 font-medium mb-2">Inflation Impact</p>
                <p className="text-xs text-red-600">What costs {formatCurrency(currentAmount)} today</p>
                <p className="text-2xl font-bold text-red-800 mb-2">{formatCurrency(results.futureValue)}</p>
                <p className="text-xs text-red-600">will cost in {timePeriod} years</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <DollarSign className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-sm text-purple-700 font-medium">Real Value Today</p>
                <p className="text-3xl font-bold text-purple-800">{formatCurrency(results.realValue)}</p>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-4">
            <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200">
              <CardContent className="pt-6">
                <div className="text-center">
                  <TrendingDown className="h-6 w-6 text-slate-600 mx-auto mb-2" />
                  <p className="text-sm text-slate-700 font-medium">Purchasing Power Loss</p>
                  <p className="text-2xl font-bold text-slate-800">{results.purchasingPowerLoss}%</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Clock className="h-6 w-6 text-gray-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-700 font-medium">Future Cost</p>
                  <p className="text-2xl font-bold text-gray-800">{formatCurrency(results.futureValue)}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-purple-600" />
                Inflation Impact Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={results.chartData}>
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
                        name === 'realValue' ? 'Real Value' : 'Future Cost'
                      ]}
                      labelFormatter={(year) => `Year ${year}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="realValue"
                      stroke="#64748b"
                      strokeWidth={2}
                      name="realValue"
                      dot={{ r: 3 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="inflatedValue"
                      stroke="#ef4444"
                      strokeWidth={2}
                      name="inflatedValue"
                      dot={{ r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-slate-500 rounded"></div>
                  <span className="text-sm">Real Value</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span className="text-sm">Future Cost</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InflationCalculator;
