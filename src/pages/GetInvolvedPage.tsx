import Navigation from "@/components/Navigation";
import GetInvolved from "@/components/GetInvolved";
import Footer from "@/components/Footer";

const GetInvolvedPage = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-20">
        <GetInvolved />
      </main>
      <Footer />
    </div>
  );
};

export default GetInvolvedPage;
