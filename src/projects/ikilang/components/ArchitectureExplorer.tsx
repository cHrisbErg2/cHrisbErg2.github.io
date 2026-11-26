import { useId, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Layers,
  Lock,
  Shield,
  Wrench,
} from "lucide-react";
import { IKILANG_DATA } from "../data";
import { TranslationBenchFigure } from "../../../components/anatomy/bench/TranslationBenchFigure";

export function ArchitectureExplorer() {
  const layers = IKILANG_DATA.architectureLayers;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const headingId = useId();
  const baseId = useId();

  const activeLayer = layers[selectedIndex] ?? layers[0];

  const selectAndFocus = (index: number) => {
    const wrapped = (index + layers.length) % layers.length;
    setSelectedIndex(wrapped);
    tabRefs.current[wrapped]?.focus();
  };

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      selectAndFocus(index + 1);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      selectAndFocus(index - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      selectAndFocus(0);
    } else if (event.key === "End") {
      event.preventDefault();
      selectAndFocus(layers.length - 1);
    }
  };

  return (
    <section className="card lab-card" aria-labelledby={headingId}>
      <div className="lab-header">
        <div>
          <span className="eyebrow">
            <Layers size={14} strokeWidth={2} aria-hidden="true" />
            Demo 03 · 5-stage system map
          </span>
          <h3 id={headingId} className="lab-title">
            Public module boundaries &amp; private core
          </h3>
          <p className="lab-subtitle">
            Click any module or use arrow keys to inspect inputs, outputs, and guardrails across all
            five stages. Model prompts, scoring weights, and routing stay private.
          </p>
        </div>
      </div>

      {/* Interactive 3D Isometric Live Translation Bench (2-way synced with 5-stage tablist) */}
      <div className="arch-bench-wrap">
        <TranslationBenchFigure
          variant="explorer"
          selectedStage={selectedIndex}
          onSelectStage={setSelectedIndex}
        />
      </div>

      {/* Accessible WAI-ARIA Tablist */}
      <div
        className="tablist arch-tablist"
        role="tablist"
        aria-label="IkiLang 5-layer architecture"
      >
        {layers.map((layer, index) => {
          const isSelected = index === selectedIndex;
          return (
            <button
              key={layer.id}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              id={`${baseId}-tab-${layer.id}`}
              type="button"
              role="tab"
              aria-selected={isSelected}
              aria-controls={`${baseId}-panel-${layer.id}`}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => setSelectedIndex(index)}
              onKeyDown={(event) => handleTabKeyDown(event, index)}
            >
              <span className="arch-tab-num">{layer.step}</span>
              <span>{layer.name}</span>
              {layer.isBlackBox ? (
                <Lock size={14} strokeWidth={2} aria-hidden="true" className="arch-tab-lock" />
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Selected Layer Detail Panel */}
      <div
        id={`${baseId}-panel-${activeLayer.id}`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${activeLayer.id}`}
        tabIndex={0}
        className="arch-detail-panel"
      >
        <div className="arch-detail-header">
          <div>
            <span className="eyebrow">
              Stage 0{activeLayer.step} of 0{layers.length}
            </span>
            <h4 className="arch-detail-title">{activeLayer.name}</h4>
          </div>

          {activeLayer.isBlackBox ? (
            <span className="badge badge-validating">
              <Lock size={14} strokeWidth={2} aria-hidden="true" />
              <span>Black-boxed core internals</span>
            </span>
          ) : (
            <span className="badge badge-proven">
              <Shield size={14} strokeWidth={2} aria-hidden="true" />
              <span>Public interface boundary</span>
            </span>
          )}
        </div>

        <p className="arch-detail-role">{activeLayer.role}</p>

        {activeLayer.isBlackBox ? (
          <div className="blackbox-callout" role="note">
            <Lock size={17} strokeWidth={2} aria-hidden="true" />
            <div>
              <strong>Protected core internals:</strong> {IKILANG_DATA.blackBoxNotice}
            </div>
          </div>
        ) : null}

        <div className="grid-2 arch-contracts-grid">
          <div className="arch-contract-card">
            <span className="contract-label">
              <ArrowRight size={14} strokeWidth={2} aria-hidden="true" />
              Input contract
            </span>
            <p className="contract-text">{activeLayer.inputContract}</p>
          </div>
          <div className="arch-contract-card">
            <span className="contract-label">
              <ArrowRight size={14} strokeWidth={2} aria-hidden="true" />
              Output contract
            </span>
            <p className="contract-text">{activeLayer.outputContract}</p>
          </div>
        </div>

        <div className="grid-2 arch-meta-grid">
          <div>
            <h5 className="arch-subheading">
              <CheckCircle2 size={15} strokeWidth={2} aria-hidden="true" />
              Guarantees
            </h5>
            <ul className="clean-check-list">
              {activeLayer.invariants.map((invariant) => (
                <li key={invariant}>{invariant}</li>
              ))}
            </ul>
          </div>

          <div className="arch-right-col">
            <div>
              <h5 className="arch-subheading">
                <Wrench size={15} strokeWidth={2} aria-hidden="true" />
                Tools used
              </h5>
              <ul className="pill-list" aria-label={`Tools evaluated in ${activeLayer.name}`}>
                {activeLayer.toolsEvaluated.map((tool) => (
                  <li key={tool} className="tech-pill">
                    {tool}
                  </li>
                ))}
              </ul>
            </div>

            <div className="trial-limits-box">
              <h5 className="arch-subheading">
                <AlertCircle size={15} strokeWidth={2} aria-hidden="true" />
                Current limits
              </h5>
              <p className="trial-limits-text">{activeLayer.trialLimits}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
