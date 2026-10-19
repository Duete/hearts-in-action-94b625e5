import {
  ArrowDown,
  ArrowRight,
  Building2,
  GraduationCap,
  HandHeart,
  Heart,
  UsersRound,
} from "lucide-react";
import togetherWeCanImage from "@/assets/together-we-can.webp";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ways = [
  {
    icon: Heart,
    number: "01",
    title: "Give with purpose",
    description:
      "Your gift helps provide meals, mobility support, school supplies and clean water to people who need them most.",
    action: "Make a donation",
    href: "/donate",
    tone: "bg-secondary/15 text-secondary",
  },
  {
    icon: UsersRound,
    number: "02",
    title: "Volunteer your time",
    description:
      "Bring your skills, energy or a few hours to community activities and help turn local ideas into practical action.",
    action: "Talk to our team",
    href: "/contact",
    tone: "bg-primary/10 text-primary",
  },
  {
    icon: Building2,
    number: "03",
    title: "Build a partnership",
    description:
      "Work alongside us as a business, community group or organisation to extend support and create lasting impact.",
    action: "Explore partnering",
    href: "/contact",
    tone: "bg-accent/10 text-accent",
  },
  {
    icon: GraduationCap,
    number: "04",
    title: "Support a child",
    description:
      "Help children stay in school with support for fees, uniforms, books and the essentials they need to learn.",
    action: "Ask about sponsorship",
    href: "/contact",
    tone: "bg-primary/10 text-primary",
  },
];

const GetInvolved = () => (
  <>
    <section id="get-involved" className="relative isolate overflow-hidden bg-background">
      <div className="pointer-events-none absolute -right-24 -top-20 -z-10 h-80 w-80 rounded-full bg-secondary/10 blur-3xl" />
      <div className="container mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:grid-cols-[1.1fr_0.9fr] md:py-28">
        <div>
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-primary">
            Join us in Mbale
          </p>
          <h1 className="mb-6 max-w-2xl text-4xl font-extrabold leading-[1.08] tracking-tight text-foreground sm:text-5xl md:text-6xl">
            There’s a place for you in this work.
          </h1>
          <p className="mb-8 max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            Every act of support helps a neighbour move forward. Give, volunteer, partner or help a child stay in school—choose the way that feels right for you.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="gap-2">
              <a href="#ways-to-help">Find your way to help <ArrowDown className="h-4 w-4" /></a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/contact">Talk with our team</Link>
            </Button>
          </div>
        </div>

        <aside className="relative overflow-hidden rounded-3xl gradient-primary text-primary-foreground shadow-strong" aria-label="Our community approach">
          <figure className="relative h-52 sm:h-60">
            <img
              src={togetherWeCanImage}
              alt="Illustrative photo of volunteers and neighbours preparing food parcels and school supplies together in Mbale."
              className="h-full w-full object-cover"
              loading="eager"
              decoding="async"
            />
            <figcaption className="absolute bottom-3 left-3 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white">
              Illustrative image
            </figcaption>
          </figure>
          <div className="relative p-7 sm:p-10">
            <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
              <HandHeart className="h-7 w-7" aria-hidden="true" />
            </div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.16em] text-secondary">
              Together, we can
            </p>
            <h2 className="mb-5 text-2xl font-bold leading-snug sm:text-3xl">
              Turn care into practical, lasting change.
            </h2>
            <p className="max-w-md leading-relaxed text-primary-foreground/80">
              Global Hearts Community works with local people in Mbale to respond to real needs with dignity, compassion and community at the centre.
            </p>
            <div className="mt-8 flex items-center gap-3 border-t border-white/20 pt-5 text-sm font-semibold">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                <Heart className="h-4 w-4" aria-hidden="true" />
              </span>
              Small acts. Shared hope. Stronger communities.
            </div>
          </div>
        </aside>
      </div>
    </section>

    <section id="ways-to-help" className="bg-muted/60 py-16 md:py-24">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="mb-10 max-w-2xl md:mb-14">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-primary">Ways to take part</p>
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
            Give what you can. Make it count.
          </h2>
          <p className="text-lg leading-relaxed text-muted-foreground">
            There’s no single way to make a difference. Start with what you have, and we’ll help you find the next step.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ways.map((way) => (
            <article
              key={way.number}
              className="group flex min-h-full flex-col rounded-2xl border border-border/80 bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-medium"
            >
              <div className="mb-7 flex items-center justify-between">
                <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${way.tone}`}>
                  <way.icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <span className="text-sm font-bold tracking-widest text-muted-foreground/60">{way.number}</span>
              </div>
              <h3 className="mb-3 text-xl font-bold text-foreground">{way.title}</h3>
              <p className="mb-7 flex-1 text-sm leading-relaxed text-muted-foreground">{way.description}</p>
              <Link
                to={way.href}
                className="inline-flex items-center gap-2 font-semibold text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
              >
                {way.action}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-6 rounded-2xl border border-border bg-background p-6 shadow-soft sm:flex-row sm:items-center sm:p-8">
          <div className="flex items-start gap-4">
            <span className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary/15 text-secondary">
              <HandHeart className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h3 className="mb-1 text-lg font-bold text-foreground">Not sure where to begin?</h3>
              <p className="max-w-2xl text-muted-foreground">Tell us a little about yourself and we’ll find a meaningful way to get you involved.</p>
            </div>
          </div>
          <Button asChild className="shrink-0 gap-2">
            <Link to="/contact">Contact us <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </section>
  </>
);

export default GetInvolved;
