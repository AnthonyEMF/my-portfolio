import { languages, frameworks, databases, tools } from "../storage/tags";

export interface Project {
  title: string;
  description: string;
  images: string[];
  links: { name: string; href: string }[];
  tags: any[];
}

export const projects : Project[] = [
  {
    title: "SIGREF",
    description: 
      "Sistema de Gestión de Receptoria de Fondos, enfocado en la gestión de ingresos, facturación y operaciones administrativas en instituciones de salud. El sistema es multi rol e implementa estándares internacionales de interoperabilidad en salud (HL7 FHIR R4 y parcialmente R5), garantizando compatibilidad con sistemas de información sanitaria global. Desarrollado e implementado para la entidad pública Hospital Regional de Occidente.",
    images: [
      "/images/sigref/sigref-01.webp",
      "/images/sigref/sigref-02.webp",
      "/images/sigref/sigref-03.webp",
      "/images/sigref/sigref-04.webp",
      "/images/sigref/sigref-05.webp",
      "/images/sigref/sigref-06.webp",
      "/images/sigref/sigref-07.webp",
      "/images/sigref/sigref-08.webp",
      "/images/sigref/sigref-09.webp",
      "/images/sigref/sigref-10.webp",
      "/images/sigref/sigref-11.webp",
      "/images/sigref/sigref-12.webp",
      "/images/sigref/sigref-13.webp",
      "/images/sigref/sigref-14.webp",
    ],
    links: [
      {
        name: "Backend + Frontend Web",
        href: "https://github.com/SIGREF-UNAH/SIGREF",
      },
    ],
    tags: [
      languages.cSharp,
      languages.typeScript,
      frameworks.react,
      frameworks.net,
      databases.postgree,
      databases.mongoDb,
      tools.azure,
      tools.docker,
    ],
  },
  {
    title: "ClassNotes",
    description: 
      "Este es un proyecto de clase que fue desarrollado en equipo, orientado al ámbito educativo con el fin de optimizar las labores docentes. Ofrece una amplia variedad de herramientas intuitivas, prácticas y fáciles de implementar, garantizando una experiencia eficiente y accesible para los usuarios.",
    images: [
      "/images/classnotes/classnotes-01.webp",
      "/images/classnotes/classnotes-02.webp",
      "/images/classnotes/classnotes-03.webp",
      "/images/classnotes/classnotes-04.webp",
      "/images/classnotes/classnotes-05.webp",
      "/images/classnotes/classnotes-06.webp",
      "/images/classnotes/classnotes-07.webp",
      "/images/classnotes/classnotes-08.webp",
      "/images/classnotes/classnotes-09.webp",
      "/images/classnotes/classnotes-10.webp",
      "/images/classnotes/classnotes-11.webp",
      "/images/classnotes/classnotes-12.webp",
      "/images/classnotes/classnotes-13.webp",
      "/images/classnotes/classnotes-14.webp",
      "/images/classnotes/classnotes-15.webp",
      "/images/classnotes/classnotes-16.webp",
      "/images/classnotes/classnotes-17.webp",
      "/images/classnotes/classnotes-18.webp",
      "/images/classnotes/classnotes-19.webp",
      "/images/classnotes/classnotes-20.webp",
    ],
    links: [
      {
        name: "Backend",
        href: "https://github.com/TETvega/ClassNotes-BE",
      },
      {
        name: "Frontend Web",
        href: "https://github.com/TETvega/ClassNotes-FE",
      },
      {
        name: "Frontend Mobile",
        href: "https://github.com/TETvega/ClassNotes-FE-Movil",
      },
    ],
    tags: [
      languages.cSharp,
      languages.javaScript,
      languages.typeScript,
      frameworks.react,
      frameworks.net,
      databases.mssql,
      databases.mongoDb,
    ],
  },
  {
    title: "MeetPoint",
    description: "Una red social de eventos que permite a los usuarios descubrir, organizar y participar en eventos sociales. Los usuarios pueden crear eventos, registrarse para asistir a estos e interactuar a través de comentarios. La plataforma clasifica los eventos por categorías, facilita la gestión de asistencias y ofrece un espacio para la interacción social en torno a eventos de interés común.",
    images: [
      "/images/meetpoint/meetpoint-01.webp",
      "/images/meetpoint/meetpoint-02.webp",
      "/images/meetpoint/meetpoint-03.webp",
      "/images/meetpoint/meetpoint-04.webp",
      "/images/meetpoint/meetpoint-05.webp",
      "/images/meetpoint/meetpoint-06.webp",
      "/images/meetpoint/meetpoint-07.webp",
      "/images/meetpoint/meetpoint-08.webp",
      "/images/meetpoint/meetpoint-09.webp",
      "/images/meetpoint/meetpoint-10.webp",
      "/images/meetpoint/meetpoint-11.webp",
      "/images/meetpoint/meetpoint-12.webp",
    ],
    links: [
      {
        name: "Backend + Frontend Web",
        href: "https://github.com/AnthonyEMF/meetpoint",
      },
    ],
    tags: [
      languages.cSharp,
      languages.javaScript,
      frameworks.react,
      frameworks.net,
      databases.mssql,
      tools.docker,
    ],
  },
  {
    title: "SisPaCo",
    description: "Un sistema que esta enfocado en la gestión financiera con partidas contables para facilitar el registro de transacciones, ofreciendo un catálogo de cuentas estructurado, automatizando la actualización de saldos de cuentas, con el objetivo de proporcionar una herramienta eficiente y precisa para manejar la contabilidad de una empresa.",
    images: [
      "/images/sispaco/sispaco-01.webp",
      "/images/sispaco/sispaco-02.webp",
      "/images/sispaco/sispaco-03.webp",
      "/images/sispaco/sispaco-04.webp",
      "/images/sispaco/sispaco-05.webp",
      "/images/sispaco/sispaco-06.webp",
      "/images/sispaco/sispaco-07.webp",
      "/images/sispaco/sispaco-08.webp",
    ],
    links: [
      {
        name: "Backend + Frontend Web",
        href: "https://github.com/AnthonyEMF/sis-pa-co",
      },
    ],
    tags: [
      languages.cSharp,
      languages.javaScript,
      frameworks.react,
      frameworks.net,
      databases.mssql,
    ],
  },
];

export const otherProjects = {
  title: "Revistas",
  description: "Durante el bachillerato, reforcé mis habilidades en diseño gráfico creando dos revistas con CorelDraw (para ilustración y maquetación) y Photoshop (para edición de imágenes), lo que me permitió mejorar en composición, tipografía y manejo de color.",
  links: [
    {
      name: "Revista de Carpintería",
      image: "/images/revista-01.webp",
      href: "https://drive.google.com/file/d/1rvNVsJn-dUcBnSh6D6qSWkHfsBbXdVjK/view?usp=sharing",
    },
    {
      name: "Revista de Jardinería",
      image: "/images/revista-02.webp",
      href: "https://drive.google.com/file/d/1woo7eHkjJC-z7FueLnuDbDXryXSxoNtL/view?usp=sharing",
    },
  ],
}