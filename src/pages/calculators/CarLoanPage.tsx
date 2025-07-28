import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { Car, DollarSign, Calendar, Percent } from 'lucide-react';
import CalculatorLayout from '@/components/layout/CalculatorLayout';
import { useCurrency } from '@/contexts/CurrencyContext';

const CarLoanPage = () => {
  const [carPrice, setCarPrice] = useState(1500000);
  const [downPayment, setDownPayment] = useState(300000);
  const [interestRate, setInterestRate] = useState(9.5);
  const [loanTerm, setLoanTerm] = useState(5);
  const { formatCurrency } = useCurrency();

  const [results, setResults] = useState({
    loanAmount: 0,
    monthlyPayment: 0,
    totalPayment: 0,
    totalInterest: 0,
    chartData: [],
    pieData: [],
    yearlyBreakdown: []
  });

  useEffect(() => {
    calculateCarLoan();
  }, [carPrice, downPayment, interestRate, loanTerm]);

  const calculateCarLoan = () => {
    const loanAmount = carPrice - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    
    // Calculate EMI using formula
    const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                          (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - loanAmount;

    // Generate amortization schedule
    const chartData = [];
    const yearlyBreakdown = [];
    let balance = loanAmount;
    
    for (let year = 1; year <= loanTerm; year++) {
      let yearlyPrincipal = 0;
      let yearlyInterest = 0;
      
      for (let month = 1; month <= 12; month++) {
        const interestPayment = balance * monthlyRate;
        const principalPayment = monthlyPayment - interestPayment;
        
        yearlyInterest += interestPayment;
        yearlyPrincipal += principalPayment;
        balance -= principalPayment;
      }
      
      chartData.push({
        year,
        balance: Math.max(0, balance),
        principal: yearlyPrincipal,
        interest: yearlyInterest,
        totalPaid: (monthlyPayment * 12 * year)
      });

      yearlyBreakdown.push({
        year,
        principal: yearlyPrincipal,
        interest: yearlyInterest,
        total: yearlyPrincipal + yearlyInterest
      });
    }

    const pieData = [
      { name: 'Principal', value: loanAmount, color: '#8B5CF6' },
      { name: 'Interest', value: totalInterest, color: '#EF4444' },
      { name: 'Down Payment', value: downPayment, color: '#06D6A0' }
    ];

    setResults({
      loanAmount,
      monthlyPayment,
      totalPayment,
      totalInterest,
      chartData,
      pieData,
      yearlyBreakdown
    });
  };

  return (
    <CalculatorLayout title="Car Loan Calculator">
      <div className="space-y-8">
        {/* Calculator Section with Summary Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calculator Inputs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5 text-primary" />
                Car Loan Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Car Price: {formatCurrency(carPrice)}</Label>
                <Slider
                  value={[carPrice]}
                  onValueChange={(value) => setCarPrice(value[0])}
                  max={5000000}
                  min={300000}
                  step={50000}
                  className="w-full"
                />
                <Input
                  type="number"
                  value={carPrice}
                  onChange={(e) => setCarPrice(Number(e.target.value))}
                  className="mt-1"
                />
              </div>

              <div className="space-y-2">
                <Label>Down Payment: {formatCurrency(downPayment)}</Label>
                <Slider
                  value={[downPayment]}
                  onValueChange={(value) => setDownPayment(value[0])}
                  max={carPrice * 0.5}
                  min={carPrice * 0.1}
                  step={25000}
                  className="w-full"
                />
                <Input
                  type="number"
                  value={downPayment}
                  onChange={(e) => setDownPayment(Number(e.target.value))}
                  className="mt-1"
                />
              </div>

              <div className="space-y-2">
                <Label>Interest Rate: {interestRate}%</Label>
                <Slider
                  value={[interestRate]}
                  onValueChange={(value) => setInterestRate(value[0])}
                  max={18}
                  min={7}
                  step={0.1}
                  className="w-full"
                />
                <Input
                  type="number"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="mt-1"
                />
              </div>

              <div className="space-y-2">
                <Label>Loan Term: {loanTerm} years</Label>
                <Slider
                  value={[loanTerm]}
                  onValueChange={(value) => setLoanTerm(value[0])}
                  max={7}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <Input
                  type="number"
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(Number(e.target.value))}
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
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-muted-foreground">Monthly EMI</span>
                  </div>
                  <p className="text-2xl font-bold text-primary">{formatCurrency(results.monthlyPayment)}</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-500/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-emerald-500" />
                    <span className="text-sm font-medium text-muted-foreground">Total Payment</span>
                  </div>
                  <p className="text-2xl font-bold text-emerald-500">{formatCurrency(results.totalPayment)}</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-500/10 to-red-500/5 border-red-500/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Percent className="h-4 w-4 text-red-500" />
                    <span className="text-sm font-medium text-muted-foreground">Total Interest</span>
                  </div>
                  <p className="text-2xl font-bold text-red-500">{formatCurrency(results.totalInterest)}</p>
                </CardContent>
              </Card>
            </div>

            {/* Cost Breakdown Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Cost Breakdown</CardTitle>
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
          {/* Loan Balance Over Time */}
          <Card>
            <CardHeader>
              <CardTitle>Loan Balance Over Time</CardTitle>
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
                      dataKey="balance"
                      stroke="#8B5CF6"
                      fill="#8B5CF6"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Yearly Payment Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Yearly Payment Breakdown</CardTitle>
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
                    <Bar dataKey="principal" fill="#8B5CF6" />
                    <Bar dataKey="interest" fill="#EF4444" />
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

export default CarLoanPage;