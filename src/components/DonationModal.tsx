import { useState } from "react";
import { Phone, CreditCard, Globe, ArrowLeft, Check, Copy, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number | null;
}

type PaymentMethod = "avo" | "atm" | "western-union" | null;

const DonationModal = ({ isOpen, onClose, amount }: DonationModalProps) => {
  const { toast } = useToast();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(null);
  const [step, setStep] = useState<"select" | "details">("select");
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

  // Form states
  const [phoneNumber, setPhoneNumber] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");

  const paymentMethods = [
    {
      id: "avo" as const,
      name: "Avo Mobile Money",
      icon: Phone,
      description: "Pay instantly using your Avo mobile wallet. Quick and secure.",
      color: "bg-emerald-500",
    },
    {
      id: "atm" as const,
      name: "ATM / Debit Card",
      icon: CreditCard,
      description: "Use your Visa or Mastercard for a secure online payment.",
      color: "bg-blue-500",
    },
    {
      id: "western-union" as const,
      name: "Western Union",
      icon: Globe,
      description: "Send your donation via Western Union money transfer.",
      color: "bg-amber-500",
    },
  ];

  const westernUnionDetails = {
    receiverName: "Global Hearts Community",
    country: "Uganda",
    city: "Mbale",
    referenceCode: "GHC-" + Math.random().toString(36).substring(2, 8).toUpperCase(),
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copied!",
      description: "Details copied to clipboard.",
    });
  };

  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setStep("details");
  };

  const handleBack = () => {
    setStep("select");
    setSelectedMethod(null);
  };

  const handleClose = () => {
    setStep("select");
    setSelectedMethod(null);
    setPhoneNumber("");
    setCardNumber("");
    setExpiryDate("");
    setCvv("");
    setCardName("");
    onClose();
  };

  const handleAvoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number.",
        variant: "destructive",
      });
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Payment Request Sent!",
        description: "Please check your phone to confirm the payment.",
      });
      handleClose();
    }, 2000);
  };

  const handleCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber || !expiryDate || !cvv || !cardName) {
      toast({
        title: "Missing Information",
        description: "Please fill in all card details.",
        variant: "destructive",
      });
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Payment Successful!",
        description: `Thank you for your donation of $${amount}!`,
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
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
            {step === "details" && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBack}
                className="mr-2 h-8 w-8"
                aria-label="Go back to payment methods"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            {step === "select" ? "Choose Payment Method" : paymentMethods.find(m => m.id === selectedMethod)?.name}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {step === "select" 
              ? `Donating $${amount || 0}. Select your preferred payment method.`
              : "Complete your donation securely."
            }
          </DialogDescription>
        </DialogHeader>

        {step === "select" && (
          <div className="space-y-4 py-4">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => handleMethodSelect(method.id)}
                className={cn(
                  "w-full p-4 rounded-xl border-2 border-border bg-card text-left",
                  "transition-all duration-300 hover:border-primary hover:shadow-medium",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                  "group"
                )}
                aria-label={`Pay with ${method.name}`}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "p-3 rounded-lg transition-transform duration-300 group-hover:scale-110",
                    method.color
                  )}>
                    <method.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground text-lg">{method.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{method.description}</p>
                  </div>
                  <ArrowLeft className="h-5 w-5 text-muted-foreground rotate-180 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </button>
            ))}
          </div>
        )}

        {step === "details" && selectedMethod === "avo" && (
          <form onSubmit={handleAvoSubmit} className="space-y-6 py-4">
            <div className="bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-lg border border-emerald-200 dark:border-emerald-800">
              <p className="text-sm text-emerald-700 dark:text-emerald-300">
                Enter your Avo registered phone number. You'll receive a prompt to confirm the payment of <strong>${amount}</strong>.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-foreground font-medium">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+256 7XX XXX XXX"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="h-12 text-lg"
                required
                aria-describedby="phone-help"
              />
              <p id="phone-help" className="text-xs text-muted-foreground">Enter your Avo registered mobile number</p>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-lg font-semibold"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-5 w-5" />
                  Confirm Payment
                </>
              )}
            </Button>
          </form>
        )}

        {step === "details" && selectedMethod === "atm" && (
          <form onSubmit={handleCardSubmit} className="space-y-4 py-4">
            <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-700 dark:text-blue-300 flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Your payment is secured with 256-bit SSL encryption.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardName" className="text-foreground font-medium">Name on Card</Label>
              <Input
                id="cardName"
                type="text"
                placeholder="John Doe"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                className="h-12"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardNumber" className="text-foreground font-medium">Card Number</Label>
              <Input
                id="cardNumber"
                type="text"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                maxLength={19}
                className="h-12 font-mono"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry" className="text-foreground font-medium">Expiry Date</Label>
                <Input
                  id="expiry"
                  type="text"
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                  maxLength={5}
                  className="h-12 font-mono"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv" className="text-foreground font-medium">CVV</Label>
                <Input
                  id="cvv"
                  type="password"
                  placeholder="•••"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  maxLength={4}
                  className="h-12 font-mono"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-lg font-semibold mt-6"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-5 w-5" />
                  Pay ${amount}
                </>
              )}
            </Button>
          </form>
        )}

        {step === "details" && selectedMethod === "western-union" && (
          <div className="space-y-6 py-4">
            <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
              <p className="text-sm text-amber-700 dark:text-amber-300">
                Visit your nearest Western Union agent and use the details below to send your donation of <strong>${amount}</strong>.
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-semibold text-foreground">Transfer Details</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(`Receiver: ${westernUnionDetails.receiverName}\nCountry: ${westernUnionDetails.country}\nCity: ${westernUnionDetails.city}\nReference: ${westernUnionDetails.referenceCode}`)}
                    className="h-8"
                  >
                    {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                    Copy All
                  </Button>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Receiver Name</span>
                    <span className="font-medium text-foreground">{westernUnionDetails.receiverName}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Country</span>
                    <span className="font-medium text-foreground">{westernUnionDetails.country}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">City</span>
                    <span className="font-medium text-foreground">{westernUnionDetails.city}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Reference Code</span>
                    <span className="font-mono font-bold text-primary">{westernUnionDetails.referenceCode}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">Steps to Complete</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Visit your nearest Western Union agent</li>
                  <li>Fill out the "Send Money" form with the details above</li>
                  <li>Pay the transfer amount plus any fees</li>
                  <li>Keep your receipt with the MTCN (tracking number)</li>
                  <li>Email the MTCN to <span className="text-primary">globalheartscommunity@gmail.com</span></li>
                </ol>
              </div>
            </div>

            <Button 
              onClick={handleClose}
              className="w-full h-12 text-lg font-semibold"
            >
              <Check className="mr-2 h-5 w-5" />
              I've Noted the Details
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DonationModal;
