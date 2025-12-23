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

const colors = {
  orange: "bg-orange-500/30 border-2 border-orange-500/30",
  yellow: "bg-yellow-500/30 border-2 border-yellow-500/30",
  blue: "bg-blue-500/30 border-2 border-blue-500/30",
  red: "bg-red-500/30 border-2 border-red-500/30",
  green: "bg-green-500/30 border-2 border-green-500/30",
  purple: "bg-purple-500/30 border-2 border-purple-500/30",
  cyan: "bg-cyan-500/30 border-2 border-cyan-500/30",
  gray: "bg-gray-500/30 border-2 border-gray-500/30",
}

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
  cSharp: {
    name: "C#",
    class: colors.purple,
    icon: Csharp,
  },
  cPlus: {
    name: "Python",
    class: colors.yellow,
    icon: Python,
  },
  typeScript: {
    name: "TypeScript",
    class: colors.blue,
    icon: TypeScript,
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
  astro: {
    name: "Astro",
    class: colors.gray,
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
  bootstrap: {
    name: "Bootstrap",
    class: colors.purple,
    icon: Bootstrap,
  },
  net: {
    name: "Microsoft .NET",
    class: colors.purple,
    icon: MicrosoftNet,
  },
  express: {
    name: "Express.js",
    class: colors.gray,
    icon: ExpressJS,
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
  azure: {
    name: "Azure",
    class: colors.blue,
    icon: Azure,
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
  tableau: {
    name: "Tableau",
    class: colors.gray,
    icon: Tableau,
  },
  pentaho: {
    name: "Pentaho",
    class: colors.gray,
    icon: Pentaho,
  },
}