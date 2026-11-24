export interface EngineeringPrinciple {
  id: string;
  title: string;
  detail: string;
}

export interface ProfileConfig {
  name: string;
  roleLine: string;
  builderSummary: string;
  affiliation: string;
  locationLabel: string;
  githubUrl: string;
  email: string;
  linkedinUrl: string;
  resumeUrl: string;
  focusAreas: string[];
  principles: EngineeringPrinciple[];
}

export const PROFILE: ProfileConfig = {
  name: "Christian Muhirwa",
  roleLine:
    "Applied AI and real-time systems builder — shipping field-tested speech software under live latency and privacy constraints.",
  builderSummary:
    "I build and measure production-oriented systems for real rooms, prioritizing empirical baselines, clean boundaries, and zero-PII design.",
  affiliation: "University of Saskatchewan",
  locationLabel: "Saskatchewan, Canada",
  githubUrl: "https://github.com/cHrisbErg2",
  email: "kos536@usask.ca",
  linkedinUrl: "",
  resumeUrl: "",
  focusAreas: [
    "Real-Time Speech Systems",
    "Low-Resource Language AI",
    "Privacy-Minimal Architecture",
    "Evaluation-First Engineering",
  ],
  principles: [
    {
      id: "field-reality",
      title: "Build for real rooms",
      detail:
        "Design for soundboards, mobile WebViews, and rapid speech rather than clean lab recordings.",
    },
    {
      id: "measure-first",
      title: "Evaluate before fine-tuning",
      detail:
        "Measure labeled baselines, p95 latency, and error categories before training heavier models.",
    },
    {
      id: "privacy-minimal",
      title: "Treat privacy as architecture",
      detail:
        "Keep audience access zero-PII and tracker-free, label transport honestly, and ship only what is proven.",
    },
  ],
};
