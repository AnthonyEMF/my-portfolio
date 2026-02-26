export interface Education {
  title: string;
  date: string;
  description: string;
  link: string;
  logo: string;
}

export const educations : Education[] = [
  {
    title: "Bachiller Técnico Profesional en Informática",
    date: "2019 - 2021",
    description: "Instituto Gubernamental Álvaro Contreras",
    link: "https://drive.google.com/file/d/1gPp-VOkUocV4gwrO8h9rxfQ1kFTtFBC1/view?usp=sharing",
    logo: "/images/logos/idac.webp",
  },
  {
    title: "Ingeniería en Sistemas",
    date: "2022 - Act",
    description: "Universidad Nacional Autónoma de Honduras",
    link: "https://www.unah.edu.hn",
    logo: "/images/logos/unah.webp",
  },
];
