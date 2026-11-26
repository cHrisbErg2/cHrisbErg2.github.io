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
    shortTitle: "01 Audio stream",
    blackBox: false,
    readout: "01 AUDIO STREAM · 16 KHZ MONO PCM",
    ariaSummary: "Stage 1: Audio ingest, web audio capture terminal streaming 16 kilohertz mono PCM",
  },
  {
    id: "stage-02",
    index: 1,
    step: 2,
    name: "Streaming translation",
    shortTitle: "02 Translation core",
    blackBox: true,
    readout: "02 TRANSLATION CORE · CLOUD / LOCAL HOST · +1.02 S",
    ariaSummary: "Stage 2: Streaming translation, context-aware translation core with cloud today and local host runtime slot",
  },
  {
    id: "stage-03",
    index: 2,
    step: 3,
    name: "Quality & context",
    shortTitle: "03 Accuracy & privacy",
    blackBox: true,
    readout: "03 ACCURACY + CONTEXT · 0.10 MS P95 CHECK",
    ariaSummary: "Stage 3: Quality and context, sealed verification blade and live latency monitor",
  },
  {
    id: "stage-04",
    index: 3,
    step: 4,
    name: "Anonymous telemetry",
    shortTitle: "04 Privacy + plugins",
    blackBox: false,
    readout: "04 ZERO PII · MEDIA & HOSTING PLUGINS",
    ariaSummary: "Stage 4: Anonymous telemetry, zero-PII privacy module and media/hosting provider plugin dock",
  },
  {
    id: "stage-05",
    index: 4,
    step: 5,
    name: "Audience UI",
    shortTitle: "05 Captions + audio",
    blackBox: false,
    readout: "05 WEB CAPTIONS LIVE · VOICE AUDIO PLANNED",
    ariaSummary: "Stage 5: Audience UI, QR web app, projector display, and gated future expressive audio capsule",
  },
];

export interface BenchClause {
  id: string;
  latencySec: number;
  vuBars: number;
  packetOffset: number;
}

export const BENCH_CLAUSES: readonly BenchClause[] = [
  { id: "clause-1", latencySec: 1.02, vuBars: 6, packetOffset: 8.0 },
  { id: "clause-2", latencySec: 1.14, vuBars: 7, packetOffset: 24.0 },
  { id: "clause-3", latencySec: 1.06, vuBars: 5, packetOffset: 16.0 },
];

export const LATENCY_MAX_SEC = 2.0;
export const LATENCY_TARGET_SEC = 1.5;
export const LATENCY_REST_SEC = BENCH_CLAUSES[0]!.latencySec;

export const PACKET_REST_OFFSET = BENCH_CLAUSES[0]!.packetOffset;

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
  "stage-03": [4, 14, 42],
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
    return apart ? "SEPARATING MODULES…" : "ASSEMBLING PIPELINE…";
  }
  if (stageIndex !== null) {
    const spec = BENCH_STAGES[stageIndex];
    if (spec) return spec.readout;
  }
  if (apart) {
    return "APART · 5 SOFTWARE MODULES · CORES SEALED";
  }
  return `STREAM ${clauseIndex + 1}/${BENCH_CLAUSES.length} · +${latencySec.toFixed(2)} S REPLAY`;
}
