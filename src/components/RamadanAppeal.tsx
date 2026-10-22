import { ArrowRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ramadanAppealImg from "@/assets/ramadan-appeal.png";
import ramadanIftarImg from "@/assets/ramadan-iftar.png";
import ramadanMealsImg from "@/assets/ramadan-meals.png";

const mealOptions = [
  { meals: "1 hot meal", detail: "For one person" },
  { meals: "7 hot meals", detail: "A week of Iftar" },
  { meals: "13 hot meals", detail: "Share across a household" },
  { meals: "30 hot meals", detail: "A month of Iftar" },
];

const RamadanAppeal = () => (
  <section className="bg-muted/50 py-16 md:py-20">
    <div className="mx-auto max-w-6xl px-6">
      <header className="mb-9 max-w-3xl border-t-4 border-secondary pt-5 md:mb-12">
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.16em] text-primary">Ramadan appeal · 2026</p>
        <h2 className="mb-4 text-3xl font-semibold text-foreground md:text-5xl">Help serve 10,000 hot meals.</h2>
        <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Last season, Global Hearts Community delivered more than 8,000 hot meals and 200+ food packages to families in Mbale. This appeal aims to reach further.
        </p>
      </header>

      <div className="mb-10 grid gap-4 md:grid-cols-3">
        {[
          { src: ramadanAppealImg, alt: "Community gathering during a Ramadan food program in Uganda" },
          { src: ramadanIftarImg, alt: "Community Iftar meal during Ramadan" },
          { src: ramadanMealsImg, alt: "Prepared meals for Ramadan distribution" },
        ].map((image) => (
          <figure key={image.src} className="border border-border bg-background">
            <img src={image.src} alt={image.alt} className="aspect-[4/3] w-full object-cover" loading="lazy" decoding="async" />
          </figure>
        ))}
      </div>

      <div className="grid gap-8 border-t border-border pt-8 md:grid-cols-[1.1fr_0.9fr] md:gap-12">
        <div className="space-y-5 leading-relaxed text-muted-foreground">
          <p>
            In Mbale, families breaking their fast rely on shared meals and food packages. Volunteers and local leaders help prepare food and bring it to community Iftar gatherings and households that need support.
          </p>
          <p>
            Donations to this appeal help cover food, preparation, and distribution. The donation page accepts Pesapal in Ugandan shillings and PayPal in US dollars; the final amount appears before checkout.
          </p>
          <blockquote className="border-l-2 border-secondary bg-primary/5 px-5 py-4 text-foreground">
            <p className="font-serif text-lg italic leading-relaxed">
              “Whoever feeds a person breaking his fast will have the same reward as him, without anything being deducted from the reward of the fasting person.”
            </p>
            <cite className="mt-2 block text-sm not-italic text-muted-foreground">Hadith · Tirmidhi</cite>
          </blockquote>
        </div>

        <aside className="border-t border-primary/30 pt-5">
          <h3 className="mb-4 text-xl font-semibold">Meal quantities</h3>
          <ul className="mb-6 grid grid-cols-2 gap-x-5 gap-y-4">
            {mealOptions.map((option) => (
              <li key={option.meals} className="border-t border-border pt-3">
                <p className="font-semibold text-primary">{option.meals}</p>
                <p className="text-sm text-muted-foreground">{option.detail}</p>
              </li>
            ))}
          </ul>
          <p className="mb-5 text-sm leading-relaxed text-muted-foreground">Choose the donation amount that works for you. No fixed meal price is implied; current payment currencies are shown at checkout.</p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="gap-2">
              <Link to="/donate">Donate now <Heart className="h-4 w-4" aria-hidden="true" /></Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2">
              <Link to="/appeals">See other appeals <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
            </Button>
          </div>
        </aside>
      </div>
    </div>
  </section>
);

export default RamadanAppeal;
