import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "./Button";
import { cn } from "../../lib/utils";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";

export const Carousel = ({ images, title }: { images: string[]; title?: string }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);

  const total = images.length;
  const canScrollPrev = selectedIndex > 0;
  const canScrollNext = selectedIndex < total - 1;

  const goTo = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(total - 1, index));
    track.scrollTo({ left: track.offsetWidth * clamped, behavior: "smooth" });
  }, [total]);

  const scrollPrev = useCallback(() => goTo(selectedIndex - 1), [selectedIndex, goTo]);
  const scrollNext = useCallback(() => goTo(selectedIndex + 1), [selectedIndex, goTo]);

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
      { root: trackRef.current, threshold: 0.55 }
    );
    slides.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [total]);

  useEffect(() => {
    setProgress(((selectedIndex + 1) / total) * 100);
  }, [selectedIndex, total]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lightbox !== null) {
        if (e.key === "Escape") setLightbox(null);
        if (e.key === "ArrowLeft") setLightbox((v) => (v === null ? v : Math.max(0, v - 1)));
        if (e.key === "ArrowRight") setLightbox((v) => (v === null ? v : Math.min(total - 1, (v as number) + 1)));
        return;
      }
      if (e.key === "ArrowLeft") scrollPrev();
      if (e.key === "ArrowRight") scrollNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [scrollPrev, scrollNext, lightbox, total]);

  useEffect(() => {
    if (lightbox !== null) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [lightbox]);

  // drag to scroll
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const onPointerDown = (e: React.PointerEvent) => {
    isDown.current = true;
    startX.current = e.pageX - (trackRef.current?.offsetLeft || 0);
    scrollLeft.current = trackRef.current?.scrollLeft || 0;
    (trackRef.current as any)?.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDown.current || !trackRef.current) return;
    e.preventDefault();
    const x = e.pageX - trackRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.2;
    trackRef.current.scrollLeft = scrollLeft.current - walk;
  };
  const onPointerUp = () => { isDown.current = false; };

  return (
    <div className="space-y-3">
      <style>{`
        .carousel-no-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
        .carousel-no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>

      <div className="relative group/carousel overflow-hidden rounded-[16px] border border-white/10 bg-black/20 backdrop-blur-md shadow-glass">
        {/* Track */}
        <div
          ref={trackRef}
          className="carousel-no-scrollbar flex overflow-x-scroll touch-pan-y select-none"
          style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        >
          {images.map((image, index) => (
            <div
              key={index}
              ref={(el) => { slideRefs.current[index] = el; }}
              className="relative shrink-0 w-full"
              style={{ scrollSnapAlign: "start", scrollSnapStop: "always" }}
            >
              <div className="aspect-[16/9] overflow-hidden bg-black">
                <img
                  src={image}
                  alt={`${title || "Proyecto"} - ${index + 1}`}
                  className="h-full w-full object-cover transition duration-700 group-hover/carousel:scale-[1.02]"
                  loading={index === 0 ? "eager" : "lazy"}
                  decoding="async"
                  draggable={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent pointer-events-none" />
                <button
                  onClick={() => setLightbox(index)}
                  className="absolute top-3 right-3 size-8 rounded-full bg-black/45 backdrop-blur-md border border-white/15 text-white grid place-items-center opacity-0 group-hover/carousel:opacity-100 transition hover:bg-white hover:text-black"
                  aria-label="Ampliar imagen"
                >
                  <Maximize2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Nav */}
        <Button
          variant="glass"
          size="icon"
          className={cn("absolute left-3 top-1/2 -translate-y-1/2", !canScrollPrev && "opacity-40 pointer-events-none")}
          onClick={scrollPrev}
          aria-label="Anterior"
        >
          <ChevronLeft className="size-4" />
        </Button>
        <Button
          variant="glass"
          size="icon"
          className={cn("absolute right-3 top-1/2 -translate-y-1/2", !canScrollNext && "opacity-40 pointer-events-none")}
          onClick={scrollNext}
          aria-label="Siguiente"
        >
          <ChevronRight className="size-4" />
        </Button>

        {/* Counter + progress */}
        <div className="absolute bottom-0 inset-x-0">
          <div className="h-1 bg-white/10">
            <div className="h-full bg-gradient-to-r from-accent-blue to-accent-yellow transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex items-center justify-between px-3 py-2 bg-gradient-to-t from-black/60 to-transparent">
            <div className="flex gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={cn("h-1.5 rounded-full transition-all", i === selectedIndex ? "w-6 bg-white" : "w-1.5 bg-white/40 hover:bg-white/70")}
                  aria-label={`Ir a slide ${i+1}`}
                />
              ))}
            </div>
            <span className="text-xs font-medium text-white bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-2.5 py-1">
              {String(selectedIndex+1).padStart(2,"0")} / {String(total).padStart(2,"0")}
            </span>
          </div>
        </div>
      </div>

      {/* Thumbnails cinematic */}
      <div className="carousel-no-scrollbar flex gap-2 overflow-auto pb-1 snap-x snap-mandatory">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => goTo(index)}
            className={cn(
              "relative shrink-0 overflow-hidden rounded-xl border transition-all snap-start",
              selectedIndex === index
                ? "w-[112px] border-white shadow-lg scale-[1.02]"
                : "w-[96px] border-white/10 opacity-70 hover:opacity-100 hover:border-white/20"
            )}
          >
            <div className="aspect-[16/10] overflow-hidden bg-black">
              <img src={image} alt={`Thumb ${index+1}`} className="h-full w-full object-cover" loading="lazy" />
              <div className={cn("absolute inset-0 ring-1 ring-white/10", selectedIndex===index && "bg-white/0")} />
            </div>
            {selectedIndex===index && <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-6 rounded-full bg-gradient-to-r from-accent-blue to-accent-yellow" />}
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-md grid place-items-center p-4 lg:p-8" onClick={()=>setLightbox(null)}>
          <div className="relative w-full max-w-6xl" onClick={e=>e.stopPropagation()}>
            <img src={images[lightbox]} alt={`Ampliada ${lightbox+1}`} className="w-full max-h-[82vh] object-contain rounded-2xl border border-white/10 shadow-2xl bg-black" />
            <div className="absolute top-3 right-3 flex gap-2">
              <span className="bg-black/60 backdrop-blur-md border border-white/10 text-white text-xs rounded-full px-3 py-1.5">
                {lightbox+1} / {total}
              </span>
              <button onClick={()=>setLightbox(null)} className="size-9 rounded-full bg-white text-black grid place-items-center hover:bg-white/90">
                <X className="size-4" />
              </button>
            </div>
            <Button variant="glass" size="icon" className="absolute left-2 lg:-left-4 top-1/2 -translate-y-1/2" onClick={()=>setLightbox(v=> Math.max(0,(v as number)-1))}><ChevronLeft className="size-5"/></Button>
            <Button variant="glass" size="icon" className="absolute right-2 lg:-right-4 top-1/2 -translate-y-1/2" onClick={()=>setLightbox(v=> Math.min(total-1,(v as number)+1))}><ChevronRight className="size-5"/></Button>
          </div>
        </div>
      )}
    </div>
  );
};
