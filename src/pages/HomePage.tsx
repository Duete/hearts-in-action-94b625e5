import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Programs from "@/components/Programs";
import HomeHighlights, { HomeImpactStrip } from "@/components/HomeHighlights";
import Footer from "@/components/Footer";

const HomePage = () => {
  return (
    <div className="home-theme min-h-screen bg-background text-foreground">
      <div className="bg-accent text-accent-foreground/80 text-xs">
        <div className="max-w-6xl mx-auto px-6 py-2 flex flex-wrap justify-between gap-2"><span>Mbale, Uganda · Hope in action</span><a href="mailto:globalheartscommunity@gmail.com" className="hover:text-accent-foreground">globalheartscommunity@gmail.com</a></div>
      </div>
      <Navigation />
      <main>
        <Hero />
        <div className="bg-accent text-accent-foreground/80 text-xs text-center px-6 py-3">Serving Mbale and surrounding communities · Registered Charity Organization MC/195</div>
        <HomeImpactStrip />
        <Programs />
        <HomeHighlights />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
