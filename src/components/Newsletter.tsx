import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const Newsletter = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    // Replace this demonstration response with the newsletter provider's API when configured.
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubscribed(true);
      setEmail("");
      toast({
        title: "Successfully Subscribed!",
        description: "Thank you for joining our newsletter.",
      });
    }, 1000);
  };

  return (
    <section className="newsletter-section py-12 md:py-16" aria-labelledby="newsletter-title">
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
          {isSubscribed ? (
            <div className="flex items-center gap-3 rounded-lg bg-white/10 p-4 text-primary-foreground" role="status">
              <CheckCircle className="h-6 w-6 shrink-0" aria-hidden="true" />
              <div>
                <p className="font-semibold">You’re subscribed!</p>
                <p className="text-sm text-primary-foreground/80">Thank you for joining our community.</p>
              </div>
              <Button
                variant="outline"
                className="ml-auto border-primary-foreground/70 bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                onClick={() => setIsSubscribed(false)}
              >
                Add another
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row" aria-label="Newsletter subscription">
              <div className="relative min-w-0 flex-1">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <Input
                  type="email"
                  name="email"
                  aria-label="Email address"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 border-0 bg-white pl-10 text-foreground"
                  autoComplete="email"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-12 shrink-0 bg-secondary px-6 font-semibold text-secondary-foreground hover:bg-secondary/90"
              >
                {isSubmitting ? (
                  <span>Subscribing...</span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="h-4 w-4" aria-hidden="true" />
                    Subscribe
                  </span>
                )}
              </Button>
            </form>
          )}
        </div>
      </motion.div>
    </section>
  );
};

export default Newsletter;
