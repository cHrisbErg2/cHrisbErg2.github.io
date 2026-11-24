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
  "Black-box seam",
  "Black-box guard",
  "Zero-PII logs",
  "QR phone + screen",
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
            <Layers size={14} aria-hidden="true" />
            Lab 03 · 5-layer black-box architecture
          </span>
          <h3 id={headingId} className="lab-title">
            Public interface contracts &amp; protected internals
          </h3>
          <p className="lab-subtitle">
            Inspect inputs, outputs, invariants, and trial limits across all five boundaries while
            proprietary core internals stay black-boxed.
          </p>
        </div>
      </div>

      {/* Responsive SVG Signal-Flow Diagram (syncs with the WAI-ARIA tablist below) */}
      <div className="arch-diagram-shell" aria-hidden="true">
        <svg
          className="arch-svg"
          viewBox="0 0 920 132"
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
            const boxWidth = 158;
            const gap = 26;
            const x = 14 + index * (boxWidth + gap);
            const y = 16;
            const height = 100;
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
                <rect
                  x={x}
                  y={y}
                  width={boxWidth}
                  height={height}
                  rx="12"
                  className="arch-svg-rect"
                />
                <text x={x + 12} y={y + 24} className="arch-svg-step">
                  0{layer.step}
                </text>
                {layer.isBlackBox ? (
                  <text x={x + boxWidth - 12} y={y + 24} textAnchor="end" className="arch-svg-lock">
                    PRIVATE
                  </text>
                ) : null}
                <text x={x + 12} y={y + 54} className="arch-svg-title">
                  {layer.name}
                </text>
                <text x={x + 12} y={y + 78} className="arch-svg-sub">
                  {SVG_SUBTITLES[index] ?? ""}
                </text>

                {index < layers.length - 1 ? (
                  <line
                    x1={x + boxWidth + 4}
                    y1={y + height / 2}
                    x2={x + boxWidth + gap - 5}
                    y2={y + height / 2}
                    stroke="var(--control-border)"
                    strokeWidth="2"
                    markerEnd={`url(#${baseId}-arrow)`}
                  />
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
                <Lock size={14} aria-hidden="true" className="arch-tab-lock" />
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
              Layer 0{activeLayer.step} of 0{layers.length}
            </span>
            <h4 className="arch-detail-title">{activeLayer.name}</h4>
          </div>

          {activeLayer.isBlackBox ? (
            <span className="badge badge-validating">
              <Lock size={14} aria-hidden="true" />
              <span>Black-boxed core internals</span>
            </span>
          ) : (
            <span className="badge badge-proven">
              <Shield size={14} aria-hidden="true" />
              <span>Public interface boundary</span>
            </span>
          )}
        </div>

        <p className="arch-detail-role">{activeLayer.role}</p>

        {activeLayer.isBlackBox ? (
          <div className="blackbox-callout" role="note">
            <Lock size={17} aria-hidden="true" />
            <div>
              <strong>Protected core internals:</strong> {IKILANG_DATA.blackBoxNotice}
            </div>
          </div>
        ) : null}

        <div className="grid-2 arch-contracts-grid">
          <div className="card-subtle">
            <span className="contract-label">
              <ArrowRight size={14} aria-hidden="true" />
              Input contract
            </span>
            <p className="contract-text">{activeLayer.inputContract}</p>
          </div>
          <div className="card-subtle">
            <span className="contract-label">
              <ArrowRight size={14} aria-hidden="true" />
              Output contract
            </span>
            <p className="contract-text">{activeLayer.outputContract}</p>
          </div>
        </div>

        <div className="grid-2 arch-meta-grid">
          <div>
            <h5 className="arch-subheading">
              <CheckCircle2 size={15} aria-hidden="true" />
              Engineering invariants
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
                <Wrench size={15} aria-hidden="true" />
                Ecosystem tools
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
                <AlertCircle size={15} aria-hidden="true" />
                Trial limits
              </h5>
              <p className="trial-limits-text">{activeLayer.trialLimits}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
