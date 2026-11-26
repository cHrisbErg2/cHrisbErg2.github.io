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
  { mark: "lit", label: "Active stage · +1.02 s dial needle" },
  { mark: "raised", label: "Sealed black-box core (02 & 03)" },
  { mark: "edge", label: "Public 16 kHz / QR boundary" },
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
    : `CLAUSE 1/${BENCH_CLAUSES.length} · +${BENCH_CLAUSES[0]!.latencySec.toFixed(2)} S (< 1.5 S)`;

  return (
    <div className={`iso ikilang-bench${isExplorer ? " is-explorer" : " is-hero"}`}>
      <Plate
        fig={isExplorer ? "Fig 2" : "Fig 1"}
        title="Live translation bench"
        hint="Hover stages · Space to explode"
        readout={initialReadout}
        pdfHref="/ikilang-bench-drawing-a4.pdf"
        pdfLabel="Open printable 1-page A4 technical drawing PDF"
        keys={BENCH_KEYS}
        caption={
          isExplorer ? (
            "Five modular boundaries in physical sequence: a 16 kHz soundboard box feeds a sprung clause carriage into sealed translation and guardrail vaults, an isolated 0 PII tally counter, and synced QR/projector displays with audience audio locked off. Click any stage or use the tabs below."
          ) : (
            <span className="bench-hero-footer">
              <span>
                Soundboard 16 kHz PCM → sealed translation &amp; guardrail vaults → 0 PII QR &amp; projector displays.
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
