import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Programs", href: "#programs" },
    { name: "Get Involved", href: "#get-involved" },
    { name: "Appeals", href: "#appeals" },
    { name: "Gallery", href: "#gallery" },
    { name: "News", href: "#news" },
    { name: "Contact", href: "#contact" },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-primary text-primary-foreground shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <a href="#home" className={`flex items-center gap-2 transition-smooth hover:scale-105 ${isScrolled ? "text-primary-foreground" : ""}`}>
            <img src={logo} alt="Global Hearts Community Logo" className="h-10 w-10 md:h-12 md:w-12" />
            <span className={`text-lg md:text-xl font-bold leading-tight ${isScrolled ? "text-primary-foreground" : "text-primary"}`}>Global Hearts Community</span>
          </a>

          <div className="hidden md:flex items-center gap-5">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollToSection(link.href)}
                className={`text-[0.9rem] font-medium transition-all duration-300 relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left ${
                  isScrolled 
                    ? "text-primary-foreground hover:text-primary-foreground/80 after:bg-primary-foreground/80" 
                    : "text-foreground hover:text-primary after:bg-primary"
                }`}
              >
                {link.name}
              </button>
            ))}
            <Button variant="hero" size="default" onClick={() => scrollToSection("#donate")}>
              Donate Now
            </Button>
          </div>

          <button
            className="md:hidden text-foreground hover:text-primary transition-smooth"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-background border-t border-border shadow-strong">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollToSection(link.href)}
                className="text-left py-2 text-foreground hover:text-primary transition-smooth font-medium"
              >
                {link.name}
              </button>
            ))}
            <Button variant="hero" size="default" onClick={() => scrollToSection("#donate")} className="w-full">
              Donate Now
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
