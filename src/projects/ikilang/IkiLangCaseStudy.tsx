import { useId } from "react";
import {
  ArrowLeft,
  ArrowLeftRight,
  CalendarCheck,
  CheckCircle2,
  Compass,
  FlaskConical,
  Layers,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { IKILANG_DATA } from "./data";
import { LatencyTimelineLab } from "./components/LatencyTimelineLab";
import { OperatorAudiencePreview } from "./components/OperatorAudiencePreview";
import { ArchitectureExplorer } from "./components/ArchitectureExplorer";
import { SystemCardAndRoadmap } from "./components/SystemCardAndRoadmap";
import "./ikilang.css";

interface IkiLangCaseStudyProps {
  onBackToOverview?: () => void;
}

function jumpToSection(elementId: string) {
  const target = document.getElementById(elementId);
  if (!target) return;
  const reduced =
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  target.focus({ preventScroll: true });
}

export function IkiLangCaseStudy({ onBackToOverview }: IkiLangCaseStudyProps) {
  const storyId = useId();
  const bridgeId = useId();
  const toolsId = useId();
  const labsId = useId();

  return (
    <article className="section-stack ikilang-case-study" aria-label="IkiLang / KinyaVoice Case Study">
      {/* Hero Header */}
      <header className="hero-panel ikilang-hero">
        {onBackToOverview ? (
          <div className="case-back-row">
            <button
              type="button"
              className="button button-ghost case-back-btn"
              onClick={onBackToOverview}
            >
              <ArrowLeft size={16} aria-hidden="true" />
              <span>Back to overview</span>
            </button>
          </div>
        ) : null}

        <div className="ikilang-hero-badges">
          <span className="badge badge-proven">
            <span className="status-dot" aria-hidden="true" />
            <span>{IKILANG_DATA.coBrandLabel}</span>
          </span>
          <span className="badge badge-validating">
            <FlaskConical size={14} aria-hidden="true" />
            <span>Phase 1A · Active validation</span>
          </span>
          <span className="badge">
            <CalendarCheck size={14} aria-hidden="true" />
            <span>Verified {IKILANG_DATA.lastVerifiedDate}</span>
          </span>
        </div>

        <h1 className="hero-title">{IKILANG_DATA.productName}</h1>
        <p className="ikilang-tagline">{IKILANG_DATA.tagline}</p>
        <p className="hero-lead">{IKILANG_DATA.heroSummary}</p>

        <nav className="section-jump-nav" aria-label="Case study sections">
          <button
            type="button"
            className="button button-secondary jump-btn"
            onClick={() => jumpToSection("ikilang-story")}
          >
            <Compass size={15} aria-hidden="true" />
            <span>Read motivation</span>
          </button>
          <button
            type="button"
            className="button button-secondary jump-btn"
            onClick={() => jumpToSection("ikilang-labs")}
          >
            <FlaskConical size={15} aria-hidden="true" />
            <span>Explore interactive labs</span>
          </button>
          <button
            type="button"
            className="button button-secondary jump-btn"
            onClick={() => jumpToSection("ikilang-system-card")}
          >
            <ShieldCheck size={15} aria-hidden="true" />
            <span>View system card &amp; roadmap</span>
          </button>
        </nav>

        {/* Proof-First Discipline Highlights */}
        <div className="discipline-grid" aria-label="Verified engineering benchmarks">
          {IKILANG_DATA.disciplineSignals.map((signal) => (
            <div key={signal.id} className="discipline-card">
              <span className="discipline-metric">{signal.metric}</span>
              <span className="discipline-label">{signal.label}</span>
              <p className="discipline-detail">{signal.detail}</p>
            </div>
          ))}
        </div>
      </header>

      {/* Why I'm Building This + Bidirectional Two-Way Bridge */}
      <section
        id="ikilang-story"
        tabIndex={-1}
        className="card story-card"
        aria-labelledby={storyId}
      >
        <div className="section-heading-row">
          <div>
            <span className="eyebrow">Motivation &amp; problem reality</span>
            <h2 id={storyId} className="section-title">
              {IKILANG_DATA.founderStory.heading}
            </h2>
            <p className="section-lead">{IKILANG_DATA.founderStory.subtitle}</p>
          </div>
        </div>

        <div className="story-paragraphs">
          {IKILANG_DATA.founderStory.paragraphs.map((paragraph, index) => (
            <p key={index} className="story-paragraph">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="grid-2 story-callouts">
          <div className="card-subtle story-callout-box">
            <span className="eyebrow">Mother tongue &amp; validation</span>
            <p className="story-callout-text">
              {IKILANG_DATA.founderStory.languageStewardshipNote}
            </p>
          </div>
          <div className="card-subtle story-callout-box">
            <span className="eyebrow">Blueprint #1 principle</span>
            <p className="story-callout-text">{IKILANG_DATA.founderStory.blueprintPrinciple}</p>
          </div>
        </div>

        {/* Two-Way Bridge Cards */}
        <div className="bridge-section" aria-labelledby={bridgeId}>
          <div className="bridge-header">
            <span className="eyebrow">
              <ArrowLeftRight size={14} aria-hidden="true" />
              Bidirectional community access
            </span>
            <h3 id={bridgeId} className="bridge-heading">
              Two-way dignity: independent access &amp; local engagement
            </h3>
          </div>

          <div className="grid-2 bridge-grid">
            {IKILANG_DATA.bridgeDirections.map((direction) => (
              <article key={direction.id} className="bridge-card">
                <span className="bridge-direction-tag">{direction.directionLabel}</span>
                <h4 className="bridge-card-title">{direction.title}</h4>
                <p className="bridge-audience">{direction.audience}</p>

                <ul className="pill-list" aria-label={`Settings for ${direction.title}`}>
                  {direction.settings.map((setting) => (
                    <li key={setting} className="tech-pill">
                      {setting}
                    </li>
                  ))}
                </ul>

                <p className="bridge-value">{direction.valueStatement}</p>
                <p className="bridge-dignity">
                  <CheckCircle2 size={15} aria-hidden="true" />
                  <span>{direction.dignityHighlight}</span>
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Tools & Engineering Discipline */}
      <section className="card" aria-labelledby={toolsId}>
        <div className="section-heading-row">
          <div>
            <span className="eyebrow">
              <Wrench size={14} aria-hidden="true" />
              Ecosystem stack
            </span>
            <h2 id={toolsId} className="section-title">
              Tools evaluated across streaming, capture &amp; verification
            </h2>
            <p className="section-lead">
              Public stack isolated behind pluggable seams — private model routing, prompts, and
              scoring internals remain black-boxed.
            </p>
          </div>
        </div>

        <div className="grid-2 tools-grid">
          {IKILANG_DATA.toolCategories.map((category) => (
            <article key={category.id} className="card-subtle tool-category-card">
              <h3 className="tool-category-title">{category.category}</h3>
              <p className="tool-category-purpose">{category.purpose}</p>
              <ul className="pill-list" aria-label={category.category}>
                {category.tools.map((tool) => (
                  <li key={tool} className="tech-pill tech-pill-strong">
                    {tool}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* Interactive Lab Trio */}
      <section
        id="ikilang-labs"
        tabIndex={-1}
        className="section-stack labs-section"
        aria-labelledby={labsId}
      >
        <div className="labs-intro">
          <span className="eyebrow">
            <Layers size={14} aria-hidden="true" />
            Zero-API interactive labs
          </span>
          <h2 id={labsId} className="section-title">
            Cadence, multi-screen UX &amp; black-box boundaries
          </h2>
          <p className="section-lead">
            Deterministic static previews — zero live API calls, zero autoplay audio, full keyboard
            control.
          </p>
        </div>

        <LatencyTimelineLab />
        <OperatorAudiencePreview />
        <ArchitectureExplorer />
      </section>

      {/* System Card, Shortcomings, Privacy Honesty, Field Spec, Roadmap & Changelog */}
      <div id="ikilang-system-card" tabIndex={-1}>
        <SystemCardAndRoadmap />
      </div>
    </article>
  );
}
