import { ArrowRight, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { SocialHandleList } from "@/components/SocialHandles";
import { Link } from "react-router-dom";
import impact from "@/data/impact.json";

const impactHighlights = [
  { value: impact.meals, label: "Hot meals served", context: "Ramadan 2026" },
  { value: impact.foodPackages, label: "Food packages", context: "Ramadan 2026" },
  { value: impact.students, label: "Students supported", context: "Education program" },
  { value: impact.mobilityAids, label: "Mobility aids", context: "Over three years" },
];

const About = () => {
  const values = [
    {
      title: "Respect and care",
      description: "We listen to local people and treat each person with care when planning and delivering support.",
    },
    {
      title: "Community leadership",
      description: "Local leaders, women’s groups, and disability advocates help shape program priorities.",
    },
    {
      title: "Accountability",
      description: "Global Hearts Community is registered as NGO MC/195. Annual reports and financial summaries are available on request.",
    },
  ];

  const headerVariants = {
    hidden: { opacity: 0, y: 0 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
      },
    },
  };

  const leftColumnVariants = {
    hidden: { opacity: 0, x: 0 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
        staggerChildren: 0.2,
      },
    },
  };

  const rightColumnVariants = {
    hidden: { opacity: 0, x: 0 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 0 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const,
      },
    },
  };

  const valueCardVariants = {
    hidden: { opacity: 0, x: 0 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <section id="about" className="bg-muted py-14 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-14 grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <motion.div
            className="space-y-5"
            variants={headerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">Who We Are · Mbale, Uganda</p>
            <h1 className="text-4xl font-semibold leading-tight text-foreground md:text-6xl">
              Community programs rooted in Mbale.
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Global Hearts Community is a registered Ugandan charity based in Mbale. We work with local communities on education, health outreach, food assistance, women’s livelihoods, disability support, and environmental programs.
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <Button asChild>
                <Link to="/programs">
                  Explore our programs <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/get-involved">Get involved</Link>
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-2 text-sm font-medium text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" aria-hidden="true" /> Mbale, Uganda
              </span>
              <span>Registered Charity Organization · MC/195</span>
            </div>
          </motion.div>

          <motion.div
            variants={rightColumnVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
              <figure className="overflow-hidden border border-border">
              <img
                src="/images/about-water-well-1440.webp"
                srcSet="/images/about-water-well-720.webp 720w, /images/about-water-well-1440.webp 1440w"
                sizes="(min-width: 1024px) 50vw, 100vw"
                width={1440}
                height={810}
                loading="eager"
                decoding="async"
                alt="Children and community members celebrate a Global Hearts Community water well in Mbale, Uganda."
                className="aspect-video w-full object-cover"
              />
              <figcaption className="bg-card px-4 py-3 text-sm text-muted-foreground">
                A community water-well celebration supported by Global Hearts Community.
              </figcaption>
            </figure>
          </motion.div>
        </div>

        <motion.div
          className="mb-16"
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="mb-6 text-center">
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.16em] text-primary">Selected program milestones</p>
            <h2 className="text-2xl font-semibold text-foreground md:text-3xl">Reported results</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
            {impactHighlights.map((item) => (
              <Card key={item.label} className="border-0 border-t border-border bg-transparent shadow-none">
                <CardContent className="p-4 px-0 text-left sm:p-5 sm:px-0">
                  <p className="font-serif text-3xl font-semibold text-primary md:text-4xl">{item.value.toLocaleString()}+</p>
                  <p className="mt-1 font-semibold text-foreground">{item.label}</p>
                  <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">{item.context}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <motion.div 
            className="space-y-6"
            variants={leftColumnVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.div variants={itemVariants}>
              <div className="mb-4 border-b border-border pb-3">
                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">01 · Purpose</p>
                <h2 className="text-2xl font-bold text-foreground">Our Mission</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                We support vulnerable people in Mbale and surrounding areas through education, health outreach, women’s livelihood programs, and environmental work. Programs are planned with local communities and leaders.
              </p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <div className="mb-4 border-b border-border pb-3">
                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-accent">02 · Direction</p>
                <h2 className="text-2xl font-bold text-foreground">Our Vision</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Communities where people can access education, healthcare, income opportunities, and a sustainable environment, and can shape decisions that affect their lives.
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            variants={rightColumnVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-foreground mb-6">Core Values</h2>
            <motion.div 
              className="space-y-4"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.15,
                  },
                },
              }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              {values.map((value, index) => (
                <motion.div key={value.title} variants={valueCardVariants}>
                  <Card className="border-0 border-t border-border bg-transparent shadow-none">
                    <CardContent className="flex gap-4 px-0 py-5">
                      <span className="font-serif text-sm text-secondary">0{index + 1}</span>
                      <div>
                        <h3 className="font-semibold text-lg text-foreground mb-2">{value.title}</h3>
                        <p className="text-muted-foreground">{value.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        <section aria-labelledby="about-answers-heading" className="mb-16">
          <div className="mb-6 text-center">
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.16em] text-primary">About Global Hearts Community</p>
            <h2 id="about-answers-heading" className="text-2xl font-bold text-foreground md:text-3xl">
              Quick answers about our work
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="h-full border-0 border-t border-border bg-transparent shadow-none">
              <CardContent className="p-6">
                <h3 className="mb-2 text-lg font-bold text-foreground">What is Global Hearts Community?</h3>
                <p className="leading-relaxed text-muted-foreground">
                  Global Hearts Community is a registered Ugandan charity based in Mbale. We work alongside communities to support vulnerable people through practical local programs.
                </p>
              </CardContent>
            </Card>
            <Card className="h-full border-0 border-t border-border bg-transparent shadow-none">
              <CardContent className="p-6">
                <h3 className="mb-2 text-lg font-bold text-foreground">Where does the organization work?</h3>
                <p className="leading-relaxed text-muted-foreground">
                  We are based in Mbale, Uganda, and serve Mbale and surrounding communities.
                </p>
              </CardContent>
            </Card>
            <Card className="h-full border-0 border-t border-border bg-transparent shadow-none">
              <CardContent className="p-6">
                <h3 className="mb-2 text-lg font-bold text-foreground">What programs does it run?</h3>
                <p className="leading-relaxed text-muted-foreground">
                  Our work includes education support, health outreach, food assistance, women’s empowerment, disability support, and environmental conservation.
                </p>
              </CardContent>
            </Card>
            <Card className="h-full border-0 border-t border-border bg-transparent shadow-none">
              <CardContent className="p-6">
                <h3 className="mb-2 text-lg font-bold text-foreground">How can I support the work?</h3>
                <p className="leading-relaxed text-muted-foreground">
                  You can <Link className="font-semibold text-primary underline underline-offset-4" to="/donate">donate</Link>, <Link className="font-semibold text-primary underline underline-offset-4" to="/get-involved">volunteer or partner</Link>, or <Link className="font-semibold text-primary underline underline-offset-4" to="/contact">contact our team</Link>.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <motion.div
          className="mt-4"
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <Card className="border-0 border-t border-border bg-transparent shadow-none">
            <CardContent className="p-8 md:p-10">
              <div className="flex flex-col md:flex-row md:items-center gap-8">
                <div className="md:max-w-xs">
                  <h2 className="text-2xl font-semibold text-foreground mb-2">Follow our work</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    See our latest activities, appeals and community stories on social media.
                  </p>
                </div>
                <SocialHandleList className="flex-1" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
