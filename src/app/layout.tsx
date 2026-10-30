import type { Metadata, Viewport } from "next";
import { PERSON, SITE_URL, LINKS } from "@/content/siteContent";
import { bacley, spirtush } from "./fonts";
import "./globals.css";

const DESCRIPTION =
  "Mahandar Kumar \u2014 BSCS student at FAST-NUCES Karachi. Explore a 3D newspaper-house portfolio of AI/ML, full-stack and competitive-programming projects. Hidden keys unlock a secret attic.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Mahandar Kumar \u2014 3D House Portfolio",
  description: DESCRIPTION,
  keywords: ["Mahandar Kumar", "portfolio", "AI engineer", "full-stack developer", "RAG", "React Three Fiber", "FAST-NUCES"],
  authors: [{ name: PERSON.name }],
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "Mahandar Kumar \u2014 3D House Portfolio",
    description: DESCRIPTION,
    siteName: "Mahandar Kumar Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mahandar Kumar \u2014 3D House Portfolio",
    description: DESCRIPTION,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0d0c0a",
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: PERSON.name,
  url: SITE_URL,
  jobTitle: "Computer Science student and AI / full-stack developer",
  affiliation: { "@type": "CollegeOrUniversity", name: "FAST-NUCES Karachi" },
  sameAs: LINKS.filter((l) => l.href.startsWith("http")).map((l) => l.href),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bacley.variable} ${spirtush.variable} h-full antialiased`}
    >
      <body className="h-screen w-screen overflow-hidden flex flex-col bg-[var(--color-corridor-floor)] text-[var(--color-ink)]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
        {children}
      </body>
    </html>
  );
}
