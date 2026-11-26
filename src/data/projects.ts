export type ProjectKind = "case-study" | "external";
export type ProjectStatus = "proven" | "validating" | "gated" | "public-repo";

export interface ProjectSummary {
  id: string;
  name: string;
  subtitle: string;
  badge: string;
  kind: ProjectKind;
  route?: "ikilang";
  externalUrl?: string;
  summary: string;
  highlights: string[];
  tags: string[];
  status: ProjectStatus;
  statusLabel: string;
  ctaLabel: string;
}

export const PUBLIC_PROJECTS: ProjectSummary[] = [
  {
    id: "ikilang",
    name: "IkiLang / KinyaVoice",
    subtitle: "Live Kinyarwanda via Soundboard → English Captions",
    badge: "Flagship system · Live trials",
    kind: "case-study",
    route: "ikilang",
    summary:
      "Streams live Kinyarwanda speech from a soundboard or phone mic to English captions on visitor phones and room projectors in ~1 second — no app install, no account.",
    highlights: [
      "+1.02 s caption delay after speech end on live 16 kHz WebSocket replay",
      "451 passing tests (385 Python, 66 TypeScript) · 0.10 ms p95 quality-check time",
      "0% mid-sentence cutoffs on 16-clause fast-speech benchmark (down from 85.7%)",
      "Built for newcomers in clinics and services, plus visiting NGO, clinic, and ministry teams",
    ],
    tags: [
      "Python",
      "FastAPI",
      "React",
      "TypeScript",
      "Web Audio API",
      "WebSockets",
      "Speech AI",
    ],
    status: "validating",
    statusLabel: "Live trials",
    ctaLabel: "Open interactive case study",
  },
  {
    id: "agri-for-prairie",
    name: "AgriAI for Prairie",
    subtitle: "Applied AI side project built for agricultural producers.",
    badge: "Side project · GitHub",
    kind: "external",
    externalUrl: "https://github.com/cHrisbErg2/AgrI-For-Prairie",
    summary:
      "Another side project in active development exploring practical decision tools for agricultural producers.",
    highlights: [
      "Separate side project linked on GitHub",
      "Built around practical workflows for agricultural producers",
    ],
    tags: ["Applied AI", "AgTech", "Side project", "GitHub"],
    status: "public-repo",
    statusLabel: "GitHub project",
    ctaLabel: "View repository on GitHub",
  },
];
