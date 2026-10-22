import { ArrowDown, ArrowRight } from "lucide-react";
import foodDistributionImage from "@/assets/gallery/food-distribution.jpg";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ways = [
  {
    number: "01",
    title: "Donate",
    description: "Your gift helps provide meals, mobility support, school supplies, and clean water to people who need them most.",
    action: "Make a donation",
    href: "/donate",
  },
  {
    number: "02",
    title: "Volunteer",
    description: "Bring your skills, energy, or a few hours to community activities in Mbale.",
    action: "Talk to our team",
    href: "/contact",
  },
  {
    number: "03",
    title: "Partner with us",
    description: "Work alongside Global Hearts Community as a business, community group, or organization.",
    action: "Ask about partnership",
    href: "/contact",
  },
  {
    number: "04",
    title: "Support a child’s education",
    description: "Help children stay in school with support for fees, uniforms, books, and learning materials.",
    action: "Ask about sponsorship",
    href: "/contact",
  },
];

const GetInvolved = () => (
  <>
    <section id="get-involved" className="bg-background">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 md:grid-cols-[1.1fr_0.9fr] md:py-24">
        <div>
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-primary">Take part · Mbale, Uganda</p>
          <h1 className="mb-6 max-w-2xl text-4xl font-semibold leading-tight text-foreground sm:text-5xl md:text-6xl">
            Ways to support work in Mbale.
          </h1>
          <p className="mb-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Choose a program to support, offer time or skills, partner with the organization, or ask about school sponsorship.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <a href="#ways-to-help">See the options <ArrowDown className="h-4 w-4" /></a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/contact">Contact the team</Link>
            </Button>
          </div>
        </div>

        <figure className="border border-border bg-card">
          <img
            src={foodDistributionImage}
            alt="Children seated with plates during a community food distribution in Mbale."
            className="aspect-[4/3] w-full object-cover"
            loading="eager"
            decoding="async"
          />
          <figcaption className="border-t border-border px-4 py-3 text-sm text-muted-foreground">
            Children at a food distribution in Mbale.
          </figcaption>
        </figure>
      </div>
    </section>

    <section id="ways-to-help" className="bg-muted/60 py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-9 max-w-2xl md:mb-12">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.16em] text-primary">Ways to take part</p>
          <h2 className="mb-4 text-3xl font-semibold text-foreground md:text-4xl">Choose what fits your time and resources.</h2>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Start with the program or contribution you have in mind. The team can explain the next step.
          </p>
        </div>

        <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-4">
          {ways.map((way) => (
            <article key={way.number} className="flex min-h-full flex-col border-t border-border pt-4">
              <p className="mb-5 font-serif text-sm text-secondary">{way.number}</p>
              <h3 className="mb-3 text-xl font-semibold text-foreground">{way.title}</h3>
              <p className="mb-6 flex-1 text-sm leading-relaxed text-muted-foreground">{way.description}</p>
              <Link
                to={way.href}
                className="inline-flex items-center gap-2 font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
              >
                {way.action}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-6 border-t border-primary/30 bg-background p-6 sm:flex-row sm:items-center sm:px-8">
          <div>
            <h3 className="mb-1 text-lg font-semibold text-foreground">Have a question about where to begin?</h3>
            <p className="max-w-2xl text-muted-foreground">Tell the team what you are interested in and they can explain the available options.</p>
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
