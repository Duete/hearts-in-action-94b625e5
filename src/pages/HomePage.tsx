import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Programs from "@/components/Programs";
import HomeHighlights, { HomeImpactStrip } from "@/components/HomeHighlights";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const HomePage = () => {
  const { hash } = useLocation();
  useEffect(() => {
    if (hash === "#programs") document.getElementById("programs")?.scrollIntoView();
  }, [hash]);
  return (
    <div className="home-theme min-h-screen bg-background text-foreground">
      <div className="bg-accent text-accent-foreground/80 text-xs">
        <div className="max-w-6xl mx-auto px-6 py-2 flex flex-wrap justify-between gap-2"><a href="https://share.google/YcMQcIemKi1Z4L5Ms" target="_blank" rel="noopener noreferrer" aria-label="View Global Hearts Community location on Google Maps" className="hover:text-accent-foreground hover:underline underline-offset-4">Mbale, Uganda · Hope in action</a><a href="mailto:globalheartscommunity@gmail.com" className="hover:text-accent-foreground">globalheartscommunity@gmail.com</a></div>
      </div>
      <Navigation />
      <main>
        <Hero />
        <div className="bg-accent text-accent-foreground/80 text-xs text-center px-6 py-3">Serving Mbale and surrounding communities · Registered Charity Organization MC/195</div>
        <HomeImpactStrip />
        <Programs />
        <HomeHighlights />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
