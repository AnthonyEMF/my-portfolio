import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "./Button";
import { cn } from "../../lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const Carousel = ({ images }: { images: string[] }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const total = images.length;
  const canScrollPrev = selectedIndex > 0;
  const canScrollNext = selectedIndex < total - 1;

  const goTo = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: track.offsetWidth * index, behavior: "smooth" });
    // No seteamos selectedIndex aquí — lo hace el IntersectionObserver
    // cuando el slide realmente llega a ser visible (igual que Embla "select")
  }, []);

  const scrollPrev = useCallback(() => goTo(selectedIndex - 1), [selectedIndex, goTo]);
  const scrollNext = useCallback(() => goTo(selectedIndex + 1), [selectedIndex, goTo]);

  // IntersectionObserver: se dispara UNA sola vez cuando el slide
  useEffect(() => {
    const slides = slideRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!slides.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = slides.indexOf(entry.target as HTMLDivElement);
            if (idx !== -1) setSelectedIndex(idx);
          }
        });
      },
      { root: trackRef.current, threshold: 0.5 }
    );

    slides.forEach((slide) => observer.observe(slide));
    return () => observer.disconnect();
  }, [total]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") scrollPrev();
      if (e.key === "ArrowRight") scrollNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [scrollPrev, scrollNext]);

  return (
    <div className="space-y-4">
      <style>{`
        .carousel-no-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
        .carousel-no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Main viewport */}
      <div className="relative">
        <div
          ref={trackRef}
          className="carousel-no-scrollbar rounded-lg border-2 border-secondary-gray"
          style={{
            display: "flex",
            overflowX: "scroll",
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
            willChange: "scroll-position",
          }}
        >
          {images.map((image, index) => (
            <div
              key={index}
              ref={(el) => { slideRefs.current[index] = el; }}
              style={{
                flex: "0 0 100%",
                scrollSnapAlign: "start",
                scrollSnapStop: "always",
              }}
            >
              <div className="aspect-video">
                <img
                  src={image}
                  alt={`Slide ${index + 1}`}
                  className="h-auto w-auto object-cover"
                  loading={index === 0 ? "eager" : "lazy"}
                  decoding="async"
                />
              </div>
            </div>
          ))}
        </div>

        <Button
          variant="secondary"
          size="icon"
          className={cn(
            "absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-primary-gray/80 shadow-lg hover:bg-primary-gray",
            !canScrollPrev && "opacity-50 cursor-not-allowed"
          )}
          onClick={scrollPrev}
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
          onClick={scrollNext}
        >
          <ChevronRight className="size-3 lg:size-5" />
        </Button>

        {/* Slide counter */}
        <div className="absolute bottom-3 right-3 pointer-events-none bg-primary-gray/80 rounded-full px-2.5 py-0.5">
          <span className="text-xs font-semibold text-white tabular-nums">
            {selectedIndex + 1}
            <span className="text-tertiary-gray mx-1">/</span>
            {total}
          </span>
        </div>
      </div>

      {/* Thumbnails */}
      <div className="carousel-no-scrollbar flex gap-2 overflow-auto pb-2">
        {images.map((image, index) => (
          <button
            key={index}
            className={cn(
              "relative flex-0 min-w-25 cursor-pointer overflow-hidden rounded-md border-2 transition-all",
              selectedIndex === index
                ? "border-secondary-gray"
                : "border-transparent opacity-70 hover:opacity-100"
            )}
            onClick={() => goTo(index)}
          >
            <div className="aspect-video w-25">
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="h-auto w-auto object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};