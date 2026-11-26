import { useId, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Cpu,
  FlaskConical,
  HeartHandshake,
  Lock,
  Milestone,
  Radio,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { IKILANG_DATA, MATURITY_LABELS } from "../data";
import type { MaturityStatus } from "../types";

type MaturityFilter = "all" | MaturityStatus;

function renderMaturityBadge(status: MaturityStatus) {
  if (status === "proven") {
    return (
      <span className="badge badge-proven">
        <CheckCircle2 size={14} strokeWidth={2} aria-hidden="true" />
        <span>{MATURITY_LABELS.proven}</span>
      </span>
    );
  }
  if (status === "validating") {
    return (
      <span className="badge badge-validating">
        <FlaskConical size={14} strokeWidth={2} aria-hidden="true" />
        <span>{MATURITY_LABELS.validating}</span>
      </span>
    );
  }
  return (
    <span className="badge badge-gated">
      <Lock size={14} strokeWidth={2} aria-hidden="true" />
      <span>{MATURITY_LABELS.gated}</span>
    </span>
  );
}

export function SystemCardAndRoadmap() {
  const [filter, setFilter] = useState<MaturityFilter>("all");
  const systemCardHeadingId = useId();
  const shortcomingsHeadingId = useId();
  const privacyHeadingId = useId();
  const fieldHeadingId = useId();
  const roadmapHeadingId = useId();
  const migrationHeadingId = useId();
  const changelogHeadingId = useId();

  const matrix = IKILANG_DATA.maturityMatrix;
  const counts = {
    all: matrix.length,
    proven: matrix.filter((item) => item.status === "proven").length,
    validating: matrix.filter((item) => item.status === "validating").length,
    gated: matrix.filter((item) => item.status === "gated").length,
  };

  const filteredItems =
    filter === "all" ? matrix : matrix.filter((item) => item.status === filter);

  const filterButtons: Array<{ id: MaturityFilter; label: string; count: number }> = [
    { id: "all", label: "All", count: counts.all },
    { id: "proven", label: MATURITY_LABELS.proven, count: counts.proven },
    { id: "validating", label: MATURITY_LABELS.validating, count: counts.validating },
    { id: "gated", label: MATURITY_LABELS.gated, count: counts.gated },
  ];

  const { shortcomingsAndHumanBoundary, nvidiaMigrationGoal } = IKILANG_DATA;

  return (
    <div className="section-stack system-card-stack">
      {/* 1. System Status & Maturity Matrix */}
      <section className="card" aria-labelledby={systemCardHeadingId}>
        <div className="section-heading-row">
          <div>
            <span className="eyebrow">System status</span>
            <h2 id={systemCardHeadingId} className="section-title">
              What works today vs. what is gated
            </h2>
            <p className="section-lead">
              Filter every capability by what is proven in tests, running in trials, or kept off on
              purpose.
            </p>
          </div>
        </div>

        <div
          className="segmented maturity-filter-bar"
          role="group"
          aria-label="Filter system capabilities by maturity status"
        >
          {filterButtons.map((btn) => (
            <button
              key={btn.id}
              type="button"
              aria-pressed={filter === btn.id}
              onClick={() => setFilter(btn.id)}
            >
              <span>{btn.label}</span>
              <span className="filter-count" aria-hidden="true">
                {btn.count}
              </span>
            </button>
          ))}
        </div>

        <div className="maturity-list" aria-live="polite">
          {filteredItems.map((item) => (
            <article key={item.capability} className="maturity-row">
              <div className="maturity-row-top">
                <h3 className="maturity-capability">{item.capability}</h3>
                {renderMaturityBadge(item.status)}
              </div>
              <div className="grid-2 maturity-row-details">
                <div>
                  <span className="maturity-field-label">Evidence</span>
                  <p className="maturity-field-text">{item.evidence}</p>
                </div>
                <div>
                  <span className="maturity-field-label">Boundary</span>
                  <p className="maturity-field-text">{item.boundaryNote}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 2. Limits & When Humans Remain Essential */}
      <section className="card shortcomings-card" aria-labelledby={shortcomingsHeadingId}>
        <div className="section-heading-row">
          <div>
            <span className="eyebrow">
              <ShieldAlert size={14} strokeWidth={2} aria-hidden="true" />
              Honest boundaries
            </span>
            <h2 id={shortcomingsHeadingId} className="section-title">
              {shortcomingsAndHumanBoundary.heading}
            </h2>
            <p className="section-lead">{shortcomingsAndHumanBoundary.summary}</p>
          </div>
        </div>

        <div className="grid-2 shortcomings-grid">
          <div className="card-subtle">
            <h3 className="subpanel-title">
              <AlertTriangle size={17} strokeWidth={2} aria-hidden="true" />
              Where it still falls short
            </h3>
            <ul className="clean-bullet-list">
              {shortcomingsAndHumanBoundary.currentLimits.map((limit) => (
                <li key={limit}>{limit}</li>
              ))}
            </ul>
          </div>

          <div className="card-subtle human-essential-box">
            <h3 className="subpanel-title">
              <HeartHandshake size={17} strokeWidth={2} aria-hidden="true" />
              When a human interpreter is mandatory
            </h3>
            <ul className="clean-bullet-list">
              {shortcomingsAndHumanBoundary.humanEssentialScenarios.map((scenario) => (
                <li key={scenario}>{scenario}</li>
              ))}
            </ul>
          </div>
        </div>

        <p className="closing-principle">{shortcomingsAndHumanBoundary.closingPrinciple}</p>
      </section>

      {/* 3. Privacy & Encryption Honesty */}
      <section className="card" aria-labelledby={privacyHeadingId}>
        <div className="section-heading-row">
          <div>
            <span className="eyebrow">
              <ShieldCheck size={14} strokeWidth={2} aria-hidden="true" />
              Privacy architecture
            </span>
            <h2 id={privacyHeadingId} className="section-title">
              Zero personal data &amp; honest encryption labels
            </h2>
          </div>
        </div>

        <div className="crypto-honesty-banner" role="note">
          <Lock size={18} strokeWidth={2} aria-hidden="true" />
          <p>{IKILANG_DATA.cryptographicHonestyNotice}</p>
        </div>

        <div className="grid-2 privacy-grid">
          {IKILANG_DATA.privacyCommitments.map((commitment) => (
            <article key={commitment.title} className="card-subtle privacy-item">
              <h3 className="privacy-item-title">{commitment.title}</h3>
              <p className="privacy-item-detail">{commitment.detail}</p>
            </article>
          ))}
        </div>
      </section>

      {/* 4. Room Hardware & QR Chain */}
      <section className="card" aria-labelledby={fieldHeadingId}>
        <div className="section-heading-row">
          <div>
            <span className="eyebrow">
              <Radio size={14} strokeWidth={2} aria-hidden="true" />
              Room hardware guide
            </span>
            <h2 id={fieldHeadingId} className="section-title">
              Room audio &amp; QR setup
            </h2>
          </div>
        </div>

        <ol className="field-spec-strip">
          {IKILANG_DATA.fieldSpecSteps.map((spec, index) => (
            <li key={spec.step} className="field-spec-step">
              <div className="field-spec-top">
                <span className="field-spec-num">0{spec.step}</span>
                {index < IKILANG_DATA.fieldSpecSteps.length - 1 ? (
                  <ArrowRight size={15} strokeWidth={2} className="field-spec-arrow" aria-hidden="true" />
                ) : null}
              </div>
              <h3 className="field-spec-label">{spec.label}</h3>
              <p className="field-spec-detail">{spec.detail}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* 5. 4-Phase Rollout Timeline */}
      <section className="card" aria-labelledby={roadmapHeadingId}>
        <div className="section-heading-row">
          <div>
            <span className="eyebrow">
              <Milestone size={14} strokeWidth={2} aria-hidden="true" />
              Rollout plan
            </span>
            <h2 id={roadmapHeadingId} className="section-title">
              4-phase rollout
            </h2>
            <p className="section-lead">
              New capabilities unlock only after latency, accuracy, and consent benchmarks pass.
            </p>
          </div>
        </div>

        <ol className="roadmap-list">
          {IKILANG_DATA.roadmapPhases.map((phase) => (
            <li key={phase.id} className="roadmap-card">
              <div className="roadmap-card-top">
                <div className="roadmap-heading-group">
                  <span className="roadmap-phase-tag">{phase.phase}</span>
                  <h3 className="roadmap-title">{phase.title}</h3>
                </div>
                {renderMaturityBadge(phase.status)}
              </div>

              <div className="grid-2 roadmap-details">
                <div>
                  <span className="maturity-field-label">Goal</span>
                  <p className="maturity-field-text">{phase.objective}</p>
                </div>
                <div>
                  <span className="maturity-field-label">Unlock rule</span>
                  <p className="maturity-field-text">{phase.exitGate}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* 6. Long-Term Goal: Cloud -> NVIDIA Migration Gate */}
      <section className="card" aria-labelledby={migrationHeadingId}>
        <div className="section-heading-row">
          <div>
            <span className="eyebrow">
              <Cpu size={14} strokeWidth={2} aria-hidden="true" />
              {nvidiaMigrationGoal.eyebrow}
            </span>
            <h2 id={migrationHeadingId} className="section-title">
              {nvidiaMigrationGoal.heading}
            </h2>
            <p className="section-lead">{nvidiaMigrationGoal.summary}</p>
          </div>
        </div>

        <div className="grid-2" style={{ marginBlockEnd: "22px" }}>
          <div className="principle-column">
            <span className="principle-index">{nvidiaMigrationGoal.liveBaselineLabel}</span>
            <h3 className="principle-title">{nvidiaMigrationGoal.liveBaselineTitle}</h3>
            <p className="principle-detail">{nvidiaMigrationGoal.liveBaselineDetail}</p>
          </div>

          <div className="principle-column">
            <span className="principle-index">{nvidiaMigrationGoal.longTermTargetLabel}</span>
            <h3 className="principle-title">{nvidiaMigrationGoal.longTermTargetTitle}</h3>
            <p className="principle-detail">{nvidiaMigrationGoal.longTermTargetDetail}</p>
          </div>
        </div>

        <p className="closing-principle">{nvidiaMigrationGoal.cutoverRule}</p>
      </section>

      {/* 7. Recent Engineering Log */}
      <section className="card" aria-labelledby={changelogHeadingId}>
        <div className="section-heading-row">
          <div>
            <span className="eyebrow">
              <Calendar size={14} strokeWidth={2} aria-hidden="true" />
              Changelog
            </span>
            <h2 id={changelogHeadingId} className="section-title">
              Recent engineering log
            </h2>
          </div>
        </div>

        <ol className="changelog-list">
          {IKILANG_DATA.changelog.map((entry) => (
            <li key={`${entry.date}-${entry.title}`} className="changelog-item">
              <div className="changelog-meta">
                <time dateTime={entry.date} className="changelog-date">
                  {entry.date}
                </time>
                <span className="meta-chip">{entry.tag}</span>
                {renderMaturityBadge(entry.status)}
              </div>
              <h3 className="changelog-title">{entry.title}</h3>
              <p className="changelog-summary">{entry.summary}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
