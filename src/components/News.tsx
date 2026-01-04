import { Calendar, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import educationImg from "@/assets/education-program.jpg";
import womenImg from "@/assets/women-empowerment.jpg";
import healthImg from "@/assets/health-outreach.jpg";

const News = () => {
  const articles = [
    {
      title: "50+ Students Receive Scholarships",
      date: "March 15, 2025",
      excerpt: "Global Hearts Community continues to make a quiet but meaningful impact through its education support project aimed at vulnerable children.",
      fullContent: "Global Hearts Community continues to make a quiet but meaningful impact through its education support project aimed at vulnerable children. So far, 50 primary school pupils have received full scholarships, giving them a real chance to stay in school and learn without the burden of school fees.\n\nThe beneficiaries are mainly orphans and children born from unintended pregnancies to teenage mothers, groups that often face the highest risk of dropping out of school. Through this project, Global Hearts Community covers school fees and provides essential scholastic materials, helping to create a stable learning environment for each child.\n\nBeyond financial support, the initiative restores hope to families and children who might otherwise see education as unreachable. For many of these learners, the scholarship is more than assistance. It is a lifeline that allows them to focus on their studies, grow in confidence, and imagine a better future.\n\nGlobal Hearts Community remains committed to expanding this program and reaching even more children in need, guided by the belief that access to education can break cycles of poverty and change lives in lasting ways.",
      image: educationImg,
    },
    {
      title: "Women's Cooperative Launches Successfully",
      date: "March 8, 2025",
      excerpt: "Our women empowerment program has helped establish a thriving cooperative, providing 50 women with sustainable income through craft production and marketing.",
      image: womenImg,
    },
    {
      title: "Community Health Camp Serves 100 Families",
      date: "February 28, 2025",
      excerpt: "Global Hearts Community recently held a community health camp that reached over 100 families in a rural setting where access to basic healthcare remains limited. For many residents, this was not just an outreach activity,",
      fullContent: "Global Hearts Community recently held a community health camp that reached over 100 families in a rural setting where access to basic healthcare remains limited. For many residents, this was not just an outreach activity, but a rare chance to receive essential health services close to home.\n\nThe camp was organized in partnership with nearby local health centers, a deliberate approach to ensure both quality care and continuity after the event. Through this collaboration, trained health workers provided screening and testing for some of the most common but often neglected conditions in rural communities. These included diabetes, malaria, high blood pressure, and other preventable or manageable diseases that silently affect many families.\n\nThroughout the day, community members received blood sugar checks, malaria tests, and blood pressure measurements. Those found with abnormal results were counseled on next steps and formally referred to partner health facilities for follow-up care. This link between outreach and the formal health system helped bridge a gap that many rural families struggle with, knowing where to go and what to do after a diagnosis.\n\nBeyond testing, the camp placed strong emphasis on health education. Volunteers and health professionals spoke with families about early warning signs of chronic illnesses, the importance of regular check-ups, proper nutrition, and simple lifestyle changes that can reduce long-term health risks. These conversations were practical and relatable, grounded in everyday realities of rural life.\n\nFor Global Hearts Community, the goal was not only to treat illness but to strengthen prevention and awareness. Many attendees shared that it was their first time being screened for conditions like hypertension or diabetes, despite experiencing symptoms for years. Moments like these highlight how much impact even a single well-organized health camp can have.\n\nThis initiative was made possible through the support of donors and partners who believe that access to healthcare should not depend on location or income. Every test conducted, every referral made, and every conversation held was a step toward healthier, more resilient communities.\n\nAs Global Hearts Community looks ahead, there are plans to expand these health camps to reach more villages and to include additional services based on local needs. Continued donor support will be crucial in scaling this work, strengthening partnerships with health centers, and ensuring that no family is left behind simply because they live far from a hospital.\n\nInvesting in community health is investing in dignity, productivity, and hope. Through initiatives like this, Global Hearts Community is turning compassion into action and making measurable change where it matters most.",
      image: healthImg,
    },
  ];

  return (
    <section id="news" className="py-20 md:py-32 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">Latest News</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stay updated with our recent activities and community impact stories.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <Card key={index} className="overflow-hidden shadow-medium hover:shadow-strong transition-smooth group">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-muted-foreground mb-3">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">{article.date}</span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-smooth">
                  {article.title}
                </h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">{article.excerpt}</p>
                {article.fullContent ? (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="link" className="p-0 h-auto group/btn">
                        Read More
                        <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-2xl">{article.title}</DialogTitle>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span className="text-sm">{article.date}</span>
                        </div>
                      </DialogHeader>
                      <div className="mt-4">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-64 object-cover rounded-lg mb-6"
                        />
                        <div className="prose prose-sm max-w-none">
                          {article.fullContent.split('\n\n').map((paragraph, idx) => (
                            <p key={idx} className="text-muted-foreground leading-relaxed mb-4">
                              {paragraph}
                            </p>
                          ))}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <Button variant="link" className="p-0 h-auto group/btn">
                    Read More
                    <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default News;
