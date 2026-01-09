import { useState } from "react";
import { Mail, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const Newsletter = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
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

    // Simulate subscription (replace with actual API call when backend is ready)
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

  if (isSubscribed) {
    return (
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-primary-foreground" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-2">
              You're Subscribed!
            </h2>
            <p className="text-primary-foreground/80">
              Thank you for joining our community. You'll receive updates about our mission and impact.
            </p>
            <Button
              variant="outline"
              className="mt-4 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              onClick={() => setIsSubscribed(false)}
            >
              Subscribe Another Email
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-primary">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-14 h-14 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
            <Mail className="h-7 w-7 text-primary-foreground" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-3">
            Stay Updated on Our Mission
          </h2>
          <p className="text-primary-foreground/80 mb-6 leading-relaxed">
            Join our newsletter to receive updates on our programs, success stories, and ways you can help make a difference in communities across Uganda.
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <div className="flex-1 relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-12 bg-white text-foreground border-0"
                required
              />
            </div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-12 px-6 bg-accent text-accent-foreground hover:bg-accent/90 font-semibold"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Subscribing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Subscribe
                </span>
              )}
            </Button>
          </form>
          
          <p className="text-xs text-primary-foreground/60 mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
