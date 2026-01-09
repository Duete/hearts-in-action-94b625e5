import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroVideo from "@/assets/hero-video.mp4";

const Hero = () => {
  const scrollToSection = (id: string) => {
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={heroVideo} type="video/mp4" />
      </video>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 md:py-32 text-center">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
            A better world can't wait
          </h1>
          
          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
            We work alongside communities to create lasting, positive change through sustainable development, humanitarian assistance, and innovative partnerships.
          </p>
          
          <Button 
            variant="warm" 
            size="xl" 
            onClick={() => scrollToSection("#get-involved")}
            className="group text-lg px-8 py-6"
          >
            Get Involved
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
};

export default Hero;
