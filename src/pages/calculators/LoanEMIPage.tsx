import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Calculator, DollarSign, Calendar, Percent } from 'lucide-react';
import CalculatorLayout from '@/components/layout/CalculatorLayout';
import { useCurrency } from '@/contexts/CurrencyContext';

const LoanEMIPage = () => {
  const [loanAmount, setLoanAmount] = useState(500000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [loanTenure, setLoanTenure] = useState(20);
  const { formatCurrency } = useCurrency();

  const [results, setResults] = useState({
    emi: 0,
    totalPayment: 0,
    totalInterest: 0,
    chartData: [],
    pieData: [],
    yearlyBreakdown: []
  });

  useEffect(() => {
    calculateEMI();
  }, [loanAmount, interestRate, loanTenure]);

  const calculateEMI = () => {
    const monthlyRate = interestRate / 100 / 12;
    const totalMonths = loanTenure * 12;
    
    const emi = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
    const totalPayment = emi * totalMonths;
    const totalInterest = totalPayment - loanAmount;

    let balance = loanAmount;
    const chartData = [];
    const yearlyBreakdown = [];
    
    for (let year = 0; year <= loanTenure; year++) {
      if (year === 0) {
        chartData.push({ year, balance: loanAmount });
      } else {
        let yearlyPrincipal = 0;
        let yearlyInterest = 0;
        
        for (let month = 1; month <= 12 && balance > 0; month++) {
          const interestComponent = balance * monthlyRate;
          const principalComponent = emi - interestComponent;
          
          yearlyPrincipal += principalComponent;
          yearlyInterest += interestComponent;
          balance -= principalComponent;
          
          if (balance < 0) balance = 0;
        }
        
        chartData.push({ year, balance: Math.max(0, balance) });
        yearlyBreakdown.push({
          year,
          principal: yearlyPrincipal,
          interest: yearlyInterest
        });
      }
    }

    const pieData = [
      { name: 'Principal Amount', value: loanAmount, color: '#8B5CF6' },
      { name: 'Total Interest', value: totalInterest, color: '#EF4444' }
    ];

    setResults({ emi, totalPayment, totalInterest, chartData, pieData, yearlyBreakdown });
  };

  return (
    <CalculatorLayout title="Loan EMI Calculator">
      <div className="space-y-8">
        {/* Calculator Row */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Inputs */}
          <div className="xl:col-span-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-primary" />
                  Loan Parameters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Loan Amount: {formatCurrency(loanAmount)}</Label>
                  <Slider value={[loanAmount]} onValueChange={(value) => setLoanAmount(value[0])} max={10000000} min={100000} step={50000} />
                </div>
                <div>
                  <Label>Interest Rate: {interestRate}%</Label>
                  <Slider value={[interestRate]} onValueChange={(value) => setInterestRate(value[0])} max={20} min={5} step={0.1} />
                </div>
                <div>
                  <Label>Tenure: {loanTenure} years</Label>
                  <Slider value={[loanTenure]} onValueChange={(value) => setLoanTenure(value[0])} max={30} min={1} step={1} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary Cards */}
          <div className="xl:col-span-4 space-y-4">
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
              <CardContent className="pt-6 text-center">
                <DollarSign className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-sm text-text-cool">Monthly EMI</p>
                <p className="text-2xl font-bold">{formatCurrency(results.emi)}</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5">
              <CardContent className="pt-6 text-center">
                <Calendar className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-sm text-text-cool">Total Payment</p>
                <p className="text-2xl font-bold">{formatCurrency(results.totalPayment)}</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-red-500/10 to-red-500/5">
              <CardContent className="pt-6 text-center">
                <Percent className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <p className="text-sm text-text-cool">Total Interest</p>
                <p className="text-2xl font-bold">{formatCurrency(results.totalInterest)}</p>
              </CardContent>
            </Card>
          </div>

          {/* First Chart */}
          <div className="xl:col-span-4">
            <Card>
              <CardHeader><CardTitle>Principal vs Interest</CardTitle></CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={results.pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={120} paddingAngle={5} dataKey="value">
                        {results.pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader><CardTitle>Outstanding Balance</CardTitle></CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={results.chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis tickFormatter={(value) => formatCurrency(value).replace(/\.\d+/, '')} />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Line type="monotone" dataKey="balance" stroke="#8B5CF6" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader><CardTitle>Yearly Payment Breakdown</CardTitle></CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={results.yearlyBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis tickFormatter={(value) => formatCurrency(value).replace(/\.\d+/, '')} />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
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

export default LoanEMIPage;
