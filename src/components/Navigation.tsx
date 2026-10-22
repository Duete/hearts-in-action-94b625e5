import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import logo from "@/assets/logo.png";

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname, location.hash]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Impact", href: "/impact" },
    { name: "Appeals", href: "/appeals" },
    { name: "Gallery", href: "/gallery" },
    { name: "Get Involved", href: "/get-involved" },
    { name: "News", href: "/news" },
    { name: "Find Us", href: "/#find-us" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (href: string) => {
    if (href === "/#find-us") return location.pathname === "/" && location.hash === "#find-us";
    if (href === "/") return location.pathname === "/" && !location.hash;
    return location.pathname === href;
  };

  return (
    <nav
      className={`${isHome ? "sticky" : "fixed"} top-0 left-0 right-0 z-50 border-b border-border transition-colors duration-150 ${
        isHome ? "bg-background text-foreground" : "bg-background text-foreground"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src={logo} 
              alt="Global Hearts Community Logo" 
              className="h-10 w-10 md:h-12 md:w-12"
              loading="eager"
            />
            <span className="text-base font-semibold leading-tight text-primary md:text-lg">
              Global Hearts Community
            </span>
          </Link>

          <div className="hidden xl:flex items-center gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`text-[0.9rem] font-medium transition-all duration-300 relative after:content-[''] after:absolute after:w-full after:h-0.5 after:bottom-0 after:left-0 after:origin-bottom-right after:transition-transform after:duration-300 ${
                  isActive(link.href)
                    ? "after:scale-x-100"
                    : "after:scale-x-0 hover:after:scale-x-100 hover:after:origin-bottom-left"
                } ${
                    "text-foreground hover:text-primary after:bg-secondary"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Button variant="warm" size="default" asChild>
              <Link to="/donate">Donate</Link>
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="xl:hidden shrink-0 text-primary"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="xl:hidden max-h-[80vh] overflow-y-auto border-t border-border bg-background">
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
            <Button variant="warm" size="default" asChild className="w-full">
              <Link to="/donate">Donate</Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
