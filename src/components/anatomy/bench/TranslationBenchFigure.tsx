import "../../iso/iso.css";
import "./bench.css";
import { Plate } from "../../iso/draw";
import type { LegendKey } from "../../iso/iso-kit";
import { BenchArt } from "./art";
import { BENCH_CLAUSES, BENCH_STAGES } from "./model";

export interface TranslationBenchFigureProps {
  variant?: "hero" | "explorer";
  selectedStage?: number | null;
  onSelectStage?: (stageIndex: number) => void;
  onOpenCaseStudy?: () => void;
}

const BENCH_KEYS: LegendKey[] = [
  { mark: "lit", label: "Active module · live stream packet" },
  { mark: "raised", label: "Sealed black-box core (02 & 03)" },
  { mark: "edge", label: "Public web, privacy & plugin boundary" },
];

export function TranslationBenchFigure({
  variant = "hero",
  selectedStage,
  onSelectStage,
  onOpenCaseStudy,
}: TranslationBenchFigureProps) {
  const isExplorer = variant === "explorer";
  const initialStage = selectedStage !== undefined && selectedStage !== null ? BENCH_STAGES[selectedStage] : null;
  const initialReadout = initialStage
    ? initialStage.readout
    : `STREAM 1/${BENCH_CLAUSES.length} · +${BENCH_CLAUSES[0]!.latencySec.toFixed(2)} S REPLAY`;

  return (
    <div className={`iso ikilang-bench${isExplorer ? " is-explorer" : " is-hero"}`}>
      <Plate
        fig={isExplorer ? "Fig 2" : "Fig 1"}
        title="Streaming software pipeline"
        hint="Hover modules · Space explode"
        readout={initialReadout}
        pdfHref="/ikilang-bench-drawing-a4.pdf"
        pdfLabel="Open printable 1-page A4 technical drawing PDF"
        keys={BENCH_KEYS}
        caption={
          isExplorer ? (
            "Five modular software stages: 16 kHz audio capture streams into a swappable cloud/local translation core, context & privacy checks, a zero-PII plugin dock, and synced QR/projector captions (with future expressive voice audio). Click any module or use the tabs below."
          ) : (
            <span className="bench-hero-footer">
              <span>
                16 kHz audio stream → sealed cloud/local translation &amp; privacy cores → live web captions (+ future voice audio &amp; plugins).
              </span>
              {onOpenCaseStudy ? (
                <button type="button" className="bench-case-link" onClick={onOpenCaseStudy}>
                  Inspect 5-stage contracts →
                </button>
              ) : null}
            </span>
          )
        }
      >
        <BenchArt selectedStage={selectedStage} onSelectStage={onSelectStage} showExplodeControl />
      </Plate>
    </div>
  );
}
