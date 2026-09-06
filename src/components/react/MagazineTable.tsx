import { useState } from "react";
import { cn } from "../../lib/utils";
import { MagazineViewer } from "./MagazineViewer";

type Magazine = {
  name: string;
  image: string;
  href: string;
  pages?: string[];
};

type Props = {
  magazines: Magazine[];
};

export function MagazineTable({ magazines }: Props) {
  const [selected, setSelected] = useState<Magazine | null>(null);
  const [hovered, setHovered] = useState(false);

  return (
    <>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Contenedor de revistas */}
        <div className="relative w-full min-h-[300px] sm:min-h-[360px] lg:min-h-[460px] flex items-center justify-center mb-6 lg:mb-16">
          <div className="relative flex items-center justify-center gap-0 w-full max-w-[560px] lg:max-w-[640px] h-[240px] sm:h-[300px] lg:h-[380px]">
            {magazines.slice(0, 2).map((mag, idx) => {
              const isFirst = idx === 0;
              const baseRotate = isFirst ? -6 : 5;
              const hoverRotate = isFirst ? -8 : 7;
              const baseX = isFirst ? -12 : 12;
              const hoverX = isFirst ? -48 : 48;
              const baseY = isFirst ? 8 : -4;

              return (
                <button
                  key={mag.name}
                  type="button"
                  onClick={() => setSelected(mag)}
                  className={cn(
                    "absolute w-[158px] sm:w-[200px] lg:w-[260px] xl:w-[280px] aspect-[0.77] will-change-transform transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 rounded-sm"
                  )}
                  style={{
                    left: isFirst ? "8%" : "auto",
                    right: isFirst ? "auto" : "8%",
                    top: `${12 + baseY}%`,
                    transform: hovered
                      ? `translateX(${hoverX}px) rotate(${hoverRotate}deg) scale(1.02)`
                      : `translateX(${baseX}px) rotate(${baseRotate}deg)`,
                    zIndex: isFirst ? 1 : 2,
                  }}
                  aria-label={`Abrir ${mag.name}`}
                >
                  {/* Sombra de la revista */}
                  <div
                    className="absolute inset-0 rounded-sm blur-xl transition-all duration-500"
                    style={{
                      background: "rgba(0,0,0,0.35)",
                      transform: "translateY(12px) scale(0.95)",
                      opacity: hovered ? 0.5 : 0.4,
                    }}
                  />

                  {/* Cuerpo de la revista */}
                  <div className="relative w-full h-full bg-white rounded-sm overflow-hidden shadow-[0_12px_32px_rgba(0,0,0,0.45),0_4px_12px_rgba(0,0,0,0.3),0_1px_3px_rgba(0,0,0,0.2)]">
                    {/* Lomo */}
                    <div className="absolute left-0 top-0 bottom-0 w-[10px] sm:w-[12px] bg-gradient-to-r from-black/20 via-black/10 to-transparent z-10 pointer-events-none" />
                    <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-black/10 z-10" />

                    {/* Portada */}
                    <img
                      src={mag.image}
                      alt={mag.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />

                    {/* Brillo superior */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white/15 pointer-events-none" />
                    {/* Borde interior */}
                    <div className="absolute inset-0 rounded-sm ring-1 ring-black/10 pointer-events-none" />
                    {/* Páginas laterales (grosor) */}
                    <div className="absolute right-0 top-[1px] bottom-[1px] w-[4px] bg-gradient-to-l from-black/10 to-white/60 pointer-events-none hidden sm:block" />
                    <div className="absolute bottom-0 left-[1px] right-[1px] h-[4px] bg-gradient-to-t from-black/10 to-transparent pointer-events-none hidden sm:block" />
                  </div>

                  {/* Etiqueta al hover */}
                  <div
                    className={cn(
                      "absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/15 bg-black/25 px-3 py-1 text-xs font-medium text-white shadow-lg backdrop-blur-md transition-all duration-300 pointer-events-none",
                      hovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
                    )}
                  >
                    {mag.name}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {selected && (
        <MagazineViewer magazine={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
