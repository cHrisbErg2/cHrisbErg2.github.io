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
    "Department of Electrical and Computer Engineering · University of Saskatchewan",
  builderSummary:
    "I build low-latency, privacy-preserving speech translation software — streaming live audio into context-aware captions on a zero-install web app today, with future support for expressive voice audio, host-run local models, and media plugins.",
  affiliation: "University of Saskatchewan",
  locationLabel: "Saskatoon, SK",
  githubUrl: "https://github.com/cHrisbErg2",
  email: "christian.muhirwa@usask.ca",
  linkedinUrl: "",
  resumeUrl: "",
  focusAreas: [
    "Real-Time Audio & WebSockets",
    "Low-Resource Speech AI",
    "Python & TypeScript",
    "Offline Eval & Testing",
  ],
  principles: [
    {
      id: "field-reality",
      title: "Test on real mics, not studio clips",
      detail:
        "Soundboards, room echo, fast speakers, and mobile browsers break assumptions that pass on clean demos.",
    },
    {
      id: "measure-first",
      title: "Measure before fine-tuning",
      detail:
        "Track p95 caption delay, mid-sentence cutoffs, and domain errors on labeled audio before training custom weights.",
    },
    {
      id: "privacy-minimal",
      title: "Zero personal data by default",
      detail:
        "Visitors scan a QR code and read live captions with no sign-up, no IP logging, and no analytics trackers.",
    },
  ],
};
