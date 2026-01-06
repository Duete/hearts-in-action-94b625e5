import { useState } from "react";
import { CreditCard, Building2, Check, Loader2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number | null;
}

type DonationType = "one-time" | "recurring";
type PaymentMethod = "card" | "bank";

const presetAmounts = [500, 100, 50, 25];

const DonationModal = ({ isOpen, onClose, amount: initialAmount }: DonationModalProps) => {
  const { toast } = useToast();
  const [donationType, setDonationType] = useState<DonationType>("one-time");
  const [selectedAmount, setSelectedAmount] = useState<number | null>(initialAmount);
  const [customAmount, setCustomAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [coverFees, setCoverFees] = useState(false);
  
  // Personal info
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [receiveUpdates, setReceiveUpdates] = useState(true);
  
  // Card details
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (value: string) => {
    const numericValue = value.replace(/[^0-9.]/g, "");
    setCustomAmount(numericValue);
    setSelectedAmount(null);
  };

  const getFinalAmount = () => {
    const baseAmount = selectedAmount || parseFloat(customAmount) || 0;
    if (coverFees && baseAmount > 0) {
      return Math.round(baseAmount * 1.03 * 100) / 100; // 3% fee
    }
    return baseAmount;
  };

  const handleClose = () => {
    setDonationType("one-time");
    setSelectedAmount(initialAmount);
    setCustomAmount("");
    setPaymentMethod("card");
    setFirstName("");
    setLastName("");
    setEmail("");
    setComment("");
    setCardNumber("");
    setExpiryDate("");
    setCvv("");
    setCoverFees(false);
    setReceiveUpdates(true);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalAmount = getFinalAmount();
    if (!finalAmount || finalAmount <= 0) {
      toast({
        title: "Please select an amount",
        description: "Choose a preset amount or enter a custom amount.",
        variant: "destructive",
      });
      return;
    }

    if (!firstName || !lastName || !email) {
      toast({
        title: "Missing Information",
        description: "Please fill in your personal details.",
        variant: "destructive",
      });
      return;
    }

    if (paymentMethod === "card" && (!cardNumber || !expiryDate || !cvv)) {
      toast({
        title: "Missing Card Details",
        description: "Please fill in all card information.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Thank You for Your Donation!",
        description: `Your ${donationType} donation of $${finalAmount.toFixed(2)} has been processed.`,
      });
      handleClose();
    }, 2000);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(" ") : value;
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        {/* Header */}
        <div className="bg-primary px-6 py-8 text-primary-foreground">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/20 rounded-full">
                <Heart className="h-6 w-6" />
              </div>
              <DialogTitle className="text-2xl font-bold">
                Make a Difference Today
              </DialogTitle>
            </div>
            <p className="text-primary-foreground/90 text-sm leading-relaxed">
              Your generous support helps us provide essential services to communities in need. 
              Every donation, no matter the size, creates lasting impact.
            </p>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
          {/* Donation Type Toggle */}
          <div className="flex rounded-lg border border-border overflow-hidden">
            <button
              type="button"
              onClick={() => setDonationType("one-time")}
              className={cn(
                "flex-1 py-3 px-4 text-sm font-semibold transition-colors",
                donationType === "one-time"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              One-time
            </button>
            <button
              type="button"
              onClick={() => setDonationType("recurring")}
              className={cn(
                "flex-1 py-3 px-4 text-sm font-semibold transition-colors",
                donationType === "recurring"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              Monthly
            </button>
          </div>

          {/* Amount Selection */}
          <div className="space-y-3">
            <Label className="text-foreground font-semibold">
              Choose a <span className="text-primary">{donationType}</span> amount
            </Label>
            <div className="grid grid-cols-4 gap-3">
              {presetAmounts.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => handleAmountSelect(amount)}
                  className={cn(
                    "py-3 px-4 rounded-lg border-2 font-bold text-lg transition-all",
                    selectedAmount === amount
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-foreground hover:border-primary/50"
                  )}
                >
                  ${amount}
                </button>
              ))}
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">$</span>
              <Input
                type="text"
                placeholder="Other amount"
                value={customAmount}
                onChange={(e) => handleCustomAmountChange(e.target.value)}
                className="pl-8 h-12 text-lg"
              />
            </div>
          </div>

          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground border-b border-border pb-2">
              Your Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="h-11"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="h-11"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11"
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="updates"
                checked={receiveUpdates}
                onCheckedChange={(checked) => setReceiveUpdates(checked as boolean)}
              />
              <Label htmlFor="updates" className="text-sm text-muted-foreground cursor-pointer">
                Keep me updated on the impact of my donation
              </Label>
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="comment">Leave a Comment (Optional)</Label>
            <Textarea
              id="comment"
              placeholder="Share why you're giving or leave a message of support..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[80px] resize-none"
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground text-right">{comment.length}/500</p>
          </div>

          {/* Cover Fees */}
          <div className="bg-muted/50 p-4 rounded-lg border border-border">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="coverFees"
                checked={coverFees}
                onCheckedChange={(checked) => setCoverFees(checked as boolean)}
                className="mt-0.5"
              />
              <div>
                <Label htmlFor="coverFees" className="text-foreground font-medium cursor-pointer">
                  Cover transaction fees
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Add 3% to help cover processing fees so 100% of your intended gift goes to our programs.
                </p>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground border-b border-border pb-2">
              Payment Method
            </h3>
            <div className="flex rounded-lg border border-border overflow-hidden">
              <button
                type="button"
                onClick={() => setPaymentMethod("card")}
                className={cn(
                  "flex-1 py-3 px-4 text-sm font-medium transition-colors flex items-center justify-center gap-2",
                  paymentMethod === "card"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                <CreditCard className="h-4 w-4" />
                Debit or Credit
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("bank")}
                className={cn(
                  "flex-1 py-3 px-4 text-sm font-medium transition-colors flex items-center justify-center gap-2",
                  paymentMethod === "bank"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                <Building2 className="h-4 w-4" />
                Bank Transfer
              </button>
            </div>

            {paymentMethod === "card" && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    maxLength={19}
                    className="h-11 font-mono"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      type="text"
                      placeholder="MM/YY"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                      maxLength={5}
                      className="h-11 font-mono"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">Security Code</Label>
                    <Input
                      id="cvv"
                      type="password"
                      placeholder="CVV"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      maxLength={4}
                      className="h-11 font-mono"
                      required
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <CreditCard className="h-3 w-3" />
                  Your payment is secured with 256-bit SSL encryption
                </p>
              </div>
            )}

            {paymentMethod === "bank" && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-3">Bank Transfer Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Bank Name</span>
                      <span className="font-medium text-foreground">Stanbic Bank Uganda</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Account Name</span>
                      <span className="font-medium text-foreground">Global Hearts Community</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Account Number</span>
                      <span className="font-mono font-medium text-foreground">9030012345678</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-muted-foreground">Swift Code</span>
                      <span className="font-mono font-medium text-foreground">SBICUGKX</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Please use your email address as the payment reference. After completing the transfer, 
                  email your confirmation to <span className="text-primary">globalheartscommunity@gmail.com</span>
                </p>
              </div>
            )}
          </div>

          {/* Summary & Submit */}
          <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
            <div className="flex justify-between items-center mb-2">
              <span className="text-muted-foreground">Donation Amount</span>
              <span className="font-medium">${(selectedAmount || parseFloat(customAmount) || 0).toFixed(2)}</span>
            </div>
            {coverFees && (
              <div className="flex justify-between items-center mb-2 text-sm">
                <span className="text-muted-foreground">Processing Fee (3%)</span>
                <span className="font-medium">
                  ${((selectedAmount || parseFloat(customAmount) || 0) * 0.03).toFixed(2)}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center pt-2 border-t border-primary/20">
              <span className="font-semibold text-foreground">Total</span>
              <span className="text-xl font-bold text-primary">${getFinalAmount().toFixed(2)}</span>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full h-14 text-lg font-bold"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Heart className="mr-2 h-5 w-5" />
                Complete {donationType === "recurring" ? "Monthly" : ""} Donation
              </>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            By completing this donation, you agree to our terms and privacy policy. 
            You will receive a tax receipt via email.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DonationModal;
