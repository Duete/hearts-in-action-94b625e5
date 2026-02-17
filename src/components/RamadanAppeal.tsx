import { motion } from "framer-motion";
import { Heart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ramadanAppealImg from "@/assets/ramadan-appeal.png";
import ramadanIftarImg from "@/assets/ramadan-iftar.png";
import ramadanMealsImg from "@/assets/ramadan-meals.png";

const mealOptions = [
  { meals: "1 Iftar Meal", price: "£5" },
  { meals: "7 Iftar Meals", price: "£25" },
  { meals: "13 Iftar Meals", price: "£50" },
  { meals: "30 Iftar Meals", price: "£125" },
];

const RamadanAppeal = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 text-primary font-semibold text-sm uppercase tracking-wider mb-4">
            <Heart className="h-4 w-4" /> Ramadan Appeal
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
            Feed the Soul, Reap the Rewards
          </h2>
          <p className="text-lg md:text-xl text-primary font-medium">
            This Ramadan, your generosity can be the reason someone's fast is fulfilled.
          </p>
        </motion.div>

        {/* Image Gallery Row */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {[
            { src: ramadanAppealImg, alt: "Ramadan appeal community gathering in Uganda" },
            { src: ramadanIftarImg, alt: "Community iftar meal during Ramadan" },
            { src: ramadanMealsImg, alt: "Prepared iftar meals for distribution" },
          ].map((img, i) => (
            <div key={i} className="rounded-xl overflow-hidden shadow-medium aspect-[4/3]">
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </motion.div>

        {/* Body Content */}
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="bg-card rounded-2xl shadow-strong p-8 md:p-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="space-y-5 text-muted-foreground leading-relaxed mb-8">
              <p>
                As the crescent moon is sighted, we welcome a season of mercy, forgiveness, and immense reward. 
                Ramadan is not just about abstaining from food and drink; it is about purifying our wealth and our hearts.
              </p>
              <p>
                Yet, for millions of our brothers and sisters around the world, the fast is a struggle against hunger, 
                not a choice. This month, let your charity be the bridge between their hardship and their iftar.
              </p>
            </div>

            {/* Hadith Quote */}
            <div className="border-l-4 border-primary bg-primary/5 rounded-r-lg p-6 mb-8">
              <p className="text-foreground italic text-lg leading-relaxed mb-2">
                "Whoever feeds a person breaking his fast will have the same reward as him, without anything being 
                deducted from the reward of the fasting person."
              </p>
              <p className="text-sm text-muted-foreground font-medium">— (Tirmidhi)</p>
            </div>

            {/* Meal Options */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              {mealOptions.map((option) => (
                <div
                  key={option.meals}
                  className="bg-muted rounded-xl p-4 text-center hover:bg-primary/10 transition-colors"
                >
                  <p className="text-2xl font-bold text-primary mb-1">{option.price}</p>
                  <p className="text-sm text-muted-foreground">{option.meals}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <p className="text-foreground font-medium text-center mb-6">
              Double your reward this Ramadan. Donate now to provide a hot meal to those in need.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="xl" asChild className="group">
                <Link to="/donate">
                  Give a Meal
                  <Heart className="ml-2 group-hover:scale-110 transition-transform" />
                </Link>
              </Button>
              <Button variant="warm" size="xl" asChild className="group">
                <Link to="/donate">
                  Donate Now
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default RamadanAppeal;
