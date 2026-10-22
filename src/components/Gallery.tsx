import { useState } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import womenImg from "@/assets/women-empowerment-new.png";
import healthImg from "@/assets/health-outreach.jpg";
import environmentImg from "@/assets/tree-planting-mbale.png.asset.json";
import kurbanImg from "@/assets/gallery/kurban.png";
import childrenFeedingImg from "@/assets/gallery/children-feeding.webp";
import disabilitySupportImg from "@/assets/gallery/disability-support.webp";
import waterWellImg from "@/assets/gallery/water-well.webp";
import communityFeedingImg from "@/assets/gallery/community-feeding.jpg";
import foodPlatesImg from "@/assets/gallery/food-plates.jpg";
import communityMealImg from "@/assets/gallery/community-meal.jpg";
import waterCollectionImg from "@/assets/gallery/water-collection.jpg";
import kurbanMeatImg from "@/assets/gallery/kurban-meat.jpg";
import womenDistributionImg from "@/assets/gallery/women-distribution.jpg";
import schoolChildrenImg from "@/assets/gallery/school-children.jpg";
import childrenMassFeedingImg from "@/assets/gallery/children-mass-feeding.jpg";
import outdoorChildrenFeedingImg from "@/assets/gallery/outdoor-children-feeding.jpg";
import foodDistributionImg from "@/assets/gallery/food-distribution.jpg";
import waterWellInstallationImg from "@/assets/gallery/water-well-installation.png";
import waterWellConstructionImg from "@/assets/gallery/water-well-construction.png";
import ramadanChildrenFeedingImg from "@/assets/gallery/ramadan-children-feeding.png";
import boreholeConstructionImg from "@/assets/gallery/borehole-construction.png";
import schoolSuppliesImg from "@/assets/gallery/school-supplies-distribution.png";
import womenEmpowermentSuppliesImg from "@/assets/gallery/women-empowerment-supplies.png";
import communityIftarOutdoorImg from "@/assets/gallery/community-iftar-outdoor.png";
import ramadanIftarMealsImg from "@/assets/gallery/ramadan-iftar-meals.png";
import healthCheckupImg from "@/assets/gallery/health-checkup.png";
import foodPackageDistributionImg from "@/assets/gallery/food-package-distribution.png";
import orphanFoodSupportImg from "@/assets/gallery/orphan-food-support.png";
import blanketDistributionImg from "@/assets/gallery/blanket-distribution.png";
import maizeFlourDistributionImg from "@/assets/gallery/maize-flour-distribution.png";
import wheelchairSupportImg from "@/assets/gallery/wheelchair-support.png";
import familyFoodReliefImg from "@/assets/gallery/family-food-relief.png";
import motherBabyFoodAidImg from "@/assets/gallery/mother-baby-food-aid.png";
import womenFoodCollectionImg from "@/assets/gallery/women-food-collection.png";
import maizeFlourCloseupImg from "@/assets/gallery/maize-flour-closeup.png";
import childrenIftarMealImg from "@/assets/gallery/children-iftar-meal.jpg";
import elderlyWheelchairSupportImg from "@/assets/gallery/elderly-wheelchair-support.png";
import orphanFeedingProgramImg from "@/assets/gallery/orphan-feeding-program.png";
import foodDistributionBannerImg from "@/assets/gallery/food-distribution-banner.webp.asset.json";
import nabukwasiJaneWheelchairImg from "@/assets/gallery/nabukwasi-jane-wheelchair.webp.asset.json";
import waterwellCelebrationImg from "@/assets/gallery/waterwell-celebration.webp.asset.json";
import manafwaWheelchairImg from "@/assets/gallery/manafwa-wheelchair.webp.asset.json";
import namisindwaFoodPackagesImg from "@/assets/gallery/namisindwa-food-packages.jpg.asset.json";
import namisindwaPackageHandoverImg from "@/assets/gallery/namisindwa-package-handover.jpg.asset.json";
import childrenFeedingJuiceImg from "@/assets/gallery/children-feeding-juice.jpg.asset.json";
import wasswaKevinWheelchairImg from "@/assets/gallery/joyful-wheelchair-donation-namisindwa.png.asset.json";
import namisindwaWheelchairFoodImg from "@/assets/gallery/wheelchair-donation-namisindwa-food.png.asset.json";

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
  hidden: { opacity: 0, y: 0 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25 },
  },
};

const ParallaxImage = ({ src, alt, onClick }: { src: string; alt: string; onClick: () => void }) => (
  <button
    type="button"
    className="group block w-full text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
    onClick={onClick}
    aria-label={`Open photo: ${alt}`}
  >
    <img src={src} alt="" className="aspect-[4/3] w-full border border-border object-cover" loading="lazy" decoding="async" />
    <span className="mt-2 block border-l-2 border-secondary pl-3 text-sm leading-snug text-muted-foreground group-hover:text-foreground">{alt}</span>
  </button>
);

interface LightboxProps {
  images: { src: string; alt: string }[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

const Lightbox = ({ images, currentIndex, onClose, onPrev, onNext }: LightboxProps) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onClose();
    if (e.key === "ArrowLeft") onPrev();
    if (e.key === "ArrowRight") onNext();
  };

  // Handle swipe gestures
  const swipeThreshold = 50;
  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > swipeThreshold) {
      onPrev();
    } else if (info.offset.x < -swipeThreshold) {
      onNext();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
    >
      {/* Close button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 z-50 text-white hover:bg-white/20 h-12 w-12"
        aria-label="Close photo viewer"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        <X className="h-8 w-8" />
      </Button>

      {/* Previous button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20 h-14 w-14 hidden md:flex"
        aria-label="Previous photo"
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
      >
        <ChevronLeft className="h-10 w-10" />
      </Button>

      {/* Next button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20 h-14 w-14 hidden md:flex"
        aria-label="Next photo"
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
      >
        <ChevronRight className="h-10 w-10" />
      </Button>

      {/* Swipe hint for mobile */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-white/50 text-sm md:hidden">
        Swipe left or right to navigate
      </div>

      {/* Image container with swipe support */}
      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="max-w-[90vw] max-h-[85vh] select-none relative"
        onClick={(e) => e.stopPropagation()}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
      >
        <img
          src={images[currentIndex].src}
          alt={images[currentIndex].alt}
          className="max-w-full max-h-[75vh] object-contain pointer-events-none"
          draggable={false}
        />
        <p className="text-white text-center mt-4 text-lg font-medium">
          {images[currentIndex].alt}
        </p>
        <p className="text-white/60 text-center mt-1 text-sm">
          {currentIndex + 1} / {images.length}
        </p>
      </motion.div>
    </motion.div>
  );
};

const Gallery = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [
    { src: womenImg, alt: "Women empowerment program" },
    { src: healthImg, alt: "Health outreach and medical care" },
    { src: environmentImg.url, alt: "Volunteers planting tree saplings along a roadside in Mbale" },
    { src: kurbanImg, alt: "Qurban meat distribution program" },
    { src: childrenFeedingImg, alt: "Children enjoying nutritious meals" },
    { src: disabilitySupportImg, alt: "Supporting persons with disabilities" },
    { src: waterWellImg, alt: "Clean water access for children" },
    { src: communityFeedingImg, alt: "Community feeding program" },
    { src: foodPlatesImg, alt: "Prepared meals for community distribution" },
    { src: communityMealImg, alt: "Families sharing a community meal" },
    { src: waterCollectionImg, alt: "Water collection in rural areas" },
    { src: kurbanMeatImg, alt: "Kurban meat preparation for distribution" },
    { src: womenDistributionImg, alt: "Women receiving food packages" },
    { src: schoolChildrenImg, alt: "School children in education program" },
    { src: childrenMassFeedingImg, alt: "Children mass feeding program" },
    { src: outdoorChildrenFeedingImg, alt: "Outdoor children feeding event" },
    { src: foodDistributionImg, alt: "Food distribution to children" },
    { src: waterWellInstallationImg, alt: "Water well installation project" },
    { src: waterWellConstructionImg, alt: "Water well construction by volunteers" },
    { src: ramadanChildrenFeedingImg, alt: "Ramadan iftar feeding for children in Uganda" },
    { src: boreholeConstructionImg, alt: "Borehole construction bringing clean water to communities" },
    { src: schoolSuppliesImg, alt: "School supplies and essentials distribution to orphans" },
    { src: womenEmpowermentSuppliesImg, alt: "Women empowerment essentials and hygiene supplies distribution" },
    { src: communityIftarOutdoorImg, alt: "Community outdoor iftar gathering during Ramadan" },
    { src: ramadanIftarMealsImg, alt: "Ramadan iftar meals served to families in need" },
    { src: healthCheckupImg, alt: "Free health checkup and blood pressure screening outreach" },
    { src: foodPackageDistributionImg, alt: "Food package distribution to vulnerable families" },
    { src: orphanFoodSupportImg, alt: "Orphan support through food and essential supplies" },
    { src: blanketDistributionImg, alt: "Blanket and bedding distribution to vulnerable families" },
    { src: maizeFlourDistributionImg, alt: "Maize flour and food staples distribution event" },
    { src: wheelchairSupportImg, alt: "Wheelchair and mobility support for persons with disabilities" },
    { src: familyFoodReliefImg, alt: "Families celebrating food relief packages received" },
    { src: motherBabyFoodAidImg, alt: "Mother and baby receiving food aid and essentials" },
    { src: womenFoodCollectionImg, alt: "Women collecting food packages at community distribution" },
    { src: maizeFlourCloseupImg, alt: "Fortified maize flour ready for community distribution" },
    { src: childrenIftarMealImg, alt: "Children sharing an iftar meal during Ramadan" },
    { src: elderlyWheelchairSupportImg, alt: "Elderly woman receiving wheelchair and care support" },
    { src: orphanFeedingProgramImg, alt: "Orphan feeding program providing meals to children" },
    { src: wasswaKevinWheelchairImg.url, alt: "Boy smiling in his new wheelchair in Namisindwa District" },
    { src: namisindwaWheelchairFoodImg.url, alt: "Family with a donated wheelchair and food support in Namisindwa District" },
    { src: nabukwasiJaneWheelchairImg.url, alt: "Elderly woman waving from her new wheelchair in Namisindwa District" },
    { src: manafwaWheelchairImg.url, alt: "Wheelchair handover to an elderly man in Manafwa District" },
    { src: foodDistributionBannerImg.url, alt: "Women carrying food packages at a community distribution" },
    { src: namisindwaFoodPackagesImg.url, alt: "Food relief packages laid out for community distribution" },
    { src: namisindwaPackageHandoverImg.url, alt: "Community members celebrating as food packages are handed over" },
    { src: waterwellCelebrationImg.url, alt: "Children playing at the inauguration of a new community water well" },
    { src: childrenFeedingJuiceImg.url, alt: "Children holding juice cups during a community feeding program" },
  ];

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const goToPrev = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <section id="gallery" className="py-20 md:py-32 bg-background">
        <div className="container mx-auto px-6">
          <motion.div
            className="mb-10 max-w-2xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl md:text-5xl font-semibold text-foreground mb-4">Photos from the field</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Photographs from food distributions, health outreach, water projects, education, and mobility support in Mbale and surrounding districts.
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
                <ParallaxImage 
                  src={image.src} 
                  alt={image.alt} 
                  onClick={() => openLightbox(index)}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <Lightbox
            images={images}
            currentIndex={currentImageIndex}
            onClose={closeLightbox}
            onPrev={goToPrev}
            onNext={goToNext}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Gallery;
