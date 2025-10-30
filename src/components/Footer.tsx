import logo from "@/assets/logo.png";

const Footer = () => {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const footerLinks = {
    quickLinks: [
      { name: "Home", href: "#home" },
      { name: "About Us", href: "#about" },
      { name: "Programs", href: "#programs" },
      { name: "Get Involved", href: "#get-involved" },
    ],
    resources: [
      { name: "Gallery", href: "#gallery" },
      { name: "News", href: "#news" },
      { name: "Contact", href: "#contact" },
    ],
  };

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src={logo} alt="Global Hearts Community Logo" className="h-12 w-12" />
              <span className="text-2xl font-bold">Global Hearts Community</span>
            </div>
            <p className="text-primary-foreground/80 leading-relaxed mb-4">
              Registered Organization (MC/195) headquartered in Mbale City. Empowering vulnerable groups through education, health programs, and community development initiatives.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {footerLinks.quickLinks.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-primary-foreground/80 hover:text-primary-foreground transition-smooth"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-primary-foreground/80 hover:text-primary-foreground transition-smooth"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-8 text-center text-primary-foreground/80">
          <p>&copy; {new Date().getFullYear()} Global Hearts Community. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
