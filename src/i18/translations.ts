export const translations = {
  es: {
    nav: {
      home: "Inicio",
      about: "Sobre mí",
      education: "Formación",
      skills: "Habilidades",
      projects: "Proyectos",
    },
    hero: {
      greeting: "Hola, soy Anthony 👋🏻",
      available: "Disponible para trabajar",
      title: "Ingeniero en Sistemas.",
      subtitle: "Desarrollador Web/Mobile FullStack.",
      focus: "Enfocado en la innovación.",
      location: "De Santa Rosa de Copán, Honduras.",
      contact: "Contáctame",
    },
    about: {
      title: "Sobre mí",
      info: [
        {
          text: "Estudiante de Ingeniería en Sistemas en UNAH Campus Copán. A punto de graduarme y listo para nuevos desafíos.",
          icon: "Contract",
        },
        {
          text: "Especializado en desarrollo web y móvil full stack. Experiencia en gestión de proyectos, infraestructura de redes, bases de datos, análisis y diseño de sistemas.",
          icon: "Briefcase",
        },
        {
          text: "Apasionado por la innovación tecnológica. Proactivo, adaptable y orientado a resultados en equipo.",
          icon: "Happy",
        },
      ],
    },
    education: {
      title: "Formación Académica",
      bachelor: "Bachiller Técnico Profesional en Informática",
      bachelorSchool: "Instituto Gubernamental Álvaro Contreras",
      engineering: "Ingeniería en Sistemas",
      engineeringSchool: "Universidad Nacional Autónoma de Honduras",
      present: "Actual",
    },
    skills: {
      title: "Habilidades",
      languages: "Lenguajes",
      frameworks: "Frameworks y Librerías",
      databases: "Bases de datos",
      tools: "Otras herramientas",
    },
    projects: {
      title: "Proyectos",
      other: "Otros Proyectos",
      magazines: "Revistas",
      magazineDesc: "Durante el bachillerato, reforcé mis habilidades en diseño gráfico creando dos revistas con CorelDraw y Photoshop.",
      carpentry: "Revista de Carpintería",
      gardening: "Revista de Jardinería",
    },
    footer: {
      madeWith: "Hecho con",
      and: "y",
    },
  },
  en: {
    nav: {
      home: "Home",
      about: "About",
      education: "Education",
      skills: "Skills",
      projects: "Projects",
    },
    hero: {
      greeting: "Hi, I'm Anthony 👋🏻",
      available: "Available for work",
      title: "Systems Engineer.",
      subtitle: "FullStack Web/Mobile Developer.",
      focus: "Focused on innovation.",
      location: "From Santa Rosa de Copán, Honduras.",
      contact: "Contact me",
    },
    about: {
      title: "About Me",
      info: [
        {
          text: "Systems Engineering student at UNAH Campus Copán. About to graduate and ready for new challenges.",
          icon: "Contract",
        },
        {
          text: "Specialized in full stack web and mobile development. Experience in project management, network infrastructure, databases, systems analysis and design.",
          icon: "Briefcase",
        },
        {
          text: "Passionate about technological innovation. Proactive, adaptable and results-oriented in teams.",
          icon: "Happy",
        },
      ],
    },
    education: {
      title: "Education",
      bachelor: "Professional Technical Bachelor in Computing",
      bachelorSchool: "Instituto Gubernamental Álvaro Contreras",
      engineering: "Systems Engineering",
      engineeringSchool: "Universidad Nacional Autónoma de Honduras",
      present: "Present",
    },
    skills: {
      title: "Skills",
      languages: "Languages",
      frameworks: "Frameworks and Libraries",
      databases: "Databases",
      tools: "Other tools",
    },
    projects: {
      title: "Projects",
      other: "Other Projects",
      magazines: "Magazines",
      magazineDesc: "During high school, I strengthened my graphic design skills by creating two magazines with CorelDraw and Photoshop.",
      carpentry: "Carpentry Magazine",
      gardening: "Gardening Magazine",
    },
    footer: {
      madeWith: "Made with",
      and: "and",
    },
  },
};

export type Language = "es" | "en";
export type TranslationKey = typeof translations.es;