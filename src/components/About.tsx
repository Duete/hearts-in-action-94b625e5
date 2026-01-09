import { Heart, Target, Eye, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  const values = [
    {
      icon: Heart,
      title: "Compassion",
      description: "We lead with empathy and care for every individual we serve.",
    },
    {
      icon: Sparkles,
      title: "Empowerment",
      description: "We believe in enabling communities to create their own sustainable solutions.",
    },
    {
      icon: Target,
      title: "Integrity",
      description: "We maintain transparency and accountability in all our actions.",
    },
  ];

  return (
    <section id="about" className="py-20 md:py-32 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">About Us</h2>
          <p className="text-xl md:text-2xl text-[hsl(220,60%,25%)] max-w-4xl mx-auto leading-relaxed font-medium">
            Building stronger communities through sustainable programs and compassionate action as we believe no one should go hungry, face crisis alone, or be denied the chance to build a better life.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Target className="h-8 w-8 text-primary" />
                <h3 className="text-2xl font-bold text-foreground">Our Mission</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                To empower vulnerable groups in Mbale and surrounding areas, through comprehensive education support, 
                health outreach, women empowerment initiatives, and environmental conservation programs. 
                We strive to create lasting positive change that transforms lives and strengthens communities.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <Eye className="h-8 w-8 text-accent" />
                <h3 className="text-2xl font-bold text-foreground">Our Vision</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                A thriving community where every individual has access to quality education, healthcare, 
                economic opportunities, and lives in a sustainable environment. We envision a future where 
                communities are self-sufficient and empowered to shape their own destinies.
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-foreground mb-6">Core Values</h3>
            <div className="space-y-4">
              {values.map((value, index) => (
                <Card key={index} className="shadow-soft hover:shadow-medium transition-smooth border-l-4 border-l-primary">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <value.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg text-foreground mb-2">{value.title}</h4>
                        <p className="text-muted-foreground">{value.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
