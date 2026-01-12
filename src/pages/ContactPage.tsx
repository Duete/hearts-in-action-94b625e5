import Navigation from "@/components/Navigation";
import ContactUs from "@/components/ContactUs";
import Footer from "@/components/Footer";

const ContactPage = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-20">
        <ContactUs />
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
