import type { MouseEvent } from "react";

export function SkipLink() {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
      return;
    }
    event.preventDefault();
    const target = document.getElementById("main-content");
    if (target) {
      target.focus();
      if (typeof target.scrollIntoView === "function") {
        target.scrollIntoView({ block: "start", behavior: "auto" });
      }
    }
  };

  return (
    <a className="skip-link" href="#main-content" onClick={handleClick}>
      Skip to main content
    </a>
  );
}
