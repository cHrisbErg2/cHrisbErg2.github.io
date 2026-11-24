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
    subtitle: "Live Kinyarwanda → English Captions via Soundboard & QR",
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
    subtitle: "Applied AI tools for Saskatchewan grain growers.",
    badge: "Public repository",
    kind: "external",
    externalUrl: "https://github.com/cHrisbErg2/AgrI-For-Prairie",
    summary:
      "Open-source agricultural software focused on practical field decisions for prairie farms.",
    highlights: [
      "Open-source repository on GitHub",
      "Built in Saskatchewan around real grower workflows",
    ],
    tags: ["Applied AI", "AgTech", "Saskatchewan", "GitHub"],
    status: "public-repo",
    statusLabel: "Public repo",
    ctaLabel: "View repository on GitHub",
  },
];
