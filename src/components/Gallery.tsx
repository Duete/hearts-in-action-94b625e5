import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import educationImg from "@/assets/education-program.jpg";
import womenImg from "@/assets/women-empowerment-new.png";
import healthImg from "@/assets/health-outreach.jpg";
import environmentImg from "@/assets/environment-program.jpg";
import heroImg from "@/assets/hero-community.jpg";
import kurbanImg from "@/assets/gallery/kurban.png";
import childrenFeedingImg from "@/assets/gallery/children-feeding.webp";
import disabilitySupportImg from "@/assets/gallery/disability-support.webp";
import waterWellImg from "@/assets/gallery/water-well.webp";
import communityFeedingImg from "@/assets/gallery/community-feeding.jpg";

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
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5 },
  },
};

const ParallaxImage = ({ src, alt }: { src: string; alt: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  // Prevent right-click context menu
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  // Prevent drag
  const handleDragStart = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div 
      ref={ref} 
      className="relative overflow-hidden rounded-lg shadow-medium hover:shadow-strong transition-smooth group aspect-[4/3] select-none"
      onContextMenu={handleContextMenu}
    >
      <motion.img
        src={src}
        alt={alt}
        className="w-full h-[120%] object-cover group-hover:scale-105 transition-smooth pointer-events-none"
        style={{ y }}
        draggable={false}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-smooth flex items-end p-6">
        <p className="text-primary-foreground font-medium">{alt}</p>
      </div>
      {/* Invisible overlay to prevent direct image interaction */}
      <div className="absolute inset-0 z-10" onContextMenu={handleContextMenu} />
    </div>
  );
};

const Gallery = () => {
  const images = [
    { src: heroImg, alt: "Community gathering and unity" },
    { src: educationImg, alt: "Children in classroom learning" },
    { src: womenImg, alt: "Women empowerment program" },
    { src: healthImg, alt: "Health outreach and medical care" },
    { src: environmentImg, alt: "Environmental conservation activities" },
    { src: kurbanImg, alt: "Qurban meat distribution program" },
    { src: childrenFeedingImg, alt: "Children enjoying nutritious meals" },
    { src: disabilitySupportImg, alt: "Supporting persons with disabilities" },
    { src: waterWellImg, alt: "Clean water access for children" },
    { src: communityFeedingImg, alt: "Community feeding program" },
  ];

  return (
    <section id="gallery" className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">Gallery</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Capturing moments of transformation and hope in our community.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {images.map((image, index) => (
            <motion.div key={index} variants={itemVariants}>
              <ParallaxImage src={image.src} alt={image.alt} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Gallery;
