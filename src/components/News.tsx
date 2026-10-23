import { motion } from "framer-motion";
import { Calendar, CalendarClock, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import scholarshipHandoverImg from "@/assets/gallery/scholarship-school-bag-handover.png";
import scholarshipAidImg from "@/assets/gallery/scholarship-school-aid-event.png";
import scholarshipClassroomImg from "@/assets/gallery/scholarship-classroom.jpg";
import skillsTrainingImg from "@/assets/gallery/women-skills-training-starter-kit.webp";
import healthImg from "@/assets/health-outreach.jpg";
import healthCheckupImg from "@/assets/gallery/health-checkup-news.webp";
import ramadanMealsImg from "@/assets/gallery/ramadan-iftar-meals.png";
import wheelchairPhoto from "@/assets/gallery/joyful-wheelchair-donation-namisindwa.png";
import wheelchairFoodPhoto from "@/assets/gallery/wheelchair-donation-namisindwa-food.png";
import orphanSupportImg from "@/assets/gallery/orphan-support.webp";
import { SocialHandleInline, SocialHandleList } from "@/components/SocialHandles";
import { Link } from "react-router-dom";

const lastUpdated = "October 22, 2026";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5 },
  },
};

const News = () => {
  const articles: {
    title: string;
    date: string;
    excerpt: string;
    image: string;
    imageAlt?: string;
    photoFeature?: boolean;
    fullContent?: string;
    ctaText?: string;
    ctaHref?: string;
    photos?: { image: string; caption: string }[];
  }[] = [
    {
      title: "Food, school fees, and supplies for 100+ orphaned children",
      date: "October 19, 2026",
      excerpt: "More than 100 orphaned children have received food packages, scholastic materials, school fees, clothing, and bedding through Global Hearts Community.",
      fullContent: "Global Hearts Community has supported over 100 orphaned children with food packages, scholastic materials, school fees, clothing, and bedding.\n\nThis practical assistance helps address essential needs and support children’s education and day-to-day well-being.",
      image: orphanSupportImg,
    },
    {
      title: "More than 15 mobility aids distributed since 2023",
      date: "October 18, 2026",
      excerpt: "Global Hearts Community Uganda has distributed more than 15 wheelchairs and other mobility aids to individuals living with disabilities across Mbale and surrounding communities over the past three years, restoring dignity, independence, and opportunity.",
      fullContent: "MBALE, UGANDA — Global Hearts Community Uganda has distributed more than 15 wheelchairs and other mobility aids to individuals living with disabilities across Mbale and surrounding communities over the past three years. The milestone marks a significant step in the organization’s ongoing mission to restore dignity, independence, and opportunity for persons with mobility challenges in Uganda.\n\nThe distributions, which began in 2023, have reached children and adults alike, many of whom had been confined to their homes for years due to the lack of an affordable wheelchair. In Uganda, a wheelchair that would cost up to $1,000 in the local market remains far beyond the reach of most families. Through partnerships and generous donations, Global Hearts Community has been able to provide wheelchairs and other mobility tools at no cost to recipients.\n\n“For many people with disabilities in our community, a wheelchair is not a luxury; it is the key to education, employment, and social inclusion,” said a spokesperson for Global Hearts Community. “Over the last three years, we have seen firsthand how a single wheelchair can transform a life. Children who could not attend school are now in classrooms. Adults who could not work are now earning a living. Parents who could not move around their own homes are now active members of their communities.”\n\nAmong the recipients are school-going children like Wasswa Kevin in Namisindwa district, who had previously dropped out due to mobility barriers, as well as adults who had been unable to pursue livelihoods. Each distribution event includes not only the handover of mobility tools but also follow-up support to ensure proper fitting, maintenance, and community integration.\n\n“I had not left my house in two years,” said Wamono Shafik, one of the beneficiaries in Manafwa District. “Now I can go to the market, visit my friends, and feel like part of the community again. I thank Global Hearts Community for giving me my freedom back.”\n\nThe organization notes that the need remains great. With thousands of persons with disabilities in the region still waiting for mobility support, Global Hearts Community is appealing for continued donations to expand the program.\n\nHow You Can Help: A gift of $300 can provide a wheelchair to a school-going child living with a disability, while $200 can help deliver a brand-new wheelchair to someone in desperate need of mobility. Every contribution brings freedom, dignity, and a future to a person who has been left behind.\n\nTo support the wheelchair and mobility program, please visit our Donate page or contact Global Hearts Community directly.\n\nAbout Global Hearts Community: Global Hearts Community is a Mbale-based nonprofit dedicated to empowering vulnerable groups through education support, health outreach, women’s empowerment, clean water access, and environmental initiatives. The organization serves orphans, street children, individuals with disabilities, widows, and marginalized communities across Uganda.",
      image: wheelchairPhoto,
      photos: [
        { image: wheelchairPhoto, caption: "Wasswa Kevin receives a wheelchair in Namisindwa District." },
        { image: wheelchairFoodPhoto, caption: "Wasswa Kevin and his family with the donated wheelchair and food support in Namisindwa District." },
      ],
    },
    {
      title: "8,000+ meals served during Ramadan 2026",
      date: "June 12, 2026",
      excerpt: "Global Hearts Community has successfully concluded its Ramadan 2026 feeding program, which provided more than 8,000 hot meals and distributed over 200 food packages to vulnerable families across Mbale and surrounding communities.",
      fullContent: "Global Hearts Community has successfully concluded its Ramadan 2026 feeding program, which provided more than 8,000 hot meals and distributed over 200 food packages to vulnerable families across Mbale and surrounding communities. The initiative, which ran throughout the holy month, brought together volunteers, local leaders, and generous donors to ensure that no family went hungry during Ramadan.\n\nThe hot meals, prepared fresh daily and served at community Iftar gatherings, reached orphans, widows, street children, individuals with disabilities, and low-income households. Each meal included nutritious staples such as rice, beans, maize flour, cooking oil, and fresh vegetables, allowing families to break their fast with dignity and nourishment. In addition to the daily meals, the food packages distributed to households contained essential dry goods to sustain families beyond the Iftar table.\n\n“Ramadan is a time of generosity, and we are overwhelmed by the support we received,” said a spokesperson for Global Hearts Community. “Reaching over 8,000 hot meals and 200 food packages was only possible because of our volunteers, partners, and donors who believe that no one should go hungry. Every meal shared was a moment of hope for a family in need.”\n\nThe program prioritized the most vulnerable members of the community, including female-headed households, elderly residents, and families affected by disability or displacement. Volunteers worked long hours to prepare, package, and deliver meals and food packs, often traveling to remote areas to reach those unable to come to distribution points.\n\nBeneficiaries expressed deep gratitude. “This food came at a time when my children and I had nothing to break our fast with,” said one mother of four in Mbale. “I thank everyone who made this possible. We felt remembered.”\n\nThe success of last Ramadan’s program has set a high bar for this year. Global Hearts Community is now appealing for renewed support as it prepares to expand its feeding efforts, aiming to reach even more families with hot meals, food packs, and essential support.\n\nHow You Can Help: A donation of $10 provides a daily Iftar meal for someone in need, while $75 provides a full food pack and cooking gas for a family throughout Ramadan. Every contribution helps Global Hearts Community continue its mission of compassion and service.\n\nTo support this year’s Ramadan appeal, please visit our Donate page or contact Global Hearts Community directly.\n\nAbout Global Hearts Community: Global Hearts Community is a Mbale-based nonprofit dedicated to empowering vulnerable groups through education support, health outreach, women’s empowerment, clean water access, and environmental initiatives. The organization serves orphans, street children, individuals with disabilities, widows, and marginalized communities across Uganda.",
      image: ramadanMealsImg,
    },
    {
      title: "150+ pupils receive scholarships",
      date: "March 15, 2025",
      excerpt: "Global Hearts Community continues to make a quiet but meaningful impact through its education support project aimed at vulnerable children.",
      fullContent: "Global Hearts Community continues to make a quiet but meaningful impact through its education support project aimed at vulnerable children. So far, more than 150 primary school pupils have received full scholarships, giving them a real chance to stay in school and learn without the burden of school fees.\n\nThe beneficiaries are mainly orphans and children born from unintended pregnancies to teenage mothers, groups that often face the highest risk of dropping out of school. Through this project, Global Hearts Community covers school fees and provides essential scholastic materials, helping to create a stable learning environment for each child.\n\nBeyond financial support, the initiative restores hope to families and children who might otherwise see education as unreachable. For many of these learners, the scholarship is more than assistance. It is a lifeline that allows them to focus on their studies, grow in confidence, and imagine a better future.\n\nGlobal Hearts Community remains committed to expanding this program and reaching even more children in need, guided by the belief that access to education can break cycles of poverty and change lives in lasting ways.",
      image: scholarshipHandoverImg,
      imageAlt: "Children holding school bags and support packages at a Global Hearts Community handover.",
      photoFeature: true,
      photos: [
        { image: scholarshipHandoverImg, caption: "Children with school bags and support packages at a Global Hearts Community handover." },
        { image: scholarshipAidImg, caption: "A pupil with a school bag, shoes and scholastic materials at a school-aid event." },
        { image: scholarshipClassroomImg, caption: "Primary school pupils working in their classroom." },
      ],
    },
    {
      title: "50+ women learn soap making in Bukonde",
      date: "October 20, 2026",
      excerpt: "Global Hearts Community trained more than 50 women and widows in Bukonde, Mbale, to make shampoo and liquid soap—practical skills they can turn into income within weeks.",
      fullContent: `MBALE, UGANDA — Global Hearts Community has trained more than 50 women and widows in shampoo and liquid soap production, giving them practical skills they can turn into income within weeks. The training forms part of the organisation’s Women Empowerment programme, which supports vulnerable women to build sustainable livelihoods and provide for their families.

Many participants are widows, single mothers, or women caring for orphans and children with disabilities. Through hands-on sessions, they learned the full process: sourcing affordable local raw materials, safe mixing and measuring, quality control, bottling, labelling, and pricing. Participants left with their own finished products.

Shampoo and liquid soap were chosen deliberately: both are in constant demand in households, schools, shops, and salons across Mbale, require modest startup capital, and can be made at home with basic equipment.

Alongside production skills, the programme covered financial literacy, group savings, record keeping, customer care, and pricing. Participants were encouraged to form savings groups for small loans and bulk purchasing.

“Before this training, I did not know I could make something people would pay for,” said one participant. “Now I can make soap for my family and sell the rest to my neighbours. I have started saving for my children’s school fees.”

“Skills alone do not change lives; skills plus markets plus confidence do,” said a spokesperson for Global Hearts Community. “Over 50 women now have a way to earn that did not exist for them before.”

Demand for the training exceeds available places. Many graduates still need startup kits—raw materials, containers, labels, and measuring equipment—before they can begin earning.

How You Can Help

Donations fund training, raw materials, and startup kits so graduates can begin production immediately.

Editors’ Note: High-resolution photos from the training sessions are available upon request.`,
      image: skillsTrainingImg,
      imageAlt: "Women unpacking starter-kit supplies — hair dryers, styling tools and containers of finished liquid soap — at a Global Hearts Community handover in Bukonde, Mbale.",
      photos: [
        {
          image: skillsTrainingImg,
          caption: "Participants unpack starter-kit supplies — hair dryers, styling tools and containers of finished liquid soap — after the shampoo and liquid soap making training in Bukonde, Mbale.",
        },
      ],
      ctaText: "Donate Now",
      ctaHref: "/donate",
    },
    {
      title: "Health camp serves 200+ families",
      date: "February 28, 2025",
      excerpt: "The community health camp reached more than 200 families with screening, health education, and referrals to nearby health facilities.",
      fullContent: "Global Hearts Community recently held a community health camp that reached more than 200 families in a rural setting where access to basic healthcare remains limited. For many residents, this was not just an outreach activity, but a rare chance to receive essential health services close to home.\n\nThe camp was organized in partnership with nearby local health centers, a deliberate approach to ensure both quality care and continuity after the event. Through this collaboration, trained health workers provided screening and testing for some of the most common but often neglected conditions in rural communities. These included diabetes, malaria, high blood pressure, and other preventable or manageable diseases that silently affect many families.\n\nThroughout the day, community members received blood sugar checks, malaria tests, and blood pressure measurements. Those found with abnormal results were counseled on next steps and formally referred to partner health facilities for follow-up care. This link between outreach and the formal health system helped bridge a gap that many rural families struggle with, knowing where to go and what to do after a diagnosis.\n\nBeyond testing, the camp placed strong emphasis on health education. Volunteers and health professionals spoke with families about early warning signs of chronic illnesses, the importance of regular check-ups, proper nutrition, and simple lifestyle changes that can reduce long-term health risks. These conversations were practical and relatable, grounded in everyday realities of rural life.\n\nFor Global Hearts Community, the goal was not only to treat illness but to strengthen prevention and awareness. Many attendees shared that it was their first time being screened for conditions like hypertension or diabetes, despite experiencing symptoms for years. Moments like these highlight how much impact even a single well-organized health camp can have.\n\nThis initiative was made possible through the support of donors and partners who believe that access to healthcare should not depend on location or income. Every test conducted, every referral made, and every conversation held was a step toward healthier, more resilient communities.\n\nAs Global Hearts Community looks ahead, there are plans to expand these health camps to reach more villages and to include additional services based on local needs. Continued donor support will be crucial in scaling this work, strengthening partnerships with health centers, and ensuring that no family is left behind simply because they live far from a hospital.\n\nInvesting in community health is investing in dignity, productivity, and hope. Through initiatives like this, Global Hearts Community is turning compassion into action and making measurable change where it matters most.",
      image: healthImg,
      photos: [
        {
          image: healthImg,
          caption: "Global Hearts Community health-camp outreach serving families in a rural community.",
        },
        {
          image: healthCheckupImg,
          caption: "Additional photo from Global Hearts Community’s health outreach gallery: a local health worker checks a community member’s blood pressure.",
        },
      ],
    },
  ];

  const recentArticles = [...articles].sort((a, b) => Date.parse(b.date) - Date.parse(a.date));

  return (
      <section id="news" className="py-16 md:py-20 bg-muted">
      <div className="container mx-auto px-4">
        <motion.div
          className="mb-10 max-w-2xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl md:text-5xl font-semibold text-foreground mb-4">News and program reports</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Reports on food assistance, education, health, mobility, and women’s programs in Mbale.
          </p>
          <p className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground mt-4">
            <CalendarClock className="h-4 w-4 text-primary" />
            Last updated: {lastUpdated}
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {recentArticles.map((article, index) => {
            const additionalPhoto = article.photos?.find((photo) => photo.image !== article.image);
            return (
              <motion.div key={index} variants={cardVariants} className={article.photoFeature ? "md:col-span-3" : undefined}>
                <Card className="overflow-hidden border-border bg-card shadow-none group h-full">
                  {article.photoFeature ? (
                    <div className="grid sm:grid-cols-3 gap-4 bg-background p-4 md:p-6 border-b border-border">
                      {article.photos?.map((photo) => (
                        <figure key={photo.image} className="min-w-0">
                          <div className="aspect-[4/3] bg-muted overflow-hidden">
                            <img src={photo.image} alt={photo.caption} className="w-full h-full object-contain" loading="lazy" decoding="async" />
                          </div>
                          <figcaption className="mt-3 text-sm text-muted-foreground leading-relaxed">{photo.caption}</figcaption>
                        </figure>
                      ))}
                    </div>
                  ) : (
                  <div className="flex h-48 gap-1 overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.imageAlt ?? article.title}
                      className="h-full min-w-0 flex-1 object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                    {additionalPhoto && (
                      <img
                        src={additionalPhoto.image}
                        alt={additionalPhoto.caption}
                        className="h-full min-w-0 flex-1 object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    )}
                  </div>
                  )}
                  <CardContent className={article.photoFeature ? "p-6 md:p-8 grid md:grid-cols-[1fr_auto] gap-x-10 items-end" : "p-6"}>
                    <div>
                    <div className="flex items-center gap-2 text-muted-foreground mb-3">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">{article.date}</span>
                    </div>
                    <h3 className={`${article.photoFeature ? "text-2xl md:text-3xl" : "text-xl"} font-semibold text-foreground mb-3`}>
                      {article.title}
                    </h3>
                    <p className="text-muted-foreground mb-4 leading-relaxed">{article.excerpt}</p>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant={article.photoFeature ? "default" : "link"} className={article.photoFeature ? "group/btn mb-4 justify-self-start" : "p-0 h-auto group/btn"}>
                          Read More
                          <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className={`${article.photoFeature ? "max-w-4xl" : "max-w-2xl"} max-h-[85vh] overflow-y-auto`}>
                        <DialogHeader>
                          <DialogTitle className="text-2xl">{article.title}</DialogTitle>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span className="text-sm">{article.date}</span>
                          </div>
                        </DialogHeader>
                        <div className="mt-4">
                          {article.photos ? (
                            <div className={article.photoFeature ? "grid sm:grid-cols-2 gap-6 mb-8" : "space-y-6 mb-6"}>
                              {article.photos.map((photo, photoIndex) => (
                                <figure key={photo.image} className={article.photoFeature && photoIndex === 0 ? "sm:col-span-2" : undefined}>
                              <img src={photo.image} alt={photo.caption} className="w-full h-auto border border-border" loading="lazy" />
                                  <figcaption className="mt-2 text-sm text-muted-foreground">{photo.caption}</figcaption>
                                </figure>
                              ))}
                            </div>
                          ) : (
                            <img
                              src={article.image}
                              alt={article.imageAlt ?? article.title}
                              className="w-full h-64 border border-border object-cover mb-6"
                            />
                          )}
                          <div className="prose prose-sm max-w-none">
                            {(article.fullContent ?? article.excerpt).split("\n\n").map((paragraph, idx) => (
                              paragraph === "How You Can Help" ? (
                                <h3 key={idx} className="mt-6 mb-2 text-lg font-semibold text-foreground">
                                  {paragraph}
                                </h3>
                              ) : (
                                <p key={idx} className="text-muted-foreground leading-relaxed mb-4">
                                  {paragraph}
                                </p>
                              )
                            ))}
                          </div>
                          {article.ctaText && article.ctaHref && (
                            <Button asChild className="mt-3">
                              <Link to={article.ctaHref}>
                                {article.ctaText}
                                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                              </Link>
                            </Button>
                          )}
                          <div className="mt-6 pt-6 border-t border-border">
                            <p className="text-sm font-bold text-foreground mb-3">
                              Follow program updates
                            </p>
                            <SocialHandleInline />
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <Card className="border-border bg-card shadow-none">
            <CardContent className="p-8 md:p-10">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-2">Follow field updates</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  See community activities, reports, and appeal updates on social media.
                </p>
              </div>
              <SocialHandleList className="max-w-3xl mx-auto" />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default News;
