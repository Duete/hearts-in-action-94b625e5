import educationImg from "@/assets/education-program.jpg";
import womenImg from "@/assets/women-empowerment.jpg";
import healthImg from "@/assets/health-outreach.jpg";
import environmentImg from "@/assets/environment-program.jpg";
import heroImg from "@/assets/hero-community.jpg";

const Gallery = () => {
  const images = [
    { src: heroImg, alt: "Community gathering and unity" },
    { src: educationImg, alt: "Children in classroom learning" },
    { src: womenImg, alt: "Women empowerment program" },
    { src: healthImg, alt: "Health outreach and medical care" },
    { src: environmentImg, alt: "Environmental conservation activities" },
  ];

  return (
    <section id="gallery" className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">Gallery</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Capturing moments of transformation and hope in our community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-lg shadow-medium hover:shadow-strong transition-smooth group aspect-[4/3]"
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-smooth flex items-end p-6">
                <p className="text-primary-foreground font-medium">{image.alt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
