import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import logo from "@/assets/logo.png";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Programs", href: "/programs" },
    { name: "Impact", href: "/impact" },
    { name: "Gallery", href: "/gallery" },
    { name: "Get Involved", href: "/get-involved" },
    { name: "News", href: "/news" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-primary text-primary-foreground shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className={`flex items-center gap-2 transition-smooth hover:scale-105`}>
            <img 
              src={logo} 
              alt="Global Hearts Community Logo" 
              className="h-10 w-10 md:h-12 md:w-12"
              loading="eager"
            />
            <span className={`text-lg md:text-xl font-bold leading-tight ${isScrolled ? "text-primary-foreground" : "text-white"}`}>
              Global Hearts Community
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`text-[0.9rem] font-medium transition-all duration-300 relative after:content-[''] after:absolute after:w-full after:h-0.5 after:bottom-0 after:left-0 after:origin-bottom-right after:transition-transform after:duration-300 ${
                  isActive(link.href)
                    ? "after:scale-x-100"
                    : "after:scale-x-0 hover:after:scale-x-100 hover:after:origin-bottom-left"
                } ${
                  isScrolled 
                    ? "text-primary-foreground hover:text-primary-foreground/80 after:bg-primary-foreground/80" 
                    : "text-white hover:text-white/80 after:bg-white"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Button variant="hero" size="default" asChild>
              <Link to="/donate">Donate Now</Link>
            </Button>
          </div>

          <button
            className={`lg:hidden transition-smooth ${isScrolled ? "text-primary-foreground" : "text-white"}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden bg-background border-t border-border shadow-strong">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`text-left py-2 transition-smooth font-medium ${
                  isActive(link.href) ? "text-primary" : "text-foreground hover:text-primary"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Button variant="hero" size="default" asChild className="w-full">
              <Link to="/donate">Donate Now</Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
