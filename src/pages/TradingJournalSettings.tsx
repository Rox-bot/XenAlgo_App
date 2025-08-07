import { useState, useEffect, useMemo } from "react";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link, useNavigate } from "react-router-dom";
import { useJournalSettings } from "@/hooks/useJournalSettings";
import { useTrades } from "@/hooks/useTrades";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";

export default function TradingJournalSettings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { settings, updateSettings, loading } = useJournalSettings();
  const { deleteTrade } = useTrades();
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const [formSettings, setFormSettings] = useState({
    accountCapital: "100000",
    defaultRiskPercentage: "2",
    currency: "INR",
    dateFormat: "DD/MM/YYYY",
    timezone: "Asia/Kolkata",
    defaultChartView: "trades-list"
  });

  // Load settings when component mounts
  useEffect(() => {
    if (settings) {
      setFormSettings({
        accountCapital: settings.account_capital?.toString() || "100000",
        defaultRiskPercentage: settings.default_risk_percentage?.toString() || "2",
        currency: settings.default_currency || "INR",
        dateFormat: "DD/MM/YYYY", // Not stored in DB yet
        timezone: "Asia/Kolkata", // Not stored in DB yet
        defaultChartView: "trades-list" // Not stored in DB yet
      });
    }
  }, [settings]);

  // Enhanced currency formatting with error handling
  const formatCurrency = (amount: string): string => {
    try {
      const num = parseFloat(amount) || 0;
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: formSettings.currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(num);
    } catch (error) {
      console.error('Error formatting currency:', error);
      return 'Invalid Amount';
    }
  };

  // Memoized risk calculation for better performance
  const riskCalculation = useMemo(() => {
    try {
      const accountCapital = parseFloat(formSettings.accountCapital) || 0;
      const riskPercentage = parseFloat(formSettings.defaultRiskPercentage) || 0;
      const riskAmount = (accountCapital * riskPercentage) / 100;
      return {
        accountCapital,
        riskPercentage,
        riskAmount: formatCurrency(riskAmount.toString())
      };
    } catch (error) {
      console.error('Error calculating risk:', error);
      return {
        accountCapital: 0,
        riskPercentage: 0,
        riskAmount: '₹0'
      };
    }
  }, [formSettings.accountCapital, formSettings.defaultRiskPercentage, formSettings.currency]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to save settings");
      return;
    }

    // Enhanced form validation
    try {
      const accountCapital = parseFloat(formSettings.accountCapital);
      const riskPercentage = parseFloat(formSettings.defaultRiskPercentage);

      if (isNaN(accountCapital) || accountCapital <= 0) {
        toast.error("Please enter a valid account capital amount");
        return;
      }

      if (isNaN(riskPercentage) || riskPercentage < 0.1 || riskPercentage > 10) {
        toast.error("Risk percentage must be between 0.1% and 10%");
        return;
      }

      setIsSaving(true);
      await updateSettings({
        account_capital: accountCapital,
        default_risk_percentage: riskPercentage,
        default_currency: formSettings.currency,
      });
      toast.success("Settings saved successfully!");
    } catch (error: any) {
      console.error('Error saving settings:', error);
      toast.error(error.message || "Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    if (!user) {
      toast.error("You must be logged in to reset your journal");
      return;
    }

    if (!confirm("Are you sure you want to reset your journal? This will permanently delete all trade data and cannot be undone.")) {
      return;
    }

    try {
      setIsResetting(true);
      
      // Delete all trades for the user
      const { data: trades, error: fetchError } = await supabase
        .from('trades')
        .select('id')
        .eq('user_id', user.id);

      if (fetchError) throw fetchError;

      // Delete each trade
      for (const trade of trades || []) {
        await deleteTrade(trade.id);
      }

      // Reset settings to defaults
      await updateSettings({
        account_capital: 100000,
        default_risk_percentage: 2.0,
        default_currency: 'INR',
      });

      toast.success("Journal reset successfully! All trades have been deleted and settings reset to defaults.");
      navigate('/trading-journal');
    } catch (error: any) {
      console.error('Error resetting journal:', error);
      toast.error(error.message || "Failed to reset journal");
    } finally {
      setIsResetting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="text-center py-8">
            <p className="text-primary">Loading settings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/trading-journal">
            <Button variant="ghost" size="sm" className="text-primary hover:bg-background-ultra">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Journal
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-primary">Journal Settings</h1>
            <p className="text-primary">Configure your trading journal preferences</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Account Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="accountCapital">Total Account Capital *</Label>
                <Input
                  id="accountCapital"
                  type="number"
                  value={formSettings.accountCapital}
                  onChange={(e) => setFormSettings({...formSettings, accountCapital: e.target.value})}
                  placeholder="100000"
                  required
                  aria-describedby="account-capital-help"
                  className="bg-background-pure border-border-light text-primary placeholder:text-primary focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <p className="text-sm text-primary mt-1" id="account-capital-help">
                  Current value: {formatCurrency(formSettings.accountCapital)}
                </p>
              </div>

              <div>
                <Label htmlFor="defaultRisk">Default Risk Per Trade (%)</Label>
                <Input
                  id="defaultRisk"
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="10"
                  value={formSettings.defaultRiskPercentage}
                  onChange={(e) => setFormSettings({...formSettings, defaultRiskPercentage: e.target.value})}
                  placeholder="2.0"
                  aria-describedby="risk-help"
                  className="bg-background-pure border-border-light text-primary placeholder:text-primary focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <p className="text-sm text-primary mt-1" id="risk-help">
                  Recommended: 1-3% per trade. Current: {formSettings.defaultRiskPercentage}% = {riskCalculation.riskAmount} per trade
                </p>
              </div>

              <div>
                <Label htmlFor="currency">Default Currency</Label>
                <Select value={formSettings.currency} onValueChange={(value) => setFormSettings({...formSettings, currency: value})}>
                  <SelectTrigger className="bg-background-pure border-border-light text-primary">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background-pure border border-border-light">
                    <SelectItem value="INR" className="text-primary hover:bg-background-ultra">Indian Rupee (₹)</SelectItem>
                    <SelectItem value="USD" className="text-primary hover:bg-background-ultra">US Dollar ($)</SelectItem>
                    <SelectItem value="EUR" className="text-primary hover:bg-background-ultra">Euro (€)</SelectItem>
                    <SelectItem value="GBP" className="text-primary hover:bg-background-ultra">British Pound (£)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Display Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Display Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="dateFormat">Date Format</Label>
                <Select value={formSettings.dateFormat} onValueChange={(value) => setFormSettings({...formSettings, dateFormat: value})}>
                  <SelectTrigger className="bg-background-pure border-border-light text-primary">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background-pure border border-border-light">
                    <SelectItem value="DD/MM/YYYY" className="text-primary hover:bg-background-ultra">DD/MM/YYYY (21/07/2024)</SelectItem>
                    <SelectItem value="MM/DD/YYYY" className="text-primary hover:bg-background-ultra">MM/DD/YYYY (07/21/2024)</SelectItem>
                    <SelectItem value="YYYY-MM-DD" className="text-primary hover:bg-background-ultra">YYYY-MM-DD (2024-07-21)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="timezone">Timezone</Label>
                <Select value={formSettings.timezone} onValueChange={(value) => setFormSettings({...formSettings, timezone: value})}>
                  <SelectTrigger className="bg-background-pure border-border-light text-primary">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background-pure border border-border-light">
                    <SelectItem value="Asia/Kolkata" className="text-primary hover:bg-background-ultra">Asia/Kolkata (IST)</SelectItem>
                    <SelectItem value="America/New_York" className="text-primary hover:bg-background-ultra">America/New_York (EST)</SelectItem>
                    <SelectItem value="Europe/London" className="text-primary hover:bg-background-ultra">Europe/London (GMT)</SelectItem>
                    <SelectItem value="Asia/Tokyo" className="text-primary hover:bg-background-ultra">Asia/Tokyo (JST)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="defaultView">Default Chart View</Label>
                <Select value={formSettings.defaultChartView} onValueChange={(value) => setFormSettings({...formSettings, defaultChartView: value})}>
                  <SelectTrigger className="bg-background-pure border-border-light text-primary">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background-pure border border-border-light">
                    <SelectItem value="trades-list" className="text-primary hover:bg-background-ultra">Trades List</SelectItem>
                    <SelectItem value="analytics" className="text-primary hover:bg-background-ultra">Analytics Dashboard</SelectItem>
                    <SelectItem value="calendar" className="text-primary hover:bg-background-ultra">Calendar View</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <Button type="button" variant="outline" className="border-border-light text-primary hover:bg-background-ultra">
                  Export All Data
                </Button>
                <Button type="button" variant="outline" className="border-border-light text-primary hover:bg-background-ultra">
                  Import Trades
                </Button>
              </div>

              <Alert className="border-warning bg-warning/10">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <AlertDescription className="text-primary">
                  <strong className="text-warning">Danger Zone:</strong> The action below will permanently delete all your trade data. This cannot be undone.
                </AlertDescription>
              </Alert>

              <Button 
                type="button" 
                variant="destructive" 
                onClick={handleReset}
                disabled={isResetting}
                className="w-full"
              >
                {isResetting ? "Resetting..." : "Reset Journal (Delete All Data)"}
              </Button>
            </CardContent>
          </Card>

          {/* Save Settings */}
          <div className="flex justify-end gap-2">
            <Link to="/trading-journal">
              <Button type="button" variant="outline" className="border-border-light text-primary hover:bg-background-ultra">
                Cancel
              </Button>
            </Link>
            <Button type="submit" className="bg-primary text-background-soft hover:bg-primary/90" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}