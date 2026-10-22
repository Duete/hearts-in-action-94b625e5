import { useState } from "react";
import { ArrowDown, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import waterImg from "@/assets/water_well.webp";
import wheelchairPhoto from "@/assets/gallery/joyful-wheelchair-donation-namisindwa.png.asset.json";
import womenImg from "@/assets/women-empowerment-new.png";
import ramadanFoodImage from "@/assets/gallery/food-distribution.jpg";
import communityFeedingImage from "@/assets/gallery/community-feeding.jpg";

const slides = [
  { image: ramadanFoodImage, alt: "Global Hearts Community distributing food packages to families in Mbale", label: "Ramadan appeal · 2026", title: "Help us serve 10,000 hot meals this Ramadan.", text: "Last season, volunteers served more than 8,000 hot meals and distributed 200 food packages across Mbale.", cta: "Donate now", href: "/donate", secondary: "See our programs", secondaryHref: "#programs" },
  { image: communityFeedingImage, alt: "Families sharing a meal at a community feeding activity", label: "Our work · Mbale, Uganda", title: "Local programs for families in Mbale.", text: "Global Hearts Community works with local leaders on food assistance, education, health outreach, water access and mobility support.", cta: "Support a program", href: "/donate", secondary: "See our programs", secondaryHref: "#programs" },
  { image: waterImg, alt: "Community clean water source", label: "Water access", title: "Repair broken boreholes in Mbale.", text: "Support repairs and new water points so families can collect clean water closer to home.", cta: "Support water access", href: "/appeals", secondary: "See our programs", secondaryHref: "#programs" },
  { image: wheelchairPhoto.url, alt: "Wasswa Kevin with his new wheelchair in Namisindwa", label: "Mobility support", title: "More than 15 mobility aids distributed since 2023.", text: "Wheelchair support has helped children and adults in Mbale, Namisindwa and Manafwa travel to school, work and community activities.", cta: "Support mobility", href: "/appeals", secondary: "See our programs", secondaryHref: "#programs" },
  { image: womenImg, alt: "Women taking part in a community skills activity", label: "Women’s livelihoods · Bukonde", title: "More than 50 women trained in soap making.", text: "Women and widows in Bukonde learned to make shampoo and liquid soap and received practical guidance on pricing and group savings.", cta: "Support the program", href: "/get-involved", secondary: "See our programs", secondaryHref: "#programs" },
];

const Hero = () => {
  const [active, setActive] = useState(0);
  const move = (step: number) => setActive(current => (current + step + slides.length) % slides.length);

  return (
    <section aria-label="Featured stories" aria-roledescription="carousel" className="relative h-[520px] md:h-[min(70vh,600px)] md:min-h-[420px] overflow-hidden bg-accent text-accent-foreground">
      {slides.map((slide, index) => (
        <div key={slide.title} aria-hidden={index !== active} className={`absolute inset-0 transition-opacity duration-700 motion-reduce:transition-none ${index === active ? "opacity-100 z-10" : "opacity-0 pointer-events-none"}`}>
          <img src={slide.image} alt={slide.alt} className="absolute inset-0 h-full w-full object-cover object-center" loading={index === 0 ? "eager" : "lazy"} draggable={false} />
          <div className="absolute inset-0 home-hero-overlay" />
          <div className="relative max-w-6xl mx-auto px-6 md:px-12 h-full flex flex-col justify-center pb-12">
            <p className="text-secondary font-semibold text-sm mb-4">{slide.label}</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight max-w-3xl mb-5">{slide.title}</h1>
            <p className="text-base md:text-lg leading-relaxed text-accent-foreground/90 max-w-xl mb-8">{slide.text}</p>
            <div className="flex flex-wrap gap-3">
              <Button variant="warm" size="lg" asChild><Link tabIndex={index === active ? 0 : -1} to={slide.href}>{slide.cta}<ArrowRight /></Link></Button>
              <Button variant="outline" size="lg" className="bg-transparent border-accent-foreground/60 text-accent-foreground hover:bg-accent-foreground hover:text-primary" asChild><a tabIndex={index === active ? 0 : -1} href={slide.secondaryHref}>{slide.secondary}<ArrowDown /></a></Button>
            </div>
          </div>
        </div>
      ))}
      <div className="absolute bottom-6 inset-x-0 z-20 flex justify-center items-center gap-3">
        <Button variant="ghost" size="icon" className="hover:bg-accent-foreground/10" aria-label="Previous story" onClick={() => move(-1)}><ChevronLeft /></Button>
        {slides.map((slide, index) => <Button key={slide.title} variant="ghost" size="icon" aria-label={`Show slide ${index + 1}`} aria-pressed={active === index} onClick={() => setActive(index)} className="w-6 h-8 hover:bg-transparent"><span className={`h-2.5 w-2.5 rounded-full ${active === index ? "bg-secondary" : "bg-accent-foreground/50"}`} /></Button>)}
        <Button variant="ghost" size="icon" className="hover:bg-accent-foreground/10" aria-label="Next story" onClick={() => move(1)}><ChevronRight /></Button>
      </div>
    </section>
  );
};
export default Hero;
