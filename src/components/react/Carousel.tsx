import { memo, useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "./Button";
import { cn } from "../../lib/utils";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";

type Props = { images: string[]; title?: string };

// Relación de aspecto usada mientras la imagen aún no reporta su tamaño real
const FALLBACK_RATIO = 16 / 9;

const Slide = memo(function Slide({
  src,
  alt,
  index,
  onExpand,
  onLoadRatio,
  priority,
}: {
  src: string;
  alt: string;
  index: number;
  onExpand: () => void;
  onLoadRatio: (index: number, ratio: number) => void;
  priority: boolean;
}) {
  const imgRef = useRef<HTMLImageElement>(null);

  const handleLoad = useCallback(
    (img: HTMLImageElement) => {
      if (img.naturalWidth && img.naturalHeight) {
        onLoadRatio(index, img.naturalWidth / img.naturalHeight);
      }
    },
    [index, onLoadRatio]
  );

  // Si la imagen ya está en caché antes de hidratar (caso `client:visible` + SSR),
  // el evento `onLoad` nunca se dispara porque el load ya ocurrió. Detectamos
  // `complete` síncronamente tras el montaje y reportamos el ratio igual.
  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    if (img.complete && img.naturalWidth && img.naturalHeight) {
      handleLoad(img);
      return;
    }
    // Fallback: algunos navegadores reportan complete=false un frame después
    // aunque la imagen esté cacheada; reintentamos en el próximo frame.
    const id = requestAnimationFrame(() => {
      if (img.complete && img.naturalWidth && img.naturalHeight) handleLoad(img);
    });
    return () => cancelAnimationFrame(id);
  }, [src, handleLoad]);

  return (
    <div data-slide={index} className="relative h-full w-full shrink-0 snap-start snap-always">
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className="h-full w-full object-contain"
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        draggable={false}
        fetchPriority={priority ? "high" : "auto"}
        onLoad={(e) => handleLoad(e.currentTarget)}
      />
      <button
        type="button"
        onClick={onExpand}
        className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 lg:top-3 lg:right-3 z-10 grid size-7 sm:size-7 lg:size-9 place-items-center rounded-full border border-white/15 bg-black/25 shadow-lg backdrop-blur-md text-white opacity-90 transition hover:bg-black/35 sm:opacity-0 sm:group-hover/carousel:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
        aria-label={`Ampliar ${alt}`}
        aria-haspopup="dialog"
      >
        <Maximize2 className="size-3 sm:size-3 lg:size-4" />
      </button>
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
      type="button"
      onClick={onSelect}
      className={cn(
        "relative shrink-0 overflow-hidden rounded-md transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
        isActive
          ? "scale-[1.04] opacity-100"
          : "border border-white/10 opacity-55 hover:opacity-90 hover:border-white/20"
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
      className="fixed inset-0 z-[80] grid place-items-center bg-black/80 p-4 backdrop-blur-md lg:p-8"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${title || "Proyecto"} ${index + 1} de ${images.length}`}
    >
      <div className="relative w-full max-w-6xl" onClick={(e) => e.stopPropagation()}>
        <img
          src={images[index]}
          alt={`${title || "Proyecto"} ${index + 1}`}
          className="max-h-[82vh] w-full rounded-md border border-white/10 bg-black object-contain shadow-2xl"
        />
        {/* Contador + cerrar — glass unificado */}
        <div className="absolute right-3 top-3 flex items-center gap-1.5 sm:gap-2">
          <span className="rounded-full border border-white/10 bg-black/60 px-2.5 py-1 text-[11px] text-white backdrop-blur-md sm:px-3 sm:py-1.5 sm:text-xs">
            {index + 1} / {images.length}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="grid size-7 place-items-center rounded-full border border-white/15 bg-black/25 text-white shadow-lg backdrop-blur-md hover:bg-black/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 sm:size-8 lg:size-8"
            aria-label="Cerrar vista ampliada"
          >
            <X className="size-3.5 sm:size-4" />
          </button>
        </div>
        {/* Navegación — alineada con X (top-3) tanto en móvil como desktop */}
        <Button
          variant="glass"
          size="icon"
          className="absolute left-3 top-3 z-10 grid size-7 -translate-y-0 place-items-center rounded-full border border-white/15 bg-black/25 text-white shadow-lg backdrop-blur-md hover:bg-black/35 hover:text-white sm:size-8 lg:size-8"
          onClick={onPrev}
          aria-label="Imagen anterior"
        >
          <ChevronLeft className="size-3.5 sm:size-4" />
        </Button>
        <Button
          variant="glass"
          size="icon"
          className="absolute left-12 top-3 z-10 grid size-7 -translate-y-0 place-items-center rounded-full border border-white/15 bg-black/25 text-white shadow-lg backdrop-blur-md hover:bg-black/35 hover:text-white sm:left-[52px] sm:size-8 lg:left-[52px] lg:size-8"
          onClick={onNext}
          aria-label="Imagen siguiente"
        >
          <ChevronRight className="size-3.5 sm:size-4" />
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

  const viewportRef = useRef<HTMLDivElement>(null);
  const mainBoxRef = useRef<HTMLDivElement>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);
  const [mainHeight, setMainHeight] = useState<number>();
  const [ratios, setRatios] = useState<Record<number, number>>({});

  const setRatio = useCallback((i: number, r: number) => {
    setRatios((prev) => (prev[i] === r ? prev : { ...prev, [i]: r }));
  }, []);

  const currentRatio = ratios[index] ?? FALLBACK_RATIO;

  // Precarga los ratios reales con objetos Image nativos, sin depender del
  // evento onLoad del <img> renderizado. Esto cubre el caso `client:visible`
  // donde la imagen SSR ya terminó de cargar antes de hidratar (onLoad no
  // dispara) y también las imágenes `loading="lazy"` que aún no entraron al
  // viewport pero necesitan ratio para evitar barras.
  useEffect(() => {
    let cancelled = false;
    images.forEach((src, i) => {
      // Si ya tenemos el ratio, no recargamos
      // (usamos callback funcional en setRatio así que no necesitamos ratios en deps)
      const img = new Image();
      // decoding async no bloquea el main thread
      (img as any).decoding = "async";
      img.onload = () => {
        if (cancelled) return;
        if (img.naturalWidth && img.naturalHeight) {
          setRatio(i, img.naturalWidth / img.naturalHeight);
        }
      };
      img.src = src;
      // Si ya está en caché, onload puede no disparar de forma asíncrona en
      // algunos navegadores; cubrimos complete síncrono
      if (img.complete && img.naturalWidth && img.naturalHeight) {
        setRatio(i, img.naturalWidth / img.naturalHeight);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [images, setRatio]);

  // Mide la altura real (renderizada) de la imagen principal para que las
  // miniaturas puedan igualarla con un alto explícito en px. No podemos
  // confiar en `items-stretch` de Flexbox aquí: mezclar aspect-ratio con
  // stretch tiene comportamiento inconsistente entre navegadores.
  useEffect(() => {
    const box = mainBoxRef.current;
    if (!box) return;
    const update = () => setMainHeight(box.getBoundingClientRect().height);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(box);
    return () => ro.disconnect();
  }, []);

  // Cuando el contenedor sale de la animación `.reveal` (opacity/transform) o
  // entra al viewport tras el scroll, re-inspeccionamos los <img> del viewport
  // por si alguno ya está `complete` pero su onLoad no se reportó. También
  // fuerza una re-medida tras el cambio de aspect-ratio.
  useEffect(() => {
    const box = mainBoxRef.current;
    const viewport = viewportRef.current;
    if (!box || !viewport) return;

    const checkDomImages = () => {
      const imgs = viewport.querySelectorAll("img");
      imgs.forEach((el) => {
        const img = el as HTMLImageElement;
        const idxAttr = img.closest("[data-slide]")?.getAttribute("data-slide");
        const idx = idxAttr ? Number(idxAttr) : -1;
        if (idx >= 0 && img.complete && img.naturalWidth && img.naturalHeight) {
          setRatio(idx, img.naturalWidth / img.naturalHeight);
        }
      });
      // fuerza re-medida después de que el ratio actualice aspectRatio
      requestAnimationFrame(() => {
        if (box) setMainHeight(box.getBoundingClientRect().height);
      });
    };

    // 1) Observer de visibilidad del propio carrusel (cubre `client:visible`
    //    + `.reveal` que inicia con opacity:0). Cuando se vuelve visible tras
    //    el scroll, el navegador ya disparó load pero React aún no tenía ratio.
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          // esperar a que termine la transición 0.6s de .reveal
          // chequeamos inmediato y también tras un timeout
          checkDomImages();
          setTimeout(checkDomImages, 650);
        }
      },
      { threshold: 0.1 }
    );
    io.observe(box);

    // 2) Escuchar el fin de la transición reveal del ancestro
    const revealEl = box.closest(".reveal") as HTMLElement | null;
    const onRevealEnd = (e: TransitionEvent) => {
      if (e.propertyName === "opacity" || e.propertyName === "transform") {
        checkDomImages();
      }
    };
    revealEl?.addEventListener("transitionend", onRevealEnd as EventListener);

    // 3) Chequeo inicial por si hidrata ya visible
    checkDomImages();

    return () => {
      io.disconnect();
      revealEl?.removeEventListener("transitionend", onRevealEnd as EventListener);
    };
  }, [setRatio]);

  // Si el ratio del slide activo cambia tras la aparición, la altura del box
  // cambia vía aspect-ratio; aseguramos que ResizeObserver dispare, pero como
  // fallback forzamos una medida en el siguiente frame.
  useEffect(() => {
    const box = mainBoxRef.current;
    if (!box) return;
    const id = requestAnimationFrame(() => setMainHeight(box.getBoundingClientRect().height));
    return () => cancelAnimationFrame(id);
  }, [currentRatio]);

  const goTo = useCallback(
    (next: number) => {
      const clamped = Math.max(0, Math.min(total - 1, next));
      const slide = viewportRef.current?.querySelector(`[data-slide="${clamped}"]`) as HTMLElement | null;
      slide?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
    },
    [total]
  );

  const prev = useCallback(() => goTo(index - 1), [index, goTo]);
  const next = useCallback(() => goTo(index + 1), [index, goTo]);

  // Sincroniza el índice activo (y por tanto las miniaturas) con lo que
  // realmente se ve al hacer swipe, sin manejar el drag a mano.
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
          setIndex(Number((mostVisible.target as HTMLElement).dataset.slide));
        }
      },
      { root: viewport, threshold: [0.6] }
    );
    slides.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [images]);

  // Mantiene la miniatura activa visible dentro de su contenedor
  useEffect(() => {
    const el = thumbsRef.current?.querySelector(`[data-thumb="${index}"]`) as HTMLElement | null;
    el?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
  }, [index]);

  // Navegación por teclado cuando el carrusel está enfocado o visible en pantalla
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
      const viewport = viewportRef.current;
      if (!viewport) return;
      const isFocused = viewport.contains(document.activeElement);
      if (!isFocused) {
        const rect = viewport.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        if (!isVisible) return;
      }
      if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) e.preventDefault();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Home") goTo(0);
      if (e.key === "End") goTo(total - 1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [prev, next, goTo, total, lightboxIndex]);

  if (!total) return null;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-start gap-2.5">
        {/* Imagen principal — la altura se adapta a la relación de aspecto real de cada foto */}
        <div
          ref={mainBoxRef}
          className="group/carousel relative mx-auto w-full max-w-[420px] overflow-hidden rounded-md border border-white/10 bg-black/20 shadow-glass backdrop-blur-md sm:mx-0 sm:max-w-none sm:flex-1"
          role="region"
          aria-roledescription="carrusel"
          aria-label={`${title || "Proyecto"} - ${index + 1} de ${total}`}
          tabIndex={0}
        >
          <div
            ref={viewportRef}
            className="no-scrollbar flex h-full w-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden overscroll-x-contain scroll-smooth"
            style={{ aspectRatio: currentRatio, transition: "aspect-ratio 300ms ease" }}
          >
            {images.map((src, i) => (
              <Slide
                key={src}
                index={i}
                src={src}
                alt={`${title || "Proyecto"} ${i + 1} de ${total}`}
                onExpand={() => setLightboxIndex(i)}
                onLoadRatio={setRatio}
                priority={i === 0}
              />
            ))}
          </div>

          {total > 1 && (
            <>
              <Button
                variant="glass"
                size="icon"
                className={cn(
                  "absolute left-1.5 lg:left-3 top-1/2 z-10 hidden -translate-y-1/2 border border-white/15 bg-black/25 text-white shadow-lg backdrop-blur-md hover:bg-black/35 hover:text-white sm:inline-flex size-8 lg:size-10",
                  index === 0 && "pointer-events-none opacity-40"
                )}
                onClick={prev}
                aria-label="Imagen anterior"
              >
                <ChevronLeft className="size-4 lg:size-5" />
              </Button>
              <Button
                variant="glass"
                size="icon"
                className={cn(
                  "absolute right-1.5 lg:right-3 top-1/2 z-10 hidden -translate-y-1/2 border border-white/15 bg-black/25 text-white shadow-lg backdrop-blur-md hover:bg-black/35 hover:text-white sm:inline-flex size-8 lg:size-10",
                  index === total - 1 && "pointer-events-none opacity-40"
                )}
                onClick={next}
                aria-label="Imagen siguiente"
              >
                <ChevronRight className="size-4 lg:size-5" />
              </Button>
            </>
          )}
        </div>

        {/* Miniaturas verticales — alto fijado en px, igual al de la imagen principal (medido con ResizeObserver) */}
        {total > 1 && (
          <div
            ref={thumbsRef}
            className="no-scrollbar hidden w-[136px] shrink-0 snap-y snap-mandatory flex-col gap-2.5 overflow-y-auto overflow-x-hidden overscroll-contain pr-1 sm:flex lg:w-[168px]"
            style={mainHeight ? { height: mainHeight, maxHeight: mainHeight } : undefined}
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
        )}
      </div>

      {/* Miniaturas horizontales — solo en móvil */}
      {total > 1 && (
        <div className="no-scrollbar mx-auto flex w-full max-w-[420px] snap-x snap-mandatory gap-1.5 overflow-x-auto overflow-y-hidden pb-1 sm:hidden">
          {images.map((src, i) => (
            <div key={src} data-thumb={i} className="shrink-0 snap-start">
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
      )}

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
