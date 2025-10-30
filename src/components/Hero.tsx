import { ArrowRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-community.jpg";

const Hero = () => {
  const scrollToSection = (id: string) => {
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 gradient-hero"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-20 md:py-32 text-center">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <div className="flex justify-center mb-6">
            <Heart className="h-16 w-16 md:h-20 md:w-20 text-secondary fill-secondary animate-pulse" />
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 leading-tight">
            Empowering Communities,<br />Transforming Lives
          </h1>
          
          <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Join us in creating lasting change through education, health programs, and community development in Mbale and surrounding areas, Uganda.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              variant="warm" 
              size="xl" 
              onClick={() => scrollToSection("#get-involved")}
              className="group"
            >
              Get Involved
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline" 
              size="xl" 
              onClick={() => scrollToSection("#programs")}
              className="bg-primary-foreground/10 backdrop-blur-sm border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
};

export default Hero;
