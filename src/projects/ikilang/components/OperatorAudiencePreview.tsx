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

const SIMULATED_LEVEL_BARS = [
  28, 46, 68, 52, 78, 84, 64, 44, 62, 88, 72, 49, 36, 70, 58, 40,
];

function MiniQrGraphic() {
  return (
    <svg
      className="mini-qr-svg"
      viewBox="0 0 44 44"
      width="44"
      height="44"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="0" y="0" width="44" height="44" rx="6" className="qr-bg" />
      {/* Top-left finder */}
      <rect x="4" y="4" width="12" height="12" rx="2" className="qr-ink" />
      <rect x="6" y="6" width="8" height="8" rx="1" className="qr-bg" />
      <rect x="8" y="8" width="4" height="4" className="qr-ink" />
      {/* Top-right finder */}
      <rect x="28" y="4" width="12" height="12" rx="2" className="qr-ink" />
      <rect x="30" y="6" width="8" height="8" rx="1" className="qr-bg" />
      <rect x="32" y="8" width="4" height="4" className="qr-ink" />
      {/* Bottom-left finder */}
      <rect x="4" y="28" width="12" height="12" rx="2" className="qr-ink" />
      <rect x="6" y="30" width="8" height="8" rx="1" className="qr-bg" />
      <rect x="8" y="32" width="4" height="4" className="qr-ink" />
      {/* Data modules */}
      <rect x="19" y="5" width="3" height="3" className="qr-ink" />
      <rect x="23" y="9" width="3" height="6" className="qr-ink" />
      <rect x="18" y="18" width="5" height="5" rx="1" className="qr-ink" />
      <rect x="6" y="20" width="4" height="4" className="qr-ink" />
      <rect x="13" y="21" width="3" height="3" className="qr-ink" />
      <rect x="27" y="19" width="4" height="4" className="qr-ink" />
      <rect x="34" y="20" width="5" height="4" className="qr-ink" />
      <rect x="20" y="27" width="4" height="4" className="qr-ink" />
      <rect x="28" y="28" width="6" height="4" className="qr-ink" />
      <rect x="21" y="34" width="5" height="5" className="qr-ink" />
      <rect x="30" y="34" width="4" height="6" className="qr-ink" />
      <rect x="36" y="30" width="4" height="7" className="qr-ink" />
    </svg>
  );
}

export function OperatorAudiencePreview() {
  const scenarios = IKILANG_DATA.previewScenarios;
  const [scenarioId, setScenarioId] = useState(scenarios[0]?.id ?? "sanctuary");
  const [stepIndex, setStepIndex] = useState(1);
  const [audienceMode, setAudienceMode] = useState<AudienceViewMode>("mobile");
  const [highContrastProjector, setHighContrastProjector] = useState(false);
  const [largeProjectorText, setLargeProjectorText] = useState(false);
  const headingId = useId();
  const audioNoticeId = useId();

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
            <Monitor size={14} strokeWidth={2} aria-hidden="true" />
            Demo 02 · Soundboard to screens
          </span>
          <h3 id={headingId} className="lab-title">
            Operator console &amp; phone/projector screens
          </h3>
          <p className="lab-subtitle">
            Switch rooms to inspect clean 16 kHz audio capture alongside the zero-install Phone QR
            screen (audio off) and upward book-scroll Sanctuary Projector.
          </p>
        </div>
      </div>

      <div className="provenance-banner" role="note">
        <Info size={16} strokeWidth={2} aria-hidden="true" />
        <span>{IKILANG_DATA.previewProvenanceNotice}</span>
      </div>

      <div className="preview-scenario-bar">
        <span className="preview-bar-label">Room context:</span>
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
                <Mic size={14} strokeWidth={2} aria-hidden="true" />
                Operator · Soundboard capture
              </span>
              <h4 className="pane-title">{activeScenario.contextLabel}</h4>
            </div>
            <span className="badge badge-proven">
              <ShieldCheck size={14} strokeWidth={2} aria-hidden="true" />
              <span>Zero-PII session</span>
            </span>
          </div>

          <div className="operator-meta-chips">
            <span className="meta-chip">{activeScenario.directionTag}</span>
            <span className="meta-chip meta-chip-mono">{activeScenario.pcmHint}</span>
          </div>

          {/* 16-bar Animated Level Meter */}
          <div className="signal-meter-card">
            <div className="signal-meter-header">
              <span className="signal-meter-label">
                <span className="status-dot is-pulsing" aria-hidden="true" />
                Audio meter (simulated)
              </span>
              <span className="signal-meter-value">16 kHz Mono PCM · -14 dBFS</span>
            </div>

            <div className="signal-bars" aria-hidden="true">
              {SIMULATED_LEVEL_BARS.map((height, idx) => {
                const offset = ((height + safeStepIndex * 13 + idx * 9) % 62) + 24;
                return (
                  <span
                    key={idx}
                    className={`signal-bar${idx > 13 ? " is-headroom" : ""}`}
                    style={{
                      height: `${offset}%`,
                      animationDelay: `${idx * 70}ms`,
                    }}
                  />
                );
              })}
            </div>
            <p className="signal-caption">No mic accessed and zero audio played.</p>
          </div>

          {/* Inline QR Join Card for Room Display */}
          <div className="operator-qr-card">
            <MiniQrGraphic />
            <div className="operator-qr-copy">
              <strong>Room QR Join Poster</strong>
              <span>Guests scan to read live captions in Safari or Chrome — no app install.</span>
            </div>
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
                className="button button-secondary has-leading-icon"
                onClick={() => handleStepChange(-1)}
                disabled={safeStepIndex === 0}
              >
                <ChevronLeft size={16} strokeWidth={2} aria-hidden="true" />
                <span>Previous utterance</span>
              </button>
              <button
                type="button"
                className="button button-primary has-trailing-icon"
                onClick={() => handleStepChange(1)}
                disabled={safeStepIndex === utteranceSteps.length - 1}
              >
                <span>Next utterance</span>
                <ChevronRight size={16} strokeWidth={2} aria-hidden="true" />
              </button>
            </div>
          </div>

          <p className="operator-boundary-note">{activeScenario.audienceNote}</p>
        </article>

        {/* Right Pane: Audience Delivery */}
        <article className="pane-card audience-pane" aria-label="Audience delivery pane">
          <div className="pane-top">
            <div className="pane-heading-group">
              <span className="eyebrow">Audience · Multi-screen</span>
              <h4 className="pane-title">
                {audienceMode === "mobile" ? "Mobile QR listener" : "Sanctuary projector"}
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
                <Smartphone size={15} strokeWidth={2} aria-hidden="true" />
                <span>Mobile QR</span>
              </button>
              <button
                type="button"
                aria-pressed={audienceMode === "projector"}
                onClick={() => setAudienceMode("projector")}
              >
                <Monitor size={15} strokeWidth={2} aria-hidden="true" />
                <span>Projector</span>
              </button>
            </div>
          </div>

          {audienceMode === "mobile" ? (
            <div className="phone-bezel-outer">
              <div className="phone-bezel-notch" aria-hidden="true" />
              <div className="mobile-listener-shell">
                <div className="mobile-listener-header">
                  <span className="badge badge-proven">
                    <QrCode size={14} strokeWidth={2} aria-hidden="true" />
                    <span>QR join · no app</span>
                  </span>
                  <span className="mobile-join-hint">Anchored to join time</span>
                </div>

                <div
                  className="segmented mobile-modality-strip"
                  role="group"
                  aria-label="Listener delivery mode controls"
                >
                  <button type="button" aria-pressed="true">
                    <Subtitles size={15} strokeWidth={2} aria-hidden="true" />
                    <span>Captions</span>
                  </button>
                  <button
                    type="button"
                    disabled
                    aria-describedby={audioNoticeId}
                  >
                    <Headphones size={15} strokeWidth={2} aria-hidden="true" />
                    <span>Audio (Off)</span>
                  </button>
                  <button
                    type="button"
                    disabled
                    aria-describedby={audioNoticeId}
                  >
                    <VolumeX size={15} strokeWidth={2} aria-hidden="true" />
                    <span>Both (Off)</span>
                  </button>
                </div>

                <div id={audioNoticeId} className="audio-disarmed-notice" role="status">
                  <VolumeX size={16} strokeWidth={2} aria-hidden="true" />
                  <span>{IKILANG_DATA.audioDisarmedNotice}</span>
                </div>

                <div
                  key={`${activeScenario.id}-${safeStepIndex}`}
                  className="mobile-caption-feed caption-enter"
                >
                  <div className="mobile-just-said">
                    <span className="recency-pill">Just said</span>
                    <p>{activeStep.justSaid}</p>
                  </div>

                  <div className="mobile-live-stage">
                    <span className="live-stage-label">
                      <span className="status-dot is-pulsing" aria-hidden="true" />
                      Live caption
                    </span>
                    <p className="mobile-live-text">{activeStep.activeLine}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="projector-frame-outer">
              <div
                className={`projector-stage${highContrastProjector ? " is-high-contrast" : ""}${
                  largeProjectorText ? " is-large-text" : ""
                }`}
                aria-label="Sanctuary projector upward book-scroll caption stage"
              >
                <div className="projector-toolbar">
                  <span className="projector-badge">
                    <span className="status-dot is-pulsing" aria-hidden="true" />
                    Upward book-scroll
                  </span>

                  <div className="projector-a11y-controls">
                    <button
                      type="button"
                      className="projector-control-btn"
                      aria-pressed={highContrastProjector}
                      onClick={() => setHighContrastProjector((prev) => !prev)}
                    >
                      <Contrast size={15} strokeWidth={2} aria-hidden="true" />
                      <span>High contrast</span>
                    </button>
                    <button
                      type="button"
                      className="projector-control-btn"
                      aria-pressed={largeProjectorText}
                      onClick={() => setLargeProjectorText((prev) => !prev)}
                    >
                      <Type size={15} strokeWidth={2} aria-hidden="true" />
                      <span>{largeProjectorText ? "Text: Large" : "Text: Standard"}</span>
                    </button>
                  </div>
                </div>

                {/* Chronological Upward Book-Scroll Hierarchy: Earlier -> Just Said -> Active Stage */}
                <div
                  key={`proj-${activeScenario.id}-${safeStepIndex}`}
                  className="projector-scroll-body caption-enter"
                >
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
                    <span className="projector-live-label">Active live caption</span>
                    <p className="projector-active-text">{activeStep.activeLine}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </article>
      </div>
    </section>
  );
}
