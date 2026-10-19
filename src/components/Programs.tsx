import { GraduationCap, Users, Heart, Trees, Droplets, HeartHandshake, Accessibility, ShoppingBasket } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import educationImg from "@/assets/education-classroom.jpg";
import womenImg from "@/assets/women-empowerment-new.png";
import healthImg from "@/assets/health-outreach.jpg";
import environmentImg from "@/assets/environment-program.jpg";
import waterImg from "@/assets/water_well.webp";
import elderlyImg from "@/assets/elderly-care.jpg";
import disabilityImg from "@/assets/pwds.webp";
import foodImg from "@/assets/lame_being_fed.webp";
import watermarkImg from "@/assets/watermark.png";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Programs = () => {
  const programs = [
    {
      icon: GraduationCap,
      title: "Education Support",
      description: "Providing scholarships, school supplies, and tutoring to ensure every child has access to quality education and the opportunity to build a brighter future.",
      image: educationImg,
      color: "primary",
    },
    {
      icon: Users,
      title: "Women Empowerment",
      description: "Skills training, microfinance support, and leadership development programs that enable women to achieve economic independence and community influence.",
      image: womenImg,
      color: "secondary",
    },
    {
      icon: Heart,
      title: "Health Outreach",
      description: "Medical camps, health education, maternal care support, HIV/AIDS awareness, and disease prevention programs to improve community health and wellbeing.",
      image: healthImg,
      color: "accent",
    },
    {
      icon: Trees,
      title: "Environmental Conservation",
      description: "Tree planting initiatives, sustainable farming practices, and environmental education to protect our natural resources for future generations.",
      image: environmentImg,
      color: "primary",
    },
    {
      icon: Droplets,
      title: "Water & Sanitation",
      description: "Drilling boreholes, protecting water sources, and promoting hygiene practices to ensure clean water access and improved sanitation for all community members.",
      image: waterImg,
      color: "secondary",
    },
    {
      icon: HeartHandshake,
      title: "Elderly & Vulnerable Support",
      description: "Providing care, social support, and essential resources to elderly persons, widows, orphans, and displaced individuals in our community.",
      image: elderlyImg,
      color: "accent",
    },
    {
      icon: Accessibility,
      title: "Disability Inclusion",
      description: "Supporting persons with disabilities through accessibility programs, skills training, and advocacy to ensure full participation in community life.",
      image: disabilityImg,
      color: "primary",
    },
    {
      icon: ShoppingBasket,
      title: "Food Security",
      description: "Distributing food packages to vulnerable families, promoting small-scale agriculture, and providing nutrition education to combat hunger and malnutrition.",
      image: foodImg,
      color: "secondary",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const,
      },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <section id="programs" className="py-16 md:py-20 bg-background scroll-mt-24">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div 
          className="text-center mb-10"
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <p className="text-sm font-bold text-primary mb-3">WHAT WE DO</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Programs</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Eight practical pathways to dignity, health and opportunity for vulnerable communities in Mbale.
          </p>
        </motion.div>

        <motion.div 
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {programs.map((program, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="overflow-hidden shadow-medium hover:shadow-strong transition-smooth group h-full">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={program.image}
                    alt={program.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
                    loading="lazy"
                    draggable={false}
                  />
                  {/* Centered Watermark */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                    <img 
                      src={watermarkImg} 
                      alt="" 
                      className="w-16 h-16 object-contain opacity-40 pointer-events-none"
                      draggable={false}
                    />
                  </div>
                </div>
                <CardContent className="p-5">
                  <div className="flex items-start gap-2 mb-3">
                    <program.icon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <h3 className="text-lg font-bold text-primary leading-snug">{program.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{program.description}</p>
                  <Button variant="link" asChild className="px-0 mt-3 font-semibold"><Link to="/get-involved">Support this program<ArrowRight /></Link></Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Programs;