import { Banknote, Mail, MapPin, Phone } from "lucide-react";
import { SocialHandleIcons, socialHandlesWithWhatsApp } from "@/components/SocialHandles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import distributionBackground from "@/assets/contact-impact-background.webp";

const ContactUs = () => {
  const { toast } = useToast();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    toast({
      title: "This form is not connected yet",
      description: "No message was sent. Please email globalheartscommunity@gmail.com or call the Mbale team.",
      variant: "destructive",
    });
  };

  return (
    <section className="bg-background">
      <header className="relative flex min-h-[250px] items-end overflow-hidden bg-primary md:min-h-[300px]">
        <img src={distributionBackground} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover object-center" loading="eager" decoding="async" />
        <div className="absolute inset-0 bg-foreground/60" />
        <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-8 md:pb-12">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-secondary">Global Hearts Community · Mbale</p>
          <h1 className="text-5xl font-semibold text-white md:text-7xl">Talk to the team.</h1>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <div className="mb-8 max-w-2xl">
          <h2 className="mb-2 text-2xl font-semibold">Contact Global Hearts Community</h2>
          <p className="text-muted-foreground">For program, volunteer, partnership, or donation questions, use the contact details below. Please call ahead before visiting the Mbale office.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <aside className="space-y-6" aria-label="Contact details">
            <div className="border-t border-border pt-4">
              <div className="mb-2 flex items-center gap-2 text-primary"><MapPin className="h-4 w-4" aria-hidden="true" /><h3 className="font-semibold">Office</h3></div>
              <p className="mb-2 text-sm text-muted-foreground">Mbale City, Uganda</p>
              <a href="https://maps.app.goo.gl/AALiKMYTYQHwptsS9" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary underline underline-offset-4">Open the map pin</a>
            </div>
            <div className="border-t border-border pt-4">
              <div className="mb-2 flex items-center gap-2 text-primary"><Mail className="h-4 w-4" aria-hidden="true" /><h3 className="font-semibold">Email</h3></div>
              <p className="space-y-1 text-sm"><a className="block text-primary underline underline-offset-4" href="mailto:globalheartscommunity@gmail.com">globalheartscommunity@gmail.com</a><a className="block text-primary underline underline-offset-4" href="mailto:info@globalheartscommunity.org">info@globalheartscommunity.org</a></p>
            </div>
            <div className="border-t border-border pt-4">
              <div className="mb-2 flex items-center gap-2 text-primary"><Phone className="h-4 w-4" aria-hidden="true" /><h3 className="font-semibold">Phone and WhatsApp</h3></div>
              <p className="space-y-1 text-sm"><a className="block text-primary underline underline-offset-4" href="tel:+256784434649">+256 784 434 649</a><a className="block text-primary underline underline-offset-4" href="tel:+256791481089">+256 791 481 089</a></p>
            </div>
            <div className="border-t border-border pt-4">
              <div className="mb-2 flex items-center gap-2 text-primary"><Banknote className="h-4 w-4" aria-hidden="true" /><h3 className="font-semibold">Bank transfers</h3></div>
              <p className="text-sm leading-relaxed text-muted-foreground">Global Hearts Community · DFCU Bank Uganda<br />Account: 01110017845397 · SWIFT: DFCUUGKA<br />DFCU Towers, Kampala Road, Kampala, Uganda</p>
            </div>
          </aside>

          <div className="border border-border bg-card p-5 md:p-7">
            <h2 className="mb-2 text-2xl font-semibold">Send a message</h2>
            <p className="mb-6 text-sm text-muted-foreground">This form is not connected to email yet. For a response, contact us directly using the email or phone details.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-medium text-foreground">Full name</label>
                <Input id="name" name="name" autoComplete="name" placeholder="Your name" required />
              </div>
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-foreground">Email address</label>
                <Input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
              </div>
              <div>
                <label htmlFor="message" className="mb-2 block text-sm font-medium text-foreground">Message</label>
                <Textarea id="message" name="message" placeholder="Tell us what you would like to discuss." rows={5} required />
              </div>
              <Button type="submit" className="w-full">Send message</Button>
            </form>
          </div>
        </div>

        <div className="mt-12 grid gap-8 border-t border-border pt-6 md:grid-cols-2">
          <section>
            <h2 className="mb-3 text-xl font-semibold">Office hours</h2>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>Monday–Friday: 8:00 AM–5:00 PM</p>
              <p>Saturday: 9:00 AM–1:00 PM</p>
              <p>Sunday: Closed</p>
            </div>
          </section>
          <section>
            <h2 className="mb-3 text-xl font-semibold">Connect with Global Hearts</h2>
            <SocialHandleIcons handles={socialHandlesWithWhatsApp} />
          </section>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
