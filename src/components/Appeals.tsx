import { Droplets, Heart, Moon, Building, BookOpen, TreePine } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const Appeals = () => {
  const appealCategories = [
    {
      title: "Provide Safe Water",
      icon: Droplets,
      appeals: [
        {
          name: "Waterwell Construction",
          description: "Improve access to clean water in rural areas by drilling boreholes, protecting springs & gravity flow.",
          amount: "$1,100",
        },
        {
          name: "Water Well Repair",
          description: "Restore access to clean water by helping us repair broken wells. Your support brings safe water back to communities in need.",
          amount: "$300",
        },
        {
          name: "Community Wells",
          description: "Support the digging of community wells to provide safe, reliable water for entire villages.",
          amount: "$2,500",
        },
      ],
    },
    {
      title: "Support Our Children",
      icon: Heart,
      appeals: [
        {
          name: "Orphan Sponsorship",
          description: "We offer psychological support, home based care & sponsorships for vulnerable children and the elderly.",
          amount: "$500",
        },
        {
          name: "Birthdays",
          description: "Make a child's birthday special by donating to support vulnerable children. Your gift brings joy, meals, and hope.",
          amount: "$50",
        },
        {
          name: "Wheelchair Support",
          description: "Help provide wheelchairs to people with disabilities, giving them mobility and independence.",
          amount: "$300",
        },
      ],
    },
    {
      title: "Religious Giving",
      icon: Moon,
      appeals: [
        {
          name: "Ramadan",
          description: "Support our efforts to provide food, iftar meals, and essential aid to vulnerable families during Ramadan.",
          amount: "Any Amount",
        },
        {
          name: "Zakat",
          description: "Fulfill your Zakat and uplift those in need. Your contribution supports the poor, orphans, and vulnerable families.",
          amount: "Any Amount",
        },
        {
          name: "Kurban",
          description: "Sadaka, Akika, shifa, shukuru, bajram/Eid Adha and Adaka kurban.",
          amount: "Cow $350 | Goat $75 | Sheep $80",
        },
      ],
    },
    {
      title: "Build Mosques & Shelters",
      icon: Building,
      appeals: [
        {
          name: "Construction of Mosques",
          description: "Erecting new mosques to ensure these spaces inspire peace and connection in the community.",
          amount: "$15,000",
        },
        {
          name: "Renovation of Mosques",
          description: "Help renovate worn and aging mosques to restore them as clean, safe, and welcoming places of worship.",
          amount: "$5,000",
        },
        {
          name: "Shelters",
          description: "Provide safe and dignified shelter for vulnerable families in need of a secure home.",
          amount: "$3,500",
        },
      ],
    },
    {
      title: "Education",
      icon: BookOpen,
      appeals: [
        {
          name: "Quran Distribution",
          description: "Help spread the light of the Quran by donating copies to those eager to learn and connect with their faith.",
          amount: "$5 per copy",
        },
        {
          name: "Madarasa Support",
          description: "Support Islamic education by funding teachers, materials, and facilities for madarasa students.",
          amount: "$3 - $5",
        },
      ],
    },
    {
      title: "Other Appeals",
      icon: TreePine,
      appeals: [
        {
          name: "Tree Planting",
          description: "Plant trees to combat climate change, restore ecosystems, and provide shade and fruit for communities.",
          amount: "$5 per tree",
        },
        {
          name: "Healthcare Assistance",
          description: "Support medical care, treatments, and health services for those who cannot afford them.",
          amount: "$200 - $500",
        },
        {
          name: "Emergency Relief",
          description: "Provide immediate aid during crises, including food, shelter, and medical supplies.",
          amount: "Any Amount",
        },
      ],
    },
  ];

  const scrollToContact = () => {
    const element = document.querySelector("#contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
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

  const categoryVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const,
      },
    },
  };

  const cardContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <section id="appeals" className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">Appeals</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your generous donations help us deliver life-changing programs. Choose an appeal that resonates with your heart.
          </p>
        </motion.div>

        <div className="space-y-16">
          {appealCategories.map((category, catIndex) => (
            <motion.div 
              key={catIndex}
              variants={categoryVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center">
                  <category.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-foreground">{category.title}</h3>
              </div>

              <motion.div 
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={cardContainerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
              >
                {category.appeals.map((appeal, appealIndex) => (
                  <motion.div key={appealIndex} variants={cardVariants}>
                    <Card className="shadow-medium hover:shadow-strong transition-smooth group overflow-hidden h-full">
                      <CardContent className="p-6 flex flex-col h-full">
                        <h4 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                          {appeal.name}
                        </h4>
                        <p className="text-muted-foreground mb-4 leading-relaxed text-sm flex-grow">
                          {appeal.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-primary">{appeal.amount}</span>
                          <Button variant="hero" size="sm" onClick={scrollToContact}>
                            Donate
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="text-center mt-16"
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
          <Button variant="hero" size="xl" onClick={scrollToContact} className="shadow-medium">
            Donate Now
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default Appeals;