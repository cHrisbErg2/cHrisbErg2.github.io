import { useCallback, useEffect, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  FlaskConical,
  Github,
  MapPin,
} from "lucide-react";
import { TranslationBenchFigure } from "./components/anatomy/bench/TranslationBenchFigure";
import { SkipLink } from "./components/SkipLink";
import { SiteHeader } from "./components/SiteHeader";
import type { PortfolioRoute } from "./components/SiteHeader";
import { SiteFooter } from "./components/SiteFooter";
import { PROFILE } from "./data/profile";
import { PUBLIC_PROJECTS } from "./data/projects";
import { IkiLangCaseStudy } from "./projects/ikilang/IkiLangCaseStudy";
import "./projects/ikilang/ikilang.css";

function parseHashRoute(hash: string): PortfolioRoute | null {
  const trimmed = hash.trim();
  if (trimmed === "" || trimmed === "#") {
    return "home";
  }
  if (!trimmed.startsWith("#/")) {
    return null;
  }
  const normalized = trimmed.slice(1).toLowerCase();
  if (normalized === "/projects/ikilang" || normalized.startsWith("/projects/ikilang/")) {
    return "ikilang";
  }
  return "home";
}

function hashForRoute(route: PortfolioRoute): string {
  return route === "ikilang" ? "#/projects/ikilang" : "#/";
}

const HERO_PROOF_METRICS = [
  { value: "+1.02 s", label: "replay delay" },
  { value: "451", label: "passing tests" },
  { value: "0.10 ms", label: "p95 guardrail" },
  { value: "0%", label: "clause cutoffs" },
];

export function App() {
  const [activeRoute, setActiveRoute] = useState<PortfolioRoute>(
    () => parseHashRoute(typeof window !== "undefined" ? window.location.hash : "") ?? "home",
  );

  useEffect(() => {
    const handleHashChange = () => {
      const nextRoute = parseHashRoute(window.location.hash);
      if (nextRoute !== null) {
        setActiveRoute(nextRoute);
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    document.title =
      activeRoute === "ikilang"
        ? "IkiLang / KinyaVoice Case Study — Christian Muhirwa"
        : "Christian Muhirwa — Computer Engineering, DSP, Edge & Embedded ML | Portfolio";
  }, [activeRoute]);

  const navigate = useCallback((route: PortfolioRoute) => {
    const nextHash = hashForRoute(route);
    if (window.location.hash !== nextHash) {
      window.location.hash = nextHash;
    }
    setActiveRoute(route);
    if (typeof window.scrollTo === "function") {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, []);

  const flagshipProject = PUBLIC_PROJECTS.find((project) => project.kind === "case-study");
  const externalProjects = PUBLIC_PROJECTS.filter((project) => project.kind === "external");

  return (
    <div className="site-shell">
      <SkipLink />
      <SiteHeader activeRoute={activeRoute} onNavigate={navigate} />

      <main id="main-content" className="site-main" tabIndex={-1}>
        {activeRoute === "ikilang" ? (
          <IkiLangCaseStudy onBackToOverview={() => navigate("home")} />
        ) : (
          <div className="section-stack">
            {/* Split 2-Column Graphical Hero */}
            <section className="hero-panel overview-hero" aria-labelledby="overview-hero-heading">
              <div className="overview-hero-grid">
                <div className="hero-copy-col">
                  <div className="overview-identity-row hero-stagger-1">
                    <span className="eyebrow">{PROFILE.affiliation}</span>
                    <span className="badge">
                      <MapPin size={13} strokeWidth={2} aria-hidden="true" />
                      <span>{PROFILE.locationLabel}</span>
                    </span>
                  </div>

                  <h1 id="overview-hero-heading" className="hero-title hero-stagger-1">
                    {PROFILE.name}
                  </h1>
                  <p className="overview-role-line hero-stagger-2">{PROFILE.roleLine}</p>
                  <p className="hero-lead hero-stagger-2">{PROFILE.builderSummary}</p>

                  {/* Compact Proof Metrics */}
                  <dl className="hero-proof-strip hero-stagger-3" aria-label="Measured pipeline benchmarks">
                    {HERO_PROOF_METRICS.map((metric) => (
                      <div key={metric.label} className="hero-proof-item">
                        <dt className="hero-proof-label">{metric.label}</dt>
                        <dd className="hero-proof-value">{metric.value}</dd>
                      </div>
                    ))}
                  </dl>

                  <ul className="pill-list hero-stagger-3" aria-label="Core engineering focus areas">
                    {PROFILE.focusAreas.map((area) => (
                      <li key={area} className="tech-pill">
                        {area}
                      </li>
                    ))}
                  </ul>

                  <div className="hero-actions hero-stagger-4">
                    <button
                      type="button"
                      className="button button-primary has-trailing-icon"
                      onClick={() => navigate("ikilang")}
                    >
                      <span>Explore IkiLang case study</span>
                      <ArrowRight size={17} strokeWidth={2} aria-hidden="true" />
                    </button>
                    <a
                      className="button button-secondary has-leading-icon"
                      href={PROFILE.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github size={17} strokeWidth={2} aria-hidden="true" />
                      <span>View GitHub profile</span>
                    </a>
                  </div>
                </div>

                <div className="hero-rig-col hero-stagger-4">
                  <TranslationBenchFigure variant="hero" onOpenCaseStudy={() => navigate("ikilang")} />
                </div>
              </div>
            </section>

            {/* Flagship Interactive Project Card */}
            {flagshipProject ? (
              <section aria-labelledby="flagship-section-heading">
                <div className="overview-section-header">
                  <span className="eyebrow">Flagship case study</span>
                  <h2 id="flagship-section-heading" className="section-title">
                    Live low-resource speech translation
                  </h2>
                </div>

                <article className="card interactive-card flagship-card">
                  <div className="flagship-top">
                    <div>
                      <span className="eyebrow">{flagshipProject.badge}</span>
                      <h3 className="flagship-heading">{flagshipProject.name}</h3>
                      <p className="flagship-subtitle">{flagshipProject.subtitle}</p>
                    </div>
                    <span className="badge badge-validating">
                      <FlaskConical size={14} strokeWidth={2} aria-hidden="true" />
                      <span>{flagshipProject.statusLabel}</span>
                    </span>
                  </div>

                  <p className="flagship-summary">{flagshipProject.summary}</p>

                  <ul className="flagship-highlights">
                    {flagshipProject.highlights.map((highlight) => (
                      <li key={highlight}>
                        <CheckCircle2 size={16} strokeWidth={2} aria-hidden="true" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flagship-inside-strip">
                    <strong>Interactive walkthroughs inside:</strong>
                    <span>65 s latency chart</span>
                    <span aria-hidden="true">·</span>
                    <span>Phone QR &amp; projector preview</span>
                    <span aria-hidden="true">·</span>
                    <span>5-stage schematic</span>
                    <span aria-hidden="true">·</span>
                    <span>What works vs. gated</span>
                  </div>

                  <ul className="pill-list" aria-label="IkiLang public stack highlights">
                    {flagshipProject.tags.map((tag) => (
                      <li key={tag} className="tech-pill tech-pill-strong">
                        {tag}
                      </li>
                    ))}
                  </ul>

                  <div className="flagship-footer">
                    <button
                      type="button"
                      className="button button-primary has-trailing-icon"
                      onClick={() => navigate("ikilang")}
                    >
                      <span>{flagshipProject.ctaLabel}</span>
                      <ArrowRight size={17} strokeWidth={2} aria-hidden="true" />
                    </button>
                  </div>
                </article>
              </section>
            ) : null}

            {/* Modular More Public Work Section */}
            {externalProjects.length > 0 ? (
              <section aria-labelledby="more-work-heading">
                <div className="overview-section-header">
                  <span className="eyebrow">More public work</span>
                  <h2 id="more-work-heading" className="section-title">
                    Open repositories
                  </h2>
                </div>

                <div className={externalProjects.length === 1 ? "single-project-grid" : "grid-2"}>
                  {externalProjects.map((project) => (
                    <article key={project.id} className="card interactive-card external-project-card">
                      <div className="external-project-top">
                        <div>
                          <span className="eyebrow">{project.badge}</span>
                          <h3 className="external-project-title">{project.name}</h3>
                          <p className="external-project-subtitle">{project.subtitle}</p>
                        </div>
                        <span className="badge">{project.statusLabel}</span>
                      </div>

                      <p className="external-project-summary">{project.summary}</p>

                      <ul className="pill-list" aria-label={`${project.name} topics`}>
                        {project.tags.map((tag) => (
                          <li key={tag} className="tech-pill">
                            {tag}
                          </li>
                        ))}
                      </ul>

                      {project.externalUrl ? (
                        <div className="external-project-actions">
                          <a
                            className="button button-secondary has-trailing-icon"
                            href={project.externalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <span>{project.ctaLabel}</span>
                            <ExternalLink size={16} strokeWidth={2} aria-hidden="true" />
                          </a>
                        </div>
                      ) : null}
                    </article>
                  ))}
                </div>
              </section>
            ) : null}

            {/* Engineering Philosophy Hairline Strip */}
            <section aria-labelledby="philosophy-heading">
              <div className="overview-section-header">
                <span className="eyebrow">How I work</span>
                <h2 id="philosophy-heading" className="section-title">
                  Engineering principles
                </h2>
              </div>

              <div className="principles-strip">
                {PROFILE.principles.map((principle, index) => (
                  <article key={principle.id} className="principle-column">
                    <span className="principle-index">0{index + 1}</span>
                    <h3 className="principle-title">{principle.title}</h3>
                    <p className="principle-detail">{principle.detail}</p>
                  </article>
                ))}
              </div>
            </section>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}

export default App;
