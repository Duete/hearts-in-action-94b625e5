import { GraduationCap, Users, Heart, Trees } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import educationImg from "@/assets/education-program.jpg";
import womenImg from "@/assets/women-empowerment.jpg";
import healthImg from "@/assets/health-outreach.jpg";
import environmentImg from "@/assets/environment-program.jpg";

const Programs = () => {
  const programs = [
    {
      icon: GraduationCap,
      title: "Education Support",
      description: "Providing scholarships, school supplies, and tutoring to ensure every child has access to quality education and the opportunity to build a brighter future.",
      image: educationImg,
      color: "primary",
    },
    {
      icon: Users,
      title: "Women Empowerment",
      description: "Skills training, microfinance support, and leadership development programs that enable women to achieve economic independence and community influence.",
      image: womenImg,
      color: "secondary",
    },
    {
      icon: Heart,
      title: "Health Outreach",
      description: "Medical camps, health education, maternal care support, and disease prevention programs to improve community health and wellbeing.",
      image: healthImg,
      color: "accent",
    },
    {
      icon: Trees,
      title: "Environmental Conservation",
      description: "Tree planting initiatives, sustainable farming practices, and environmental education to protect our natural resources for future generations.",
      image: environmentImg,
      color: "primary",
    },
  ];

  return (
    <section id="programs" className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">Our Programs</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive initiatives designed to create sustainable change in our communities.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {programs.map((program, index) => (
            <Card
              key={index}
              className="overflow-hidden shadow-medium hover:shadow-strong transition-smooth group"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={program.image}
                  alt={program.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`bg-${program.color}/10 p-3 rounded-lg`}>
                    <program.icon className={`h-6 w-6 text-${program.color}`} />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">{program.title}</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">{program.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Programs;
