
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Home, DollarSign, Calendar, Percent, ChevronDown, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Switch } from '@/components/ui/switch';
import { useCurrency } from '@/contexts/CurrencyContext';

const LoanEMICalculator = () => {
  const { currency } = useCurrency();
  const [loanAmount, setLoanAmount] = useState(300000);
  const [interestRate, setInterestRate] = useState(7.5);
  const [loanTenure, setLoanTenure] = useState(20);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [enablePartPayment, setEnablePartPayment] = useState(false);
  const [partPaymentAmount, setPartPaymentAmount] = useState(10000);
  const [partPaymentYear, setPartPaymentYear] = useState(5);

  const [results, setResults] = useState({
    emi: 0,
    totalAmount: 0,
    totalInterest: 0,
    pieData: [],
    amortizationData: [],
    withPartPayment: {
      totalAmount: 0,
      totalInterest: 0,
      tenureReduction: 0,
      interestSaved: 0
    }
  });

  useEffect(() => {
    calculateEMI();
  }, [loanAmount, interestRate, loanTenure, enablePartPayment, partPaymentAmount, partPaymentYear]);

  const calculateEMI = () => {
    const monthlyRate = interestRate / 100 / 12;
    const totalMonths = loanTenure * 12;
    
    const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
                (Math.pow(1 + monthlyRate, totalMonths) - 1);
    
    const totalAmount = emi * totalMonths;
    const totalInterest = totalAmount - loanAmount;

    // Calculate with part payment
    let withPartPayment = {
      totalAmount: totalAmount,
      totalInterest: totalInterest,
      tenureReduction: 0,
      interestSaved: 0
    };

    if (enablePartPayment) {
      const partPaymentMonth = partPaymentYear * 12;
      let remainingPrincipal = loanAmount;
      let monthlyPayment = 0;
      let totalPaid = 0;
      let month = 0;
      
      while (remainingPrincipal > 0 && month < totalMonths) {
        const interestPayment = remainingPrincipal * monthlyRate;
        const principalPayment = emi - interestPayment;
        
        remainingPrincipal -= principalPayment;
        totalPaid += emi;
        month++;
        
        // Apply part payment
        if (month === partPaymentMonth && remainingPrincipal > partPaymentAmount) {
          remainingPrincipal -= partPaymentAmount;
          totalPaid += partPaymentAmount;
        }
        
        if (remainingPrincipal <= 0) break;
      }
      
      withPartPayment = {
        totalAmount: totalPaid,
        totalInterest: totalPaid - loanAmount - (enablePartPayment ? partPaymentAmount : 0),
        tenureReduction: totalMonths - month,
        interestSaved: totalInterest - (totalPaid - loanAmount - (enablePartPayment ? partPaymentAmount : 0))
      };
    }

    // Pie chart data
    const pieData = [
      { name: 'Principal', value: loanAmount, color: '#8b5cf6' },
      { name: 'Interest', value: enablePartPayment ? withPartPayment.totalInterest : totalInterest, color: '#64748b' }
    ];

    // Amortization schedule (yearly)
    const amortizationData = [];
    let remainingPrincipal = loanAmount;
    
    for (let year = 1; year <= loanTenure; year++) {
      let yearlyPrincipal = 0;
      let yearlyInterest = 0;
      
      for (let month = 1; month <= 12; month++) {
        const interestPayment = remainingPrincipal * monthlyRate;
        const principalPayment = emi - interestPayment;
        
        yearlyInterest += interestPayment;
        yearlyPrincipal += principalPayment;
        remainingPrincipal -= principalPayment;
        
        // Apply part payment
        if (enablePartPayment && year === partPaymentYear && month === 12) {
          remainingPrincipal -= partPaymentAmount;
        }
        
        if (remainingPrincipal <= 0) break;
      }
      
      amortizationData.push({
        year,
        principal: Math.round(yearlyPrincipal),
        interest: Math.round(yearlyInterest),
        balance: Math.round(Math.max(0, remainingPrincipal))
      });
      
      if (remainingPrincipal <= 0) break;
    }

    setResults({
      emi: Math.round(emi),
      totalAmount: Math.round(totalAmount),
      totalInterest: Math.round(totalInterest),
      pieData,
      amortizationData,
      withPartPayment
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
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Loan EMI Calculator</h2>
        <p className="text-gray-600">Calculate your monthly payments and optimize with part payments</p>
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
                    <h4 className="font-semibold">Enter Loan Details</h4>
                    <p className="text-sm text-gray-600">Set your loan amount, interest rate, and tenure</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <h4 className="font-semibold">Enable Part Payment (Optional)</h4>
                    <p className="text-sm text-gray-600">Add a one-time part payment to reduce interest and tenure</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <h4 className="font-semibold">Compare Results</h4>
                    <p className="text-sm text-gray-600">See how part payment saves interest and reduces loan tenure</p>
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
                <Home className="h-5 w-5 text-purple-600" />
                Loan Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label>Loan Amount</Label>
                  <Input
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-32"
                  />
                </div>
                <Slider
                  value={[loanAmount]}
                  onValueChange={(value) => setLoanAmount(value[0])}
                  max={1000000}
                  min={10000}
                  step={5000}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>{currency.symbol}10,000</span>
                  <span>{currency.symbol}1,000,000</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label>Interest Rate (% per year)</Label>
                  <Input
                    type="number"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-32"
                    step="0.1"
                  />
                </div>
                <Slider
                  value={[interestRate]}
                  onValueChange={(value) => setInterestRate(value[0])}
                  max={20}
                  min={1}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>1%</span>
                  <span>20%</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label>Loan Tenure (Years)</Label>
                  <Input
                    type="number"
                    value={loanTenure}
                    onChange={(e) => setLoanTenure(Number(e.target.value))}
                    className="w-32"
                  />
                </div>
                <Slider
                  value={[loanTenure]}
                  onValueChange={(value) => setLoanTenure(value[0])}
                  max={30}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>1 year</span>
                  <span>30 years</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Part Payment Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-purple-600" />
                Part Payment Options
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="part-payment"
                  checked={enablePartPayment}
                  onCheckedChange={setEnablePartPayment}
                />
                <Label htmlFor="part-payment">Enable Part Payment</Label>
              </div>

              {enablePartPayment && (
                <>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label>Part Payment Amount</Label>
                      <Input
                        type="number"
                        value={partPaymentAmount}
                        onChange={(e) => setPartPaymentAmount(Number(e.target.value))}
                        className="w-32"
                      />
                    </div>
                    <Slider
                      value={[partPaymentAmount]}
                      onValueChange={(value) => setPartPaymentAmount(value[0])}
                      max={100000}
                      min={1000}
                      step={1000}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>{currency.symbol}1,000</span>
                      <span>{currency.symbol}100,000</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label>Part Payment Year</Label>
                      <Input
                        type="number"
                        value={partPaymentYear}
                        onChange={(e) => setPartPaymentYear(Number(e.target.value))}
                        className="w-32"
                      />
                    </div>
                    <Slider
                      value={[partPaymentYear]}
                      onValueChange={(value) => setPartPaymentYear(value[0])}
                      max={loanTenure}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>Year 1</span>
                      <span>Year {loanTenure}</span>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Results Summary */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <DollarSign className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-sm text-purple-700 font-medium">Monthly EMI</p>
                <p className="text-3xl font-bold text-purple-800">{formatCurrency(results.emi)}</p>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Calendar className="h-6 w-6 text-slate-600 mx-auto mb-2" />
                  <p className="text-xs text-slate-700 font-medium">Total Amount</p>
                  <p className="text-lg font-bold text-slate-800">
                    {formatCurrency(enablePartPayment ? results.withPartPayment.totalAmount : results.totalAmount)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Percent className="h-6 w-6 text-gray-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-700 font-medium">Total Interest</p>
                  <p className="text-lg font-bold text-gray-800">
                    {formatCurrency(enablePartPayment ? results.withPartPayment.totalInterest : results.totalInterest)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {enablePartPayment && (
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-green-700 font-medium mb-2">Part Payment Benefits</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-green-600">Interest Saved</p>
                      <p className="text-lg font-bold text-green-800">{formatCurrency(results.withPartPayment.interestSaved)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-green-600">Tenure Reduced</p>
                      <p className="text-lg font-bold text-green-800">{Math.round(results.withPartPayment.tenureReduction / 12)} yrs</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Payment Breakdown</CardTitle>
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
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-500 rounded"></div>
                <span className="text-sm">Principal ({formatCurrency(loanAmount)})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-slate-500 rounded"></div>
                <span className="text-sm">Interest ({formatCurrency(enablePartPayment ? results.withPartPayment.totalInterest : results.totalInterest)})</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Yearly Payment Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={results.amortizationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis tickFormatter={(value) => `${currency.symbol}${(value / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Bar dataKey="principal" stackId="a" fill="#8b5cf6" name="Principal" />
                  <Bar dataKey="interest" stackId="a" fill="#64748b" name="Interest" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoanEMICalculator;
