import { useEffect, useState } from "react";
import { ArrowDown, ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import communityImg from "@/assets/hero-community.jpg";
import waterImg from "@/assets/water_well.webp";
import wheelchairPhoto from "@/assets/gallery/joyful-wheelchair-donation-namisindwa.png.asset.json";
import womenImg from "@/assets/women-empowerment-new.png";

const slides = [
  { image: communityImg, alt: "Global Hearts Community supporting families in Uganda", label: "Hope in action · Mbale, Uganda", title: "Global Hearts Community", text: "Working alongside vulnerable communities to build a future with food, clean water, education and dignity.", cta: "Make a Difference", href: "/donate" },
  { image: waterImg, alt: "Community clean water source", label: "Clean water", title: "Safe water. Healthier communities.", text: "Help repair boreholes and protect water sources so families can access clean water close to home.", cta: "Support Clean Water", href: "/appeals" },
  { image: wheelchairPhoto.url, alt: "Wasswa Kevin with his new wheelchair in Namisindwa", label: "Mobility & independence", title: "Opening doors to independence.", text: "More than 15 wheelchairs and mobility aids have helped children and adults reconnect with community life.", cta: "Give Mobility", href: "/appeals" },
  { image: womenImg, alt: "Women taking part in community empowerment activities", label: "Women empowerment", title: "Opportunity for women. Hope for families.", text: "Skills training, leadership and livelihood support help women build lasting economic independence.", cta: "Partner With Us", href: "/get-involved" },
];

const Hero = () => {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useReducedMotion();
  const move = (step: number) => setActive(current => (current + step + slides.length) % slides.length);
  useEffect(() => {
    if (paused || reducedMotion) return;
    const timer = window.setInterval(() => setActive(current => (current + 1) % slides.length), 7000);
    return () => window.clearInterval(timer);
  }, [paused, reducedMotion]);

  return (
    <section aria-label="Featured highlights" className="relative h-[520px] md:h-[min(70vh,600px)] md:min-h-[420px] overflow-hidden bg-accent text-accent-foreground" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)}>
      {slides.map((slide, index) => (
        <div key={slide.title} aria-hidden={index !== active} className={`absolute inset-0 transition-opacity duration-700 motion-reduce:transition-none ${index === active ? "opacity-100 z-10" : "opacity-0 pointer-events-none"}`}>
          <img src={slide.image} alt={slide.alt} className="absolute inset-0 h-full w-full object-cover object-center" loading={index === 0 ? "eager" : "lazy"} draggable={false} />
          <div className="absolute inset-0 home-hero-overlay" />
          <div className="relative max-w-6xl mx-auto px-6 md:px-12 h-full flex flex-col justify-center pb-12">
            <p className="text-secondary font-semibold text-sm mb-5">{slide.label}</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight max-w-2xl mb-6">{slide.title}</h1>
            <p className="text-base md:text-lg leading-relaxed text-accent-foreground/90 max-w-xl mb-8">{slide.text}</p>
            <div className="flex flex-wrap gap-3">
              <Button variant="warm" size="lg" asChild><Link tabIndex={index === active ? 0 : -1} to={slide.href}>{slide.cta}<ArrowRight /></Link></Button>
              <Button variant="outline" size="lg" className="bg-transparent border-accent-foreground/60 text-accent-foreground hover:bg-accent-foreground hover:text-primary" asChild><a tabIndex={index === active ? 0 : -1} href="#programs">Our Programs<ArrowDown /></a></Button>
            </div>
          </div>
        </div>
      ))}
      <div className="absolute bottom-6 inset-x-0 z-20 flex justify-center items-center gap-3">
        <Button variant="ghost" size="icon" className="hover:bg-accent-foreground/10" aria-label="Previous slide" onClick={() => move(-1)}><ChevronLeft /></Button>
        {slides.map((slide, index) => <Button key={slide.title} variant="ghost" size="icon" aria-label={`Show slide ${index + 1}`} aria-pressed={active === index} onClick={() => setActive(index)} className="w-6 h-8 hover:bg-transparent"><span className={`h-2.5 w-2.5 rounded-full ${active === index ? "bg-secondary" : "bg-accent-foreground/50"}`} /></Button>)}
        <Button variant="ghost" size="icon" className="hover:bg-accent-foreground/10" aria-label="Next slide" onClick={() => move(1)}><ChevronRight /></Button>
        <Button variant="ghost" size="icon" className="hover:bg-accent-foreground/10" aria-label={paused ? "Play slideshow" : "Pause slideshow"} onClick={() => setPaused(current => !current)}>{paused ? <Play /> : <Pause />}</Button>
      </div>
    </section>
  );
};
export default Hero;