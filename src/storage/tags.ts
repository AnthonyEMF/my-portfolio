import ReactJS from "../icons/frameworks/ReactJS.astro";
import MsSQL from "../icons/databases/MsSQL.astro";
import MongoDB from "../icons/databases/MongoDB.astro";
import Csharp from "../icons/languages/Csharp.astro";
import Python from "../icons/languages/Python.astro";
import JavaScript from "../icons/languages/JavaScript.astro";
import TypeScript from "../icons/languages/TypeScript.astro";
import HTML from "../icons/languages/HTML.astro";
import CSS from "../icons/languages/CSS.astro";
import NodeJS from "../icons/frameworks/NodeJS.astro";
import Astro from "../icons/frameworks/Astro.astro";
import Expo from "../icons/frameworks/Expo.astro";
import MicrosoftNet from "../icons/frameworks/MicrosoftNet.astro";
import Tailwind from "../icons/frameworks/Tailwind.astro";
import Bootstrap from "../icons/frameworks/Bootstrap.astro";
import MySQL from "../icons/databases/MySQL.astro";
import PostgreSQL from "../icons/databases/PostgreSQL.astro";
import GitHub from "../icons/social/GitHub.astro";
import ExpressJS from "../icons/frameworks/ExpressJS.astro";
import Git from "../icons/tools/Git.astro";
import Azure from "../icons/tools/Azure.astro";
import Docker from "../icons/tools/Docker.astro";
import Figma from "../icons/tools/Figma.astro";
import PowerBI from "../icons/tools/PowerBI.astro";
import Tableau from "../icons/tools/Tableau.astro";
import Pentaho from "../icons/tools/Pentaho.astro";
import Vercel from "../icons/tools/Vercel.astro";
import Next from "../icons/frameworks/Next.astro";
import Nest from "../icons/frameworks/Nest.astro";
import Aws from "../icons/tools/Aws.astro";
import GoogleCloud from "../icons/tools/GoogleCloud.astro";
import Supabase from "../icons/frameworks/Supabase.astro";

const colors = {
  orange: "bg-orange-500/15 backdrop-blur-md border border-orange-400/20",
  yellow: "bg-yellow-500/15 backdrop-blur-md border border-yellow-400/20",
  blue: "bg-blue-500/15 backdrop-blur-md border border-blue-400/20",
  red: "bg-red-500/15 backdrop-blur-md border border-red-400/20",
  green: "bg-emerald-500/15 backdrop-blur-md border border-emerald-400/20",
  purple: "bg-violet-500/15 backdrop-blur-md border border-violet-400/20",
  cyan: "bg-cyan-500/15 backdrop-blur-md border border-cyan-400/20",
  gray: "bg-white/[0.06] backdrop-blur-md border border-white/10",
};

export interface Tag {
  name: string;
  class: string;
  icon: any;
}

export const languages: Record<string, Tag> = {
  html: {
    name: "HTML",
    class: colors.orange,
    icon: HTML,
  },
  css: {
    name: "CSS",
    class: colors.blue,
    icon: CSS,
  },
  javaScript: {
    name: "JavaScript",
    class: colors.yellow,
    icon: JavaScript,
  },
  typeScript: {
    name: "TypeScript",
    class: colors.blue,
    icon: TypeScript,
  },
  cSharp: {
    name: "C#",
    class: colors.purple,
    icon: Csharp,
  },
  python: {
    name: "Python",
    class: colors.yellow,
    icon: Python,
  },
};

export const frameworks: Record<string, Tag> = {
  node: {
    name: "Node.js",
    class: colors.green,
    icon: NodeJS,
  },
  react: {
    name: "React",
    class: colors.cyan,
    icon: ReactJS,
  },
  next: {
    name: "Next",
    class: colors.gray,
    icon: Next,
  },
  astro: {
    name: "Astro",
    class: colors.orange,
    icon: Astro,
  },
  expo: {
    name: "Expo",
    class: colors.gray,
    icon: Expo,
  },
  tailwind: {
    name: "Tailwind",
    class: colors.cyan,
    icon: Tailwind,
  },
  net: {
    name: ".NET Core",
    class: colors.purple,
    icon: MicrosoftNet,
  },
  nest: {
    name: "Nest",
    class: colors.red,
    icon: Nest,
  },
};

export const databases: Record<string, Tag> = {
  mssql: {
    name: "MS SQL Server",
    class: colors.red,
    icon: MsSQL,
  },
  mysql: {
    name: "MySQL",
    class: colors.gray,
    icon: MySQL,
  },
  postgree: {
    name: "PostgreSQL",
    class: colors.blue,
    icon: PostgreSQL,
  },
  mongoDb: {
    name: "MongoDB",
    class: colors.green,
    icon: MongoDB,
  },
  supabase: {
    name: "Supabase",
    class: colors.green,
    icon: Supabase,
  },
};

export const tools: Record<string, Tag> = {
  gitHub: {
    name: "GitHub",
    class: colors.gray,
    icon: GitHub,
  },
  git: {
    name: "Git",
    class: colors.orange,
    icon: Git,
  },
  cloud: {
    name: "Google Cloud",
    class: colors.gray,
    icon: GoogleCloud,
  },
  docker: {
    name: "Docker",
    class: colors.blue,
    icon: Docker,
  },
  figma: {
    name: "Figma",
    class: colors.gray,
    icon: Figma,
  },
  powerBi: {
    name: "PowerBI",
    class: colors.yellow,
    icon: PowerBI,
  },
  pentaho: {
    name: "Pentaho",
    class: colors.gray,
    icon: Pentaho,
  },
};
