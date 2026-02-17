import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import RamadanAppeal from "@/components/RamadanAppeal";
import Footer from "@/components/Footer";

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <Hero />
        <RamadanAppeal />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
