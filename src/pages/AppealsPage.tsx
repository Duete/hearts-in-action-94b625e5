import Navigation from "@/components/Navigation";
import Appeals from "@/components/Appeals";
import Footer from "@/components/Footer";

const AppealsPage = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-20">
        <Appeals />
      </main>
      <Footer />
    </div>
  );
};

export default AppealsPage;
