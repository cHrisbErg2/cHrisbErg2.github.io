import type { Point3 } from "../../iso/iso-kit";

export const STAGE_IDS = ["stage-01", "stage-02", "stage-03", "stage-04", "stage-05"] as const;
export type StageId = (typeof STAGE_IDS)[number];

export interface BenchStageSpec {
  id: StageId;
  index: number;
  step: number;
  name: string;
  shortTitle: string;
  blackBox: boolean;
  readout: string;
  ariaSummary: string;
}

export const BENCH_STAGES: readonly BenchStageSpec[] = [
  {
    id: "stage-01",
    index: 0,
    step: 1,
    name: "Audio ingest",
    shortTitle: "01 Audio ingest",
    blackBox: false,
    readout: "01 AUDIO IN · 16 KHZ MONO PCM",
    ariaSummary: "Stage 1: Audio ingest, soundboard box with moving fader and 16 kilohertz meter",
  },
  {
    id: "stage-02",
    index: 1,
    step: 2,
    name: "Streaming translation",
    shortTitle: "02 Streaming core",
    blackBox: true,
    readout: "02 STREAMING CORE · SEALED · +1.02 S",
    ariaSummary: "Stage 2: Streaming translation, sprung clause carriage and sealed black-box Vault A",
  },
  {
    id: "stage-03",
    index: 2,
    step: 3,
    name: "Quality & context",
    shortTitle: "03 Guardrail + dial",
    blackBox: true,
    readout: "03 GUARDRAIL · SEALED · 0.10 MS P95",
    ariaSummary: "Stage 3: Quality and context, sealed black-box Cassette B and radial +1.02 second dial gauge",
  },
  {
    id: "stage-04",
    index: 3,
    step: 4,
    name: "Anonymous telemetry",
    shortTitle: "04 Tally + 0 PII",
    blackBox: false,
    readout: "04 TELEMETRY · 451 TESTS · 0 PII",
    ariaSummary: "Stage 4: Anonymous telemetry, mechanical clause tally counter and zero PII ground post",
  },
  {
    id: "stage-05",
    index: 4,
    step: 5,
    name: "Audience UI",
    shortTitle: "05 QR + screens",
    blackBox: false,
    readout: "05 QR + PROJECTOR · 0 PII · AUDIO OFF",
    ariaSummary: "Stage 5: Audience UI, bench QR tile, sanctuary projector panel, and cradled phone with audio off",
  },
];

export interface BenchClause {
  id: string;
  latencySec: number;
  faderNorm: number;
  vuBars: number;
  carriageOffset: number;
}

export const BENCH_CLAUSES: readonly BenchClause[] = [
  { id: "clause-1", latencySec: 1.02, faderNorm: 0.72, vuBars: 6, carriageOffset: 6.0 },
  { id: "clause-2", latencySec: 1.14, faderNorm: 0.86, vuBars: 7, carriageOffset: 11.5 },
  { id: "clause-3", latencySec: 1.06, faderNorm: 0.56, vuBars: 5, carriageOffset: 8.5 },
];

export const DIAL_MIN_SEC = 0.0;
export const DIAL_MAX_SEC = 2.0;
export const DIAL_TARGET_SEC = 1.5;
export const DIAL_REST_SEC = BENCH_CLAUSES[0]!.latencySec;
export const DIAL_SWEEP_START = -Math.PI * 0.75;
export const DIAL_SWEEP_SPAN = Math.PI * 1.5;

export function dialAngleRad(seconds: number): number {
  const clamped = Math.min(DIAL_MAX_SEC, Math.max(DIAL_MIN_SEC, seconds));
  const share = (clamped - DIAL_MIN_SEC) / (DIAL_MAX_SEC - DIAL_MIN_SEC);
  return DIAL_SWEEP_START + share * DIAL_SWEEP_SPAN;
}

export const CARRIAGE_REST_OFFSET = BENCH_CLAUSES[0]!.carriageOffset;
export const CARRIAGE_MIN_OFFSET = 0.0;
export const CARRIAGE_MAX_OFFSET = 14.0;

export const SPRING = {
  stagger: 0.035,
  stiffness: 64,
  damping: 14.2,
  substeps: 4,
} as const;

export const STAGGER_OPEN: readonly StageId[] = ["stage-05", "stage-01", "stage-04", "stage-03", "stage-02"];
export const STAGGER_CLOSE: readonly StageId[] = ["stage-02", "stage-03", "stage-04", "stage-01", "stage-05"];

export const EXPLODE_VECTORS: Record<StageId, Point3> = {
  "stage-01": [-22, -10, 20],
  "stage-02": [-6, -16, 36],
  "stage-03": [4, 14, 44],
  "stage-04": [14, -18, 28],
  "stage-05": [24, 12, 24],
};

export interface ReadoutState {
  stageIndex: number | null;
  apart: boolean;
  moving: boolean;
  clauseIndex: number;
  latencySec: number;
}

export function formatBenchReadout({ stageIndex, apart, moving, clauseIndex, latencySec }: ReadoutState): string {
  if (moving) {
    return apart ? "OPENING SEAMS…" : "CLOSING UP…";
  }
  if (stageIndex !== null) {
    const spec = BENCH_STAGES[stageIndex];
    if (spec) return spec.readout;
  }
  if (apart) {
    return "APART · 5 BOUNDARIES · CORES SEALED";
  }
  return `CLAUSE ${clauseIndex + 1}/${BENCH_CLAUSES.length} · +${latencySec.toFixed(2)} S (< 1.5 S)`;
}
