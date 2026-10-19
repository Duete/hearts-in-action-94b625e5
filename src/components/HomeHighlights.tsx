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
  <div
    className="impact-marquee border-b-4 border-secondary/80 bg-secondary text-black"
    role="region"
    aria-label="Community impact statistics"
    tabIndex={0}
  >
    <div className="impact-marquee-track" aria-hidden="true">
      {[0, 1].map(copy => (
        <div className="impact-marquee-group" key={copy}>
          {stats.map(stat => (
            <span className="impact-marquee-item" key={stat.label}>
              <span><strong>{stat.value.toLocaleString()}+</strong> {stat.label.toLowerCase()}</span>
              <span className="impact-marquee-separator">•</span>
            </span>
          ))}
        </div>
      ))}
    </div>
    <span className="sr-only">
      {stats.map(stat => `${stat.value.toLocaleString()}+ ${stat.label.toLowerCase()}`).join("; ")}
    </span>
  </div>
);

const HomeHighlights = () => (
  <>
    <section className="bg-accent text-accent-foreground">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div><p className="text-secondary text-sm font-semibold mb-2">GIVE HOPE</p><h2 className="text-2xl font-bold">A small act of kindness. A lasting difference.</h2></div>
        <Button variant="warm" size="lg" asChild><Link to="/appeals">Explore Our Appeals<ArrowRight /></Link></Button>
      </div>
    </section>
    <section className="bg-muted py-16 md:py-20" id="trust">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mx-auto mb-10 max-w-3xl text-center md:mb-12">
          <p className="text-sm text-primary font-bold mb-3">ACCOUNTABILITY</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Commitment to You</h2>
          <p className="text-muted-foreground leading-relaxed">We are committed to transparency, safeguarding and responsible stewardship of every shilling and dollar entrusted to us.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {commitments.map(item => (
            <article key={item.title} className="h-full rounded-lg border-l-4 border-secondary bg-card p-6 shadow-soft">
              <h3 className="mb-3 text-lg font-bold text-card-foreground">{item.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
    <section className="py-16 md:py-20">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-8 md:gap-14 items-center">
        <img src={wheelchairPhoto.url} alt="Wasswa Kevin in his new blue wheelchair in Namisindwa" loading="lazy" className="w-full aspect-[4/3] object-cover rounded-lg" />
        <div><p className="text-primary text-sm font-bold mb-3">A STORY OF CHANGE</p><h2 className="text-3xl md:text-4xl font-bold mb-5">More than mobility.<br />A new sense of freedom.</h2><p className="text-muted-foreground leading-relaxed mb-6">For Wasswa Kevin in Namisindwa, a new wheelchair brings greater independence. Over three years, Global Hearts Community has distributed more than 15 wheelchairs and mobility aids, supporting dignity and participation in community life.</p><Button asChild size="lg"><Link to="/news">Read Our Stories<ArrowRight /></Link></Button></div>
      </div>
    </section>
    <section className="bg-muted py-16">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <p className="text-primary text-sm font-bold mb-3">JOIN US</p><h2 className="text-3xl md:text-4xl font-bold mb-4">More than one way to help.</h2><p className="text-muted-foreground">Together, we can create more opportunities for our communities.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-9">
          {[{ icon: Heart, title: "Donate", href: "/donate" }, { icon: GraduationCap, title: "Support Education", href: "/get-involved" }, { icon: Handshake, title: "Partner With Us", href: "/get-involved" }, { icon: Users, title: "Volunteer", href: "/get-involved" }].map(item => <Button key={item.title} asChild variant="outline" className="h-auto flex-col gap-4 py-7 whitespace-normal"><Link to={item.href}><item.icon className="!h-7 !w-7 text-primary" />{item.title}</Link></Button>)}
        </div>
      </div>
    </section>
    <section className="py-16 md:py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8"><div><p className="text-primary text-sm font-bold mb-3">FROM THE FIELD</p><h2 className="text-3xl md:text-4xl font-bold">News & updates</h2></div><Button variant="link" asChild><Link to="/news">All news<ArrowRight /></Link></Button></div>
        <div className="grid md:grid-cols-3 gap-6">
          {[{ image: wheelchairPhoto.url, category: "Mobility milestone", title: "15+ wheelchairs and mobility tools. Three years of restoring independence.", text: "Supporting children and adults in Mbale and surrounding communities." }, { image: ramadanPhoto, category: "Ramadan 2026 report", title: "Over 8,000 hot meals and 200+ food packages delivered.", text: "Food support for vulnerable families across Mbale." }, { image: educationPhoto, category: "Education", title: "Full scholarships help 150+ children stay in school.", text: "School fees and scholastic materials open doors to brighter futures." }].map(item => <article key={item.title} className="border border-border rounded-lg overflow-hidden bg-card"><img src={item.image} alt={item.category} loading="lazy" className="w-full h-48 object-cover" /><div className="p-5"><p className="text-xs text-primary font-bold mb-3">{item.category}</p><h3 className="text-lg font-bold leading-snug mb-3">{item.title}</h3><p className="text-sm text-muted-foreground mb-3">{item.text}</p><Button variant="link" asChild className="px-0"><Link to="/news">Read the story<ArrowRight /></Link></Button></div></article>)}
        </div>
      </div>
    </section>
  </>
);
export default HomeHighlights;
