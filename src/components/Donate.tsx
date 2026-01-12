import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import heroImg from "@/assets/hero-community.jpg";
import DonationModal from "./DonationModal";

const Donate = () => {
  const { toast } = useToast();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  
  const donateRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: donateRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  const getDonationAmount = () => {
    if (customAmount) return parseFloat(customAmount);
    return selectedAmount;
  };

  const handleProceedToDonate = () => {
    const amount = getDonationAmount();
    if (!amount || amount <= 0) {
      toast({
        title: "Please select an amount",
        description: "Choose a preset amount or enter a custom donation.",
        variant: "destructive",
      });
      return;
    }
    setIsDonationModalOpen(true);
  };

  const donationAmounts = [10, 25, 50, 100, 250, 500];

  return (
    <section className="bg-background">
      {/* Donate Header with Parallax */}
      <div
        ref={donateRef}
        className="relative h-[300px] flex items-center justify-center overflow-hidden"
      >
        <motion.div 
          className="absolute inset-0 w-full h-[140%] bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${heroImg})`,
            y: bgY
          }}
        >
          <div className="absolute inset-0 bg-foreground/60"></div>
        </motion.div>
        <motion.div
          className="relative z-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h1 className="text-6xl md:text-8xl font-bold text-secondary mb-4">DONATE</h1>
        </motion.div>
      </div>

      {/* Donation Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <Card className="shadow-strong">
              <CardContent className="p-8 md:p-12">
                <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-4">
                  How much would you like to donate today?
                </h2>
                <p className="text-center text-muted-foreground mb-8">
                  All donations directly impact our organization and help us further our mission.
                </p>

                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-sm font-medium text-foreground">Donation Amount *</label>
                    <span className="text-sm text-muted-foreground">USD $</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {donationAmounts.map((amount) => (
                      <Button
                        key={amount}
                        variant={selectedAmount === amount ? "default" : "outline"}
                        className={`h-14 text-lg font-semibold ${
                          selectedAmount === amount 
                            ? "bg-primary hover:bg-primary/90" 
                            : "hover:border-primary hover:text-primary"
                        }`}
                        onClick={() => {
                          setSelectedAmount(amount);
                          setCustomAmount("");
                        }}
                      >
                        ${amount}.00
                      </Button>
                    ))}
                  </div>
                  <Input
                    type="number"
                    placeholder="Enter custom amount"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setSelectedAmount(null);
                    }}
                    className="text-center h-14 text-lg"
                  />
                </div>

                <div className="bg-muted p-6 rounded-lg mb-6">
                  <h3 className="font-bold text-lg text-foreground mb-3 flex items-center gap-2">
                    <Banknote className="h-5 w-5 text-primary" />
                    Bank Transfer Details
                  </h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p><span className="font-semibold text-foreground">Account Name:</span> Global Hearts Community</p>
                    <p><span className="font-semibold text-foreground">Account Number:</span> 01110017845397</p>
                    <p><span className="font-semibold text-foreground">Bank:</span> DFCU Bank Uganda</p>
                    <p><span className="font-semibold text-foreground">SWIFT:</span> DFCUUGKA</p>
                    <p><span className="font-semibold text-foreground">Address:</span> DFCU Towers, Kampala Road, Kampala, Uganda</p>
                  </div>
                </div>

                <Button 
                  size="lg" 
                  className="w-full bg-primary hover:bg-primary/90 text-lg font-semibold h-14"
                  onClick={handleProceedToDonate}
                >
                  Proceed to Donate
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <DonationModal 
            isOpen={isDonationModalOpen}
            onClose={() => setIsDonationModalOpen(false)}
            amount={getDonationAmount()}
          />
        </div>
      </div>
    </section>
  );
};

export default Donate;
