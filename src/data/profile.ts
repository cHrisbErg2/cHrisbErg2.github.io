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
    "Applied AI & Real-Time Systems Builder — shipping field-tested speech and community software rather than waiting for classroom assignments.",
  builderSummary:
    "I design and validate real-world software systems under live acoustic, latency, and privacy constraints. Every project here emphasizes measurable reliability, clean interface boundaries, and honest engineering maturity over surface-level demos.",
  affiliation: "University of Saskatchewan",
  locationLabel: "Saskatchewan, Canada",
  githubUrl: "https://github.com/cHrisbErg2",
  email: "kos536@usask.ca",
  linkedinUrl: "",
  resumeUrl: "",
  focusAreas: [
    "Real-Time Speech Systems",
    "Low-Resource Language AI",
    "Privacy-Minimal Web Architecture",
    "Evaluation-First Engineering",
  ],
  principles: [
    {
      id: "field-reality",
      title: "Build for Real Rooms, Not Clean Demos",
      detail:
        "Design around soundboards, mobile WebViews, fast uninterrupted speakers, and low-bandwidth venues rather than curated lab clips.",
    },
    {
      id: "measure-first",
      title: "Evaluate Before Fine-Tuning",
      detail:
        "Establish hand-labeled baselines, latency percentiles, and concrete error taxonomies before reaching for heavier models or training runs.",
    },
    {
      id: "privacy-minimal",
      title: "Privacy & Honesty as Architecture",
      detail:
        "Keep attendee access zero-PII and tracker-free, separate encrypted transport from server-side processing honestly, and label only what is proven today.",
    },
  ],
};
