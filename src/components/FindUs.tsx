import { ExternalLink, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const directionsUrl = "https://maps.app.goo.gl/AALiKMYTYQHwptsS9";
const mapEmbedUrl = "https://maps.google.com/maps?q=1.0797455,34.1546022&z=17&hl=en&output=embed";

const FindUs = () => (
  <section id="find-us" className="scroll-mt-24 bg-muted/70 py-16 md:py-20" aria-labelledby="find-us-title">
    <div className="container mx-auto grid max-w-6xl items-center gap-10 px-6 md:grid-cols-2 md:gap-12">
      <div>
        <div className="mb-5 flex h-[58px] w-[58px] items-center justify-center rounded-full bg-primary text-primary-foreground shadow-soft">
          <MapPin className="h-7 w-7" aria-hidden="true" />
        </div>
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.16em] text-primary">Visit Us</p>
        <h2 id="find-us-title" className="mb-4 text-3xl font-extrabold text-foreground md:text-4xl">
          Find Us in Mbale
        </h2>
        <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
          We would love to meet you. Visit our office in Mbale, Uganda, or get directions straight to our door.
        </p>
        <p className="mt-5 font-bold text-primary">Mbale, Uganda</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Open Monday–Saturday · Please call ahead before visiting.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
          <Button asChild className="gap-2">
            <a href={directionsUrl} target="_blank" rel="noopener noreferrer">
              Get Directions <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          </Button>
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            <MapPin className="h-4 w-4" aria-hidden="true" />
            View on Google Maps
          </a>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border-4 border-background bg-muted shadow-soft">
        <iframe
          title="Map showing the location of Global Hearts Community in Mbale, Uganda"
          src={mapEmbedUrl}
          className="block h-[280px] w-full border-0 sm:h-[340px]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    </div>
  </section>
);

export default FindUs;
