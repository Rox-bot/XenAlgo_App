
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DollarSign, Calculator, Receipt, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const TaxCalculator = () => {
  const [annualIncome, setAnnualIncome] = useState(75000);
  const [deductions, setDeductions] = useState(12950);
  const [filingStatus, setFilingStatus] = useState('single');
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const [results, setResults] = useState({
    taxableIncome: 0,
    federalTax: 0,
    stateTax: 0,
    ficaTax: 0,
    totalTax: 0,
    netIncome: 0,
    effectiveRate: 0,
    marginalRate: 0
  });

  useEffect(() => {
    calculateTax();
  }, [annualIncome, deductions, filingStatus]);

  const calculateTax = () => {
    const taxableIncome = Math.max(0, annualIncome - deductions);
    
    // Federal tax brackets for 2024 (single filer)
    const federalBrackets = [
      { min: 0, max: 11000, rate: 0.10 },
      { min: 11000, max: 44725, rate: 0.12 },
      { min: 44725, max: 95375, rate: 0.22 },
      { min: 95375, max: 182050, rate: 0.24 },
      { min: 182050, max: 231250, rate: 0.32 },
      { min: 231250, max: 578125, rate: 0.35 },
      { min: 578125, max: Infinity, rate: 0.37 }
    ];

    let federalTax = 0;
    let marginalRate = 0;
    
    for (const bracket of federalBrackets) {
      if (taxableIncome > bracket.min) {
        const taxableInThisBracket = Math.min(taxableIncome, bracket.max) - bracket.min;
        federalTax += taxableInThisBracket * bracket.rate;
        marginalRate = bracket.rate;
      }
    }

    // Estimated state tax (varies by state, using 5% average)
    const stateTax = taxableIncome * 0.05;
    
    // FICA taxes (Social Security + Medicare)
    const ficaTax = annualIncome * 0.0765;
    
    const totalTax = federalTax + stateTax + ficaTax;
    const netIncome = annualIncome - totalTax;
    const effectiveRate = (totalTax / annualIncome) * 100;

    setResults({
      taxableIncome: Math.round(taxableIncome),
      federalTax: Math.round(federalTax),
      stateTax: Math.round(stateTax),
      ficaTax: Math.round(ficaTax),
      totalTax: Math.round(totalTax),
      netIncome: Math.round(netIncome),
      effectiveRate: Math.round(effectiveRate * 100) / 100,
      marginalRate: Math.round(marginalRate * 10000) / 100
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
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Tax Calculator</h2>
        <p className="text-gray-600">Calculate your income tax and optimize your tax planning</p>
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
                    <h4 className="font-semibold">Enter Your Income</h4>
                    <p className="text-sm text-gray-600">Input your annual gross income</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <h4 className="font-semibold">Add Deductions</h4>
                    <p className="text-sm text-gray-600">Include standard or itemized deductions</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <h4 className="font-semibold">View Tax Breakdown</h4>
                    <p className="text-sm text-gray-600">See federal, state, and FICA tax calculations</p>
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
                <Calculator className="h-5 w-5 text-purple-600" />
                Income Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label>Annual Income</Label>
                  <Input
                    type="number"
                    value={annualIncome}
                    onChange={(e) => setAnnualIncome(Number(e.target.value))}
                    className="w-32"
                  />
                </div>
                <Slider
                  value={[annualIncome]}
                  onValueChange={(value) => setAnnualIncome(value[0])}
                  max={500000}
                  min={20000}
                  step={1000}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>$20,000</span>
                  <span>$500,000</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label>Deductions</Label>
                  <Input
                    type="number"
                    value={deductions}
                    onChange={(e) => setDeductions(Number(e.target.value))}
                    className="w-32"
                  />
                </div>
                <Slider
                  value={[deductions]}
                  onValueChange={(value) => setDeductions(value[0])}
                  max={50000}
                  min={5000}
                  step={250}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>$5,000</span>
                  <span>$50,000</span>
                </div>
              </div>

              <div>
                <Label className="mb-2 block">Filing Status</Label>
                <select 
                  value={filingStatus} 
                  onChange={(e) => setFilingStatus(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="single">Single</option>
                  <option value="married-joint">Married Filing Jointly</option>
                  <option value="married-separate">Married Filing Separately</option>
                  <option value="head-of-household">Head of Household</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <DollarSign className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-sm text-purple-700 font-medium">Net Income</p>
                <p className="text-3xl font-bold text-purple-800">{formatCurrency(results.netIncome)}</p>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-xs text-slate-700 font-medium">Effective Rate</p>
                  <p className="text-xl font-bold text-slate-800">{results.effectiveRate}%</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-xs text-gray-700 font-medium">Marginal Rate</p>
                  <p className="text-xl font-bold text-gray-800">{results.marginalRate}%</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-purple-600" />
                Tax Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Gross Income</span>
                  <span className="font-semibold">{formatCurrency(annualIncome)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Less: Deductions</span>
                  <span className="font-semibold">-{formatCurrency(deductions)}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-gray-600">Taxable Income</span>
                  <span className="font-semibold">{formatCurrency(results.taxableIncome)}</span>
                </div>
                <div className="space-y-2 mt-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Federal Tax</span>
                    <span className="font-semibold">{formatCurrency(results.federalTax)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">State Tax</span>
                    <span className="font-semibold">{formatCurrency(results.stateTax)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">FICA Tax</span>
                    <span className="font-semibold">{formatCurrency(results.ficaTax)}</span>
                  </div>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between font-bold">
                    <span>Total Tax</span>
                    <span className="text-red-600">{formatCurrency(results.totalTax)}</span>
                  </div>
                  <div className="flex justify-between font-bold mt-2">
                    <span>Net Income</span>
                    <span className="text-green-600">{formatCurrency(results.netIncome)}</span>
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

export default TaxCalculator;
