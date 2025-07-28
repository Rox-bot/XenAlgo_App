import { useState, useEffect } from "react";
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to save settings");
      return;
    }

    try {
      setIsSaving(true);
      await updateSettings({
        account_capital: parseFloat(formSettings.accountCapital),
        default_risk_percentage: parseFloat(formSettings.defaultRiskPercentage),
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

  const formatCurrency = (amount: string) => {
    const num = parseFloat(amount) || 0;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: formSettings.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading settings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/trading-journal">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Journal
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Journal Settings</h1>
            <p className="text-muted-foreground">Configure your trading journal preferences</p>
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
                />
                <p className="text-sm text-muted-foreground mt-1">
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
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Recommended: 1-3% per trade. Current: {formSettings.defaultRiskPercentage}% = {formatCurrency((parseFloat(formSettings.accountCapital) * parseFloat(formSettings.defaultRiskPercentage) / 100).toString())} per trade
                </p>
              </div>

              <div>
                <Label htmlFor="currency">Default Currency</Label>
                <Select value={formSettings.currency} onValueChange={(value) => setFormSettings({...formSettings, currency: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
                    <SelectItem value="USD">US Dollar ($)</SelectItem>
                    <SelectItem value="EUR">Euro (€)</SelectItem>
                    <SelectItem value="GBP">British Pound (£)</SelectItem>
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
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY (21/07/2024)</SelectItem>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY (07/21/2024)</SelectItem>
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD (2024-07-21)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="timezone">Timezone</Label>
                <Select value={formSettings.timezone} onValueChange={(value) => setFormSettings({...formSettings, timezone: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                    <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                    <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                    <SelectItem value="Asia/Tokyo">Asia/Tokyo (JST)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="defaultView">Default Chart View</Label>
                <Select value={formSettings.defaultChartView} onValueChange={(value) => setFormSettings({...formSettings, defaultChartView: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trades-list">Trades List</SelectItem>
                    <SelectItem value="analytics">Analytics Dashboard</SelectItem>
                    <SelectItem value="calendar">Calendar View</SelectItem>
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
                <Button type="button" variant="outline">
                  Export All Data
                </Button>
                <Button type="button" variant="outline">
                  Import Trades
                </Button>
              </div>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Danger Zone:</strong> The action below will permanently delete all your trade data. This cannot be undone.
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
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}