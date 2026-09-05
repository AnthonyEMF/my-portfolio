import { memo, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "./Button";
import { cn } from "../../lib/utils";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";

type Props = { images: string[]; title?: string };

const SWIPE_THRESHOLD = 40;

const Slide = memo(function Slide({
  src,
  alt,
  onExpand,
  priority,
}: {
  src: string;
  alt: string;
  onExpand: () => void;
  priority: boolean;
}) {
  return (
    <div className="relative w-full shrink-0">
      <div className="aspect-[16/8] sm:aspect-[16/9] overflow-hidden bg-black">
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          draggable={false}
          fetchPriority={priority ? "high" : "auto"}
        />
        <button
          onClick={onExpand}
          className="absolute top-2.5 right-2.5 size-7 rounded-full bg-black/45 backdrop-blur-md border border-white/15 text-white grid place-items-center opacity-0 group-hover/carousel:opacity-100 focus:opacity-100 transition hover:bg-white hover:text-black"
          aria-label={`Ampliar ${alt}`}
          aria-haspopup="dialog"
        >
          <Maximize2 className="size-3.5" />
        </button>
      </div>
    </div>
  );
});

const Thumb = memo(function Thumb({
  src,
  alt,
  isActive,
  onSelect,
}: {
  src: string;
  alt: string;
  isActive: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "relative shrink-0 overflow-hidden rounded-md border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
        isActive ? "border-white opacity-100" : "border-white/10 opacity-65 hover:opacity-100 hover:border-white/20"
      )}
      aria-label={alt}
      aria-current={isActive}
    >
      <div className="aspect-[16/9] overflow-hidden bg-black">
        <img src={src} alt={alt} className="h-full w-full object-cover" loading="lazy" decoding="async" />
      </div>
    </button>
  );
});

function Lightbox({
  images,
  index,
  onClose,
  onPrev,
  onNext,
  title,
}: {
  images: string[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  title?: string;
}) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    const nextImg = images[index + 1];
    if (nextImg) {
      const img = new Image();
      img.src = nextImg;
    }
    const prevImg = images[index - 1];
    if (prevImg) {
      const img = new Image();
      img.src = prevImg;
    }
  }, [index, images]);

  return createPortal(
    <div
      className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-md grid place-items-center p-4 lg:p-8"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${title || "Proyecto"} ${index + 1} de ${images.length}`}
    >
      <div className="relative w-full max-w-6xl" onClick={(e) => e.stopPropagation()}>
        <img
          src={images[index]}
          alt={`${title || "Proyecto"} ${index + 1}`}
          className="w-full max-h-[82vh] object-contain rounded-md border border-white/10 shadow-2xl bg-black"
        />
        <div className="absolute top-3 right-3 flex gap-2">
          <span className="bg-black/60 backdrop-blur-md border border-white/10 text-white text-xs rounded-full px-3 py-1.5">
            {index + 1} / {images.length}
          </span>
          <button
            onClick={onClose}
            className="size-8 rounded-full bg-white/[0.08] backdrop-blur-md border border-white/10 text-white grid place-items-center hover:bg-white/12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            aria-label="Cerrar vista ampliada"
          >
            <X className="size-4" />
          </button>
        </div>
        <Button
          variant="glass"
          size="icon"
          className="absolute left-2 lg:-left-3 top-1/2 -translate-y-1/2"
          onClick={onPrev}
          aria-label="Imagen anterior"
        >
          <ChevronLeft className="size-4" />
        </Button>
        <Button
          variant="glass"
          size="icon"
          className="absolute right-2 lg:-right-3 top-1/2 -translate-y-1/2"
          onClick={onNext}
          aria-label="Imagen siguiente"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>,
    document.body
  );
}

export function Carousel({ images, title }: Props) {
  const total = images.length;
  const [index, setIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const trackRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const startXRef = useRef(0);
  const deltaRef = useRef(0);
  const isDraggingRef = useRef(false);
  const [thumbsHeight, setThumbsHeight] = useState<number | undefined>(undefined);

  const goTo = useCallback(
    (next: number) => {
      const clamped = Math.max(0, Math.min(total - 1, next));
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        if (trackRef.current) {
          trackRef.current.style.transform = `translateX(-${clamped * 100}%)`;
        }
        setIndex(clamped);
        // Mantener thumb visible sin hacer scroll de página
        requestAnimationFrame(() => {
          const el = document.querySelector(`[data-thumb="${clamped}"]`) as HTMLElement | null;
          const container = thumbsRef.current;
          if (el && container) {
            const elTop = el.offsetTop;
            const elBottom = elTop + el.offsetHeight;
            const cTop = container.scrollTop;
            const cBottom = cTop + container.clientHeight;
            if (elTop < cTop) container.scrollTo({ top: elTop - 4, behavior: "smooth" });
            else if (elBottom > cBottom) container.scrollTo({ top: elBottom - container.clientHeight + 4, behavior: "smooth" });
          }
        });
      });
    },
    [total]
  );

  const prev = useCallback(() => goTo(index - 1), [index, goTo]);
  const next = useCallback(() => goTo(index + 1), [index, goTo]);

  // Mantener transform y sincronizar altura thumbs al abrir <details> o resize - usar LayoutEffect para evitar flash
  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const syncHeight = () => {
      if (viewport) setThumbsHeight(viewport.clientHeight);
    };
    // Sincroniza inmediatamente antes del primer paint
    syncHeight();
    const details = viewport.closest("details");
    const onToggle = () => {
      if ((details as HTMLDetailsElement)?.open) {
        requestAnimationFrame(() => {
          if (trackRef.current) trackRef.current.style.transform = `translateX(-${index * 100}%)`;
          syncHeight();
        });
      }
    };
    details?.addEventListener("toggle", onToggle);
    const ro = new ResizeObserver(() => {
      if (trackRef.current) trackRef.current.style.transform = `translateX(-${index * 100}%)`;
      syncHeight();
    });
    ro.observe(viewport);
    return () => {
      details?.removeEventListener("toggle", onToggle);
      ro.disconnect();
    };
  }, [index]);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  // Teclado local + lightbox - evita auto-scroll de página
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (lightboxIndex !== null) {
        if (e.key === "Escape") setLightboxIndex(null);
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          setLightboxIndex((v) => (v === null ? null : Math.max(0, v - 1)));
        }
        if (e.key === "ArrowRight") {
          e.preventDefault();
          setLightboxIndex((v) => (v === null ? null : Math.min(total - 1, v + 1)));
        }
        return;
      }
      // Solo si el carrusel tiene foco o está visible y el usuario navega con flechas
      const isCarouselFocused = viewportRef.current?.contains(document.activeElement);
      if (!isCarouselFocused) {
        if (!viewportRef.current) return;
        const rect = viewportRef.current.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        if (!isVisible) return;
      }
      if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) {
        e.preventDefault();
      }
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Home") goTo(0);
      if (e.key === "End") goTo(total - 1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [prev, next, goTo, total, lightboxIndex]);

  const onPointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    deltaRef.current = 0;
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    deltaRef.current = e.clientX - startXRef.current;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
    if (Math.abs(deltaRef.current) > SWIPE_THRESHOLD) {
      deltaRef.current < 0 ? next() : prev();
    }
    deltaRef.current = 0;
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2.5 items-stretch min-h-0 sm:items-stretch">
        {/* Principal - rounded-md 6px - compacto en móvil */}
        <div
          ref={viewportRef}
          className="relative group/carousel w-full max-w-[360px] mx-auto sm:max-w-none sm:mx-0 sm:flex-1 min-w-0 self-stretch min-h-0 overflow-hidden rounded-md border border-white/10 bg-black/20 backdrop-blur-md shadow-glass flex flex-col"
          role="region"
          aria-roledescription="carrusel"
          aria-label={`${title || "Proyecto"} - ${index + 1} de ${total}`}
          tabIndex={0}
        >
          <div
            ref={trackRef}
            className="flex will-change-transform"
            style={{ transform: `translateX(-${index * 100}%)`, transition: "transform 320ms cubic-bezier(0.22,1,0.36,1)" }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
          >
            {images.map((src, i) => (
              <Slide
                key={src}
                src={src}
                alt={`${title || "Proyecto"} ${i + 1} de ${total}`}
                onExpand={() => setLightboxIndex(i)}
                priority={i === 0}
              />
            ))}
          </div>

          <Button
            variant="glass"
            size="icon"
            className={cn("absolute left-2 top-1/2 -translate-y-1/2 size-8", index === 0 && "opacity-40 pointer-events-none")}
            onClick={prev}
            aria-label="Imagen anterior"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="glass"
            size="icon"
            className={cn("absolute right-2 top-1/2 -translate-y-1/2 size-8", index === total - 1 && "opacity-40 pointer-events-none")}
            onClick={next}
            aria-label="Imagen siguiente"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>

        {/* Thumbnails vertical - altura exacta del principal, sin animación de encogido */}
        <div
          ref={thumbsRef}
          className="no-scrollbar hidden sm:flex flex-col gap-2.5 w-[112px] lg:w-[140px] shrink-0 overflow-y-auto overflow-x-hidden pr-1 overscroll-contain snap-y snap-mandatory"
          style={thumbsHeight ? { height: thumbsHeight, maxHeight: thumbsHeight } : { height: "280px", maxHeight: "280px", visibility: "hidden" }}
        >
          {images.map((src, i) => (
            <div key={src} data-thumb={i} className="snap-start">
              <Thumb
                src={src}
                alt={`${title || "Proyecto"} miniatura ${i + 1}`}
                isActive={i === index}
                onSelect={() => goTo(i)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Thumbnails móvil - horizontal - más compacto */}
      <div className="no-scrollbar flex sm:hidden gap-1.5 overflow-x-auto overflow-y-hidden snap-x snap-mandatory pb-1 max-w-[360px] mx-auto w-full">
        {images.map((src, i) => (
          <div key={src} data-thumb={i} className="snap-start shrink-0">
            <div className="w-[72px]">
              <Thumb
                src={src}
                alt={`${title || "Proyecto"} miniatura ${i + 1}`}
                isActive={i === index}
                onSelect={() => goTo(i)}
              />
            </div>
          </div>
        ))}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={() => setLightboxIndex((v) => (v === null ? null : Math.max(0, v - 1)))}
          onNext={() => setLightboxIndex((v) => (v === null ? null : Math.min(total - 1, v + 1)))}
          title={title}
        />
      )}
    </div>
  );
}
