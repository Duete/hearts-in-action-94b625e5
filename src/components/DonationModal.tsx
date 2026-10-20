import { useState } from "react";
import { ArrowUpRight, Heart, Loader2, LockKeyhole, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number | null;
  gateway: "paypal" | "pesapal";
}

interface CreateOrderResponse {
  ok?: boolean;
  code?: string;
  message?: string;
  orderId?: string;
  approvalUrl?: string;
  captureToken?: string;
  reference?: string;
}

const DonationModal = ({ isOpen, onClose, amount, gateway }: DonationModalProps) => {
  const { toast } = useToast();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [acknowledged, setAcknowledged] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleClose = () => {
    if (isProcessing) return;
    setFirstName("");
    setLastName("");
    setEmail("");
    setAcknowledged(false);
    onClose();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!amount || !Number.isFinite(amount) || amount < 1) {
      toast({
        title: "Choose a valid amount",
        description: "Select or enter a donation of at least $1.00.",
        variant: "destructive",
      });
      return;
    }
    if (!acknowledged) {
      toast({
        title: "Please confirm",
        description: "Acknowledge how your details will be used to process this gift.",
        variant: "destructive",
      });
      return;
    }

    try {
      const storageProbeKey = `ghc-${gateway}-storage-probe:${Date.now()}`;
      window.sessionStorage.setItem(storageProbeKey, "1");
      window.sessionStorage.removeItem(storageProbeKey);
    } catch {
      toast({
        title: "Secure checkout unavailable",
        description: "This browser is blocking the temporary storage needed to verify the payment return. No payment was started. Enable site storage or use bank transfer.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const currency = gateway === "pesapal" ? "UGX" : "USD";
      const response = await fetch(`/api/${gateway}-create-order.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          amount,
          currency,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          privacyAcknowledged: true,
        }),
      });
      const result = (await response.json().catch(() => ({}))) as CreateOrderResponse;
      if (!response.ok || !result.ok || !result.orderId || !result.approvalUrl || !result.captureToken) {
        const message = result.code === "amount_out_of_range"
          ? "That amount is above the current online checkout limit. Choose a smaller amount or contact us about a larger gift."
          : result.message || `${gateway === "pesapal" ? "Pesapal" : "PayPal"} checkout could not be started. Please try again or use bank transfer.`;
        throw new Error(message);
      }

      // The one-time token is not placed in the URL; it is needed to verify capture after PayPal returns.
      try {
      const tokenKey = gateway === "pesapal" ? result.reference : result.orderId;
      if (!tokenKey) throw new Error("The payment reference was missing. No payment was opened.");
      window.sessionStorage.setItem(`ghc-${gateway}-capture:${tokenKey}`, result.captureToken);
      } catch {
        throw new Error(`The secure return token could not be saved, so ${gateway === "pesapal" ? "Pesapal" : "PayPal"} was not opened and no payment was taken. Enable site storage or use bank transfer.`);
      }
      window.location.assign(result.approvalUrl);
    } catch (error) {
      toast({
        title: "Checkout unavailable",
        description: error instanceof Error ? error.message : "Please try again later or use bank transfer.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  const currency = gateway === "pesapal" ? "UGX" : "USD";
  const providerName = gateway === "pesapal" ? "Pesapal" : "PayPal";
  const formattedAmount = new Intl.NumberFormat(currency === "UGX" ? "en-UG" : "en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: currency === "UGX" ? 0 : 2,
  }).format(amount ?? 0);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto p-0 sm:max-w-xl">
        <div className="bg-primary px-6 py-7 text-primary-foreground sm:px-8">
          <DialogHeader>
            <div className="mb-3 flex items-center gap-3">
              <span className="rounded-full bg-white/15 p-2.5">
                <Heart className="h-5 w-5" aria-hidden="true" />
              </span>
              <DialogTitle className="text-2xl font-bold text-primary-foreground">
                Complete your donation
              </DialogTitle>
            </div>
            <p className="text-sm leading-relaxed text-primary-foreground/85">
              Your gift to Global Hearts Community will be processed through {providerName}’s hosted checkout.
            </p>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 px-6 py-6 sm:px-8">
          <div className="flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 p-4">
            <div>
              <p className="text-sm text-muted-foreground">One-time donation</p>
              <p className="text-2xl font-bold text-primary">{formattedAmount}</p>
            </div>
            <ShieldCheck className="h-7 w-7 text-primary" aria-hidden="true" />
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Your receipt details</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="donor-first-name">First name</Label>
                <Input
                  id="donor-first-name"
                  name="given-name"
                  autoComplete="given-name"
                  maxLength={100}
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="donor-last-name">Last name</Label>
                <Input
                  id="donor-last-name"
                  name="family-name"
                  autoComplete="family-name"
                  maxLength={100}
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="donor-email">Email for your receipt</Label>
              <Input
                id="donor-email"
                name="email"
                type="email"
                autoComplete="email"
                maxLength={254}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
              <p className="text-xs leading-relaxed text-muted-foreground">
                We use this address to process your gift and send its payment receipt. It does not subscribe you to newsletter updates.
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-muted/40 p-4">
            <div className="flex items-start gap-3">
              <Checkbox
                id="donor-data-notice"
                checked={acknowledged}
                onCheckedChange={(checked) => setAcknowledged(checked === true)}
                className="mt-0.5"
              />
              <Label htmlFor="donor-data-notice" className="cursor-pointer text-sm leading-relaxed text-foreground">
                I understand that my name and email will be used to process this donation and send a receipt. I will not be added to marketing emails unless I separately subscribe.
              </Label>
            </div>
          </div>

          <Button type="submit" className="h-12 w-full text-base font-semibold" disabled={isProcessing || !acknowledged}>
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                Connecting to {providerName}…
              </>
            ) : (
              <>
                <LockKeyhole className="mr-2 h-4 w-4" aria-hidden="true" />
                Continue to {providerName}
                <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </>
            )}
          </Button>

          <p className="text-center text-xs leading-relaxed text-muted-foreground">
            Payment is completed on {providerName}. This website does not request or store your card details. You will only see a success message after {providerName} confirms the payment.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DonationModal;
