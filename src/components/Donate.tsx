import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Banknote,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Heart,
  LockKeyhole,
  Mail,
  MapPin,
  ShieldCheck,
  TriangleAlert,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import heroImg from "@/assets/hero-community.jpg";
import DonationModal from "./DonationModal";

interface CaptureResponse {
  ok?: boolean;
  status?: string;
  reference?: string;
  receiptStatus?: string;
  receiptRetryAllowed?: boolean;
  message?: string;
}

type PaymentNotice = {
  kind: "checking" | "success" | "cancelled" | "error";
  message: string;
  reference?: string;
  receiptRetryAllowed?: boolean;
};

type ReceiptRetry = { orderId: string; captureToken: string };

const donationAmounts = [10, 25, 50, 100, 250, 500];

const getReceiptMessage = (receiptStatus?: string, retryAllowed = false) => {
  if (receiptStatus === "sent") return "Your payment is confirmed and a receipt email has been sent.";
  if (receiptStatus === "failed") {
    return retryAllowed
      ? "Your payment is confirmed, but the receipt email could not be delivered yet. You can retry below or contact us and quote this reference."
      : "Your payment is confirmed, but the receipt email could not be delivered automatically. Please contact us and quote this reference.";
  }
  return "Your payment is confirmed and the receipt email is being processed. You can check or retry delivery below; if it does not arrive, contact us and quote this reference.";
};

const Donate = () => {
  const { toast } = useToast();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(25);
  const [customAmount, setCustomAmount] = useState("");
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [paymentNotice, setPaymentNotice] = useState<PaymentNotice | null>(null);
  const [receiptRetry, setReceiptRetry] = useState<ReceiptRetry | null>(null);
  const [isRetryingReceipt, setIsRetryingReceipt] = useState(false);
  const handledReturn = useRef(false);

  const donationAmount = customAmount.trim() !== "" ? Number(customAmount) : selectedAmount;

  useEffect(() => {
    if (handledReturn.current) return;
    const params = new URLSearchParams(window.location.search);
    const paymentState = params.get("payment");
    const orderId = params.get("token");

    const cleanPaymentQuery = () => {
      params.delete("payment");
      params.delete("token");
      params.delete("PayerID");
      const query = params.toString();
      const cleanUrl = `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`;
      window.history.replaceState({}, "", cleanUrl);
    };

    if (paymentState === "cancelled") {
      handledReturn.current = true;
      setPaymentNotice({
        kind: "cancelled",
        message: "You returned from PayPal without completing checkout. No payment has been confirmed.",
      });
      cleanPaymentQuery();
      return;
    }

    if (!orderId || paymentState !== "return") return;
    handledReturn.current = true;
    setPaymentNotice({ kind: "checking", message: "Checking the payment status with PayPal…" });

    let captureToken: string | null = null;
    try {
      captureToken = window.sessionStorage.getItem(`ghc-paypal-capture:${orderId}`);
    } catch {
      captureToken = null;
    }
    if (!captureToken) {
      setPaymentNotice({
        kind: "error",
        message: "This browser could not verify the checkout session. Do not pay again; contact our team so we can check the payment.",
      });
      return;
    }

    let cancelled = false;
    const verifyPayment = async () => {
      try {
        const response = await fetch("/api/paypal-capture-order.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify({ orderId, captureToken }),
        });
        const result = (await response.json().catch(() => ({}))) as CaptureResponse;
        if (!response.ok || !result.ok || result.status !== "paid") {
          throw new Error(result.message || "We could not verify the payment yet. Do not pay again; contact our team for help.");
        }

        if (cancelled) return;
        const retryAllowed = result.receiptRetryAllowed === true && result.receiptStatus !== "sent";
        if (retryAllowed) {
          setReceiptRetry({ orderId, captureToken });
        } else {
          setReceiptRetry(null);
          try {
            window.sessionStorage.removeItem(`ghc-paypal-capture:${orderId}`);
          } catch {
            // The payment is confirmed by the server; failure to clear local session state is harmless.
          }
        }
        cleanPaymentQuery();
        setPaymentNotice({
          kind: "success",
          message: getReceiptMessage(result.receiptStatus, retryAllowed),
          reference: result.reference,
          receiptRetryAllowed: retryAllowed,
        });
      } catch (error) {
        if (cancelled) return;
        setPaymentNotice({
          kind: "error",
          message: error instanceof Error
            ? error.message
            : "We could not verify the payment yet. Do not pay again; contact our team for help.",
        });
      }
    };

    void verifyPayment();
    return () => {
      cancelled = true;
      handledReturn.current = false;
    };
  }, []);

  const handleRetryReceipt = async () => {
    if (!receiptRetry || isRetryingReceipt) return;
    setIsRetryingReceipt(true);
    try {
      const response = await fetch("/api/paypal-capture-order.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(receiptRetry),
      });
      const result = (await response.json().catch(() => ({}))) as CaptureResponse;
      if (!response.ok || !result.ok || result.status !== "paid") {
        throw new Error(result.message || "Receipt delivery could not be checked right now.");
      }

      const retryAllowed = result.receiptRetryAllowed === true && result.receiptStatus !== "sent";
      setPaymentNotice({
        kind: "success",
        message: getReceiptMessage(result.receiptStatus, retryAllowed),
        reference: result.reference,
        receiptRetryAllowed: retryAllowed,
      });
      if (!retryAllowed) {
        setReceiptRetry(null);
        try {
          window.sessionStorage.removeItem(`ghc-paypal-capture:${receiptRetry.orderId}`);
        } catch {
          // Failure to clear local session state does not affect the confirmed payment.
        }
      }
    } catch (error) {
      toast({
        title: "Receipt delivery not confirmed",
        description: error instanceof Error
          ? `${error.message} Your payment remains confirmed.`
          : "Your payment remains confirmed. Please contact us if the receipt does not arrive.",
        variant: "destructive",
      });
    } finally {
      setIsRetryingReceipt(false);
    }
  };

  const handleProceedToDonate = () => {
    if (donationAmount === null || !Number.isFinite(donationAmount) || donationAmount < 1 || donationAmount > 100000) {
      toast({
        title: "Choose a valid amount",
        description: "Select or enter a donation between $1 and $100,000 USD.",
        variant: "destructive",
      });
      return;
    }
    setIsDonationModalOpen(true);
  };

  return (
    <section className="bg-background">
      <header className="relative isolate flex min-h-[320px] items-center overflow-hidden md:min-h-[390px]">
        <img
          src={heroImg}
          alt="Community members working together in Mbale"
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-foreground/85 via-foreground/65 to-foreground/25" />
        <motion.div
          className="container mx-auto px-4 py-16 md:px-6"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-secondary">
            <Heart className="h-4 w-4" aria-hidden="true" /> Give with purpose
          </p>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight text-white md:text-6xl">
            Help communities build a stronger future.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/85 md:text-lg">
            Your contribution supports Global Hearts Community’s work with families in Mbale and surrounding communities.
          </p>
        </motion.div>
      </header>

      <div className="container mx-auto px-4 py-12 md:px-6 md:py-16">
        {paymentNotice && (
          <div
            className={`mb-8 flex items-start gap-3 rounded-xl border p-4 md:p-5 ${
              paymentNotice.kind === "success"
                ? "border-green-300 bg-green-50 text-green-950 dark:border-green-900 dark:bg-green-950/30 dark:text-green-100"
                : paymentNotice.kind === "checking"
                  ? "border-primary/25 bg-primary/5 text-foreground"
                  : paymentNotice.kind === "cancelled"
                    ? "border-border bg-muted/50 text-foreground"
                    : "border-amber-300 bg-amber-50 text-amber-950 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-100"
            }`}
            role="status"
            aria-live="polite"
          >
            {paymentNotice.kind === "success" ? (
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            ) : paymentNotice.kind === "checking" ? (
              <Clock3 className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            ) : paymentNotice.kind === "cancelled" ? (
              <XCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            ) : (
              <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            )}
            <div className="min-w-0 flex-1">
              <p className="font-semibold">
                {paymentNotice.kind === "success" ? "Thank you for your gift" :
                  paymentNotice.kind === "checking" ? "Verifying payment" :
                    paymentNotice.kind === "cancelled" ? "Checkout not completed" : "Payment needs attention"}
              </p>
              <p className="mt-1 text-sm leading-relaxed">{paymentNotice.message}</p>
              {paymentNotice.reference && <p className="mt-2 font-mono text-xs">Reference: {paymentNotice.reference}</p>}
              {paymentNotice.kind === "success" && paymentNotice.receiptRetryAllowed && receiptRetry && (
                <Button type="button" variant="outline" className="mt-3" onClick={() => void handleRetryReceipt()} disabled={isRetryingReceipt} aria-busy={isRetryingReceipt}>
                  <Mail className="mr-2 h-4 w-4" aria-hidden="true" />
                  {isRetryingReceipt ? "Checking receipt…" : "Retry receipt email"}
                </Button>
              )}
              {paymentNotice.kind === "error" && new URLSearchParams(window.location.search).has("token") && (
                <Button type="button" variant="outline" className="mt-3" onClick={() => window.location.reload()}>
                  Retry payment verification
                </Button>
              )}
            </div>
          </div>
        )}

        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <Card className="border-border/80 shadow-sm">
            <CardHeader className="pb-3">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">Make a one-time gift</p>
              <CardTitle className="text-2xl md:text-3xl">Choose your donation</CardTitle>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Select a suggested amount or enter the gift that feels right for you. The total is shown before you continue.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground">Donation amount</label>
                  <span className="text-sm text-muted-foreground">USD</span>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {donationAmounts.map((amount) => (
                    <Button
                      key={amount}
                      type="button"
                      variant={selectedAmount === amount && customAmount === "" ? "default" : "outline"}
                      className="h-12 text-base font-semibold"
                      aria-pressed={selectedAmount === amount && customAmount === ""}
                      onClick={() => {
                        setSelectedAmount(amount);
                        setCustomAmount("");
                      }}
                    >
                      ${amount}
                    </Button>
                  ))}
                </div>
                <div className="mt-3 space-y-2">
                  <label htmlFor="custom-donation-amount" className="text-sm font-medium text-foreground">Or enter another amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      id="custom-donation-amount"
                      type="number"
                      inputMode="decimal"
                      min="1"
                      max="100000"
                      step="0.01"
                      value={customAmount}
                      onChange={(event) => {
                        setCustomAmount(event.target.value);
                        setSelectedAmount(null);
                      }}
                      className="h-12 pl-8"
                      placeholder="Enter amount"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                <div className="flex items-start gap-3">
                  <LockKeyhole className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                  <div>
                    <p className="font-semibold text-foreground">PayPal hosted checkout</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      You will leave this site to complete payment on PayPal. Your card details are entered on PayPal, not on this website.
                    </p>
                  </div>
                </div>
              </div>

              <Button type="button" size="lg" className="h-12 w-full text-base font-semibold" onClick={handleProceedToDonate}>
                <Heart className="mr-2 h-4 w-4" aria-hidden="true" />
                Continue with {donationAmount && Number.isFinite(donationAmount) ? `$${donationAmount.toFixed(2)}` : "your gift"}
              </Button>
              <p className="text-center text-xs leading-relaxed text-muted-foreground">
                A payment receipt is emailed only after PayPal confirms the donation. No success message is generated for an unverified payment.
              </p>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="h-full border-border/80 shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <span className="rounded-lg bg-secondary/20 p-2.5 text-primary"><Banknote className="h-5 w-5" aria-hidden="true" /></span>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-primary">Prefer a bank transfer?</p>
                    <CardTitle className="text-xl">Manual giving</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <dl className="divide-y divide-border rounded-lg border border-border px-4">
                  <div className="flex justify-between gap-4 py-3 text-sm"><dt className="text-muted-foreground">Account name</dt><dd className="text-right font-medium text-foreground">Global Hearts Community</dd></div>
                  <div className="flex justify-between gap-4 py-3 text-sm"><dt className="text-muted-foreground">Account number</dt><dd className="text-right font-mono font-medium text-foreground">01110017845397</dd></div>
                  <div className="flex justify-between gap-4 py-3 text-sm"><dt className="text-muted-foreground">Bank</dt><dd className="text-right font-medium text-foreground">DFCU Bank Uganda</dd></div>
                  <div className="flex justify-between gap-4 py-3 text-sm"><dt className="text-muted-foreground">SWIFT</dt><dd className="text-right font-mono font-medium text-foreground">DFCUUGKA</dd></div>
                  <div className="flex justify-between gap-4 py-3 text-sm"><dt className="text-muted-foreground">Bank address</dt><dd className="max-w-[60%] text-right font-medium text-foreground">DFCU Towers, Kampala Road, Kampala, Uganda</dd></div>
                </dl>
                <div className="rounded-lg bg-muted/60 p-4 text-sm leading-relaxed text-muted-foreground">
                  Bank transfers are confirmed manually after funds appear in the organization’s account. Email your transfer reference to{" "}
                  <a className="font-medium text-primary underline-offset-4 hover:underline" href="mailto:globalheartscommunity@gmail.com">globalheartscommunity@gmail.com</a>.
                </div>
                <details className="rounded-lg border border-border px-4 py-3">
                  <summary className="cursor-pointer text-sm font-semibold text-foreground">Western Union donations</summary>
                  <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                    <p><span className="font-medium text-foreground">Receiver:</span> Global Hearts Community</p>
                    <p><span className="font-medium text-foreground">Country / city:</span> Uganda / Mbale</p>
                    <p>After sending, share the MTCN with our team so we can verify the transfer before confirming receipt.</p>
                    <a className="inline-flex items-center gap-1 font-medium text-primary underline-offset-4 hover:underline" href="https://wa.me/256791481089" target="_blank" rel="noopener noreferrer">
                      Message us on WhatsApp <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  </div>
                </details>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mx-auto mt-8 grid max-w-6xl gap-4 rounded-xl border border-border bg-muted/30 p-5 sm:grid-cols-3 sm:p-6">
          <div className="flex items-start gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" /><p className="text-sm leading-relaxed text-muted-foreground">Donation details are submitted over your site’s HTTPS connection and kept on the server, not in browser code.</p></div>
          <div className="flex items-start gap-3"><Mail className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" /><p className="text-sm leading-relaxed text-muted-foreground">Donation receipts and newsletter subscriptions are separate; a gift does not automatically opt you into updates.</p></div>
          <div className="flex items-start gap-3"><MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" /><p className="text-sm leading-relaxed text-muted-foreground">Global Hearts Community serves Mbale and surrounding communities in Uganda.</p></div>
        </div>

        <DonationModal
          isOpen={isDonationModalOpen}
          onClose={() => setIsDonationModalOpen(false)}
          amount={donationAmount}
        />
      </div>
    </section>
  );
};

export default Donate;
