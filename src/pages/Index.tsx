import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Programs from "@/components/Programs";
import GetInvolved from "@/components/GetInvolved";
import Appeals from "@/components/Appeals";
import Gallery from "@/components/Gallery";
import News from "@/components/News";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <Hero />
        <About />
        <Programs />
        <GetInvolved />
        <Appeals />
        <Gallery />
        <News />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
