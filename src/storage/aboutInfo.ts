import Briefcase from "../icons/Briefcase.astro";
import Contract from "../icons/Contract.astro";
import Happy from "../icons/Happy.astro";

export interface AboutInfo {
  content: string;
  icon: any;
}

export const aboutInfo: AboutInfo[] = [
  {
    content:
      "Mis formaciones como Ingeniero en Sistemas de la Universidad Nacional Autónoma de Honduras y Bachiller Técnico en Informática me permitieron desarrollar habilidades en cuanto a cualquier tema de computación se refiere.",
    icon: Contract,
  },
  {
    content:
      "Me enfoco principalmente en el desarrollo de software pero tengo experiencia en DevOps, TI, redes, bases de datos, análisis y diseño de sistemas.",
    icon: Briefcase,
  },
  {
    content:
      "Asumo el rol de líder cuando la situación lo requiere, priorizando el fortalecimiento de los vínculos con mis compañeros para asegurar que el equipo alcance sus objetivos.",
    icon: Happy,
  },
];
