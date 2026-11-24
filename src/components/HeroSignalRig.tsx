import { useEffect, useId, useState } from "react";
import { Pause, Play, QrCode, Radio } from "lucide-react";
import { SwapIcon } from "./SwapIcon";

interface SampleCaptionFrame {
  id: string;
  context: string;
  justSaid: string;
  liveCaption: string;
  delayLabel: string;
  bars: number[];
}

const SAMPLE_FRAMES: SampleCaptionFrame[] = [
  {
    id: "sanctuary",
    context: "Sanctuary soundboard",
    justSaid: "Welcome to everyone joining us in the hall today.",
    liveCaption: "Hospitality means no family sits disconnected from the room.",
    delayLabel: "+1.02 s",
    bars: [32, 68, 86, 54, 92, 74, 48, 80, 62, 42],
  },
  {
    id: "clinic",
    context: "Clinic reception",
    justSaid: "Read intake steps privately on your phone via QR code.",
    liveCaption: "A human interpreter joins inside the exam room for consent.",
    delayLabel: "+1.14 s",
    bars: [44, 78, 60, 88, 70, 52, 84, 66, 48, 36],
  },
  {
    id: "outreach",
    context: "Visiting NGO workshop",
    justSaid: "Local leaders speak at full speed in their mother tongue.",
    liveCaption: "Visiting clinicians and guests read live English captions.",
    delayLabel: "+1.08 s",
    bars: [38, 62, 90, 76, 58, 82, 94, 64, 50, 40],
  },
];

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function HeroSignalRig() {
  const [reducedMotion, setReducedMotion] = useState(() => prefersReducedMotion());
  const [isPlaying, setIsPlaying] = useState(() => !prefersReducedMotion());
  const [frameIndex, setFrameIndex] = useState(0);
  const rigHeadingId = useId();

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches);
      if (event.matches) {
        setIsPlaying(false);
      }
    };
    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    }
    return undefined;
  }, []);

  useEffect(() => {
    if (!isPlaying) return undefined;
    const interval = window.setInterval(() => {
      setFrameIndex((current) => (current + 1) % SAMPLE_FRAMES.length);
    }, 2800);
    return () => window.clearInterval(interval);
  }, [isPlaying]);

  const activeFrame = SAMPLE_FRAMES[frameIndex] ?? SAMPLE_FRAMES[0];

  return (
    <aside
      className={`signal-rig-shell${isPlaying && !reducedMotion ? " is-animating" : ""}`}
      aria-labelledby={rigHeadingId}
    >
      <div className="signal-rig-stage">
        {/* Top studio control header */}
        <div className="signal-rig-header">
          <div className="signal-rig-title-group">
            <span className="signal-rig-kicker" id={rigHeadingId}>
              <span className={`status-dot${isPlaying ? " is-pulsing" : ""}`} aria-hidden="true" />
              <span>Live signal path · preview</span>
            </span>
            <span className="signal-rig-context">{activeFrame.context}</span>
          </div>

          <button
            type="button"
            className="rig-play-btn has-leading-icon"
            aria-pressed={isPlaying}
            onClick={() => setIsPlaying((prev) => !prev)}
          >
            <SwapIcon
              active={isPlaying}
              nudgeInactivePlay
              activeIcon={<Pause size={15} strokeWidth={2} aria-hidden="true" />}
              inactiveIcon={<Play size={15} strokeWidth={2} aria-hidden="true" />}
            />
            <span>{isPlaying ? "Pause demo" : "Play demo"}</span>
          </button>
        </div>

        {/* Multi-part isometric-inspired SVG pipeline schematic */}
        <div className="signal-rig-svg-wrap" aria-hidden="true">
          <svg
            className="hero-rig-svg"
            viewBox="0 0 480 154"
            role="presentation"
            focusable="false"
          >
            {/* Depth drop shadow plates */}
            <rect x="14" y="24" width="128" height="106" rx="14" className="rig-node-shadow" />
            <rect x="176" y="24" width="128" height="106" rx="14" className="rig-node-shadow" />
            <rect x="338" y="24" width="128" height="106" rx="14" className="rig-node-shadow" />

            {/* Connector cables behind nodes */}
            <path d="M 140 74 C 156 74, 160 74, 174 74" className="rig-cable-base" />
            <path d="M 302 74 C 318 74, 322 74, 336 74" className="rig-cable-base" />
            <path
              d="M 140 74 C 156 74, 160 74, 174 74"
              className="rig-cable-flow"
            />
            <path
              d="M 302 74 C 318 74, 322 74, 336 74"
              className="rig-cable-flow is-delayed"
            />

            {/* Node 1: Soundboard / 16 kHz Capture */}
            <g className="rig-node">
              <rect x="12" y="20" width="128" height="106" rx="14" className="rig-node-body" />
              <path
                d="M 12 34 Q 12 20 26 20 L 126 20 Q 140 20 140 34 L 140 46 L 12 46 Z"
                className="rig-node-top"
              />
              <circle cx="25" cy="33" r="4" className="rig-led-live" />
              <text x="35" y="37" className="rig-node-step">
                01 AUDIO IN
              </text>
              <text x="24" y="65" className="rig-node-title">
                Soundboard
              </text>
              <text x="24" y="81" className="rig-node-sub">
                16 kHz mono PCM
              </text>

              {/* Animated level bars inside Node 1 */}
              {activeFrame.bars.slice(0, 8).map((val, idx) => {
                const barHeight = Math.max(8, Math.round((val / 100) * 26));
                const barX = 24 + idx * 12;
                const barY = 114 - barHeight;
                return (
                  <rect
                    key={idx}
                    x={barX}
                    y={barY}
                    width="7"
                    height={barHeight}
                    rx="3"
                    className="rig-audio-bar"
                  />
                );
              })}
              <circle cx="140" cy="74" r="4.5" className="rig-port" />
            </g>

            {/* Node 2: Streaming Engine */}
            <g className="rig-node is-accent">
              <rect x="174" y="20" width="128" height="106" rx="14" className="rig-node-body-accent" />
              <path
                d="M 174 34 Q 174 20 188 20 L 288 20 Q 302 20 302 34 L 302 46 L 174 46 Z"
                className="rig-node-top-accent"
              />
              <circle cx="187" cy="33" r="4" className="rig-led-amber" />
              <text x="197" y="37" className="rig-node-step-accent">
                02 ENGINE
              </text>
              <text x="186" y="65" className="rig-node-title">
                Streaming MT
              </text>
              <text x="186" y="81" className="rig-node-sub">
                RW → EN · WebSocket
              </text>
              <rect x="186" y="92" width="104" height="22" rx="7" className="rig-chip-bg" />
              <text x="238" y="107" textAnchor="middle" className="rig-chip-text">
                Target &lt; 1.5 s
              </text>
              <circle cx="174" cy="74" r="4.5" className="rig-port" />
              <circle cx="302" cy="74" r="4.5" className="rig-port" />
            </g>

            {/* Node 3: Audience QR Phone / Projector */}
            <g className="rig-node">
              <rect x="336" y="20" width="128" height="106" rx="14" className="rig-node-body" />
              <path
                d="M 336 34 Q 336 20 350 20 L 450 20 Q 464 20 464 34 L 464 46 L 336 46 Z"
                className="rig-node-top"
              />
              <circle cx="349" cy="33" r="4" className="rig-led-live" />
              <text x="359" y="37" className="rig-node-step">
                03 SCREENS
              </text>
              <text x="348" y="65" className="rig-node-title">
                Phone + Screen
              </text>
              <text x="348" y="81" className="rig-node-sub">
                QR browser · 0 PII
              </text>
              {/* Stylized caption bars */}
              <rect x="348" y="92" width="74" height="6" rx="3" className="rig-line-muted" />
              <rect x="348" y="103" width="98" height="8" rx="4" className="rig-line-accent" />
              <circle cx="336" cy="74" r="4.5" className="rig-port" />
            </g>
          </svg>
        </div>

        {/* Live miniature phone caption viewport */}
        <div className="rig-caption-viewport" aria-live="polite">
          <div className="rig-caption-meta">
            <span className="rig-caption-tag">
              <QrCode size={13} strokeWidth={2} aria-hidden="true" />
              <span>QR phone output</span>
            </span>
            <span className="rig-latency-pill">
              <Radio size={12} strokeWidth={2} aria-hidden="true" />
              <span>{activeFrame.delayLabel}</span>
            </span>
          </div>

          <div key={activeFrame.id} className="rig-caption-lines">
            <p className="rig-just-said">
              <span className="rig-line-prefix">Just said:</span> {activeFrame.justSaid}
            </p>
            <p className="rig-live-line">{activeFrame.liveCaption}</p>
          </div>
        </div>

        {/* Step dots + honest static simulation note */}
        <div className="rig-footer-row">
          <div className="rig-step-dots" role="group" aria-label="Select room example">
            {SAMPLE_FRAMES.map((frame, index) => (
              <button
                key={frame.id}
                type="button"
                className={`rig-dot-btn${index === frameIndex ? " is-active" : ""}`}
                aria-label={`Show ${frame.context} example`}
                aria-pressed={index === frameIndex}
                onClick={() => {
                  setIsPlaying(false);
                  setFrameIndex(index);
                }}
              >
                <span>{frame.context}</span>
              </button>
            ))}
          </div>
          <p className="rig-honesty-note">Illustrative UI preview · not live inference</p>
        </div>
      </div>
    </aside>
  );
}
