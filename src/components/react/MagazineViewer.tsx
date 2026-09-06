import { useCallback, useEffect, useState } from "react";
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

  const pages = magazine?.pages?.length ? magazine.pages : magazine ? [magazine.image] : [];
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
  }, [magazine]);

  // reset loaded state al cambiar de página — la animación solo debe correr cuando la imagen ya está decodificada
  useEffect(() => {
    setIsPageLoaded(false);
    const src = pages[page];
    if (!src) return;
    const img = new Image();
    img.src = src;
    // si ya está en caché, complete será true y decode resuelve inmediato
    if (img.complete) {
      if (img.decode) {
        img.decode().then(() => setIsPageLoaded(true)).catch(() => setIsPageLoaded(true));
      } else {
        setIsPageLoaded(true);
      }
    } else {
      img.onload = () => {
        if (img.decode) {
          img.decode().then(() => setIsPageLoaded(true)).catch(() => setIsPageLoaded(true));
        } else {
          setIsPageLoaded(true);
        }
      };
      img.onerror = () => setIsPageLoaded(true);
    }
  }, [page, pages]);

  const animatedClose = useCallback(() => {
    setIsVisible(false);
    window.setTimeout(() => onClose(), 280);
  }, [onClose]);

  const handlePrev = useCallback(() => {
    if (page <= 0) return;
    setPage((p) => Math.max(0, p - 1));
  }, [page]);

  const handleNext = useCallback(() => {
    if (page >= total - 1) return;
    setPage((p) => Math.min(total - 1, p + 1));
  }, [page, total]);

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
          {/* Imagen — 1 en 1, sin botones encima */}
          <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-black">
            {/* placeholder mientras decodifica */}
            {!isPageLoaded && (
              <div className="absolute inset-0 grid place-items-center bg-black">
                <div className="size-8 animate-spin rounded-full border-2 border-white/20 border-t-white/60" />
              </div>
            )}
            <img
              key={pages[page]}
              src={pages[page]}
              alt={`${magazine.name} página ${page + 1}`}
              onLoad={() => setIsPageLoaded(true)}
              onError={() => setIsPageLoaded(true)}
              className={cn(
                "max-h-[72vh] sm:max-h-[76vh] lg:max-h-[78vh] w-full object-contain will-change-transform",
                isPageLoaded
                  ? "opacity-100 scale-100 animate-[lightboxContentIn_300ms_cubic-bezier(0.22,1,0.36,1)]"
                  : "opacity-0 scale-[0.98]"
              )}
              style={{ transition: "opacity 300ms cubic-bezier(0.22,1,0.36,1), transform 300ms cubic-bezier(0.22,1,0.36,1)" }}
              draggable={false}
            />
          </div>

          {/* Barra inferior — título centrado */}
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
