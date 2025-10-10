import { Calendar, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import educationImg from "@/assets/education-program.jpg";
import womenImg from "@/assets/women-empowerment.jpg";
import healthImg from "@/assets/health-outreach.jpg";

const News = () => {
  const articles = [
    {
      title: "200 Students Receive Scholarships",
      date: "March 15, 2025",
      excerpt: "We're proud to announce that 200 students from vulnerable families have received full scholarships for the upcoming academic year, ensuring access to quality education.",
      image: educationImg,
    },
    {
      title: "Women's Cooperative Launches Successfully",
      date: "March 8, 2025",
      excerpt: "Our women empowerment program has helped establish a thriving cooperative, providing 50 women with sustainable income through craft production and marketing.",
      image: womenImg,
    },
    {
      title: "Community Health Camp Serves 500 Families",
      date: "February 28, 2025",
      excerpt: "Last month's health outreach program provided free medical checkups, medications, and health education to over 500 families in rural communities.",
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
                <Button variant="link" className="p-0 h-auto group/btn">
                  Read More
                  <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default News;
