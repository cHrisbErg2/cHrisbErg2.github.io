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
    subtitle: "Real-Time Low-Resource Speech Translation & Accessible Live Captions",
    badge: "Flagship Blueprint · Active Validation",
    kind: "case-study",
    route: "ikilang",
    summary:
      "A continuous-streaming speech translation blueprint built for real gatherings, clinics, NGOs, and cross-cultural outreach — starting with Kinyarwanda captions-only live trials backed by an offline evaluation harness and zero-PII browser delivery.",
    highlights: [
      "Sub-1.5 s target p95 caption latency budget for rapid uninterrupted speech",
      "420+ automated tests across backend audio/fallback contracts and frontend UI",
      "Zero-download QR mobile and sanctuary projector views with zero attendee PII",
      "Bidirectional dignity framing for newcomers and visiting community partners",
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
    statusLabel: "Active Validation",
    ctaLabel: "Explore Interactive Case Study",
  },
  {
    id: "agri-for-prairie",
    name: "AgriAI for Prairie",
    subtitle: "Farmer-first field intelligence, developed in Saskatchewan.",
    badge: "Public Repository",
    kind: "external",
    externalUrl: "https://github.com/cHrisbErg2/AgrI-For-Prairie",
    summary:
      "AgriAI for Prairie — Farmer-first field intelligence, developed in Saskatchewan. An independent applied project exploring practical agronomic insights tailored to prairie growing workflows.",
    highlights: [
      "Standalone public GitHub repository",
      "Built in Saskatchewan with farmer-first workflow focus",
    ],
    tags: ["Applied AI", "AgTech", "Saskatchewan", "Public GitHub"],
    status: "public-repo",
    statusLabel: "Public GitHub Repo",
    ctaLabel: "Open Repository on GitHub",
  },
];
