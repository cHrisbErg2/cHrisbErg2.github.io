import { useCallback, useEffect, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  FlaskConical,
  Github,
  MapPin,
} from "lucide-react";
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
        : "Christian Muhirwa — Applied AI & Real-Time Systems Portfolio";
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
            {/* Builder Overview Hero */}
            <section className="hero-panel overview-hero" aria-labelledby="overview-hero-heading">
              <div className="overview-identity-row">
                <span className="eyebrow">{PROFILE.affiliation}</span>
                <span className="badge">
                  <MapPin size={13} aria-hidden="true" />
                  <span>{PROFILE.locationLabel}</span>
                </span>
              </div>

              <h1 id="overview-hero-heading" className="hero-title">
                {PROFILE.name}
              </h1>
              <p className="overview-role-line">{PROFILE.roleLine}</p>
              <p className="hero-lead">{PROFILE.builderSummary}</p>

              <ul className="pill-list" aria-label="Core engineering focus areas">
                {PROFILE.focusAreas.map((area) => (
                  <li key={area} className="tech-pill tech-pill-strong">
                    {area}
                  </li>
                ))}
              </ul>

              <div className="hero-actions">
                <button
                  type="button"
                  className="button button-primary"
                  onClick={() => navigate("ikilang")}
                >
                  <span>Explore IkiLang / KinyaVoice Case Study</span>
                  <ArrowRight size={17} aria-hidden="true" />
                </button>
                <a
                  className="button button-secondary"
                  href={PROFILE.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github size={17} aria-hidden="true" />
                  <span>GitHub Profile</span>
                </a>
              </div>
            </section>

            {/* Flagship Interactive Project Card */}
            {flagshipProject ? (
              <section aria-labelledby="flagship-section-heading">
                <div className="overview-section-header">
                  <span className="eyebrow">Flagship Case Study</span>
                  <h2 id="flagship-section-heading" className="section-title">
                    Real-Time Low-Resource Speech Translation Blueprint
                  </h2>
                </div>

                <article className="card flagship-card">
                  <div className="flagship-top">
                    <div>
                      <span className="eyebrow">{flagshipProject.badge}</span>
                      <h3 className="flagship-heading">{flagshipProject.name}</h3>
                      <p className="flagship-subtitle">{flagshipProject.subtitle}</p>
                    </div>
                    <span className="badge badge-validating">
                      <FlaskConical size={14} aria-hidden="true" />
                      <span>{flagshipProject.statusLabel}</span>
                    </span>
                  </div>

                  <p className="flagship-summary">{flagshipProject.summary}</p>

                  <ul className="flagship-highlights">
                    {flagshipProject.highlights.map((highlight) => (
                      <li key={highlight}>
                        <CheckCircle2 size={16} aria-hidden="true" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flagship-inside-strip">
                    <strong>Inside the interactive case study:</strong>
                    <span>65 s Latency Timeline Lab</span>
                    <span aria-hidden="true">·</span>
                    <span>Operator &amp; Audience Dual-Pane Preview</span>
                    <span aria-hidden="true">·</span>
                    <span>5-Layer Black-Box Map</span>
                    <span aria-hidden="true">·</span>
                    <span>Canonical Maturity Matrix &amp; Roadmap</span>
                  </div>

                  <ul className="pill-list" aria-label="IkiLang public stack highlights">
                    {flagshipProject.tags.map((tag) => (
                      <li key={tag} className="tech-pill">
                        {tag}
                      </li>
                    ))}
                  </ul>

                  <div className="flagship-footer">
                    <button
                      type="button"
                      className="button button-primary"
                      onClick={() => navigate("ikilang")}
                    >
                      <span>{flagshipProject.ctaLabel}</span>
                      <ArrowRight size={17} aria-hidden="true" />
                    </button>
                  </div>
                </article>
              </section>
            ) : null}

            {/* Modular More Public Work Section */}
            {externalProjects.length > 0 ? (
              <section aria-labelledby="more-work-heading">
                <div className="overview-section-header">
                  <span className="eyebrow">More Public Work</span>
                  <h2 id="more-work-heading" className="section-title">
                    Independent Public Repositories
                  </h2>
                </div>

                <div className="grid-2">
                  {externalProjects.map((project) => (
                    <article key={project.id} className="card external-project-card">
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
                            className="button button-secondary"
                            href={project.externalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <span>{project.ctaLabel}</span>
                            <ExternalLink size={16} aria-hidden="true" />
                          </a>
                        </div>
                      ) : null}
                    </article>
                  ))}
                </div>
              </section>
            ) : null}

            {/* Engineering Philosophy Strip */}
            <section aria-labelledby="philosophy-heading">
              <div className="overview-section-header">
                <span className="eyebrow">How I Build</span>
                <h2 id="philosophy-heading" className="section-title">
                  Engineering Philosophy
                </h2>
              </div>

              <div className="grid-3">
                {PROFILE.principles.map((principle) => (
                  <article key={principle.id} className="card principle-card">
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
