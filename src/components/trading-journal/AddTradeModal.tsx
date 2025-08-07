import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X } from "lucide-react";
import { TradeFormData } from "@/hooks/useTrades";
import { toast } from "sonner";

interface AddTradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddTrade: (tradeData: TradeFormData) => Promise<any>;
  accountCapital: number;
}

const initialFormData = {
    symbol: "",
    trade_type: "LONG" as "LONG" | "SHORT",
    entry_price: "",
    quantity: "",
    entry_date: new Date().toISOString().slice(0, 16),
    stop_loss: "",
    take_profit: "",
    setup_type: "",
    entry_reason: "",
};

export function AddTradeModal({ open, onOpenChange, onAddTrade, accountCapital }: AddTradeModalProps) {
  const [formData, setFormData] = useState(initialFormData);
  const [showRiskManagement, setShowRiskManagement] = useState(false);
  const [showSetupDetails, setShowSetupDetails] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when modal opens/closes
  useEffect(() => {
    if (open) {
      resetForm();
    }
  }, [open]);

  const resetForm = () => {
    setFormData(initialFormData);
    setShowRiskManagement(false);
    setShowSetupDetails(false);
    setShowImageUpload(false);
    setUploadedImages([]);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.symbol.trim()) {
      newErrors.symbol = "Symbol is required";
    } else if (!/^[A-Z]+$/.test(formData.symbol.trim())) {
      newErrors.symbol = "Symbol must be uppercase letters only";
    }

    if (!formData.entry_price) {
      newErrors.entry_price = "Entry price is required";
    } else if (parseFloat(formData.entry_price) <= 0) {
      newErrors.entry_price = "Entry price must be positive";
    }

    if (!formData.quantity) {
      newErrors.quantity = "Quantity is required";
    } else if (parseInt(formData.quantity) <= 0) {
      newErrors.quantity = "Quantity must be positive";
    }

    if (formData.stop_loss && parseFloat(formData.stop_loss) <= 0) {
      newErrors.stop_loss = "Stop loss must be positive";
    }

    if (formData.take_profit && parseFloat(formData.take_profit) <= 0) {
      newErrors.take_profit = "Take profit must be positive";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateInvestment = () => {
    const price = parseFloat(formData.entry_price) || 0;
    const qty = parseInt(formData.quantity) || 0;
    return price * qty;
  };

  const calculateRisk = () => {
    if (!formData.stop_loss || !formData.entry_price || !formData.quantity) return 0;
    const entryPrice = parseFloat(formData.entry_price);
    const stopLoss = parseFloat(formData.stop_loss);
    const quantity = parseInt(formData.quantity);
    const multiplier = formData.trade_type === 'LONG' ? 1 : -1;
    return Math.abs((entryPrice - stopLoss) * quantity * multiplier);
  };

  const calculateRiskPercentage = () => {
    const riskAmount = calculateRisk();
    return (riskAmount / accountCapital) * 100;
  };

  const calculateRRRatio = () => {
    if (!formData.stop_loss || !formData.take_profit || !formData.entry_price) return 0;
    const entryPrice = parseFloat(formData.entry_price);
    const stopLoss = parseFloat(formData.stop_loss);
    const takeProfit = parseFloat(formData.take_profit);
    const risk = Math.abs(entryPrice - stopLoss);
    const reward = Math.abs(takeProfit - entryPrice);
    return risk > 0 ? reward / risk : 0;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (uploadedImages.length + files.length > 2) {
      toast.error("Maximum 2 images allowed");
      return;
    }
    setUploadedImages([...uploadedImages, ...files]);
  };

  const removeImage = (index: number) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      setIsSubmitting(true);
      
      const tradeData: TradeFormData = {
        symbol: formData.symbol.trim().toUpperCase(),
        trade_type: formData.trade_type,
        entry_price: parseFloat(formData.entry_price),
        quantity: parseInt(formData.quantity),
        entry_date: formData.entry_date,
        stop_loss: formData.stop_loss ? parseFloat(formData.stop_loss) : undefined,
        take_profit: formData.take_profit ? parseFloat(formData.take_profit) : undefined,
        setup_type: formData.setup_type || undefined,
        entry_reason: formData.entry_reason || undefined,
      };

      await onAddTrade(tradeData);
      
      // Reset form and close modal
      resetForm();
      onOpenChange(false);
      toast.success("Trade added successfully!");
    } catch (error: any) {
      console.error('Error adding trade:', error);
      toast.error(error.message || "Failed to add trade");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background-pure border border-border-light">
        <DialogHeader>
          <DialogTitle className="text-primary">Add New Trade</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Trade Details */}
          <Card className="bg-background-pure border border-border-light">
            <CardContent className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="symbol" className="text-primary">Symbol *</Label>
                  <Input
                    id="symbol"
                    value={formData.symbol}
                    onChange={(e) => setFormData({...formData, symbol: e.target.value.toUpperCase()})}
                    placeholder="e.g., RELIANCE"
                    className={`bg-background-pure border-border-light text-primary placeholder:text-text-cool focus:border-primary ${errors.symbol ? "border-error" : ""}`}
                  />
                  {errors.symbol && <p className="text-sm text-error mt-1">{errors.symbol}</p>}
                </div>

                <div>
                  <Label className="text-primary">Trade Type *</Label>
                  <RadioGroup
                    value={formData.trade_type}
                    onValueChange={(value) => setFormData({...formData, trade_type: value as "LONG" | "SHORT"})}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="LONG" id="long" className="border-border-light" />
                      <Label htmlFor="long" className="text-primary">Long</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="SHORT" id="short" className="border-border-light" />
                      <Label htmlFor="short" className="text-primary">Short</Label>
                    </div>
                  </RadioGroup>
              </div>

                <div>
                  <Label htmlFor="entryPrice" className="text-primary">Entry Price *</Label>
                  <Input
                    id="entryPrice"
                    type="number"
                    step="0.01"
                    value={formData.entry_price}
                    onChange={(e) => setFormData({...formData, entry_price: e.target.value})}
                    placeholder="0.00"
                    className={`bg-background-pure border-border-light text-primary placeholder:text-text-cool focus:border-primary ${errors.entry_price ? "border-error" : ""}`}
                  />
                  {errors.entry_price && <p className="text-sm text-error mt-1">{errors.entry_price}</p>}
                </div>

                <div>
                  <Label htmlFor="quantity" className="text-primary">Quantity *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                    placeholder="0"
                    className={`bg-background-pure border-border-light text-primary placeholder:text-text-cool focus:border-primary ${errors.quantity ? "border-error" : ""}`}
                  />
                  {errors.quantity && <p className="text-sm text-error mt-1">{errors.quantity}</p>}
              </div>

              <div>
                  <Label htmlFor="entryDate" className="text-primary">Entry Date *</Label>
                  <Input
                    id="entryDate"
                    type="datetime-local"
                    value={formData.entry_date}
                    onChange={(e) => setFormData({...formData, entry_date: e.target.value})}
                    className="bg-background-pure border-border-light text-primary focus:border-primary"
                  />
              </div>

                <div className="flex items-end">
                  <div className="w-full">
                    <Label className="text-primary">Investment Amount</Label>
                    <p className="text-lg font-semibold text-primary">
                      {formatCurrency(calculateInvestment())}
                  </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Risk Management */}
          <Card className="bg-background-pure border border-border-light">
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="riskManagement"
                  checked={showRiskManagement}
                  onCheckedChange={(checked) => setShowRiskManagement(checked === true)}
                  className="border-border-light"
                />
                <Label htmlFor="riskManagement" className="font-medium text-primary">Risk Management</Label>
              </div>

              {showRiskManagement && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
                    <div>
                      <Label htmlFor="stopLoss" className="text-primary">Stop Loss</Label>
                      <Input
                        id="stopLoss"
                        type="number"
                        step="0.01"
                        value={formData.stop_loss}
                        onChange={(e) => setFormData({...formData, stop_loss: e.target.value})}
                        placeholder="0.00"
                        className={`bg-background-pure border-border-light text-primary placeholder:text-text-cool focus:border-primary ${errors.stop_loss ? "border-error" : ""}`}
                      />
                    {errors.stop_loss && <p className="text-sm text-error mt-1">{errors.stop_loss}</p>}
                    </div>

                    <div>
                      <Label htmlFor="takeProfit" className="text-primary">Take Profit</Label>
                      <Input
                        id="takeProfit"
                        type="number"
                        step="0.01"
                        value={formData.take_profit}
                        onChange={(e) => setFormData({...formData, take_profit: e.target.value})}
                        placeholder="0.00"
                        className={`bg-background-pure border-border-light text-primary placeholder:text-text-cool focus:border-primary ${errors.take_profit ? "border-error" : ""}`}
                      />
                    {errors.take_profit && <p className="text-sm text-error mt-1">{errors.take_profit}</p>}
                    </div>

                  <div>
                    <Label className="text-primary">Risk Amount</Label>
                    <p className="text-lg font-semibold text-error">
                      {formatCurrency(calculateRisk())}
                    </p>
                  </div>

                  <div>
                    <Label className="text-primary">Risk % of Capital</Label>
                    <p className="text-lg font-semibold text-warning">
                      {calculateRiskPercentage().toFixed(2)}%
                    </p>
                  </div>

                  <div>
                    <Label className="text-primary">Risk:Reward Ratio</Label>
                    <p className="text-lg font-semibold text-info">
                      {calculateRRRatio().toFixed(2)}:1
                        </p>
                    </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Setup Details */}
          <Card className="bg-background-pure border border-border-light">
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="setupDetails"
                  checked={showSetupDetails}
                  onCheckedChange={(checked) => setShowSetupDetails(checked === true)}
                  className="border-border-light"
                />
                <Label htmlFor="setupDetails" className="font-medium text-primary">Setup Details</Label>
              </div>

              {showSetupDetails && (
                <div className="space-y-4 pl-6">
                  <div>
                    <Label htmlFor="setupType" className="text-primary">Setup Type</Label>
                    <Select value={formData.setup_type} onValueChange={(value) => setFormData({...formData, setup_type: value})}>
                      <SelectTrigger className="bg-background-pure border-border-light text-primary focus:border-primary">
                        <SelectValue placeholder="Select setup type" />
                      </SelectTrigger>
                      <SelectContent className="bg-background-pure border border-border-light">
                        <SelectItem value="breakout" className="text-primary">Breakout</SelectItem>
                        <SelectItem value="pullback" className="text-primary">Pullback</SelectItem>
                        <SelectItem value="reversal" className="text-primary">Reversal</SelectItem>
                        <SelectItem value="support-resistance" className="text-primary">Support/Resistance</SelectItem>
                        <SelectItem value="other" className="text-primary">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="entryReason" className="text-primary">Entry Reason</Label>
                    <Textarea
                      id="entryReason"
                      value={formData.entry_reason}
                      onChange={(e) => setFormData({...formData, entry_reason: e.target.value})}
                      placeholder="Describe your entry reasoning..."
                      maxLength={200}
                      rows={3}
                      className="bg-background-pure border-border-light text-primary placeholder:text-text-cool focus:border-primary"
                    />
                    <p className="text-xs text-text-cool mt-1">
                      {formData.entry_reason.length}/200 characters
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Image Upload */}
          <Card className="bg-background-pure border border-border-light">
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="imageUpload"
                  checked={showImageUpload}
                  onCheckedChange={(checked) => setShowImageUpload(checked === true)}
                  className="border-border-light"
                />
                <Label htmlFor="imageUpload" className="font-medium text-primary">Upload Screenshots (Max 2)</Label>
              </div>

              {showImageUpload && (
                <div className="space-y-4 pl-6">
                  <div className="border-2 border-dashed border-border-light rounded-lg p-6 text-center bg-background-ultra">
                    <Upload className="w-8 h-8 text-text-cool mx-auto mb-2" />
                    <p className="text-sm text-text-cool mb-2">Drag & drop images or click to browse</p>
                    <input
                      type="file"
                      accept="image/jpeg,image/png"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                      id="imageInput"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('imageInput')?.click()}
                      disabled={uploadedImages.length >= 2}
                      className="border-border-light text-primary hover:bg-background-ultra"
                    >
                      Browse Files
                    </Button>
                    <p className="text-xs text-text-cool mt-2">
                      JPG, PNG (Max 5MB total)
                    </p>
                  </div>

                  {uploadedImages.length > 0 && (
                    <div className="space-y-2">
                      {uploadedImages.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-background-ultra rounded border border-border-light">
                          <span className="text-sm truncate text-primary">{file.name}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeImage(index)}
                            className="text-text-cool hover:text-primary"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                resetForm();
                onOpenChange(false);
              }}
              className="border-border-light text-primary hover:bg-background-ultra"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-primary text-background-soft hover:bg-primary-light" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Trade'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}