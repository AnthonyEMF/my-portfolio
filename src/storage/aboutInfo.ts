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
      "Estudiante de Ingeniería en Sistemas en UNAH Campus Copán. A punto de graduarme y listo para nuevos desafíos.",
    icon: Contract,
  },
  {
    content:
      "Especializado en desarrollo web y móvil full stack. Experiencia en gestión de proyectos, infraestructura de redes, bases de datos, análisis y diseño de sistemas.",
    icon: Briefcase,
  },
  {
    content:
      "Apasionado por la innovación tecnológica. Proactivo, adaptable y orientado a resultados en equipo.",
    icon: Happy,
  },
];