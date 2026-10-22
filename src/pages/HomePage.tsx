import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Programs from "@/components/Programs";
import HomeHighlights, { HomeImpactStrip } from "@/components/HomeHighlights";
import FindUs from "@/components/FindUs";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import { MapPin } from "lucide-react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const HomePage = () => {
  const { hash } = useLocation();
  useEffect(() => {
    if (hash === "#programs") document.getElementById("programs")?.scrollIntoView();
    if (hash === "#find-us") document.getElementById("find-us")?.scrollIntoView();
  }, [hash]);
  return (
    <div className="home-theme min-h-screen bg-background text-foreground">
      <div className="bg-accent text-accent-foreground/80 text-xs">
        <div className="max-w-6xl mx-auto px-6 py-2 flex flex-wrap justify-between gap-2"><a href="https://maps.app.goo.gl/AALiKMYTYQHwptsS9" target="_blank" rel="noopener noreferrer" aria-label="View Global Hearts Community location on Google Maps" className="inline-flex items-center gap-1.5 hover:text-accent-foreground hover:underline underline-offset-4"><MapPin className="h-3.5 w-3.5" aria-hidden="true" />Based in Mbale, Uganda</a><a href="mailto:globalheartscommunity@gmail.com" className="hover:text-accent-foreground">globalheartscommunity@gmail.com</a></div>
      </div>
      <Navigation />
      <main>
        <Hero />
        <div className="bg-accent text-accent-foreground/80 text-xs text-center px-6 py-3">Serving Mbale and surrounding communities · Registered Charity Organization MC/195</div>
        <HomeImpactStrip />
        <Programs />
        <HomeHighlights />
        <FindUs />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
