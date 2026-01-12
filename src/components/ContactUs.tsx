import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { MapPin, Mail, Phone, Facebook, Twitter, Instagram, Banknote, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import heroImg from "@/assets/hero-community.jpg";

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

const ContactUs = () => {
  const { toast } = useToast();
  
  const headerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: headerRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent!",
      description: "Thank you for reaching out. We'll get back to you soon.",
    });
  };

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
      {/* Contact Header with Parallax */}
      <div
        ref={headerRef}
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
          <h1 className="text-6xl md:text-8xl font-bold text-secondary mb-4">CONTACT US</h1>
        </motion.div>
      </div>

      {/* Contact Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Contact Form */}
          <motion.div
            className="grid md:grid-cols-2 gap-8 mb-12"
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

export default ContactUs;
