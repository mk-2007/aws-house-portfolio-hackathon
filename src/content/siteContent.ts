/**
 * Single source of truth for the plain-text version of the portfolio.
 * The 3D rooms draw their own copy inside the canvas (crawlers and screen
 * readers can't read a WebGL canvas), so this file feeds two text surfaces:
 *   1. ClassicView  - the visible, accessible, fast "no 3D" version.
 *   2. SeoContent   - a visually hidden copy in the static HTML for crawlers.
 * Edit text HERE once and both stay in sync.
 */
import { PROJECTS } from "@/components/scene/rooms/projectsData";

export const SITE_URL = "https://main.d2gaf2v937ut0e.amplifyapp.com";

export const PERSON = {
  name: "Mahandar Kumar",
  role: "AI Engineer \u2022 Full-Stack Developer \u2022 Systems Thinker",
  school: "BSCS student at FAST-NUCES Karachi",
  motto: "Living to lead a change",
  quote: "Every great product starts with a bold question.",
};

export const ABOUT = {
  intro: [
    "I am a Computer Science student dedicated to architecting scalable backend systems, autonomous AI agents, and intuitive multimodal applications that deliver real impact.",
    "Whether it's developing AI-powered applications, designing backend systems, or solving complex programming challenges, I'm always excited to take on the next opportunity.",
  ],
  philosophy: [
    {
      title: "Precision & Robust Architecture",
      body: "Build software that remains resilient, testable, and maintainable under scale.",
    },
    {
      title: "Practical AI Integration",
      body: "Harness RAG pipelines and vector intelligence to solve genuine, domain-specific challenges.",
    },
    {
      title: "Continuous Curiosity",
      body: "Master modern frameworks, optimize algorithms, and turn complex theory into clean code.",
    },
  ],
};

export const SKILL_GROUPS: { title: string; items: string[] }[] = [
  { title: "Programming Languages", items: ["Python", "C++", "JavaScript", "TypeScript", "SQL"] },
  { title: "Databases & Vector Stores", items: ["PostgreSQL", "SQLite", "ChromaDB", "Vector Databases", "Redis Cache"] },
  {
    title: "Artificial Intelligence & RAG",
    items: [
      "Retrieval-Augmented Generation",
      "LangChain",
      "Hugging Face",
      "Embedding Models",
      "Vector Search",
      "Prompt Engineering",
    ],
  },
  { title: "Backend Architecture", items: ["FastAPI", "RESTful APIs", "JWT Auth", "Async Pipelines", "Node.js"] },
  {
    title: "Tools & Computer Science",
    items: ["Git & GitHub", "Docker", "Linux", "VS Code", "Postman", "OOP", "Data Structures", "Algorithms"],
  },
];

export const PROJECT_LIST = PROJECTS;

export const LINKS = [
  { label: "Email", href: "mailto:mk6447959@gmail.com", text: "mk6447959@gmail.com" },
  { label: "GitHub", href: "https://github.com/mk-2007", text: "mk-2007" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/mahandar-khatri-9098493aa", text: "mahandar-khatri" },
  { label: "Codeforces", href: "https://codeforces.com/profile/_gazzy284", text: "_gazzy284" },
  { label: "LeetCode", href: "https://leetcode.com/u/struck_high/", text: "struck_high" },
  { label: "Resume (PDF)", href: "/Resume.pdf", text: "Download" },
];
