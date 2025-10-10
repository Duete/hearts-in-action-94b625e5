import { MapPin, Mail, Phone, Facebook, Twitter, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();

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
      content: "Sironko, Uganda",
    },
    {
      icon: Mail,
      title: "Email",
      content: "info@globalheartsug.org",
    },
    {
      icon: Phone,
      title: "Phone",
      content: "+256 700 000 000",
    },
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
  ];

  return (
    <section id="contact" className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">Get in Touch</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions or want to get involved? We'd love to hear from you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div>
            <Card className="shadow-medium mb-8">
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
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
                    <Textarea id="message" placeholder="Tell us how you'd like to get involved..." rows={6} required />
                  </div>
                  <Button type="submit" variant="hero" size="lg" className="w-full">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="flex gap-4 justify-center">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="bg-primary/10 hover:bg-primary hover:text-primary-foreground p-3 rounded-full transition-smooth"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {contactInfo.map((info, index) => (
              <Card key={index} className="shadow-soft hover:shadow-medium transition-smooth">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <info.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-foreground mb-1">{info.title}</h3>
                      <p className="text-muted-foreground">{info.content}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card className="shadow-soft border-l-4 border-l-secondary">
              <CardContent className="p-6">
                <h3 className="font-bold text-xl text-foreground mb-3">Office Hours</h3>
                <div className="space-y-2 text-muted-foreground">
                  <p>Monday - Friday: 8:00 AM - 5:00 PM</p>
                  <p>Saturday: 9:00 AM - 1:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
