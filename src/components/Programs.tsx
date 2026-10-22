import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import educationImg from "@/assets/education-classroom.jpg";
import womenImg from "@/assets/women-empowerment-new.png";
import healthImg from "@/assets/health-outreach.jpg";
import environmentImg from "@/assets/tree-planting-mbale.png.asset.json";
import waterImg from "@/assets/water_well.webp";
import elderlyImg from "@/assets/elderly-care.jpg";
import disabilityImg from "@/assets/pwds.webp";
import foodImg from "@/assets/lame_being_fed.webp";

const programs = [
  { title: "Education support", description: "Scholarships, school supplies, and tutoring for children in Mbale and surrounding communities.", image: educationImg },
  { title: "Women’s livelihoods", description: "Skills training, savings groups, start-up support, and leadership workshops for women and widows.", image: womenImg },
  { title: "Health outreach", description: "Community health camps, screening, health education, and referrals to local health facilities.", image: healthImg },
  { title: "Environmental conservation", description: "Tree planting, sustainable farming practices, and environmental education in communities and schools.", image: environmentImg.url },
  { title: "Water and sanitation", description: "Borehole drilling and repair, protection of water sources, and hygiene education.", image: waterImg },
  { title: "Elderly and vulnerable support", description: "Practical care and essential supplies for older people, widows, orphans, and displaced people.", image: elderlyImg },
  { title: "Disability inclusion", description: "Mobility support, skills training, and advocacy for people with disabilities.", image: disabilityImg },
  { title: "Food assistance", description: "Food packages, meals, and nutrition support for families facing food insecurity.", image: foodImg },
];

const Programs = () => (
  <section id="programs" className="scroll-mt-24 bg-background py-16 md:py-20">
    <div className="mx-auto max-w-6xl px-6">
      <header className="mb-10 max-w-2xl md:mb-12">
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.16em] text-primary">Programs · Mbale, Uganda</p>
        <h2 className="mb-4 text-3xl font-semibold text-foreground md:text-4xl">What we work on</h2>
        <p className="text-lg text-muted-foreground">Eight program areas developed with local communities and leaders.</p>
      </header>

      <div className="grid gap-x-8 gap-y-10 md:grid-cols-2">
        {programs.map((program) => (
          <article key={program.title} className="grid gap-4 border-t border-border pt-4 sm:grid-cols-[0.85fr_1.15fr] sm:gap-6">
            <img
              src={program.image}
              alt={`${program.title} activities by Global Hearts Community in Mbale and surrounding communities`}
              className="aspect-[4/3] h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
            <div className="flex flex-col items-start">
              <h3 className="mb-2 text-xl font-semibold text-foreground">{program.title}</h3>
              <p className="flex-1 text-sm leading-relaxed text-muted-foreground">{program.description}</p>
              <Button variant="link" asChild className="mt-3 h-auto px-0">
                <Link to="/get-involved">How to take part <ArrowRight /></Link>
              </Button>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default Programs;
