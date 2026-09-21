import type { AstroComponentFactory } from "astro/runtime/server/index.js";
import Aws from "../icons/tools/Aws.astro";
import GoogleCloud from "../icons/tools/GoogleCloud.astro";

export interface Education {
  title: string;
  date: string;
  description: string;
  link: string;
  logo: string | AstroComponentFactory;
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
    date: "2022 - 2026",
    description: "Universidad Nacional Autónoma de Honduras",
    link: "https://www.unah.edu.hn",
    logo: "/images/logos/unah.webp",
  },
];

export const certifications: Education[] = [
  {
    title: "Fundamentos de AWS: Cloud, Serverless y Operación",
    date: "20 de Septiembre 2026",
    description: "Commit Academy",
    link: "https://www.commitacademy.io/app/verify-certificate/cert_yhe5UVqhmO",
    logo: Aws,
  },
];
