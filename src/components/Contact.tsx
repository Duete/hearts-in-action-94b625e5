import { motion } from "framer-motion";
import { MapPin, Mail, Phone, Facebook, Twitter, Instagram, Banknote, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import heroImg from "@/assets/hero-community.jpg";
import DonationModal from "./DonationModal";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

const Contact = () => {
  const { toast } = useToast();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent!",
      description: "Thank you for reaching out. We'll get back to you soon.",
    });
  };

  const donationAmounts = [10, 25, 50, 100, 250, 500];

  const contactInfo = [
    {
      icon: MapPin,
      title: "Location",
      content: "Mbale City, Uganda",
    },
    {
      icon: Mail,
      title: "Email",
      content: "globalheartscommunity@gmail.com, info@globalheartscommunity.org",
    },
    {
      icon: Phone,
      title: "Phone",
      content: "+256784 434 649, +256791 481 089",
    },
    {
      icon: Banknote,
      title: "Bank Account",
      content: "Global Hearts Community - 01110017845397 - DFCU Bank Uganda | SWIFT: DFCUUGKA | DFCU Towers, Kampala Road, Kampala, Uganda",
    },
  ];

  const socialLinks = [
    { icon: Facebook, href: "https://www.facebook.com/share/17tiYWGKkU/", label: "Facebook" },
    { icon: Twitter, href: "https://x.com/GHCommunity_Ug", label: "X" },
    { icon: Instagram, href: "https://www.instagram.com/global_hearts_community_ugand/", label: "Instagram" },
    { icon: MessageCircle, href: "https://wa.me/256791481089", label: "WhatsApp" },
  ];

  return (
    <section className="bg-background">
      {/* Donate Header */}
      <motion.div
        id="donate"
        className="relative h-[300px] flex items-center justify-center overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImg})` }}
        >
          <div className="absolute inset-0 bg-foreground/60"></div>
        </div>
        <motion.div
          className="relative z-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h1 className="text-6xl md:text-8xl font-bold text-secondary mb-4">DONATE</h1>
        </motion.div>
      </motion.div>

      {/* Donation Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <Card className="shadow-strong mb-12">
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

          {/* Contact Form */}
          <motion.div
            id="contact"
            className="grid md:grid-cols-2 gap-8 mb-12 scroll-mt-24"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div variants={itemVariants}>
              <Card className="shadow-medium h-full">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-foreground mb-6">Send us a Message</h3>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                        Full Name
                      </label>
                      <Input id="name" placeholder="John Doe" required />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                        Email Address
                      </label>
                      <Input id="email" type="email" placeholder="john@example.com" required />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                        Message
                      </label>
                      <Textarea id="message" placeholder="Tell us how you'd like to get involved..." rows={4} required />
                    </div>
                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div className="space-y-6" variants={containerVariants}>
              {contactInfo.map((info, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <Card className="shadow-soft">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-primary/10 p-3 rounded-lg">
                          <info.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-bold text-foreground mb-1">{info.title}</h4>
                          <p className="text-sm text-muted-foreground">{info.content}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Office Hours & Social */}
          <motion.div
            className="grid md:grid-cols-2 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div variants={itemVariants}>
              <Card className="shadow-soft border-l-4 border-l-secondary h-full">
                <CardContent className="p-6">
                  <h3 className="font-bold text-xl text-foreground mb-4">Office Hours</h3>
                  <div className="space-y-2 text-muted-foreground">
                    <p>Monday - Friday: 8:00 AM - 5:00 PM</p>
                    <p>Saturday: 9:00 AM - 1:00 PM</p>
                    <p>Sunday: Closed</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="shadow-soft h-full">
                <CardContent className="p-6">
                  <h3 className="font-bold text-xl text-foreground mb-4">Follow Us</h3>
                  <div className="flex gap-4">
                    {socialLinks.map((social, index) => (
                      <a
                        key={index}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.label}
                        className="bg-primary/10 hover:bg-primary hover:text-primary-foreground p-3 rounded-full transition-smooth"
                      >
                        <social.icon className="h-5 w-5" />
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
