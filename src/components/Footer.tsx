import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";
import { MapPin } from "lucide-react";

const Footer = () => {
  const footerLinks = {
    explore: [
      { name: "Home", href: "/" },
      { name: "About", href: "/about" },
      { name: "Programs", href: "/#programs" },
      { name: "Impact", href: "/impact" },
      { name: "Appeals", href: "/appeals" },
      { name: "Gallery", href: "/gallery" },
    ],
    takeAction: [
      { name: "Get Involved", href: "/get-involved" },
      { name: "Donate", href: "/donate" },
      { name: "Contact", href: "/contact" },
      { name: "News", href: "/news" },
      { name: "Find Us", href: "/#find-us" },
    ],
  };

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img 
                src={logo} 
                alt="Global Hearts Community Logo" 
                className="h-12 w-12"
                loading="lazy"
              />
              <span className="text-2xl font-bold">Global Hearts Community</span>
            </Link>
            <p className="mb-3 leading-relaxed text-primary-foreground/85">Education, health, food, water, and community programs based in Mbale, Uganda.</p>
            <p className="text-sm leading-relaxed text-primary-foreground/70">Registered Charity Organization MC/195 · Company limited by guarantee No. 80034932237372 · <a href="https://maps.app.goo.gl/AALiKMYTYQHwptsS9" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 underline underline-offset-4 hover:text-primary-foreground"><MapPin className="h-3.5 w-3.5" aria-hidden="true" />Mbale City</a></p>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-lg">Explore</h3>
            <ul className="space-y-2">
              {footerLinks.explore.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-primary-foreground/80 hover:text-primary-foreground transition-smooth"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-lg">Take action</h3>
            <ul className="space-y-2">
              {footerLinks.takeAction.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-primary-foreground/80 hover:text-primary-foreground transition-smooth"
                  >
                    {link.name}
                  </Link>
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
