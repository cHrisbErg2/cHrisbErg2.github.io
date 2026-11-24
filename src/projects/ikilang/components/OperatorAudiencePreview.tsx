import { useId, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Contrast,
  Headphones,
  Info,
  Mic,
  Monitor,
  QrCode,
  ShieldCheck,
  Smartphone,
  Subtitles,
  Type,
  VolumeX,
} from "lucide-react";
import { IKILANG_DATA } from "../data";

type AudienceViewMode = "mobile" | "projector";

const SIMULATED_LEVEL_BARS = [28, 46, 64, 52, 74, 68, 44, 58, 72, 49, 36, 62];

export function OperatorAudiencePreview() {
  const scenarios = IKILANG_DATA.previewScenarios;
  const [scenarioId, setScenarioId] = useState(scenarios[0]?.id ?? "sanctuary");
  const [stepIndex, setStepIndex] = useState(1);
  const [audienceMode, setAudienceMode] = useState<AudienceViewMode>("mobile");
  const [highContrastProjector, setHighContrastProjector] = useState(false);
  const [largeProjectorText, setLargeProjectorText] = useState(false);
  const headingId = useId();

  const activeScenario =
    scenarios.find((scenario) => scenario.id === scenarioId) ?? scenarios[0];

  const utteranceSteps = activeScenario.utteranceSteps ?? [
    {
      priorLines: activeScenario.priorLines,
      justSaid: activeScenario.justSaid,
      activeLine: activeScenario.activeLine,
      speakerPaceNote: "Simulated continuous speech cadence",
    },
  ];

  const safeStepIndex = Math.min(stepIndex, utteranceSteps.length - 1);
  const activeStep = utteranceSteps[safeStepIndex] ?? utteranceSteps[0];

  const handleScenarioChange = (nextId: string) => {
    setScenarioId(nextId);
    const nextScenario = scenarios.find((item) => item.id === nextId);
    const nextStepsCount = nextScenario?.utteranceSteps?.length ?? 1;
    setStepIndex(nextStepsCount > 1 ? 1 : 0);
  };

  const handleStepChange = (delta: number) => {
    setStepIndex((current) =>
      Math.min(utteranceSteps.length - 1, Math.max(0, current + delta)),
    );
  };

  return (
    <section className="card lab-card" aria-labelledby={headingId}>
      <div className="lab-header">
        <div>
          <span className="eyebrow">
            <Monitor size={14} aria-hidden="true" />
            Interactive Lab 02 · Dual-Pane Operator &amp; Audience Preview
          </span>
          <h3 id={headingId} className="lab-title">
            Simulated Operator Soundboard Capture &amp; Multi-Screen Audience Delivery
          </h3>
          <p className="lab-subtitle">
            Switch between community, clinical/NGO, and field outreach contexts to inspect how clean
            16 kHz mono capture feeds zero-download Mobile QR captions (audio intentionally
            disarmed) and the high-contrast Sanctuary Projector upward book-scroll stage.
          </p>
        </div>
      </div>

      <div className="provenance-banner" role="note">
        <Info size={16} aria-hidden="true" />
        <span>{IKILANG_DATA.previewProvenanceNotice}</span>
      </div>

      <div className="preview-scenario-bar">
        <span className="preview-bar-label">Bidirectional Room Context:</span>
        <div
          className="segmented"
          role="group"
          aria-label="Simulated room context scenarios"
        >
          {scenarios.map((scenario) => {
            const isSelected = scenario.id === activeScenario.id;
            return (
              <button
                key={scenario.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => handleScenarioChange(scenario.id)}
              >
                <span>{scenario.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="dual-pane-grid">
        {/* Left Pane: Operator / Soundboard Capture */}
        <article className="pane-card operator-pane" aria-label="Operator and soundboard capture pane">
          <div className="pane-top">
            <div className="pane-heading-group">
              <span className="eyebrow">
                <Mic size={14} aria-hidden="true" />
                Operator · Soundboard Capture
              </span>
              <h4 className="pane-title">{activeScenario.contextLabel}</h4>
            </div>
            <span className="badge badge-proven">
              <ShieldCheck size={14} aria-hidden="true" />
              <span>Zero-PII Session</span>
            </span>
          </div>

          <div className="operator-meta-chips">
            <span className="meta-chip">{activeScenario.directionTag}</span>
            <span className="meta-chip meta-chip-mono">{activeScenario.pcmHint}</span>
          </div>

          <div className="signal-meter-card">
            <div className="signal-meter-header">
              <span className="signal-meter-label">
                <span className="status-dot" aria-hidden="true" />
                Ingest Signal Hygiene (Simulated)
              </span>
              <span className="signal-meter-value">16 kHz Mono PCM · Nominal (-14 dBFS)</span>
            </div>

            <div className="signal-bars" aria-hidden="true">
              {SIMULATED_LEVEL_BARS.map((height, idx) => {
                const offset = ((height + safeStepIndex * 11 + idx * 7) % 58) + 24;
                return (
                  <span
                    key={idx}
                    className="signal-bar"
                    style={{ height: `${offset}%` }}
                  />
                );
              })}
            </div>
            <p className="signal-caption">
              No microphone accessed and zero audio played — purely illustrates unclipped line-out
              levels.
            </p>
          </div>

          <div className="utterance-stepper-card">
            <div className="utterance-stepper-top">
              <span className="utterance-step-badge">
                Utterance {safeStepIndex + 1} of {utteranceSteps.length}
              </span>
              <span className="utterance-pace">{activeStep.speakerPaceNote}</span>
            </div>

            <div className="utterance-stepper-actions">
              <button
                type="button"
                className="button button-secondary"
                onClick={() => handleStepChange(-1)}
                disabled={safeStepIndex === 0}
              >
                <ChevronLeft size={16} aria-hidden="true" />
                <span>Previous Utterance</span>
              </button>
              <button
                type="button"
                className="button button-primary"
                onClick={() => handleStepChange(1)}
                disabled={safeStepIndex === utteranceSteps.length - 1}
              >
                <span>Next Utterance</span>
                <ChevronRight size={16} aria-hidden="true" />
              </button>
            </div>
          </div>

          <p className="operator-boundary-note">{activeScenario.audienceNote}</p>
        </article>

        {/* Right Pane: Audience Delivery */}
        <article className="pane-card audience-pane" aria-label="Audience delivery pane">
          <div className="pane-top">
            <div className="pane-heading-group">
              <span className="eyebrow">Audience Delivery · Multi-Screen</span>
              <h4 className="pane-title">
                {audienceMode === "mobile"
                  ? "Mobile QR Listener View"
                  : "Sanctuary Projector View"}
              </h4>
            </div>

            <div
              className="segmented audience-view-toggle"
              role="group"
              aria-label="Audience screen mode"
            >
              <button
                type="button"
                aria-pressed={audienceMode === "mobile"}
                onClick={() => setAudienceMode("mobile")}
              >
                <Smartphone size={15} aria-hidden="true" />
                <span>Mobile QR Listener</span>
              </button>
              <button
                type="button"
                aria-pressed={audienceMode === "projector"}
                onClick={() => setAudienceMode("projector")}
              >
                <Monitor size={15} aria-hidden="true" />
                <span>Sanctuary Projector</span>
              </button>
            </div>
          </div>

          {audienceMode === "mobile" ? (
            <div className="mobile-listener-shell">
              <div className="mobile-listener-header">
                <span className="badge badge-proven">
                  <QrCode size={14} aria-hidden="true" />
                  <span>QR Join · No App Download</span>
                </span>
                <span className="mobile-join-hint">Feed anchored to join time</span>
              </div>

              <div
                className="segmented mobile-modality-strip"
                role="group"
                aria-label="Listener delivery mode controls"
              >
                <button type="button" aria-pressed="true">
                  <Subtitles size={15} aria-hidden="true" />
                  <span>Captions</span>
                </button>
                <button
                  type="button"
                  disabled
                  aria-disabled="true"
                  title={IKILANG_DATA.audioDisarmedNotice}
                >
                  <Headphones size={15} aria-hidden="true" />
                  <span>Audio (Off)</span>
                </button>
                <button
                  type="button"
                  disabled
                  aria-disabled="true"
                  title={IKILANG_DATA.audioDisarmedNotice}
                >
                  <VolumeX size={15} aria-hidden="true" />
                  <span>Both (Off)</span>
                </button>
              </div>

              <div className="audio-disarmed-notice" role="status">
                <VolumeX size={16} aria-hidden="true" />
                <span>{IKILANG_DATA.audioDisarmedNotice}</span>
              </div>

              <div className="mobile-caption-feed">
                <div className="mobile-just-said">
                  <span className="recency-pill">Just said</span>
                  <p>{activeStep.justSaid}</p>
                </div>

                <div className="mobile-live-stage">
                  <span className="live-stage-label">
                    <span className="status-dot" aria-hidden="true" />
                    Live English Caption
                  </span>
                  <p className="mobile-live-text">{activeStep.activeLine}</p>
                </div>
              </div>
            </div>
          ) : (
            <div
              className={`projector-stage${highContrastProjector ? " is-high-contrast" : ""}${
                largeProjectorText ? " is-large-text" : ""
              }`}
              aria-label="Sanctuary projector upward book-scroll caption stage"
            >
              <div className="projector-toolbar">
                <span className="projector-badge">
                  <span className="status-dot" aria-hidden="true" />
                  Upward Book-Scroll · Sanctuary Display
                </span>

                <div className="projector-a11y-controls">
                  <button
                    type="button"
                    className="projector-control-btn"
                    aria-pressed={highContrastProjector}
                    onClick={() => setHighContrastProjector((prev) => !prev)}
                  >
                    <Contrast size={15} aria-hidden="true" />
                    <span>High Contrast</span>
                  </button>
                  <button
                    type="button"
                    className="projector-control-btn"
                    aria-pressed={largeProjectorText}
                    onClick={() => setLargeProjectorText((prev) => !prev)}
                  >
                    <Type size={15} aria-hidden="true" />
                    <span>{largeProjectorText ? "Text: Large" : "Text: Standard"}</span>
                  </button>
                </div>
              </div>

              {/* Chronological Upward Book-Scroll Hierarchy: Earlier -> Just Said -> Active Stage */}
              <div className="projector-earlier-section">
                <p className="projector-section-label">Earlier in the session</p>
                <ol className="projector-earlier-list">
                  {activeStep.priorLines.map((line, index) => (
                    <li key={`${safeStepIndex}-${index}`} className="projector-earlier-item">
                      {line}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="projector-just-said">
                <span className="projector-recency-badge">Just said</span>
                <p className="projector-just-said-text">{activeStep.justSaid}</p>
              </div>

              <div className="projector-active-stage">
                <span className="projector-live-label">Active Live Caption</span>
                <p className="projector-active-text">{activeStep.activeLine}</p>
              </div>
            </div>
          )}
        </article>
      </div>
    </section>
  );
}
