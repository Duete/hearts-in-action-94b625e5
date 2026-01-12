import Navigation from "@/components/Navigation";
import News from "@/components/News";
import Footer from "@/components/Footer";

const NewsPage = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-20">
        <News />
      </main>
      <Footer />
    </div>
  );
};

export default NewsPage;
