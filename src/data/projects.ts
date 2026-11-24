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
    subtitle: "Real-Time Low-Resource Speech Translation & Live Captions",
    badge: "Flagship blueprint · Active validation",
    kind: "case-study",
    route: "ikilang",
    summary:
      "Continuous streaming speech-translation blueprint built for real rooms and cross-cultural access, starting with Kinyarwanda captions-only trials backed by offline evaluation and zero-PII browser delivery.",
    highlights: [
      "+1.02 s live replay caption latency (< 1.5 s p95 target)",
      "451 automated tests passing (385 backend, 66 frontend) + 0.10 ms p95 guardrail overhead",
      "Zero-download QR mobile and projector views with zero attendee PII",
      "Bidirectional bridge for newcomers and visiting NGO, clinic, ministry, and travel teams",
    ],
    tags: [
      "Python",
      "FastAPI",
      "React",
      "TypeScript",
      "Web Audio API",
      "WebSockets",
      "Real-Time Speech AI",
    ],
    status: "validating",
    statusLabel: "Active validation",
    ctaLabel: "Open interactive case study",
  },
  {
    id: "agri-for-prairie",
    name: "AgriAI for Prairie",
    subtitle: "Farmer-first field intelligence, developed in Saskatchewan.",
    badge: "Public repository",
    kind: "external",
    externalUrl: "https://github.com/cHrisbErg2/AgrI-For-Prairie",
    summary:
      "Independent applied AI project exploring practical agronomic workflows for prairie growers.",
    highlights: [
      "Standalone public GitHub repository",
      "Built in Saskatchewan around grower decision workflows",
    ],
    tags: ["Applied AI", "AgTech", "Saskatchewan", "Public GitHub"],
    status: "public-repo",
    statusLabel: "Public GitHub repo",
    ctaLabel: "View repository on GitHub",
  },
];
