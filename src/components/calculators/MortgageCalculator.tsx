
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building, DollarSign, Home, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const MortgageCalculator = () => {
  const [homePrice, setHomePrice] = useState(400000);
  const [downPayment, setDownPayment] = useState(80000);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTerm, setLoanTerm] = useState(30);
  const [propertyTax, setPropertyTax] = useState(3000);
  const [homeInsurance, setHomeInsurance] = useState(1200);
  const [pmi, setPmi] = useState(200);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const [results, setResults] = useState({
    monthlyPayment: 0,
    principalInterest: 0,
    totalMonthlyPayment: 0,
    totalCost: 0,
    totalInterest: 0,
    loanAmount: 0
  });

  useEffect(() => {
    calculateMortgage();
  }, [homePrice, downPayment, interestRate, loanTerm, propertyTax, homeInsurance, pmi]);

  const calculateMortgage = () => {
    const loanAmount = homePrice - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const totalMonths = loanTerm * 12;
    
    const monthlyPayment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
                          (Math.pow(1 + monthlyRate, totalMonths) - 1);
    
    const monthlyPropertyTax = propertyTax / 12;
    const monthlyInsurance = homeInsurance / 12;
    const monthlyPMI = pmi;
    
    const totalMonthlyPayment = monthlyPayment + monthlyPropertyTax + monthlyInsurance + monthlyPMI;
    const totalCost = (monthlyPayment * totalMonths) + downPayment;
    const totalInterest = (monthlyPayment * totalMonths) - loanAmount;

    setResults({
      monthlyPayment: Math.round(monthlyPayment),
      principalInterest: Math.round(monthlyPayment),
      totalMonthlyPayment: Math.round(totalMonthlyPayment),
      totalCost: Math.round(totalCost),
      totalInterest: Math.round(totalInterest),
      loanAmount: Math.round(loanAmount)
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
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Mortgage Calculator</h2>
        <p className="text-gray-600">Calculate your home loan payments and total costs</p>
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
                    <h4 className="font-semibold">Enter Home Details</h4>
                    <p className="text-sm text-gray-600">Input home price and down payment amount</p>
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
                    <h4 className="font-semibold">Add Additional Costs</h4>
                    <p className="text-sm text-gray-600">Include property tax, insurance, and PMI</p>
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
                <Building className="h-5 w-5 text-purple-600" />
                Home Purchase Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label>Home Price</Label>
                  <Input
                    type="number"
                    value={homePrice}
                    onChange={(e) => setHomePrice(Number(e.target.value))}
                    className="w-32"
                  />
                </div>
                <Slider
                  value={[homePrice]}
                  onValueChange={(value) => setHomePrice(value[0])}
                  max={1000000}
                  min={100000}
                  step={5000}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>$100,000</span>
                  <span>$1,000,000</span>
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
                  max={homePrice * 0.5}
                  min={homePrice * 0.05}
                  step={1000}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>{((downPayment / homePrice) * 100).toFixed(0)}%</span>
                  <span>{formatCurrency(downPayment)}</span>
                </div>
              </div>

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
                  max={10}
                  min={3}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>3%</span>
                  <span>10%</span>
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
                  max={30}
                  min={10}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>10 years</span>
                  <span>30 years</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5 text-purple-600" />
                Additional Costs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label>Annual Property Tax</Label>
                  <Input
                    type="number"
                    value={propertyTax}
                    onChange={(e) => setPropertyTax(Number(e.target.value))}
                    className="w-32"
                  />
                </div>
                <Slider
                  value={[propertyTax]}
                  onValueChange={(value) => setPropertyTax(value[0])}
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

              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label>Annual Home Insurance</Label>
                  <Input
                    type="number"
                    value={homeInsurance}
                    onChange={(e) => setHomeInsurance(Number(e.target.value))}
                    className="w-32"
                  />
                </div>
                <Slider
                  value={[homeInsurance]}
                  onValueChange={(value) => setHomeInsurance(value[0])}
                  max={5000}
                  min={500}
                  step={50}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>$500</span>
                  <span>$5,000</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label>Monthly PMI</Label>
                  <Input
                    type="number"
                    value={pmi}
                    onChange={(e) => setPmi(Number(e.target.value))}
                    className="w-32"
                  />
                </div>
                <Slider
                  value={[pmi]}
                  onValueChange={(value) => setPmi(value[0])}
                  max={500}
                  min={0}
                  step={10}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>$0</span>
                  <span>$500</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <DollarSign className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-sm text-purple-700 font-medium">Total Monthly Payment</p>
                <p className="text-3xl font-bold text-purple-800">{formatCurrency(results.totalMonthlyPayment)}</p>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-4">
            <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-slate-700 font-medium">Principal & Interest</p>
                  <p className="text-2xl font-bold text-slate-800">{formatCurrency(results.principalInterest)}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-gray-700 font-medium">Loan Amount</p>
                  <p className="text-2xl font-bold text-gray-800">{formatCurrency(results.loanAmount)}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-zinc-50 to-zinc-100 border-zinc-200">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-zinc-700 font-medium">Total Interest</p>
                  <p className="text-2xl font-bold text-zinc-800">{formatCurrency(results.totalInterest)}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Payment Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Principal & Interest</span>
                  <span className="font-semibold">{formatCurrency(results.principalInterest)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Property Tax</span>
                  <span className="font-semibold">{formatCurrency(propertyTax / 12)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Home Insurance</span>
                  <span className="font-semibold">{formatCurrency(homeInsurance / 12)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">PMI</span>
                  <span className="font-semibold">{formatCurrency(pmi)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between font-bold">
                    <span>Total Monthly Payment</span>
                    <span className="text-purple-600">{formatCurrency(results.totalMonthlyPayment)}</span>
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

export default MortgageCalculator;
