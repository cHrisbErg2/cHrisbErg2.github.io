import type { MouseEvent } from "react";
import { ThemeToggle } from "./ThemeToggle";

export type PortfolioRoute = "home" | "ikilang";

export function SiteHeader({
  activeRoute,
  onNavigate,
}: {
  activeRoute: PortfolioRoute;
  onNavigate: (route: PortfolioRoute) => void;
}) {
  const handleNavClick = (route: PortfolioRoute) => (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
      return;
    }
    event.preventDefault();
    onNavigate(route);
  };

  return (
    <header className="site-header">
      <div className="header-inner">
        <a
          href="#/"
          className="site-brand"
          onClick={handleNavClick("home")}
        >
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
              <rect x="4" y="10" width="2.5" height="5" rx="1.25" />
              <rect x="8.5" y="6.5" width="2.5" height="12" rx="1.25" />
              <rect x="13" y="4" width="2.5" height="17" rx="1.25" />
              <rect x="17.5" y="8" width="2.5" height="9" rx="1.25" />
            </svg>
          </span>
          <span className="brand-text">Christian Muhirwa</span>
        </a>

        <nav className="site-nav" aria-label="Primary">
          <ul className="nav-list">
            <li>
              <a
                href="#/"
                className="nav-link"
                aria-current={activeRoute === "home" ? "page" : undefined}
                onClick={handleNavClick("home")}
              >
                Overview
              </a>
            </li>
            <li>
              <a
                href="#/projects/ikilang"
                className="nav-link"
                aria-current={activeRoute === "ikilang" ? "page" : undefined}
                onClick={handleNavClick("ikilang")}
              >
                IkiLang Case Study
              </a>
            </li>
          </ul>
        </nav>

        <div className="header-actions">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
