import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel';
import PhoneOutline from '@/components/ui/PhoneOutline';
import { useCallback, useState } from "react";

const adExamples = [
  { src: "/assets/alt-pop-example.gif", alt: "Alternative Pop Campaign" },
  { src: "/assets/electronic-example.gif", alt: "Electronic Music Campaign" },
  { src: "/assets/indie-pop-example.gif", alt: "Indie Pop Campaign" },
];

const AdExamples = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaApi, setEmblaApi] = useState<CarouselApi | null>(null);

  const onSelect = useCallback((api: CarouselApi) => {
    setSelectedIndex(api.selectedScrollSnap());
  }, []);

  return (
  <section className="py-16 bg-gradient-to-br from-musinova-lightyellow to-musinova-lightgreen text-musinova-darkgray">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-musinova-darkgray mb-4">
          Our Ad Campaigns in Action
        </h2>
        <p className="text-center text-musinova-darkgray mb-12 max-w-2xl mx-auto">
          See examples of Meta campaigns we've created for artists just like you.
        </p>

        <div className="max-w-6xl mx-auto relative">
          <Carousel
            className="w-full"
            setApi={api => {
              setEmblaApi(api);
              if (api) api.on("select", () => onSelect(api));
            }}
            opts={{
              axis: "x",
              slidesToScroll: 1,
              containScroll: "trimSnaps",
              loop: false,
            }}
          >
            <CarouselContent>
              {adExamples.map((ad, idx) => (
                <CarouselItem
                  key={ad.alt}
                  className={`transition-all duration-300 flex justify-center items-center
    ${idx === selectedIndex
                      ? "z-10"
                      : "z-0 opacity-60"
                    }
  `}
                  style={{
                    pointerEvents: idx === selectedIndex ? "auto" : "none",
                  }}
                >
                  <div className="relative aspect-[9/16] w-[220px] md:w-[320px] flex items-center justify-center">
                    {idx === selectedIndex && (
                      <PhoneOutline />
                    )}
                    <img
                      src={ad.src}
                      alt={ad.alt}
                      className="absolute inset-0 w-full h-full object-cover rounded-3xl shadow-lg"
                      style={{ zIndex: 0 }}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default AdExamples;