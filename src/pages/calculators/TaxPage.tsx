import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { Receipt, DollarSign, TrendingDown, Percent } from 'lucide-react';
import CalculatorLayout from '@/components/layout/CalculatorLayout';
import { useCurrency } from '@/contexts/CurrencyContext';

const TaxPage = () => {
  const [annualIncome, setAnnualIncome] = useState(1200000);
  const [deductions, setDeductions] = useState(150000);
  const [hra, setHra] = useState(0);
  const [investmentDeductions, setInvestmentDeductions] = useState(150000);
  const { formatCurrency } = useCurrency();

  const [results, setResults] = useState({
    taxableIncome: 0,
    totalTax: 0,
    netIncome: 0,
    effectiveTaxRate: 0,
    chartData: [],
    pieData: [],
    taxBreakdown: []
  });

  useEffect(() => {
    calculateTax();
  }, [annualIncome, deductions, hra, investmentDeductions]);

  const calculateTax = () => {
    // Calculate taxable income
    const totalDeductions = deductions + hra + investmentDeductions;
    const taxableIncome = Math.max(0, annualIncome - totalDeductions);
    
    // Tax slabs for FY 2023-24 (old regime)
    let tax = 0;
    let taxBreakdown = [];
    
    if (taxableIncome <= 250000) {
      tax = 0;
      taxBreakdown.push({ slab: 'Up to ₹2.5L', rate: '0%', amount: 0 });
    } else if (taxableIncome <= 500000) {
      tax = (taxableIncome - 250000) * 0.05;
      taxBreakdown.push(
        { slab: 'Up to ₹2.5L', rate: '0%', amount: 0 },
        { slab: '₹2.5L - ₹5L', rate: '5%', amount: tax }
      );
    } else if (taxableIncome <= 1000000) {
      tax = 12500 + (taxableIncome - 500000) * 0.2;
      taxBreakdown.push(
        { slab: 'Up to ₹2.5L', rate: '0%', amount: 0 },
        { slab: '₹2.5L - ₹5L', rate: '5%', amount: 12500 },
        { slab: '₹5L - ₹10L', rate: '20%', amount: (taxableIncome - 500000) * 0.2 }
      );
    } else {
      tax = 112500 + (taxableIncome - 1000000) * 0.3;
      taxBreakdown.push(
        { slab: 'Up to ₹2.5L', rate: '0%', amount: 0 },
        { slab: '₹2.5L - ₹5L', rate: '5%', amount: 12500 },
        { slab: '₹5L - ₹10L', rate: '20%', amount: 100000 },
        { slab: 'Above ₹10L', rate: '30%', amount: (taxableIncome - 1000000) * 0.3 }
      );
    }

    // Add cess (4% of tax)
    const totalTax = tax * 1.04;
    const netIncome = annualIncome - totalTax;
    const effectiveTaxRate = (totalTax / annualIncome) * 100;

    // Generate income comparison chart
    const chartData = [];
    for (let income = 500000; income <= 2000000; income += 250000) {
      let tempTax = 0;
      const tempTaxableIncome = Math.max(0, income - totalDeductions);
      
      if (tempTaxableIncome > 250000 && tempTaxableIncome <= 500000) {
        tempTax = (tempTaxableIncome - 250000) * 0.05;
      } else if (tempTaxableIncome > 500000 && tempTaxableIncome <= 1000000) {
        tempTax = 12500 + (tempTaxableIncome - 500000) * 0.2;
      } else if (tempTaxableIncome > 1000000) {
        tempTax = 112500 + (tempTaxableIncome - 1000000) * 0.3;
      }
      
      tempTax *= 1.04; // Add cess
      
      chartData.push({
        income: income / 100000,
        tax: tempTax,
        netIncome: income - tempTax,
        taxRate: (tempTax / income) * 100
      });
    }

    const pieData = [
      { name: 'Net Income', value: netIncome, color: '#06D6A0' },
      { name: 'Total Tax', value: totalTax, color: '#EF4444' }
    ];

    setResults({
      taxableIncome,
      totalTax,
      netIncome,
      effectiveTaxRate,
      chartData,
      pieData,
      taxBreakdown
    });
  };

  return (
    <CalculatorLayout title="Tax Calculator">
      <div className="space-y-8">
        {/* Calculator Section with Summary Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calculator Inputs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-primary" />
                Tax Calculation Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Annual Income: {formatCurrency(annualIncome)}</Label>
                <Slider
                  value={[annualIncome]}
                  onValueChange={(value) => setAnnualIncome(value[0])}
                  max={5000000}
                  min={300000}
                  step={50000}
                  className="w-full"
                />
                <Input
                  type="number"
                  value={annualIncome}
                  onChange={(e) => setAnnualIncome(Number(e.target.value))}
                  className="mt-1"
                />
              </div>

              <div className="space-y-2">
                <Label>Standard Deduction: {formatCurrency(deductions)}</Label>
                <Slider
                  value={[deductions]}
                  onValueChange={(value) => setDeductions(value[0])}
                  max={200000}
                  min={50000}
                  step={5000}
                  className="w-full"
                />
                <Input
                  type="number"
                  value={deductions}
                  onChange={(e) => setDeductions(Number(e.target.value))}
                  className="mt-1"
                />
              </div>

              <div className="space-y-2">
                <Label>HRA Exemption: {formatCurrency(hra)}</Label>
                <Slider
                  value={[hra]}
                  onValueChange={(value) => setHra(value[0])}
                  max={500000}
                  min={0}
                  step={10000}
                  className="w-full"
                />
                <Input
                  type="number"
                  value={hra}
                  onChange={(e) => setHra(Number(e.target.value))}
                  className="mt-1"
                />
              </div>

              <div className="space-y-2">
                <Label>80C Investments: {formatCurrency(investmentDeductions)}</Label>
                <Slider
                  value={[investmentDeductions]}
                  onValueChange={(value) => setInvestmentDeductions(value[0])}
                  max={150000}
                  min={0}
                  step={5000}
                  className="w-full"
                />
                <Input
                  type="number"
                  value={investmentDeductions}
                  onChange={(e) => setInvestmentDeductions(Number(e.target.value))}
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
                    <span className="text-sm font-medium text-muted-foreground">Taxable Income</span>
                  </div>
                  <p className="text-2xl font-bold text-primary">{formatCurrency(results.taxableIncome)}</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-500/10 to-red-500/5 border-red-500/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-red-500" />
                    <span className="text-sm font-medium text-muted-foreground">Total Tax</span>
                  </div>
                  <p className="text-2xl font-bold text-red-500">{formatCurrency(results.totalTax)}</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-500/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Percent className="h-4 w-4 text-emerald-500" />
                    <span className="text-sm font-medium text-muted-foreground">Net Income</span>
                  </div>
                  <p className="text-2xl font-bold text-emerald-500">{formatCurrency(results.netIncome)}</p>
                </CardContent>
              </Card>
            </div>

            {/* Income Breakdown Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Income Breakdown</CardTitle>
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
          {/* Tax Rate vs Income */}
          <Card>
            <CardHeader>
              <CardTitle>Tax Rate vs Income Level</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={results.chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                    <XAxis 
                      dataKey="income" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      label={{ value: 'Income (Lakhs)', position: 'insideBottom', offset: -5 }}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      label={{ value: 'Tax Rate (%)', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip 
                      formatter={(value, name) => [`${Number(value).toFixed(2)}%`, name]}
                      labelStyle={{ color: 'hsl(var(--foreground))' }}
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="taxRate"
                      stroke="#EF4444"
                      fill="#EF4444"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Tax Slab Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Tax Slab Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={results.taxBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                    <XAxis 
                      dataKey="slab" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={10}
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
                    <Bar dataKey="amount" fill="#EF4444" />
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

export default TaxPage;