import { HandHeart, DollarSign, Handshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const GetInvolved = () => {
  const ways = [
    {
      icon: HandHeart,
      title: "Volunteer",
      description: "Share your time and skills to make a direct impact in our community programs.",
      action: "Join as Volunteer",
      color: "primary",
    },
    {
      icon: DollarSign,
      title: "Donate",
      description: "Your financial support helps us expand our reach and serve more families.",
      action: "Make a Donation",
      color: "secondary",
    },
    {
      icon: Handshake,
      title: "Partner",
      description: "Collaborate with us as an organization to create larger-scale community impact.",
      action: "Become a Partner",
      color: "accent",
    },
  ];

  const scrollToContact = () => {
    const element = document.querySelector("#contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="get-involved" className="py-20 md:py-32 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">Get Involved</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            There are many ways you can join us in making a difference. Choose what works best for you.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {ways.map((way, index) => (
            <Card
              key={index}
              className="shadow-medium hover:shadow-strong transition-smooth text-center group"
            >
              <CardContent className="p-8">
                <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-bounce">
                  <way.icon className={`h-10 w-10 text-${way.color}`} />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">{way.title}</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">{way.description}</p>
                <Button
                  variant={way.color === "primary" ? "hero" : way.color === "secondary" ? "warm" : "default"}
                  size="lg"
                  onClick={scrollToContact}
                  className="w-full"
                >
                  {way.action}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-gradient-primary text-primary-foreground rounded-2xl p-8 md:p-12 text-center shadow-strong">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">Ready to Make an Impact?</h3>
          <p className="text-lg mb-6 max-w-2xl mx-auto opacity-90">
            Every contribution, big or small, helps us create lasting change in our community. Join us today.
          </p>
          <Button variant="warm" size="xl" onClick={scrollToContact} className="shadow-medium">
            Contact Us Now
          </Button>
        </div>
      </div>
    </section>
  );
};

export default GetInvolved;
