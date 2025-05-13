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
      "Mi nombre completo es Anthony Edward Miranda Fuentes pero me puedes decir Tony, estudio Ingeniería en Sistemas en la UNAH Copán, estoy a un año de graduarme y abierto a nuevos proyectos.",
    icon: Contract,
  },
  {
    content:
      "Mi especialización es el desarrollo de aplicaciones web y móviles, aunque también tengo experiencia en gestión de proyectos, bases de datos, diseño gráfico, ofimática, mantenimiento y nociones de contabilidad.",
    icon: Briefcase,
  },
  {
    content:
      "Soy un apasionado por la tecnología y la innovación, disfruto aprender y crear soluciones nuevas. Soy proactivo, adaptable y trabajo bien en equipo para alcanzar metas desafiantes.",
    icon: Happy,
  },
];
