
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Car, DollarSign, Calendar, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const CarLoanCalculator = () => {
  const [carPrice, setCarPrice] = useState(25000);
  const [downPayment, setDownPayment] = useState(5000);
  const [interestRate, setInterestRate] = useState(5.5);
  const [loanTerm, setLoanTerm] = useState(5);
  const [tradeInValue, setTradeInValue] = useState(0);
  const [salesTax, setSalesTax] = useState(8.5);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const [results, setResults] = useState({
    monthlyPayment: 0,
    totalCost: 0,
    totalInterest: 0,
    loanAmount: 0,
    totalTaxes: 0
  });

  useEffect(() => {
    calculateCarLoan();
  }, [carPrice, downPayment, interestRate, loanTerm, tradeInValue, salesTax]);

  const calculateCarLoan = () => {
    const taxes = carPrice * (salesTax / 100);
    const totalCost = carPrice + taxes;
    const loanAmount = totalCost - downPayment - tradeInValue;
    
    const monthlyRate = interestRate / 100 / 12;
    const totalMonths = loanTerm * 12;
    
    const monthlyPayment = loanAmount > 0 ? 
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
      (Math.pow(1 + monthlyRate, totalMonths) - 1) : 0;
    
    const totalInterest = (monthlyPayment * totalMonths) - loanAmount;
    const totalPaid = (monthlyPayment * totalMonths) + downPayment + tradeInValue;

    setResults({
      monthlyPayment: Math.round(monthlyPayment),
      totalCost: Math.round(totalPaid),
      totalInterest: Math.round(totalInterest),
      loanAmount: Math.round(loanAmount),
      totalTaxes: Math.round(taxes)
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
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Car Loan Calculator</h2>
        <p className="text-gray-600">Calculate your auto loan payments and total costs</p>
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
                    <h4 className="font-semibold">Enter Car Details</h4>
                    <p className="text-sm text-gray-600">Input car price, down payment, and trade-in value</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <h4 className="font-semibold">Set Loan Terms</h4>
                    <p className="text-sm text-gray-600">Choose interest rate and loan duration</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <h4 className="font-semibold">Include Taxes</h4>
                    <p className="text-sm text-gray-600">Add sales tax percentage for accurate calculations</p>
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
                <Car className="h-5 w-5 text-purple-600" />
                Car Purchase Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label>Car Price</Label>
                  <Input
                    type="number"
                    value={carPrice}
                    onChange={(e) => setCarPrice(Number(e.target.value))}
                    className="w-32"
                  />
                </div>
                <Slider
                  value={[carPrice]}
                  onValueChange={(value) => setCarPrice(value[0])}
                  max={80000}
                  min={5000}
                  step={1000}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>$5,000</span>
                  <span>$80,000</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label>Down Payment</Label>
                  <Input
                    type="number"
                    value={downPayment}
                    onChange={(e) => setDownPayment(Number(e.target.value))}
                    className="w-32"
                  />
                </div>
                <Slider
                  value={[downPayment]}
                  onValueChange={(value) => setDownPayment(value[0])}
                  max={carPrice * 0.5}
                  min={0}
                  step={500}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>$0</span>
                  <span>{formatCurrency(carPrice * 0.5)}</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label>Trade-in Value</Label>
                  <Input
                    type="number"
                    value={tradeInValue}
                    onChange={(e) => setTradeInValue(Number(e.target.value))}
                    className="w-32"
                  />
                </div>
                <Slider
                  value={[tradeInValue]}
                  onValueChange={(value) => setTradeInValue(value[0])}
                  max={30000}
                  min={0}
                  step={500}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>$0</span>
                  <span>$30,000</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label>Sales Tax (%)</Label>
                  <Input
                    type="number"
                    value={salesTax}
                    onChange={(e) => setSalesTax(Number(e.target.value))}
                    className="w-32"
                    step="0.1"
                  />
                </div>
                <Slider
                  value={[salesTax]}
                  onValueChange={(value) => setSalesTax(value[0])}
                  max={15}
                  min={0}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>0%</span>
                  <span>15%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-purple-600" />
                Loan Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label>Interest Rate (%)</Label>
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
                  max={15}
                  min={1}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>1%</span>
                  <span>15%</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label>Loan Term (Years)</Label>
                  <Input
                    type="number"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(Number(e.target.value))}
                    className="w-32"
                  />
                </div>
                <Slider
                  value={[loanTerm]}
                  onValueChange={(value) => setLoanTerm(value[0])}
                  max={8}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>1 year</span>
                  <span>8 years</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-sm text-purple-700 font-medium">Monthly Payment</p>
                <p className="text-3xl font-bold text-purple-800">{formatCurrency(results.monthlyPayment)}</p>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-4">
            <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-slate-700 font-medium">Loan Amount</p>
                  <p className="text-2xl font-bold text-slate-800">{formatCurrency(results.loanAmount)}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-gray-700 font-medium">Total Interest</p>
                  <p className="text-2xl font-bold text-gray-800">{formatCurrency(results.totalInterest)}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-zinc-50 to-zinc-100 border-zinc-200">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-zinc-700 font-medium">Total Cost</p>
                  <p className="text-2xl font-bold text-zinc-800">{formatCurrency(results.totalCost)}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Cost Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Car Price</span>
                  <span className="font-semibold">{formatCurrency(carPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sales Tax</span>
                  <span className="font-semibold">{formatCurrency(results.totalTaxes)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Down Payment</span>
                  <span className="font-semibold">-{formatCurrency(downPayment)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Trade-in Value</span>
                  <span className="font-semibold">-{formatCurrency(tradeInValue)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between font-bold">
                    <span>Loan Amount</span>
                    <span className="text-purple-600">{formatCurrency(results.loanAmount)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CarLoanCalculator;
