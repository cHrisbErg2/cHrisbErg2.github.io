import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "../src/App";
import { IKILANG_DATA } from "../src/projects/ikilang/data";
import { LatencyTimelineLab } from "../src/projects/ikilang/components/LatencyTimelineLab";
import { OperatorAudiencePreview } from "../src/projects/ikilang/components/OperatorAudiencePreview";
import { ArchitectureExplorer } from "../src/projects/ikilang/components/ArchitectureExplorer";
import { SystemCardAndRoadmap } from "../src/projects/ikilang/components/SystemCardAndRoadmap";

describe("Portfolio App, Routing, Theme & Accessibility", () => {
  beforeEach(() => {
    window.localStorage.clear();
    delete document.documentElement.dataset.theme;
    window.location.hash = "#/";
    window.scrollTo = vi.fn();
    HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  it("renders portfolio overview with flagship IkiLang card, external AgrI-For-Prairie repo, and navigates to the case study", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByRole("heading", { level: 1, name: "Christian Muhirwa" })).toBeInTheDocument();
    expect(screen.getByText(/Flagship Case Study/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "IkiLang / KinyaVoice" })).toBeInTheDocument();

    const agriLink = screen.getByRole("link", { name: /Open Repository on GitHub/i });
    expect(agriLink).toHaveAttribute("href", "https://github.com/cHrisbErg2/AgrI-For-Prairie");

    await user.click(screen.getByRole("button", { name: /Explore Interactive Case Study/i }));

    expect(window.location.hash).toBe("#/projects/ikilang");
    expect(
      screen.getByRole("heading", { level: 1, name: "IkiLang / KinyaVoice" }),
    ).toBeInTheDocument();
    expect(screen.getByText(IKILANG_DATA.coBrandLabel)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Why I'm Building This/i }),
    ).toBeInTheDocument();
  });

  it("loads directly onto the IkiLang case study from #/projects/ikilang hash route and returns to overview", async () => {
    const user = userEvent.setup();
    window.location.hash = "#/projects/ikilang";
    render(<App />);

    expect(
      screen.getByRole("heading", { level: 1, name: "IkiLang / KinyaVoice" }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Back to Portfolio Overview/i }));

    expect(window.location.hash).toBe("#/");
    expect(screen.getByRole("heading", { level: 1, name: "Christian Muhirwa" })).toBeInTheDocument();
  });

  it("preserves the IkiLang Case Study route and focuses #main-content when using SkipLink or fragment hashes", async () => {
    const user = userEvent.setup();
    window.location.hash = "#/projects/ikilang";
    render(<App />);

    expect(
      screen.getByRole("heading", { level: 1, name: "IkiLang / KinyaVoice" }),
    ).toBeInTheDocument();

    const skipLink = screen.getByRole("link", { name: /Skip to main content/i });
    const main = screen.getByRole("main");

    await user.click(skipLink);

    expect(
      screen.getByRole("heading", { level: 1, name: "IkiLang / KinyaVoice" }),
    ).toBeInTheDocument();
    expect(document.activeElement).toBe(main);

    // Also verify a raw non-route fragment hashchange never resets activeRoute to Overview
    window.location.hash = "#main-content";
    fireEvent(window, new HashChangeEvent("hashchange"));

    expect(
      screen.getByRole("heading", { level: 1, name: "IkiLang / KinyaVoice" }),
    ).toBeInTheDocument();
  });

  it("toggles light and dark theme via data-theme and updates aria-pressed", async () => {
    const user = userEvent.setup();
    render(<App />);

    const toggleButton = screen.getByRole("button", { name: /Dark theme/i });
    expect(toggleButton).toHaveAttribute("aria-pressed", "false");
    expect(document.documentElement.dataset.theme).toBe("light");

    await user.click(toggleButton);

    expect(toggleButton).toHaveAttribute("aria-pressed", "true");
    expect(document.documentElement.dataset.theme).toBe("dark");

    await user.click(toggleButton);

    expect(toggleButton).toHaveAttribute("aria-pressed", "false");
    expect(document.documentElement.dataset.theme).toBe("light");
  });

  it("renders zero empty or broken links and omits optional LinkedIn/Resume links when empty", () => {
    const { container } = render(<App />);

    const allLinks = Array.from(container.querySelectorAll("a"));
    expect(allLinks.length).toBeGreaterThan(0);

    for (const anchor of allLinks) {
      const href = anchor.getAttribute("href");
      expect(href, `Link "${anchor.textContent}" should have a non-empty href`).toBeTruthy();
      expect(href?.trim()).not.toBe("");
      expect(href?.trim()).not.toBe("#");
    }

    expect(screen.queryByRole("link", { name: /LinkedIn/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Resume/i })).not.toBeInTheDocument();
  });
});

describe("LatencyTimelineLab", () => {
  it("defaults paused, surfaces simulation provenance, and updates turn-based stall vs continuous delivery when scrubbed", async () => {
    const user = userEvent.setup();
    render(<LatencyTimelineLab />);

    // Provenance notice and paused default state
    expect(screen.getByText(IKILANG_DATA.timelineProvenanceNotice)).toBeInTheDocument();
    const playButton = screen.getByRole("button", { name: /Play Timeline/i });
    expect(playButton).toHaveAttribute("aria-pressed", "false");

    const scrubber = screen.getByRole("slider", { name: /Timeline scrubber/i });
    expect(scrubber).toHaveValue("0");

    // Scrub to 30s (index 3) where turn-based is stalled and continuous is delivered
    fireEvent.change(scrubber, { target: { value: "3" } });
    expect(screen.getByText(/Stalled · Waiting for Long Silence/i)).toBeInTheDocument();
    expect(
      screen.getByText(/30 s elapsed — turn-based listener view remains stalled/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Delivered \(< 1\.5 s Target\)/i)).toBeInTheDocument();

    // Scrub to 61s (index 6) where turn-based dumps a late wall of text
    fireEvent.change(scrubber, { target: { value: "6" } });
    expect(screen.getByText(/Late Wall-of-Text Dump/i)).toBeInTheDocument();
    expect(screen.getByText(/1\.8 s silence/i)).toBeInTheDocument();

    // Reset returns cleanly to 0s
    await user.click(screen.getByRole("button", { name: /Reset timeline to 0 seconds/i }));
    expect(scrubber).toHaveValue("0");
    expect(screen.getByText(/Waiting for Turn End/i)).toBeInTheDocument();

    // Play / Pause toggle updates aria-pressed cleanly
    await user.click(playButton);
    expect(screen.getByRole("button", { name: /Pause Timeline/i })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await user.click(screen.getByRole("button", { name: /Pause Timeline/i }));
    expect(screen.getByRole("button", { name: /Play Timeline/i })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });
});

describe("OperatorAudiencePreview", () => {
  it("switches scenarios, steps utterances, enforces disarmed mobile audio controls, and renders projector upward book-scroll order", async () => {
    const user = userEvent.setup();
    render(<OperatorAudiencePreview />);

    expect(screen.getByText(IKILANG_DATA.previewProvenanceNotice)).toBeInTheDocument();

    // Step Next / Previous utterances
    expect(screen.getByText(/Utterance 2 of 3/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Next Utterance/i }));
    expect(screen.getByText(/Utterance 3 of 3/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Previous Utterance/i }));
    expect(screen.getByText(/Utterance 2 of 3/i)).toBeInTheDocument();

    // Default Mobile QR view: audio & both controls must be disabled/disarmed
    const audioBtn = screen.getByRole("button", { name: /Audio \(Off\)/i });
    const bothBtn = screen.getByRole("button", { name: /Both \(Off\)/i });
    expect(audioBtn).toBeDisabled();
    expect(bothBtn).toBeDisabled();
    expect(screen.getByText(IKILANG_DATA.audioDisarmedNotice)).toBeInTheDocument();

    // Switch scenario to Medical Clinic / NGO Intake
    await user.click(screen.getByRole("button", { name: /Medical Clinic \/ NGO Intake/i }));
    expect(screen.getByText(/16 kHz Mono PCM · Desk Directional Mic/i)).toBeInTheDocument();

    // Switch scenario to Field Outreach & Visitor Exchange
    await user.click(screen.getByRole("button", { name: /Field Outreach & Visitor Exchange/i }));
    expect(screen.getByText(/16 kHz Mono PCM · Portable USB Interface/i)).toBeInTheDocument();

    // Switch back to Sanctuary and inspect Sanctuary Projector view
    await user.click(screen.getByRole("button", { name: /Sanctuary \/ Community Worship/i }));
    await user.click(screen.getByRole("button", { name: /Sanctuary Projector/i }));

    const projector = screen.getByLabelText(
      /Sanctuary projector upward book-scroll caption stage/i,
    );
    const earlierLabel = within(projector).getByText(/Earlier in the session/i);
    const justSaidBadge = within(projector).getByText(/^Just said$/i);
    const activeCaptionText = within(projector).getByText(
      /After the closing hymn, community hospitality volunteers will be available/i,
    );

    // Verify DOM order matches upward book-scroll: Earlier -> Just said -> Active live caption
    expect(
      earlierLabel.compareDocumentPosition(justSaidBadge) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(
      justSaidBadge.compareDocumentPosition(activeCaptionText) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();

    // Verify High-Contrast and Text Size accessibility toggles
    const contrastBtn = within(projector).getByRole("button", { name: /High Contrast/i });
    expect(contrastBtn).toHaveAttribute("aria-pressed", "false");
    await user.click(contrastBtn);
    expect(contrastBtn).toHaveAttribute("aria-pressed", "true");
    expect(projector).toHaveClass("is-high-contrast");

    const textSizeBtn = within(projector).getByRole("button", { name: /Text: Standard/i });
    await user.click(textSizeBtn);
    expect(within(projector).getByRole("button", { name: /Text: Large/i })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
});

describe("ArchitectureExplorer", () => {
  it("navigates 5 layers via click and keyboard and surfaces black-box disclosure on private layers", async () => {
    const user = userEvent.setup();
    render(<ArchitectureExplorer />);

    const tablist = screen.getByRole("tablist", { name: /IkiLang 5-layer architecture/i });
    const tabs = within(tablist).getAllByRole("tab");
    expect(tabs).toHaveLength(5);

    // Layer 1 starts selected
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveTextContent(/Audio Ingest/i);

    // Keyboard ArrowRight moves to Layer 2 (Black-Boxed)
    tabs[0].focus();
    await user.keyboard("{ArrowRight}");
    expect(tabs[1]).toHaveAttribute("aria-selected", "true");
    const panelLayer2 = screen.getByRole("tabpanel");
    expect(panelLayer2).toHaveTextContent(/Pluggable Speech & Translation Interface/i);
    expect(panelLayer2).toHaveTextContent(/Black-Boxed Core Internals/i);
    expect(panelLayer2).toHaveTextContent(IKILANG_DATA.blackBoxNotice);

    // Clicking Layer 5 switches to Multi-Screen Audience Delivery
    await user.click(tabs[4]);
    expect(tabs[4]).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveTextContent(/Multi-Screen Audience Delivery/i);
  });
});

describe("SystemCardAndRoadmap", () => {
  it("filters maturity matrix cleanly and renders shortcomings, cryptographic honesty, field spec, roadmap, and changelog", async () => {
    const user = userEvent.setup();
    render(<SystemCardAndRoadmap />);

    const filterGroup = screen.getByRole("group", {
      name: /Filter system capabilities by maturity status/i,
    });

    // Filter to Deliberately Gated
    await user.click(within(filterGroup).getByRole("button", { name: /Deliberately Gated/i }));
    expect(
      screen.getByRole("heading", { name: /Live Audience Audio Streaming/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: /Mono 16 kHz PCM Audio Ingest/i }),
    ).not.toBeInTheDocument();

    // Filter to Proven Today
    await user.click(within(filterGroup).getByRole("button", { name: /Proven Today/i }));
    expect(
      screen.getByRole("heading", { name: /Mono 16 kHz PCM Audio Ingest/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: /Live Audience Audio Streaming/i }),
    ).not.toBeInTheDocument();

    // Filter to Active Validation
    await user.click(within(filterGroup).getByRole("button", { name: /Active Validation/i }));
    expect(
      screen.getByRole("heading", { name: /Live Sanctuary Captions-Only Trials/i }),
    ).toBeInTheDocument();

    // Candid Shortcomings & Cryptographic Honesty sections present
    expect(
      screen.getByRole("heading", {
        name: /Where It Currently Falls Short & When Humans Are Still Essential/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(IKILANG_DATA.cryptographicHonestyNotice)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Field-Readiness Signal Chain/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /4-Phase Blueprint Roadmap/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Living Engineering Changelog/i }),
    ).toBeInTheDocument();
  });
});
