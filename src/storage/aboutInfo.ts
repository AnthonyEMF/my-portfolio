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
      "Anthony Edward Miranda Fuentes, estudiante de Ingeniería en Sistemas en UNAH Campus Copán. A un año de graduarme y listo para nuevos desafíos.",
    icon: Contract,
  },
  {
    content:
      "Especializado en desarrollo web y móvil. Experiencia en gestión de proyectos, bases de datos y diseño.",
    icon: Briefcase,
  },
  {
    content:
      "Apasionado por la innovación tecnológica. Proactivo, adaptable y orientado a resultados en equipo.",
    icon: Happy,
  },
];