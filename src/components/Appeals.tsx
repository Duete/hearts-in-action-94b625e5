import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Heart, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ramadanImg from "@/assets/optimized/gallery/ramadan-iftar-meals.webp";
import wheelchairImg from "@/assets/optimized/gallery/wheelchair-support.webp";
import orphanImg from "@/assets/optimized/gallery/orphan-feeding-program.webp";
import schoolImg from "@/assets/optimized/gallery/school-supplies-distribution.webp";
import treeImg from "@/assets/optimized/environment-program.webp";
import foodImg from "@/assets/optimized/gallery/food-package-distribution.webp";
import boreImg from "@/assets/optimized/gallery/borehole-construction.webp";
import womenImg from "@/assets/optimized/gallery/women-empowerment-supplies.webp";
import watermark from "@/assets/optimized/watermark.webp";

const appeals = [
  {
    title: "Food Packs Support: Combat Hunger, Build Health",
    image: foodImg,
    body: [
      "Hunger is a daily reality for far too many families in Mbale. Chronic malnutrition stunts children's growth and limits their ability to learn and thrive.",
      "Food packs include fortified cereal, milk powder, rice, beans, cooking oil, and vitamin-enriched biscuits — supporting healthy growth so children can focus in school.",
    ],
    tiers: ["$160 – feeds a child for a year", "$3,360 – feeds a classroom of 21 children for a year", "$12,000 – feeds an entire village for a year"],
  },
  {
    title: "Wheelchairs and Mobility Support: Restore Dignity and Independence",
    image: wheelchairImg,
    body: [
      "Imagine being unable to leave your home, attend school, or earn a living simply because you cannot walk. For many individuals living with disabilities in Uganda, a wheelchair is the key to education, employment, and social inclusion.",
      "A wheelchair costing around $1,000 in the local market is far beyond what most families can afford. When you give mobility, you give freedom, dignity, and a future.",
    ],
    tiers: ["$300 – a wheelchair for a school-going child with a disability", "$200 – a brand-new wheelchair for someone in need"],
  },
  {
    title: "Ramadan Support: Feed Families, Nourish Souls",
    image: ramadanImg,
    body: [
      "Ramadan is a sacred time of reflection, community, and generosity. Yet for many families in Mbale, the evening Iftar meal is a daily struggle. Rising food costs and economic hardship mean many households break their fast with little more than water and dates.",
      "Your Ramadan donation provides essential food packs containing rice, maize flour, cooking oil, beans, and nutritious staples that sustain families throughout the holy month. Give the gift of a full stomach and a peaceful heart.",
    ],
    tiers: ["$75 – full food pack and cooking gas for a family", "$10 – a daily Iftar meal for those in urgent need"],
  },
  {
    title: "Orphan Support: Be a Lifeline for Vulnerable Children",
    image: orphanImg,
    body: [
      "Uganda is home to countless orphaned and abandoned children facing hunger, lack of healthcare, and the constant threat of exploitation. Without intervention, many end up on the streets or in child labor.",
      "We provide safe housing, nutritious meals, healthcare access, and emotional and psychological support. Children in orphan support programs are more likely to attend and stay in school, with better health and a more stable home.",
    ],
    tiers: ["Any monthly amount – steady, life-changing support for an orphan and their family"],
  },
  {
    title: "School Fees and Scholastic Support: Open the Door to Education",
    image: schoolImg,
    body: [
      "Education is the most powerful tool for breaking the cycle of poverty. Yet school fees remain the single greatest barrier for thousands of Ugandan children, and rising costs push education further out of reach.",
      "Your donation removes financial barriers, provides essential learning materials, and ensures children can stay in school where they belong.",
    ],
    tiers: ["$30 – one month of education", "$50 – one term of school", "$150 – a full year of fees, supplies, and uniform"],
  },
  {
    title: "Tree Planting Support: Grow a Greener, Resilient Future",
    image: treeImg,
    body: [
      "Deforestation, soil erosion, and climate change are making farming harder, water scarcer, and life more precarious across Uganda.",
      "Your support plants indigenous and fruit trees in community groves, school compounds, and degraded landscapes. What we do for trees today, we do for the children of tomorrow.",
    ],
    tiers: ["$10 – 20 trees", "$25 – 50 trees", "$50 – 100 trees", "$500 – 1,000 trees in a community grove"],
  },
  {
    title: "Bore Repair and Construction: Clean Water Changes Everything",
    image: boreImg,
    body: [
      "Access to clean and safe water is a basic human right, yet many communities in Mbale still struggle daily to find it. Women and girls often walk long distances to fetch water from unprotected sources, exposing them to disease, danger, and lost opportunities for school and work. When a borehole breaks down, entire villages are forced back to unsafe water.",
      "Global Hearts Community repairs broken boreholes and constructs new ones so that families can drink clean water, cook safely, improve sanitation, and reduce waterborne diseases. Clean water means healthier children, more time for school, stronger livelihoods, and dignity for families. When you give water, you give life.",
    ],
    tiers: ["$270 – restore a broken borehole through digging and repair", "$675 – construct a new borehole or complete a major repair"],
  },
  {
    title: "Women Empowerment: Strengthening Families, Building Futures",
    image: womenImg,
    body: [
      "When women are empowered, entire communities rise. In Mbale, many women carry the weight of caring for children, farming, trading, and holding families together, yet they often lack access to education, financial services, skills training, and decision-making power.",
      "Our program equips women and widows with vocational skills (tailoring, baking, soap making, crafts, agriculture), financial literacy and savings groups, startup kits and small grants, leadership and rights workshops, menstrual health support, GBV referrals, and community support networks. Women's empowerment is a pathway to lasting change for generations.",
    ],
    tiers: ["Any amount – helps a woman learn a skill, start a business, feed her family, and pay school fees"],
  },
];

const others = [
  ["Widows Empowerment", "Skill development, financial assistance, and community integration"],
  ["HIV/AIDS Awareness", "Educational workshops reaching thousands each year"],
  ["Girl-Child Empowerment", "Mentorship helping girls stay in school and lead"],
  ["Drug & Substance Rehabilitation", "Rehabilitative services for those struggling with addiction"],
  ["Water, Sanitation & Hygiene", "Improving access to clean water and healthy practices"],
  ["Women's Empowerment", "Education, entrepreneurship opportunities, and resources"],
];

const Appeals = () => (
  <section id="appeals" className="py-20 md:py-28 bg-background">
    <div className="container mx-auto px-4">
      <motion.div
        className="text-center max-w-3xl mx-auto mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <span className="inline-flex items-center gap-2 text-primary font-semibold text-sm uppercase tracking-wider mb-4">
          <Heart className="h-4 w-4" /> Our Appeals
        </span>
        <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">Transform Lives in Mbale, Uganda</h1>
        <p className="text-lg text-muted-foreground">
          Your donation directly fuels programs that change lives. Whether you give to Ramadan food support, mobility aids,
          orphan care, education, tree planting, or food packs, every contribution creates ripple effects of hope.
        </p>
      </motion.div>

      <div className="space-y-20">
        {appeals.map((a, i) => (
          <motion.article
            key={a.title}
            className="grid md:grid-cols-2 gap-8 md:gap-12 items-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
          >
            <div
              className={`relative rounded-2xl overflow-hidden shadow-strong aspect-[4/3] select-none ${i % 2 ? "md:order-2" : ""}`}
              onContextMenu={(e) => e.preventDefault()}
            >
              <img src={a.image} alt={a.title} loading="lazy" draggable={false} className="w-full h-full object-cover" />
              <img src={watermark} alt="" aria-hidden draggable={false} className="absolute inset-0 m-auto w-24 opacity-40 pointer-events-none" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">{a.title}</h2>
              <div className="space-y-3 text-muted-foreground leading-relaxed mb-6">
                {a.body.map((p) => <p key={p}>{p}</p>)}
              </div>
              <ul className="space-y-2 mb-6">
                {a.tiers.map((t) => (
                  <li key={t} className="flex gap-2 text-foreground">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="font-medium">{t}</span>
                  </li>
                ))}
              </ul>
              <Button variant="hero" size="lg" asChild>
                <Link to="/donate">Donate to this appeal</Link>
              </Button>
            </div>
          </motion.article>
        ))}
      </div>

      <div className="mt-24">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-10">Other Ways Your Gift Transforms Lives</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {others.map(([t, d]) => (
            <div key={t} className="bg-card rounded-xl p-6 shadow-medium">
              <h3 className="font-bold text-foreground mb-2">{t}</h3>
              <p className="text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mt-20 max-w-2xl mx-auto">
        <p className="text-xl font-semibold text-foreground mb-6">
          Every donation counts. Every life matters. Every act of generosity creates a ripple that changes the world.
        </p>
        <Button variant="hero" size="xl" asChild className="shadow-medium">
          <Link to="/donate">Donate Now</Link>
        </Button>
      </div>
    </div>
  </section>
);

export default Appeals;
