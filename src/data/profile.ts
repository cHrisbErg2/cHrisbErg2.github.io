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
    "Computer Engineering Student & Entrepreneur · Department of Electrical and Computer Engineering, USask",
  builderSummary:
    "Solving everyday problems around me through curiosity, validation, and testing before building. Across Digital Signal Processing, Speech AI, Edge Computing, Embedded ML, and AgTech, I stretch software and hardware boundaries for reliability, accessibility, mutual value, and continuous growth from honest feedback.",
  affiliation: "University of Saskatchewan",
  locationLabel: "Saskatoon, SK",
  githubUrl: "https://github.com/cHrisbErg2",
  email: "christian.muhirwa@usask.ca",
  linkedinUrl: "",
  resumeUrl: "",
  focusAreas: [
    "Digital Signal Processing",
    "Speech AI",
    "Edge Computing",
    "Embedded ML",
    "AgTech",
  ],
  principles: [
    {
      id: "validate-first",
      title: "Curiosity, validation & testing first",
      detail:
        "Start with real problems people face and validate assumptions with hands-on testing before committing to architecture or code.",
    },
    {
      id: "reliability-by-design",
      title: "Reliability & accessibility by design",
      detail:
        "Stretch software and hardware capabilities together so tools stay dependable and accessible in everyday hands.",
    },
    {
      id: "honesty-feedback",
      title: "Honesty, mutual value & open feedback",
      detail:
        "Build equitable solutions that deliver honest value to both sides, treating criticism and candid feedback as an opportunity to improve.",
    },
  ],
};
