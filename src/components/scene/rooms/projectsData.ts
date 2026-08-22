export interface ProjectEntry {
  id: string;
  name: string;
  tagline: string;
  stack: string[];
  description: string;
  githubUrl?: string;
}

export const PROJECTS: ProjectEntry[] = [
  {
    id: "udaan",
    name: "Udaan",
    tagline: "A 3D travel planner that flies you through your own itinerary",
    stack: ["Next.js 14", "React Three Fiber", "Express + TypeScript", "node:sqlite"],
    description:
      "Full-stack 3D travel planner with a \"Dusk Flight\" theme — a scroll-driven 3D airplane animation carries you through the planning experience instead of a flat form.",
    githubUrl: "https://github.com/mk-2007/TravelPlanner---Udaan",
  },
  {
    id: "rag-chatbot",
    name: "Simple RAG Chatbot",
    tagline: "A text-based retrieval-augmented chatbot",
    stack: [
      "LangChain",
      "ChromaDB",
      "HuggingFace sentence-transformers",
      "ChatGroq (llama-3.1-8b-instant)",
      "Streamlit",
    ],
    description:
      "Retrieval-augmented chatbot with a neumorphic Streamlit frontend — embeddings via HuggingFace sentence-transformers, retrieval via ChromaDB, generation via Groq's llama-3.1-8b-instant.",
    githubUrl: "https://github.com/mk-2007/AI-Season---RAG-ChatBot",
  },
  {
    id: "multimodal-rag",
    name: "Multimodal RAG Chatbot",
    tagline: "A retrieval-augmented chatbot that reasons over text and images together",
    stack: ["Python", "Multimodal embeddings", "RAG pipeline"],
    description:
      "Multimodal RAG system built from scratch as an assignment submission, using \"Attention Is All You Need\" as source material to retrieve and reason over.",
    githubUrl: "https://github.com/mk-2007/Multimodal-Rag-ChatBot",
  },
  {
    id: "whatsapp-bot",
    name: "WhatsApp Bot",
    tagline: "A WhatsApp chatbot that remembers who it's talking to",
    stack: ["Baileys", "LangChain.js", "Node.js", "Python (hybrid)"],
    description:
      "A WhatsApp-native RAG chatbot built for Al-Noor Institute, combining a Baileys connection with a LangChain.js pipeline plus a personal-fact memory layer so it holds context across a conversation.",
    githubUrl: "https://github.com/mk-2007/WhatsApp-Bot---Al-Noor-Institute",
  },
  {
    id: "lead-generation-agent",
    name: "Lead Generating Agent",
    tagline: "An agent that scrapes the web to find business leads for you",
    stack: ["LangGraph", "Playwright", "Groq", "Excel export"],
    description:
      "Hackathon-deployable agent that autonomously browses for potential business leads via browser automation and exports the results straight to Excel — built backend-first, agent logic before any UI.",
    githubUrl: "https://github.com/mk-2007/Lead-Generation-Agent-with-Browser-Automation-and-Excel-Export",
  },
  {
    id: "typemaster",
    name: "TypeMaster",
    tagline: "A console-based C++ typing speed application",
    stack: ["C++", "OOP"],
    description:
      "An OOP-focused semester project — a console typing speed application with accuracy tracking, built to exercise clean class design over a flat procedural approach.",
    githubUrl: "https://github.com/mk-2007/TypeMaster---C-typing-appilcation",
  },
];
