import type { IconType } from "react-icons";
import {
  SiCplusplus,
  SiPython,
  SiJavascript,
  SiTypescript,
  SiFastapi,
  SiSqlite,
  SiPostgresql,
  SiHuggingface,
  SiDocker,
  SiPostman,
  SiLinux,
  SiGit,
  SiGithub,
  SiLangchain,
  SiNodedotjs,
} from "react-icons/si";
import {
  TbDatabase,
  TbBrain,
  TbMessageCircle,
  TbApi,
  TbLock,
  TbFileText,
  TbBinaryTree2,
  TbMathFunction,
  TbTrophy,
  TbBulb,
  TbBrandVscode,
  TbVector,
  TbSearch,
  TbListSearch,
  TbCode,
  TbPlugConnected,
} from "react-icons/tb";

/**
 * Real brand icons (react-icons/si) and clean conceptual icons (react-icons/tb).
 */
export const TECH_ICONS: Record<string, IconType> = {
  // Languages
  Python: SiPython,
  "C++": SiCplusplus,
  SQL: TbDatabase,
  JavaScript: SiJavascript,
  TypeScript: SiTypescript,

  // Artificial Intelligence
  "Retrieval-Augmented Generation": TbBrain,
  RAG: TbBrain,
  LangChain: SiLangchain,
  "Hugging Face": SiHuggingface,
  "Embedding Models": TbVector,
  "Vector Search": TbSearch,
  "BM25 Retrieval": TbListSearch,
  "Prompt Engineering": TbMessageCircle,

  // Backend
  FastAPI: SiFastapi,
  "REST APIs": TbApi,
  "RESTful APIs": TbApi,
  Authentication: TbLock,
  "JWT Auth": TbLock,
  "API Integration": TbPlugConnected,
  "File Processing": TbFileText,
  "Node.js": SiNodedotjs,
  "Async Pipelines": TbPlugConnected,

  // Databases
  PostgreSQL: SiPostgresql,
  SQLite: SiSqlite,
  ChromaDB: TbDatabase,
  "Vector Databases": TbDatabase,
  "Vector DBs": TbDatabase,
  "Redis Cache": TbDatabase,

  // Development
  Git: SiGit,
  "Git & GitHub": SiGit,
  GitHub: SiGithub,
  Docker: SiDocker,
  Linux: SiLinux,
  "VS Code": TbBrandVscode,
  Postman: SiPostman,

  // Foundations
  "Data Structures": TbBinaryTree2,
  Algorithms: TbMathFunction,
  "Object-Oriented Programming": TbCode,
  OOP: TbCode,
  "Competitive Programming": TbTrophy,
  "Problem Solving": TbBulb,
};

export function TechTag({ label }: { label: string }) {
  const Icon = TECH_ICONS[label];
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium border border-[var(--color-ink)]/30 bg-[var(--color-ink)]/5 px-2.5 py-1 rounded whitespace-nowrap text-[var(--color-ink)]">
      {Icon ? <Icon size={13} className="shrink-0 text-[var(--color-masthead)]" /> : null}
      <span>{label}</span>
    </span>
  );
}
