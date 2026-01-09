import { useState, useRef } from "react";
import { CreditCard, Building2, Loader2, Heart, Shield, Lock, CheckCircle, Download, AlertTriangle, FileText } from "lucide-react";
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
type PaymentMethod = "paypal" | "stripe" | "bank";
type Step = "form" | "confirmation";

const presetAmounts = [500, 100, 50, 25];
const SUSPICIOUS_AMOUNT_THRESHOLD = 1000;

interface DonationData {
  donationType: DonationType;
  amount: number;
  firstName: string;
  lastName: string;
  email: string;
  comment: string;
  paymentMethod: PaymentMethod;
  transactionId: string;
  date: Date;
}

const DonationModal = ({ isOpen, onClose, amount: initialAmount }: DonationModalProps) => {
  const { toast } = useToast();
  const [step, setStep] = useState<Step>("form");
  const [donationType, setDonationType] = useState<DonationType>("one-time");
  const [selectedAmount, setSelectedAmount] = useState<number | null>(initialAmount);
  const [customAmount, setCustomAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("paypal");
  const [isProcessing, setIsProcessing] = useState(false);
  const [coverFees, setCoverFees] = useState(false);
  const [donationData, setDonationData] = useState<DonationData | null>(null);
  
  // Personal info
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [receiveUpdates, setReceiveUpdates] = useState(true);
  const [acceptPrivacyPolicy, setAcceptPrivacyPolicy] = useState(false);

  // Track rapid donations for suspicious activity
  const lastDonationTime = useRef<number>(0);

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

  const generateTransactionId = () => {
    return `GHC-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
  };

  const checkSuspiciousActivity = (amount: number): boolean => {
    const now = Date.now();
    const timeSinceLastDonation = now - lastDonationTime.current;
    const isRapidSuccession = lastDonationTime.current > 0 && timeSinceLastDonation < 60000; // Less than 1 minute
    const isLargeAmount = amount >= SUSPICIOUS_AMOUNT_THRESHOLD;

    if (isLargeAmount || isRapidSuccession) {
      console.warn("[ADMIN ALERT] Suspicious donation detected:", {
        amount,
        isLargeAmount,
        isRapidSuccession,
        timeSinceLastDonation: timeSinceLastDonation / 1000 + "s",
        timestamp: new Date().toISOString(),
        donor: { firstName, lastName, email }
      });
      return true;
    }
    return false;
  };

  const handleClose = () => {
    setStep("form");
    setDonationType("one-time");
    setSelectedAmount(initialAmount);
    setCustomAmount("");
    setPaymentMethod("paypal");
    setFirstName("");
    setLastName("");
    setEmail("");
    setComment("");
    setCoverFees(false);
    setReceiveUpdates(true);
    setAcceptPrivacyPolicy(false);
    setDonationData(null);
    onClose();
  };

  const handlePaymentRedirect = () => {
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

    if (!acceptPrivacyPolicy) {
      toast({
        title: "Privacy Policy Required",
        description: "Please accept our privacy policy to continue.",
        variant: "destructive",
      });
      return;
    }

    // Check for suspicious activity
    const isSuspicious = checkSuspiciousActivity(finalAmount);
    if (isSuspicious) {
      toast({
        title: "Verification Required",
        description: "For your security, large donations may require additional verification.",
      });
    }

    setIsProcessing(true);

    // Simulate redirect to payment processor
    setTimeout(() => {
      lastDonationTime.current = Date.now();
      
      const transactionId = generateTransactionId();
      setDonationData({
        donationType,
        amount: finalAmount,
        firstName,
        lastName,
        email,
        comment,
        paymentMethod,
        transactionId,
        date: new Date()
      });

      setIsProcessing(false);
      setStep("confirmation");

      toast({
        title: "Thank You for Your Donation!",
        description: "A confirmation email will be sent to your email address.",
      });
    }, 1500);
  };

  const downloadReceipt = () => {
    if (!donationData) return;

    const receiptContent = `
DONATION RECEIPT
================

Global Hearts Community
Tax ID: XX-XXXXXXX

Transaction ID: ${donationData.transactionId}
Date: ${donationData.date.toLocaleDateString('en-US', { 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
})}

DONOR INFORMATION
-----------------
Name: ${donationData.firstName} ${donationData.lastName}
Email: ${donationData.email}

DONATION DETAILS
----------------
Type: ${donationData.donationType === 'recurring' ? 'Monthly Recurring' : 'One-Time'}
Amount: $${donationData.amount.toFixed(2)} USD
Payment Method: ${donationData.paymentMethod.charAt(0).toUpperCase() + donationData.paymentMethod.slice(1)}

${donationData.comment ? `Message: ${donationData.comment}` : ''}

DATA RETENTION NOTICE
---------------------
Your donor information will be retained for 3 years in accordance
with our data retention policy. You may request deletion of your
data at any time by contacting globalheartscommunity@gmail.com.

This receipt serves as confirmation of your charitable contribution.
Please retain for your tax records.

Thank you for your generous support!
    `.trim();

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `donation-receipt-${donationData.transactionId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Receipt Downloaded",
      description: "Your donation receipt has been saved.",
    });
  };

  // Security badges component
  const SecurityBadges = () => (
    <div className="flex flex-wrap items-center justify-center gap-4 py-3 px-4 bg-muted/30 rounded-lg border border-border">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Lock className="h-3.5 w-3.5 text-green-600" />
        <span>256-bit SSL</span>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Shield className="h-3.5 w-3.5 text-green-600" />
        <span>PCI Compliant</span>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <CheckCircle className="h-3.5 w-3.5 text-green-600" />
        <span>Secure Payment</span>
      </div>
    </div>
  );

  // Confirmation/Receipt Step
  if (step === "confirmation" && donationData) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-lg p-0">
          <div className="bg-green-600 px-6 py-8 text-white text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
              <CheckCircle className="h-10 w-10" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-white text-center">
                Thank You!
              </DialogTitle>
            </DialogHeader>
            <p className="text-white/90 mt-2">
              Your donation has been processed successfully.
            </p>
          </div>

          <div className="px-6 py-6 space-y-6">
            {/* Transaction Details */}
            <div className="bg-muted/50 p-4 rounded-lg space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Transaction ID</span>
                <span className="font-mono text-sm">{donationData.transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-bold text-primary">${donationData.amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type</span>
                <span>{donationData.donationType === 'recurring' ? 'Monthly' : 'One-time'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date</span>
                <span>{donationData.date.toLocaleDateString()}</span>
              </div>
            </div>

            {/* Email Confirmation Notice */}
            <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
              <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Confirmation Email Sent</p>
                <p className="text-sm text-muted-foreground">
                  A receipt has been sent to <span className="font-medium">{donationData.email}</span>
                </p>
              </div>
            </div>

            {/* Download Receipt */}
            <Button onClick={downloadReceipt} variant="outline" className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Download Receipt
            </Button>

            {/* Data Retention Notice */}
            <div className="text-xs text-muted-foreground text-center space-y-1">
              <p className="flex items-center justify-center gap-1">
                <Shield className="h-3 w-3" />
                Your data is encrypted and securely stored
              </p>
              <p>
                Data retained for 3 years per our{" "}
                <button className="text-primary underline hover:no-underline">
                  retention policy
                </button>
              </p>
            </div>

            <Button onClick={handleClose} className="w-full">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

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

        <form onSubmit={(e) => { e.preventDefault(); handlePaymentRedirect(); }} className="px-6 py-6 space-y-6">
          {/* Security Badges */}
          <SecurityBadges />

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
            
            {/* Large Amount Warning */}
            {getFinalAmount() >= SUSPICIOUS_AMOUNT_THRESHOLD && (
              <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
                <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  Donations of ${SUSPICIOUS_AMOUNT_THRESHOLD}+ may require additional verification for your security.
                </p>
              </div>
            )}
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
              <p className="text-xs text-muted-foreground">
                We'll send your donation receipt and confirmation to this email.
              </p>
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
            <h3 className="font-semibold text-foreground border-b border-border pb-2 flex items-center gap-2">
              <Lock className="h-4 w-4 text-green-600" />
              Secure Payment Method
            </h3>
            <div className="grid grid-cols-3 rounded-lg border border-border overflow-hidden">
              <button
                type="button"
                onClick={() => setPaymentMethod("paypal")}
                className={cn(
                  "py-3 px-4 text-sm font-medium transition-colors flex items-center justify-center gap-2",
                  paymentMethod === "paypal"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.768.768 0 0 1 .757-.646h6.609c2.193 0 3.815.621 4.824 1.845.431.524.73 1.092.899 1.716.172.635.218 1.384.139 2.29l-.016.15v.426l.31.176c.268.139.492.298.679.479.37.357.607.807.706 1.342.103.555.068 1.203-.104 1.93-.197.835-.52 1.565-.959 2.161-.42.568-.946 1.029-1.563 1.368-.593.327-1.278.566-2.036.712-.735.142-1.562.213-2.458.213H12.07a1.096 1.096 0 0 0-1.083.92l-.022.155-.457 2.903-.019.101a.313.313 0 0 1-.309.27H7.076z"/>
                </svg>
                PayPal
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("stripe")}
                className={cn(
                  "py-3 px-4 text-sm font-medium transition-colors flex items-center justify-center gap-2",
                  paymentMethod === "stripe"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                <CreditCard className="h-4 w-4" />
                Card (Stripe)
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("bank")}
                className={cn(
                  "py-3 px-4 text-sm font-medium transition-colors flex items-center justify-center gap-2",
                  paymentMethod === "bank"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                <Building2 className="h-4 w-4" />
                Bank Transfer
              </button>
            </div>

            {paymentMethod === "paypal" && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="bg-muted p-4 rounded-lg text-center">
                  <svg className="h-10 w-10 mx-auto mb-3 text-primary" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.768.768 0 0 1 .757-.646h6.609c2.193 0 3.815.621 4.824 1.845.431.524.73 1.092.899 1.716.172.635.218 1.384.139 2.29l-.016.15v.426l.31.176c.268.139.492.298.679.479.37.357.607.807.706 1.342.103.555.068 1.203-.104 1.93-.197.835-.52 1.565-.959 2.161-.42.568-.946 1.029-1.563 1.368-.593.327-1.278.566-2.036.712-.735.142-1.562.213-2.458.213H12.07a1.096 1.096 0 0 0-1.083.92l-.022.155-.457 2.903-.019.101a.313.313 0 0 1-.309.27H7.076z"/>
                  </svg>
                  <h4 className="font-semibold text-foreground mb-2">Pay with PayPal</h4>
                  <p className="text-sm text-muted-foreground">
                    You will be securely redirected to PayPal. Your card details are never stored on our servers.
                  </p>
                  <div className="flex items-center justify-center gap-2 mt-3 text-xs text-muted-foreground">
                    <Shield className="h-3 w-3 text-green-600" />
                    <span>PayPal Buyer Protection</span>
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === "stripe" && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="bg-muted p-4 rounded-lg text-center">
                  <CreditCard className="h-10 w-10 mx-auto mb-3 text-primary" />
                  <h4 className="font-semibold text-foreground mb-2">Pay with Card via Stripe</h4>
                  <p className="text-sm text-muted-foreground">
                    You will be securely redirected to Stripe's checkout. We never see or store your card details.
                  </p>
                  <div className="flex items-center justify-center gap-4 mt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Shield className="h-3 w-3 text-green-600" />
                      PCI-DSS Compliant
                    </span>
                    <span className="flex items-center gap-1">
                      <Lock className="h-3 w-3 text-green-600" />
                      Tokenized Payments
                    </span>
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === "bank" && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-3">Bank Transfer Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Bank Name</span>
                      <span className="font-medium text-foreground">DFCU Bank Uganda</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Account Name</span>
                      <span className="font-medium text-foreground">Global Hearts Community</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Account Number</span>
                      <span className="font-mono font-medium text-foreground">01110017845397</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Swift Code</span>
                      <span className="font-mono font-medium text-foreground">DFCUUGKA</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-muted-foreground">Address</span>
                      <span className="font-medium text-foreground text-right">DFCU Towers, Kampala Road, Kampala, Uganda</span>
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

          {/* Privacy Policy Acceptance */}
          <div className="bg-muted/30 p-4 rounded-lg border border-border space-y-3">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="privacyPolicy"
                checked={acceptPrivacyPolicy}
                onCheckedChange={(checked) => setAcceptPrivacyPolicy(checked as boolean)}
                className="mt-0.5"
              />
              <div>
                <Label htmlFor="privacyPolicy" className="text-sm text-foreground cursor-pointer">
                  I accept the{" "}
                  <button type="button" className="text-primary underline hover:no-underline">
                    Privacy Policy
                  </button>{" "}
                  and{" "}
                  <button type="button" className="text-primary underline hover:no-underline">
                    Data Retention Policy
                  </button>
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Your donor information will be securely encrypted and retained for 3 years. 
                  You may request access or deletion of your data at any time.
                </p>
              </div>
            </div>
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
            disabled={isProcessing || !acceptPrivacyPolicy}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Redirecting to {paymentMethod === "stripe" ? "Stripe" : paymentMethod === "paypal" ? "PayPal" : "Complete Donation"}...
              </>
            ) : (
              <>
                <Lock className="mr-2 h-5 w-5" />
                {paymentMethod === "bank" ? "Complete Donation" : `Continue to ${paymentMethod === "stripe" ? "Stripe" : "PayPal"}`}
              </>
            )}
          </Button>

          <div className="text-xs text-center text-muted-foreground space-y-2">
            <p className="flex items-center justify-center gap-1">
              <Shield className="h-3 w-3 text-green-600" />
              Your payment is protected with industry-standard encryption
            </p>
            <p>
              We never store your credit card details. All payments are processed by PCI-compliant providers.
            </p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DonationModal;
