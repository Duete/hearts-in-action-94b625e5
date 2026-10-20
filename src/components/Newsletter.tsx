import { useState } from "react";
import type { FormEvent } from "react";
import { motion } from "framer-motion";
import { Mail, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface SubscribeResponse {
  ok?: boolean;
  message?: string;
}

const Newsletter = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast({ title: "Invalid email", description: "Please enter a valid email address.", variant: "destructive" });
      return;
    }
    if (!consent) {
      toast({ title: "Please confirm", description: "Choose whether you want to receive our email updates.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/newsletter-subscribe.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ email: email.trim(), consent, website: honeypot }),
      });
      const result = (await response.json().catch(() => ({}))) as SubscribeResponse;
      if (!response.ok || !result.ok) {
        throw new Error(result.message || "Newsletter signup is temporarily unavailable. Please try again later.");
      }

      setConfirmationMessage(result.message || "Your request was received. If this address needs confirmation, check your inbox; campaign emails are sent only to confirmed subscribers.");
      setEmail("");
      setConsent(false);
      toast({ title: "Request received", description: "Campaign emails are sent only to confirmed subscribers." });
    } catch (error) {
      toast({
        title: "Subscription unavailable",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="newsletter-section py-8 md:py-10" aria-labelledby="newsletter-title">
      <motion.div
        className="container mx-auto flex flex-col items-start justify-between gap-8 px-4 md:flex-row md:items-center md:px-6"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-xl">
          <h2 id="newsletter-title" className="mb-2 text-2xl font-bold text-primary-foreground md:text-3xl">
            Get Updates From the Field
          </h2>
          <p className="leading-relaxed text-primary-foreground/80">
            Impact stories, distribution reports and appeals — straight to your inbox.
          </p>
        </div>

        <div className="w-full md:max-w-lg">
          {confirmationMessage ? (
            <div className="flex items-start gap-3 rounded-lg bg-white/10 p-4 text-primary-foreground" role="status" aria-live="polite">
              <CheckCircle className="mt-0.5 h-6 w-6 shrink-0" aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className="font-semibold">Request received</p>
                <p className="text-sm text-primary-foreground/85">{confirmationMessage}</p>
              </div>
              <Button
                type="button"
                variant="outline"
                className="shrink-0 border-primary-foreground/70 bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                onClick={() => setConfirmationMessage("")}
              >
                Add another
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3" aria-label="Newsletter subscription">
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative min-w-0 flex-1">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                  <Input
                    type="email"
                    name="email"
                    aria-label="Email address"
                    placeholder="Email address"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="h-12 border-0 bg-white pl-10 text-foreground"
                    autoComplete="email"
                    maxLength={254}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting || !consent}
                  className="h-12 shrink-0 bg-secondary px-6 font-semibold text-secondary-foreground hover:bg-secondary/90"
                >
                  {isSubmitting ? (
                    <span>Submitting…</span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="h-4 w-4" aria-hidden="true" />
                      Subscribe
                    </span>
                  )}
                </Button>
              </div>

              <div className="flex items-start gap-2 text-sm text-primary-foreground/85">
                <input
                  id="newsletter-consent"
                  type="checkbox"
                  checked={consent}
                  onChange={(event) => setConsent(event.target.checked)}
                  className="mt-1 h-4 w-4 shrink-0 accent-secondary"
                  required
                />
                <label htmlFor="newsletter-consent" className="cursor-pointer leading-relaxed">
                  Yes, email me community updates and appeals. I can unsubscribe at any time.
                </label>
              </div>

              <div className="pointer-events-none absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
                <label htmlFor="newsletter-website">Leave this field empty</label>
                <input
                  id="newsletter-website"
                  type="text"
                  name="website"
                  value={honeypot}
                  onChange={(event) => setHoneypot(event.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>
              <p className="text-xs text-primary-foreground/70">
                We’ll email a confirmation link first. You’ll receive campaign emails only after you confirm.
              </p>
            </form>
          )}
        </div>
      </motion.div>
    </section>
  );
};

export default Newsletter;
