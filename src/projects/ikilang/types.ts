export type MaturityStatus = "proven" | "validating" | "gated";

export interface FounderStory {
  heading: string;
  subtitle: string;
  paragraphs: string[];
  languageStewardshipNote: string;
  blueprintPrinciple: string;
}

export interface BridgeDirection {
  id: string;
  directionLabel: string;
  title: string;
  audience: string;
  settings: string[];
  valueStatement: string;
  dignityHighlight: string;
}

export interface ToolCategory {
  id: string;
  category: string;
  purpose: string;
  tools: string[];
}

export interface DisciplineSignal {
  id: string;
  metric: string;
  label: string;
  detail: string;
}

export type TurnBasedStatus = "waiting" | "stalled" | "dumped";
export type ContinuousStatus = "streaming" | "delivered";

export interface TimelineFrame {
  timeSec: number;
  speakerLine: string;
  breathPauseMs: number;
  turnBasedCaption: string;
  turnBasedStatus: TurnBasedStatus;
  continuousCaption: string;
  continuousStatus: ContinuousStatus;
  latencyNote: string;
}

export interface PreviewUtteranceStep {
  priorLines: string[];
  justSaid: string;
  activeLine: string;
  speakerPaceNote: string;
}

export interface PreviewScenario {
  id: string;
  label: string;
  directionTag: string;
  contextLabel: string;
  pcmHint: string;
  priorLines: string[];
  justSaid: string;
  activeLine: string;
  audienceNote: string;
  utteranceSteps?: PreviewUtteranceStep[];
}

export interface ArchitectureLayer {
  id: string;
  step: number;
  name: string;
  role: string;
  inputContract: string;
  outputContract: string;
  toolsEvaluated: string[];
  invariants: string[];
  trialLimits: string;
  isBlackBox?: boolean;
}

export interface MaturityItem {
  capability: string;
  status: MaturityStatus;
  evidence: string;
  boundaryNote: string;
}

export interface ShortcomingsAndHumanBoundary {
  heading: string;
  summary: string;
  currentLimits: string[];
  humanEssentialScenarios: string[];
  closingPrinciple: string;
}

export interface PrivacyCommitment {
  title: string;
  detail: string;
}

export interface FieldSpecStep {
  step: number;
  label: string;
  detail: string;
}

export interface RoadmapPhase {
  id: string;
  phase: string;
  title: string;
  status: MaturityStatus;
  objective: string;
  exitGate: string;
}

export interface MigrationGateCriterion {
  id: string;
  gateNumber: string;
  title: string;
  requirement: string;
  guardrail: string;
}

export interface NvidiaMigrationGoal {
  eyebrow: string;
  heading: string;
  summary: string;
  liveBaselineLabel: string;
  liveBaselineTitle: string;
  liveBaselineDetail: string;
  longTermTargetLabel: string;
  longTermTargetTitle: string;
  longTermTargetDetail: string;
  gatesHeading: string;
  gates: MigrationGateCriterion[];
  cutoverRule: string;
}

export interface ChangelogEntry {
  date: string;
  tag: string;
  title: string;
  summary: string;
  status: MaturityStatus;
}

export interface IkiLangShowcaseData {
  productName: string;
  coBrandLabel: string;
  tagline: string;
  heroSummary: string;
  lastVerifiedDate: string;
  blackBoxNotice: string;
  timelineProvenanceNotice: string;
  previewProvenanceNotice: string;
  audioDisarmedNotice: string;
  cryptographicHonestyNotice: string;
  founderStory: FounderStory;
  bridgeDirections: BridgeDirection[];
  toolCategories: ToolCategory[];
  disciplineSignals: DisciplineSignal[];
  timelineFrames: TimelineFrame[];
  previewScenarios: PreviewScenario[];
  architectureLayers: ArchitectureLayer[];
  maturityMatrix: MaturityItem[];
  shortcomingsAndHumanBoundary: ShortcomingsAndHumanBoundary;
  privacyCommitments: PrivacyCommitment[];
  fieldSpecSteps: FieldSpecStep[];
  roadmapPhases: RoadmapPhase[];
  nvidiaMigrationGoal: NvidiaMigrationGoal;
  changelog: ChangelogEntry[];
}
