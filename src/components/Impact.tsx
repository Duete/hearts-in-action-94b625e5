import impact from "@/data/impact.json";
import distributionBackground from "@/assets/contact-impact-background.webp";
import heroImg from "@/assets/hero-community.jpg";

const impactStats = [
  { value: `${impact.students}+`, label: "Students supported", description: "Primary school pupils receiving full scholarships and scholastic materials" },
  { value: `${impact.meals.toLocaleString("en-US")}+`, label: "Hot meals provided", description: "Meals shared with vulnerable communities during Ramadan 2026" },
  { value: `${impact.foodPackages}+`, label: "Food packages distributed", description: "Essential food packages provided during Ramadan 2026" },
  { value: `${impact.mobilityAids}+`, label: "Wheelchairs and mobility aids", description: "Distributed across Mbale and surrounding communities over three years" },
  { value: `${impact.healthFamilies}+`, label: "Families reached by health camp", description: "Screening, health education, and referrals through community outreach" },
  { value: `${impact.volunteers}+`, label: "Volunteers", description: "Volunteers supporting community programs" },
];

const successStories = [
  {
    title: "Mobility support since 2023",
    description: "Since 2023, Global Hearts Community has provided wheelchairs and mobility tools to children and adults across Mbale and surrounding communities. Recipients include Wasswa Kevin in Namisindwa and Wamono Shafik in Manafwa, supported with fitting, maintenance, and follow-up care.",
    impact: `${impact.mobilityAids}+ wheelchairs and mobility aids distributed in three years`,
  },
  {
    title: "School sponsorship program",
    description: "Full scholarships and essential scholastic materials help vulnerable primary school pupils stay in school. The program supports orphans and children of teenage mothers, easing the burden of school fees and restoring hope for their families.",
    impact: `${impact.students}+ primary school pupils receive full scholarships`,
  },
  {
    title: "Ramadan 2026 feeding program",
    description: "Volunteers, local leaders, and donors came together to provide fresh hot meals at community Iftar gatherings and essential food packages for vulnerable families across Mbale and surrounding communities.",
    impact: `${impact.meals.toLocaleString("en-US")}+ hot meals and ${impact.foodPackages}+ food packages provided`,
  },
  {
    title: "Community health outreach",
    description: "Working with nearby health centers, our community health camp provided diabetes, malaria, and blood pressure screening, practical health education, and referrals for follow-up care in a rural community.",
    impact: `${impact.healthFamilies}+ families reached with essential health services`,
  },
  {
    title: "Women’s skills training in Bukonde",
    description: "More than 50 women and widows in Bukonde learned to make shampoo and liquid soap. The training also covered pricing, group savings, record-keeping, customer care, and finding local customers.",
    impact: "50+ women and widows trained in shampoo and liquid-soap production",
  },
];

const Impact = () => (
  <section className="bg-background">
    <header className="relative flex h-[260px] items-end overflow-hidden bg-primary md:h-[320px]">
      <img
        src={distributionBackground}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-center"
        loading="eager"
        decoding="async"
        onError={(event) => {
          const image = event.currentTarget;
          if (image.dataset.fallbackApplied) return;
          image.dataset.fallbackApplied = "true";
          image.src = heroImg;
        }}
      />
      <div className="absolute inset-0 bg-foreground/55" />
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-8 md:pb-12">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-secondary">Global Hearts Community · Mbale, Uganda</p>
        <h1 className="text-5xl font-semibold text-white md:text-7xl">Program outcomes</h1>
      </div>
    </header>

    <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
      <section aria-labelledby="impact-results-title" className="mb-16 md:mb-20">
        <div className="mb-8 max-w-2xl">
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.16em] text-primary">Selected figures</p>
          <h2 id="impact-results-title" className="mb-3 text-3xl font-semibold md:text-4xl">Results reported by program</h2>
          <p className="text-muted-foreground">Selected results from education, food, mobility, health, and community programs in Mbale and surrounding areas.</p>
        </div>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-3">
          {impactStats.map((stat) => (
            <div key={stat.label} className="border-t border-border pt-4">
              <dt className="font-semibold text-foreground">{stat.label}</dt>
              <dd className="mt-1 font-serif text-3xl font-semibold text-primary md:text-4xl">{stat.value}</dd>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{stat.description}</p>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="impact-stories-title" className="mb-16 md:mb-20">
        <div className="mb-8">
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.16em] text-primary">From the field</p>
          <h2 id="impact-stories-title" className="text-3xl font-semibold md:text-4xl">Program notes</h2>
        </div>
        <div className="grid gap-x-10 gap-y-8 md:grid-cols-2">
          {successStories.map((story) => (
            <article key={story.title} className="border-t border-border pt-5">
              <h3 className="mb-3 text-xl font-semibold">{story.title}</h3>
              <p className="mb-4 text-muted-foreground">{story.description}</p>
              <p className="border-l-2 border-secondary pl-3 text-sm font-semibold text-primary">{story.impact}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-primary/30 bg-primary/5 px-6 py-8 md:px-10 md:py-10">
        <h2 className="mb-3 text-2xl font-semibold md:text-3xl">Support these programs</h2>
        <p className="max-w-3xl text-muted-foreground">Your support helps fund education, food assistance, mobility support, health outreach, and water access in Mbale and surrounding communities.</p>
      </section>
    </div>
  </section>
);

export default Impact;
