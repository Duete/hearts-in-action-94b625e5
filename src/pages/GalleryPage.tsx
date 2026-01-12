import Navigation from "@/components/Navigation";
import Gallery from "@/components/Gallery";
import Footer from "@/components/Footer";

const GalleryPage = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-20">
        <Gallery />
      </main>
      <Footer />
    </div>
  );
};

export default GalleryPage;
