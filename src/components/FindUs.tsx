import { ExternalLink, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const directionsUrl = "https://maps.app.goo.gl/AALiKMYTYQHwptsS9";
const mapEmbedUrl = "https://maps.google.com/maps?q=1.0797455,34.1546022&z=17&hl=en&output=embed";

const FindUs = () => (
  <section id="find-us" className="scroll-mt-24 bg-muted/70 py-10 md:py-12" aria-labelledby="find-us-title">
    <div className="container mx-auto grid max-w-5xl items-center gap-8 px-6 md:grid-cols-[0.9fr_1.1fr] md:gap-10">
      <div>
        <p className="mb-2 text-sm font-bold uppercase tracking-[0.16em] text-primary">Local office</p>
        <h2 id="find-us-title" className="mb-3 text-3xl font-semibold text-foreground md:text-4xl">
          Visit the Mbale team
        </h2>
        <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
          Global Hearts Community is based in Mbale, Uganda. The map pin shows the office area; call ahead before visiting.
        </p>
        <p className="mt-4 inline-flex items-center gap-2 font-semibold text-primary"><MapPin className="h-4 w-4" aria-hidden="true" />Mbale City, Uganda</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Open Monday–Saturday · Please call ahead before visiting.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-3">
          <Button asChild size="sm" className="gap-2">
            <a href={directionsUrl} target="_blank" rel="noopener noreferrer">
              Open map pin <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          </Button>
        </div>
      </div>

      <div className="overflow-hidden border border-border bg-muted">
        <iframe
          title="Map showing the location of Global Hearts Community in Mbale, Uganda"
          src={mapEmbedUrl}
          className="block h-[220px] w-full border-0 sm:h-[280px]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    </div>
  </section>
);

export default FindUs;
