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

const SVG_SUBTITLES = [
  "16 kHz mono PCM",
  "Swappable interface",
  "Checks + eval",
  "Zero-PII logs",
  "QR phone + display",
];

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

      {/* Crafted Multi-Part SVG Pipeline Schematic (scrolls horizontally on narrow screens instead of hiding) */}
      <div className="arch-diagram-shell" aria-hidden="true">
        <svg
          className="arch-svg"
          viewBox="0 0 960 170"
          role="presentation"
          focusable="false"
        >
          <defs>
            <marker
              id={`${baseId}-arrow`}
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="var(--control-border)" />
            </marker>
          </defs>

          {layers.map((layer, index) => {
            const boxWidth = 166;
            const gap = 25;
            const x = 14 + index * (boxWidth + gap);
            const y = 20;
            const height = 122;
            const isActive = index === selectedIndex;

            return (
              <g
                key={layer.id}
                className={`arch-svg-node${isActive ? " is-active" : ""}${
                  layer.isBlackBox ? " is-blackbox" : ""
                }`}
                onClick={() => setSelectedIndex(index)}
                style={{ cursor: "pointer" }}
              >
                {/* Drop shadow backing plate */}
                <rect
                  x={x + 3}
                  y={y + 6}
                  width={boxWidth}
                  height={height}
                  rx="14"
                  className="arch-svg-shadow"
                />

                {/* Main module casing */}
                <rect
                  x={x}
                  y={y}
                  width={boxWidth}
                  height={height}
                  rx="14"
                  className="arch-svg-rect"
                />

                {/* Module top header band */}
                <path
                  d={`M ${x} ${y + 14} Q ${x} ${y} ${x + 14} ${y} L ${x + boxWidth - 14} ${y} Q ${x + boxWidth} ${y} ${x + boxWidth} ${y + 14} L ${x + boxWidth} ${y + 34} L ${x} ${y + 34} Z`}
                  className="arch-svg-band"
                />

                <text x={x + 12} y={y + 22} className="arch-svg-step">
                  STAGE 0{layer.step}
                </text>

                {layer.isBlackBox ? (
                  <g>
                    <rect
                      x={x + boxWidth - 68}
                      y={y + 9}
                      width="56"
                      height="17"
                      rx="6"
                      className="arch-lock-pill"
                    />
                    <text x={x + boxWidth - 40} y={y + 21} textAnchor="middle" className="arch-svg-lock">
                      PRIVATE
                    </text>
                  </g>
                ) : (
                  <circle cx={x + boxWidth - 16} cy={y + 17} r="4" className="arch-public-led" />
                )}

                <text x={x + 12} y={y + 62} className="arch-svg-title">
                  {layer.name}
                </text>
                <text x={x + 12} y={y + 84} className="arch-svg-sub">
                  {SVG_SUBTITLES[index] ?? ""}
                </text>

                {/* Contract indicator bar at bottom of module */}
                <rect x={x + 12} y={y + 100} width={boxWidth - 24} height="8" rx="4" className="arch-bar-track" />
                <rect
                  x={x + 12}
                  y={y + 100}
                  width={isActive ? boxWidth - 24 : 56}
                  height="8"
                  rx="4"
                  className="arch-bar-fill"
                />

                {/* Input & output terminal ports */}
                {index > 0 ? (
                  <circle cx={x} cy={y + height / 2} r="4.5" className="arch-port" />
                ) : null}
                {index < layers.length - 1 ? (
                  <>
                    <circle cx={x + boxWidth} cy={y + height / 2} r="4.5" className="arch-port" />
                    <line
                      x1={x + boxWidth + 5}
                      y1={y + height / 2}
                      x2={x + boxWidth + gap - 5}
                      y2={y + height / 2}
                      className="arch-bus-line"
                      markerEnd={`url(#${baseId}-arrow)`}
                    />
                    <circle
                      cx={x + boxWidth + gap / 2}
                      cy={y + height / 2}
                      r="3"
                      className={`arch-bus-pulse${isActive || index + 1 === selectedIndex ? " is-hot" : ""}`}
                    />
                  </>
                ) : null}
              </g>
            );
          })}
        </svg>
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
