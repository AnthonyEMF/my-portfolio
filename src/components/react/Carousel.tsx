import useEmblaCarousel from "embla-carousel-react";
import { useEffect, useState } from "react";
import { Button } from "./Button";
import { cn } from "../../lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const Carousel = ({ images }: { images: string[] }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    if (emblaApi) {
      emblaApi.on("select", () => {
        setSelectedIndex(emblaApi.selectedScrollSnap());
        setCanScrollPrev(emblaApi.canScrollPrev());
        setCanScrollNext(emblaApi.canScrollNext());
      });

      // Initial state
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    }
  }, [emblaApi]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <div ref={emblaRef} className="overflow-hidden rounded-lg">
          <div className="flex">
            {images.map((image, index) => (
              <div className="relative flex-[0_0_100%]" key={index}>
                <div className="aspect-video">
                  <img
                    src={image}
                    alt={`Slide ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <Button
          variant="secondary"
          size="icon"
          className={cn(
            "absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-primary-gray/80 shadow-lg hover:bg-primary-gray",
            !canScrollPrev && "opacity-50 cursor-not-allowed"
          )}
          onClick={() => emblaApi?.scrollPrev()}
          //disabled={!canScrollPrev}
        >
          <ChevronLeft className="size-3 lg:size-5" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className={cn(
            "absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-primary-gray/80 shadow-lg hover:bg-primary-gray",
            !canScrollNext && "opacity-50 cursor-not-allowed"
          )}
          onClick={() => emblaApi?.scrollNext()}
          //disabled={!canScrollNext}
        >
          <ChevronRight className="size-3 lg:size-5" />
        </Button>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 overflow-auto pb-2">
        {images.map((image, index) => (
          <button
            key={index}
            className={cn(
              "relative flex-0 min-w-[100px] cursor-pointer overflow-hidden rounded-md border-2 transition-all",
              selectedIndex === index
                ? "border-secondary-gray"
                : "border-transparent opacity-70 hover:opacity-100"
            )}
            onClick={() => emblaApi?.scrollTo(index)}
          >
            <div className="aspect-video w-[100px]">
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
