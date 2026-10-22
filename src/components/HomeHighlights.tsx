import { ArrowRight, GraduationCap, Handshake, Heart, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import impact from "@/data/impact.json";
import wheelchairPhoto from "@/assets/gallery/joyful-wheelchair-donation-namisindwa.png.asset.json";
import ramadanPhoto from "@/assets/gallery/ramadan-iftar-meals.png";
import educationPhoto from "@/assets/education-program.jpg";

const stats = [
  { value: impact.meals, label: "Hot meals provided" },
  { value: impact.foodPackages, label: "Food packages distributed" },
  { value: impact.mobilityAids, label: "Wheelchairs & mobility aids" },
  { value: impact.students, label: "Students supported" },
];

const commitments = [
  {
    title: "Registered & Accountable",
    description: "Registered Ugandan NGO — MC/195. Annual reports and financial summaries available on request.",
  },
  {
    title: "Donor Feedback",
    description: "Every donation is acknowledged. We share distribution photos, beneficiary numbers and a financial report with our supporters.",
  },
  {
    title: "Safeguarding First",
    description: "We operate a child protection and safeguarding policy across all our programs and field activities.",
  },
  {
    title: "Community-Led",
    description: "Our programs are designed with local leaders, women’s groups and disability advocates — not imposed on them.",
  },
];

export const HomeImpactStrip = () => (
  <section className="border-y border-secondary/70 bg-secondary text-secondary-foreground" aria-label="Community impact statistics">
    <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-x-8 gap-y-3 px-6 py-4 sm:justify-between">
      {stats.map(stat => (
        <p className="flex items-baseline gap-2" key={stat.label}>
          <strong className="font-serif text-2xl font-semibold tabular-nums">{stat.value.toLocaleString()}+</strong>
          <span className="text-xs font-semibold uppercase tracking-wide sm:text-sm">{stat.label}</span>
        </p>
      ))}
    </div>
  </section>
);

const HomeHighlights = () => (
  <>
    <section className="bg-accent text-accent-foreground">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div><p className="text-secondary text-sm font-semibold mb-2">CURRENT PROGRAMS</p><h2 className="text-2xl font-semibold">Choose a program to support.</h2></div>
        <Button variant="warm" size="lg" asChild><Link to="/appeals">View appeals<ArrowRight /></Link></Button>
      </div>
    </section>
    <section className="bg-muted py-16 md:py-20" id="trust">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mx-auto mb-10 max-w-3xl text-center md:mb-12">
          <p className="text-sm text-primary font-bold mb-3">ACCOUNTABILITY</p>
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">How we work</h2>
          <p className="text-muted-foreground leading-relaxed">We are committed to transparency, safeguarding and responsible stewardship of every shilling and dollar entrusted to us.</p>
        </div>
        <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
          {commitments.map(item => (
            <article key={item.title} className="h-full border-t border-border pt-4">
              <h3 className="mb-2 text-lg font-semibold text-card-foreground">{item.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
    <section className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-8 md:gap-14 items-center">
        <img src={wheelchairPhoto.url} alt="Wasswa Kevin in his new blue wheelchair in Namisindwa" loading="lazy" className="w-full aspect-[4/3] object-cover" />
        <div><p className="text-primary text-sm font-bold mb-3">MOBILITY SUPPORT · NAMISINDWA</p><h2 className="text-3xl md:text-4xl font-semibold mb-5">Wasswa Kevin’s new wheelchair helps him take part in daily life.</h2><p className="text-muted-foreground leading-relaxed mb-6">Over three years, Global Hearts Community has distributed more than 15 wheelchairs and mobility aids to children and adults in Mbale and surrounding communities.</p><Button asChild size="lg"><Link to="/news">Read the report<ArrowRight /></Link></Button></div>
      </div>
    </section>
    <section className="bg-muted py-16">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <p className="text-primary text-sm font-bold mb-3">TAKE PART</p><h2 className="text-3xl md:text-4xl font-semibold mb-4">Ways to support work in Mbale.</h2><p className="text-muted-foreground">Choose a program, offer time or skills, or ask about a local partnership.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-9">
          {[{ icon: Heart, title: "Donate", href: "/donate" }, { icon: GraduationCap, title: "Support education", href: "/get-involved" }, { icon: Handshake, title: "Partner", href: "/get-involved" }, { icon: Users, title: "Volunteer", href: "/get-involved" }].map(item => <Button key={item.title} asChild variant="link" className="h-auto justify-start gap-3 border-b border-border px-0 py-4 text-left text-foreground whitespace-normal"><Link to={item.href}><item.icon className="!h-5 !w-5 text-primary" />{item.title}<ArrowRight className="!h-4 !w-4" /></Link></Button>)}
        </div>
      </div>
    </section>
    <section className="py-16 md:py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8"><div><p className="text-primary text-sm font-bold mb-3">FROM THE FIELD</p><h2 className="text-3xl md:text-4xl font-bold">News & updates</h2></div><Button variant="link" asChild><Link to="/news">All news<ArrowRight /></Link></Button></div>
        <div className="grid md:grid-cols-3 gap-6">
          {[{ image: wheelchairPhoto.url, category: "Mobility · Namisindwa", title: "15+ mobility aids distributed since 2023.", text: "Support for children and adults across Mbale and surrounding districts." }, { image: ramadanPhoto, category: "Ramadan · 2026", title: "8,000+ meals and 200+ food packages delivered.", text: "Food support for families across Mbale." }, { image: educationPhoto, category: "Education", title: "150+ pupils receive full scholarships.", text: "School fees and learning materials help pupils stay in school." }].map(item => <article key={item.title} className="border-t border-border bg-card"><img src={item.image} alt={item.category} loading="lazy" className="w-full h-48 object-cover" /><div className="pt-5"><p className="text-xs text-primary font-bold mb-3">{item.category}</p><h3 className="text-xl font-semibold leading-snug mb-3">{item.title}</h3><p className="text-sm text-muted-foreground mb-3">{item.text}</p><Button variant="link" asChild className="px-0"><Link to="/news">Read the report<ArrowRight /></Link></Button></div></article>)}
        </div>
      </div>
    </section>
  </>
);
export default HomeHighlights;
