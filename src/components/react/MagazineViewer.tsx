import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "./Button";
import { cn } from "../../lib/utils";
import { ChevronLeft, ChevronRight, ExternalLink, X } from "lucide-react";

type Magazine = {
  name: string;
  image: string;
  href: string;
  pages?: string[];
};

type Props = {
  magazine: Magazine | null;
  onClose: () => void;
};

export function MagazineViewer({ magazine, onClose }: Props) {
  const [isVisible, setIsVisible] = useState(false);
  const [page, setPage] = useState(0);
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  const viewportRef = useRef<HTMLDivElement>(null);

  const pages = useMemo(
    () => (magazine?.pages?.length ? magazine.pages : magazine ? [magazine.image] : []),
    [magazine]
  );
  const total = pages.length;

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const id = requestAnimationFrame(() => setIsVisible(true));
    return () => {
      document.body.style.overflow = prev;
      cancelAnimationFrame(id);
    };
  }, []);

  useEffect(() => {
    setPage(0);
    setIsPageLoaded(false);
    // resetea el scroll al abrir otra revista, sin animación
    requestAnimationFrame(() => {
      const viewport = viewportRef.current;
      if (viewport) viewport.scrollLeft = 0;
    });
  }, [magazine]);

  // reset loaded state al cambiar de página — solo muestra spinner si la imagen aún no está cacheada
  useEffect(() => {
    const src = pages[page];
    if (!src) return;
    const img = new Image();
    img.src = src;
    if (img.complete) {
      if (img.decode) {
        img.decode().then(() => setIsPageLoaded(true)).catch(() => setIsPageLoaded(true));
      } else {
        setIsPageLoaded(true);
      }
      return;
    }
    setIsPageLoaded(false);
    img.onload = () => {
      if (img.decode) {
        img.decode().then(() => setIsPageLoaded(true)).catch(() => setIsPageLoaded(true));
      } else {
        setIsPageLoaded(true);
      }
    };
    img.onerror = () => setIsPageLoaded(true);
  }, [page, pages]);

  const animatedClose = useCallback(() => {
    setIsVisible(false);
    window.setTimeout(() => onClose(), 280);
  }, [onClose]);

  const scrollToPage = useCallback(
    (next: number) => {
      const clamped = Math.max(0, Math.min(total - 1, next));
      setPage(clamped);
      const viewport = viewportRef.current;
      if (!viewport) return;
      const target = viewport.querySelector(`[data-slide="${clamped}"]`) as HTMLElement | null;
      if (target) {
        viewport.scrollTo({ left: target.offsetLeft, behavior: "smooth" });
      }
    },
    [total]
  );

  const handlePrev = useCallback(() => {
    if (page <= 0) return;
    scrollToPage(page - 1);
  }, [page, scrollToPage]);

  const handleNext = useCallback(() => {
    if (page >= total - 1) return;
    scrollToPage(page + 1);
  }, [page, total, scrollToPage]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        animatedClose();
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [animatedClose, handlePrev, handleNext]);

  // Sincroniza el índice activo con lo que realmente se ve al hacer swipe,
  // sin manejar el drag a mano — idéntico al Carousel
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const slides = Array.from(viewport.querySelectorAll("[data-slide]")) as HTMLElement[];
    if (!slides.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const mostVisible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (mostVisible) {
          const next = Number((mostVisible.target as HTMLElement).dataset.slide);
          if (!Number.isNaN(next)) setPage(next);
        }
      },
      { root: viewport, threshold: [0.6] }
    );
    slides.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [pages]);

  // precarga agresiva: todas las páginas al abrir + vecinos al navegar
  useEffect(() => {
    if (!magazine) return;
    pages.forEach((src) => {
      const img = new Image();
      img.decoding = "async" as any;
      img.src = src;
      if (img.decode) img.decode().catch(() => {});
    });
  }, [magazine, pages]);

  useEffect(() => {
    [pages[page - 1], pages[page + 1]].forEach((src) => {
      if (src) {
        const img = new Image();
        img.decoding = "async" as any;
        img.src = src;
        if (img.decode) img.decode().catch(() => {});
      }
    });
  }, [page, pages]);

  if (!magazine) return null;

  const canPrev = page > 0;
  const canNext = page < total - 1;

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-[80] grid place-items-center p-4 backdrop-blur-md lg:p-6 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
        isVisible ? "bg-black/80 opacity-100" : "bg-black/0 opacity-0"
      )}
      onClick={animatedClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${magazine.name} revista`}
    >
      <div
        className={cn(
          "relative w-full max-w-5xl transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="glass rounded-[20px] sm:rounded-[24px] p-3 sm:p-4 shadow-glass-lg border border-white/10">
          {/* Visor con swipe nativo — imita el Carousel: snap-x + scroll-smooth */}
          <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-black">
            {/* placeholder mientras decodifica la página actual */}
            {!isPageLoaded && (
              <div className="absolute inset-0 z-10 grid place-items-center bg-black">
                <div className="size-8 animate-spin rounded-full border-2 border-white/20 border-t-white/60" />
              </div>
            )}
            <div
              ref={viewportRef}
              className="no-scrollbar flex w-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden overscroll-x-contain scroll-smooth"
              style={{ scrollbarWidth: "none" } as React.CSSProperties}
              aria-roledescription="carrusel"
              aria-label={`${magazine.name} ${page + 1} de ${total}`}
            >
              {pages.map((src, i) => (
                <div
                  key={src}
                  data-slide={i}
                  className="relative w-full shrink-0 snap-start snap-always"
                >
                  <img
                    src={src}
                    alt={`${magazine.name} página ${i + 1}`}
                    className={cn(
                      "max-h-[72vh] sm:max-h-[76vh] lg:max-h-[78vh] w-full object-contain select-none",
                      i === page && isPageLoaded
                        ? "opacity-100"
                        : i === page && !isPageLoaded
                          ? "opacity-0"
                          : "opacity-100"
                    )}
                    draggable={false}
                    loading={i === 0 ? "eager" : "lazy"}
                    decoding="async"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Dots de paginación — solo móvil, feedback visual del swipe */}
          {total > 1 && (
            <div className="mt-2.5 flex justify-center sm:hidden" aria-hidden="true">
              <div className="flex items-center gap-1.5 max-w-full overflow-hidden px-2">
                {(total <= 12
                  ? pages.map((_, i) => i)
                  : Array.from({ length: 12 }, (_, k) => {
                      const windowSize = 12;
                      const start = Math.max(0, Math.min(total - windowSize, page - Math.floor(windowSize / 2)));
                      return start + k;
                    })
                ).map((i) => (
                  <span
                    key={i}
                    className={cn(
                      "h-1.5 shrink-0 rounded-full transition-all duration-300",
                      i === page ? "w-5 bg-white" : "w-1.5 bg-white/35"
                    )}
                  />
                ))}
                {total > 12 && <span className="ml-1 text-[10px] text-white/60">+{total - 12}</span>}
              </div>
            </div>
          )}

          {/* Barra inferior — controles */}
          <div className="mt-3 sm:mt-4 flex items-center justify-between gap-2 sm:gap-3">
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <Button
                variant="glass"
                size="icon"
                className="grid size-8 place-items-center rounded-full border border-white/15 bg-black/25 text-white shadow-lg backdrop-blur-md hover:bg-black/35 hover:text-white sm:size-8 lg:size-9 disabled:opacity-30"
                onClick={handlePrev}
                disabled={!canPrev}
                aria-label="Anterior"
              >
                <ChevronLeft className="size-4 lg:size-5" />
              </Button>
              <Button
                variant="glass"
                size="icon"
                className="grid size-8 place-items-center rounded-full border border-white/15 bg-black/25 text-white shadow-lg backdrop-blur-md hover:bg-black/35 hover:text-white sm:size-8 lg:size-9 disabled:opacity-30"
                onClick={handleNext}
                disabled={!canNext}
                aria-label="Siguiente"
              >
                <ChevronRight className="size-4 lg:size-5" />
              </Button>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <span className="rounded-full border border-white/15 bg-black/25 px-3 py-1.5 text-xs font-medium text-white shadow-lg backdrop-blur-md">
                {page + 1} / {total}
              </span>
              <a
                href={magazine.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/25 px-3 py-2 text-xs font-medium text-white shadow-lg backdrop-blur-md hover:bg-black/35 transition"
              >
                <ExternalLink className="size-3.5" /> Drive
              </a>
              <button
                type="button"
                onClick={animatedClose}
                className="grid size-8 place-items-center rounded-full border border-white/15 bg-black/25 text-white shadow-lg backdrop-blur-md hover:bg-black/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 sm:size-8 lg:size-9"
                aria-label="Cerrar"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          <div className="mt-2 flex justify-center sm:hidden">
            <a
              href={magazine.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs text-white/80 hover:bg-white/10 transition"
            >
              <ExternalLink className="size-3" /> Ver en Drive
            </a>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
