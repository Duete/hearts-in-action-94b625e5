import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Heart, Users, Home, Droplets, BookOpen, Apple } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import heroImg from "@/assets/hero-community.jpg";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

const Impact = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: headerRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  const impactStats = [
    { icon: BookOpen, value: "75+", label: "Students Supported", description: "Children receiving educational support" },
    { icon: Apple, value: "1000+", label: "Meals Provided", description: "Nutritious meals distributed to families in need" },
    { icon: Heart, value: "30+", label: "Volunteers", description: "Dedicated volunteers making a difference" },
  ];

  const successStories = [
    {
      title: "Clean Water for Namatala",
      description: "In 2023, we completed a borehole project that now provides clean water to over 500 families in Namatala village. Before this project, women and children walked over 3 kilometers daily to fetch water.",
      impact: "500 families now have access to clean water",
    },
    {
      title: "School Sponsorship Program",
      description: "Our education initiative has enabled 150 orphaned and vulnerable children to attend school. Many of these children have gone on to complete secondary education and pursue vocational training.",
      impact: "90% completion rate for sponsored students",
    },
    {
      title: "Women's Empowerment Groups",
      description: "We've established 8 women's savings groups across Mbale district. These groups provide microloans and business training, enabling women to start small enterprises and support their families.",
      impact: "120 women-owned businesses launched",
    },
  ];

  return (
    <section className="bg-background">
      {/* Impact Header with Parallax */}
      <div
        ref={headerRef}
        className="relative h-[300px] flex items-center justify-center overflow-hidden"
      >
        <motion.div 
          className="absolute inset-0 w-full h-[140%] bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${heroImg})`,
            y: bgY
          }}
        >
          <div className="absolute inset-0 bg-foreground/60"></div>
        </motion.div>
        <motion.div
          className="relative z-10 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h1 className="text-6xl md:text-8xl font-bold text-secondary mb-4">OUR IMPACT</h1>
        </motion.div>
      </div>

      {/* Impact Stats */}
      <div className="container mx-auto px-4 py-16">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Making a Measurable Difference
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Every donation, every volunteer hour, and every partnership contributes to lasting change in the communities we serve.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {impactStats.map((stat, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="shadow-medium h-full text-center hover:shadow-strong transition-all duration-300">
                <CardContent className="p-6">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</h3>
                  <p className="font-semibold text-foreground mb-2">{stat.label}</p>
                  <p className="text-sm text-muted-foreground">{stat.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Success Stories */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
            Stories of Change
          </h2>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {successStories.map((story, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="shadow-medium h-full border-t-4 border-t-secondary">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-foreground mb-4">{story.title}</h3>
                    <p className="text-muted-foreground mb-4">{story.description}</p>
                    <div className="bg-secondary/10 p-4 rounded-lg">
                      <p className="text-sm font-semibold text-secondary">{story.impact}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center bg-primary/5 rounded-2xl p-8 md:p-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Be Part of Our Impact Story
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            Your support helps us continue this vital work. Together, we can create lasting change for communities in need.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Impact;
