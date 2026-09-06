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
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isFlipping, setIsFlipping] = useState(false);

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
  }, [magazine]);

  const animatedClose = useCallback(() => {
    setIsVisible(false);
    window.setTimeout(() => onClose(), 280);
  }, [onClose]);

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
  }, [animatedClose, page, total]);

  const handlePrev = useCallback(() => {
    if (page <= 0 || isFlipping) return;
    setDirection(-1);
    setIsFlipping(true);
    window.setTimeout(() => {
      setPage((p) => Math.max(0, p - 1));
      setIsFlipping(false);
    }, 320);
  }, [page, isFlipping]);

  const handleNext = useCallback(() => {
    if (page >= total - 1 || isFlipping) return;
    setDirection(1);
    setIsFlipping(true);
    window.setTimeout(() => {
      setPage((p) => Math.min(total - 1, p + 1));
      setIsFlipping(false);
    }, 320);
  }, [page, total, isFlipping]);

  // precarga vecinos
  useEffect(() => {
    [pages[page - 1], pages[page + 1]].forEach((src) => {
      if (src) {
        const img = new Image();
        img.src = src;
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
          {/* Libro */}
          <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-[#0f0f0f] shadow-inner">
            {/* Fondo mesa sutil dentro del visor para continuidad */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-black/20 pointer-events-none" />
            
            <div className="relative w-full flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 min-h-[420px] sm:min-h-[520px] lg:min-h-[560px]">
              {/* Libro con perspectiva */}
              <div className="relative w-full max-w-[560px] sm:max-w-[640px] mx-auto perspective-[1600px]">
                <div
                  className={cn(
                    "relative w-full aspect-[1.35] sm:aspect-[1.45] bg-white rounded-sm shadow-[0_20px_60px_rgba(0,0,0,0.5),0_8px_20px_rgba(0,0,0,0.4)] overflow-hidden will-change-transform",
                    "transition-transform duration-300"
                  )}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Página actual */}
                  <div
                    key={pages[page]}
                    className={cn(
                      "absolute inset-0 w-full h-full bg-white",
                      isFlipping
                        ? direction === 1
                          ? "animate-[pageTurnNext_320ms_cubic-bezier(0.22,1,0.36,1)]"
                          : "animate-[pageTurnPrev_320ms_cubic-bezier(0.22,1,0.36,1)]"
                        : "animate-[lightboxContentIn_280ms_cubic-bezier(0.22,1,0.36,1)]"
                    )}
                  >
                    <img
                      src={pages[page]}
                      alt={`${magazine.name} página ${page + 1}`}
                      className="w-full h-full object-contain bg-white"
                      draggable={false}
                    />
                    {/* Lomo y sombra interior */}
                    <div className="absolute left-0 top-0 bottom-0 w-[18px] bg-gradient-to-r from-black/15 via-black/[0.06] to-transparent pointer-events-none" />
                    <div className="absolute inset-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.6),inset_0_-1px_12px_rgba(0,0,0,0.08)] pointer-events-none rounded-sm" />
                  </div>

                  {/* Brillo de página */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-white/10 pointer-events-none" />
                </div>

                {/* Sombra del libro sobre la mesa */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[85%] h-6 bg-black/30 blur-xl rounded-full pointer-events-none" />

                {/* Indicador de páginas en el borde inferior del libro (como revistas reales) */}
                {total > 1 && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
                    {Array.from({ length: Math.min(total, 8) }).map((_, i) => (
                      <span
                        key={i}
                        className={cn(
                          "h-1 rounded-full transition-all duration-300",
                          i === page ? "w-6 bg-white" : i < page ? "w-1.5 bg-white/60" : "w-1.5 bg-white/25"
                        )}
                      />
                    ))}
                    {total > 8 && <span className="text-[10px] text-white/50 ml-1">+{total - 8}</span>}
                  </div>
                )}
              </div>

              {/* Controles de página flotantes sobre el libro en móvil (sin tapar) */}
              <div className="absolute inset-0 flex items-center justify-between p-2 sm:p-4 pointer-events-none">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={!canPrev}
                  className={cn(
                    "pointer-events-auto grid size-9 sm:size-10 place-items-center rounded-full border border-white/15 bg-black/25 text-white shadow-lg backdrop-blur-md transition hover:bg-black/35 sm:opacity-0 sm:group-hover:opacity-100",
                    !canPrev && "opacity-30 pointer-events-none"
                  )}
                  aria-label="Página anterior"
                >
                  <ChevronLeft className="size-4 sm:size-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!canNext}
                  className={cn(
                    "pointer-events-auto grid size-9 sm:size-10 place-items-center rounded-full border border-white/15 bg-black/25 text-white shadow-lg backdrop-blur-md transition hover:bg-black/35",
                    !canNext && "opacity-30 pointer-events-none"
                  )}
                  aria-label="Página siguiente"
                >
                  <ChevronRight className="size-4 sm:size-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Barra inferior — título centrado, controles alrededor */}
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

            <div className="flex-1 min-w-0 flex flex-col items-center gap-1 px-1 sm:px-3">
              <p className="text-center text-xs sm:text-sm font-semibold text-white truncate w-full">
                {magazine.name}
              </p>
              {total > 1 && (
                <span className="text-[11px] sm:text-xs text-white/60">
                  Página {page + 1} de {total}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <a
                href={magazine.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/25 px-3 py-2 text-xs font-medium text-white shadow-lg backdrop-blur-md hover:bg-black/35 transition"
              >
                <ExternalLink className="size-3.5" /> Drive
              </a>
              <span className="rounded-full border border-white/15 bg-black/25 px-3 py-1.5 text-xs font-medium text-white shadow-lg backdrop-blur-md">
                {page + 1} / {total}
              </span>
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

      <style>{`
        @keyframes pageTurnNext {
          0% { transform: rotateY(0deg); transform-origin: left center; }
          40% { transform: rotateY(-18deg); transform-origin: left center; }
          100% { transform: rotateY(0deg); transform-origin: left center; }
        }
        @keyframes pageTurnPrev {
          0% { transform: rotateY(0deg); transform-origin: right center; }
          40% { transform: rotateY(18deg); transform-origin: right center; }
          100% { transform: rotateY(0deg); transform-origin: right center; }
        }
      `}</style>
    </div>,
    document.body
  );
}
