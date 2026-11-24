import { useEffect, useId, useState } from "react";
import {
  Activity,
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Info,
  Pause,
  Play,
  Radio,
  RotateCcw,
} from "lucide-react";
import { SwapIcon } from "../../../components/SwapIcon";
import { IKILANG_DATA } from "../data";
import type { ContinuousStatus, TurnBasedStatus } from "../types";

const STEP_INTERVAL_MS = 2200;

const CHECKPOINT_WAVE_HEIGHTS = [
  [36, 62, 82, 48, 70],
  [54, 88, 66, 90, 44],
  [68, 46, 92, 74, 58],
  [48, 78, 86, 56, 82],
  [74, 54, 90, 68, 46],
  [62, 84, 72, 92, 52],
  [12, 10, 8, 10, 14], // 1.8 s silent page-turn gap
  [58, 86, 70, 60, 48],
];

function formatElapsed(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function renderTurnBasedBadge(status: TurnBasedStatus) {
  if (status === "dumped") {
    return (
      <span className="badge badge-danger">
        <AlertOctagon size={14} strokeWidth={2} aria-hidden="true" />
        <span>Late wall-of-text dump</span>
      </span>
    );
  }
  if (status === "stalled") {
    return (
      <span className="badge badge-validating">
        <AlertTriangle size={14} strokeWidth={2} aria-hidden="true" />
        <span>Stalled · waiting for silence</span>
      </span>
    );
  }
  return (
    <span className="badge badge-gated">
      <Clock size={14} strokeWidth={2} aria-hidden="true" />
      <span>Waiting for turn end</span>
    </span>
  );
}

function renderContinuousBadge(status: ContinuousStatus) {
  if (status === "streaming") {
    return (
      <span className="badge badge-proven">
        <Radio size={14} strokeWidth={2} aria-hidden="true" />
        <span>Streaming (&lt; 1.5 s)</span>
      </span>
    );
  }
  return (
    <span className="badge badge-proven">
      <CheckCircle2 size={14} strokeWidth={2} aria-hidden="true" />
      <span>Delivered (&lt; 1.5 s target)</span>
    </span>
  );
}

export function LatencyTimelineLab() {
  const frames = IKILANG_DATA.timelineFrames;
  const maxIndex = Math.max(0, frames.length - 1);
  const [frameIndex, setFrameIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(() => prefersReducedMotion());
  const sliderId = useId();
  const headingId = useId();

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (event: MediaQueryListEvent) => setReducedMotion(event.matches);
    setReducedMotion(mq.matches);
    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    }
    return undefined;
  }, []);

  useEffect(() => {
    if (!isPlaying) return undefined;

    const timer = window.setInterval(() => {
      setFrameIndex((current) => {
        if (current >= maxIndex) {
          setIsPlaying(false);
          return current;
        }
        return current + 1;
      });
    }, STEP_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [isPlaying, maxIndex]);

  const currentFrame = frames[frameIndex] ?? frames[0];
  const totalSec = frames[maxIndex]?.timeSec ?? 65;

  // Calculate visual race bar widths
  const turnWaitSec =
    currentFrame.turnBasedStatus === "dumped"
      ? 61
      : currentFrame.turnBasedStatus === "waiting"
        ? frameIndex === 0
          ? 2
          : 4
        : currentFrame.timeSec;
  const turnBarPct = Math.min(100, Math.max(4, Math.round((turnWaitSec / totalSec) * 100)));
  const streamLatencySec = currentFrame.timeSec === 65 ? 1.28 : currentFrame.timeSec === 0 ? 1.02 : 1.14;
  const streamBarPct = Math.max(3.5, Math.round((streamLatencySec / totalSec) * 100));

  const handlePlayToggle = () => {
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }
    if (frameIndex >= maxIndex) {
      setFrameIndex(0);
    }
    setIsPlaying(true);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setFrameIndex(0);
  };

  const handleScrub = (nextIndex: number) => {
    setIsPlaying(false);
    setFrameIndex(Math.min(maxIndex, Math.max(0, nextIndex)));
  };

  return (
    <section className="card lab-card" aria-labelledby={headingId}>
      <div className="lab-header">
        <div>
          <span className="eyebrow">
            <Activity size={14} strokeWidth={2} aria-hidden="true" />
            Demo 01 · Latency race
          </span>
          <h3 id={headingId} className="lab-title">
            Why fast speakers stall turn-based translation
          </h3>
          <p className="lab-subtitle">
            Scrub 65 s of rapid speech with 220–390 ms breaths to watch turn detection stall for a
            minute while continuous streaming delivers every clause under 1.5 s.
          </p>
        </div>

        <div className="elapsed-readout" aria-live="polite">
          <span className="elapsed-label">Elapsed speech</span>
          <span className="elapsed-time">{formatElapsed(currentFrame.timeSec)}</span>
          <span className="elapsed-step">
            Step {frameIndex + 1}/{frames.length} · {currentFrame.timeSec}s / {totalSec}s
          </span>
        </div>
      </div>

      <div className="provenance-banner" role="note">
        <Info size={16} strokeWidth={2} aria-hidden="true" />
        <span>{IKILANG_DATA.timelineProvenanceNotice}</span>
      </div>

      {/* Graphical Latency Bar Comparison & Waveform Strip */}
      <div className="timeline-visual-rig">
        <div className="wait-bars-panel" aria-label="Visual comparison of caption wait times">
          <div className="wait-bars-scale" aria-hidden="true">
            <span>0 s</span>
            <span>15 s</span>
            <span>30 s</span>
            <span>45 s</span>
            <span>65 s</span>
          </div>

          <div className="wait-bar-row">
            <div className="wait-bar-meta">
              <span className="wait-bar-label">Turn-based endpoint wait</span>
              <span className={`wait-bar-num status-${currentFrame.turnBasedStatus}`}>
                {currentFrame.turnBasedStatus === "dumped"
                  ? "61.0 s (wall dumped)"
                  : `${turnWaitSec.toFixed(1)} s waiting`}
              </span>
            </div>
            <div className="wait-bar-track">
              <span className="wait-target-marker" title="1.5 s live target" />
              <div
                className={`wait-bar-fill is-turnbased status-${currentFrame.turnBasedStatus}`}
                style={{ width: `${turnBarPct}%` }}
              />
            </div>
          </div>

          <div className="wait-bar-row">
            <div className="wait-bar-meta">
              <span className="wait-bar-label">Continuous stream latency</span>
              <span className="wait-bar-num is-proven">
                {streamLatencySec.toFixed(2)} s (&lt; 1.5 s target)
              </span>
            </div>
            <div className="wait-bar-track">
              <span className="wait-target-marker" title="1.5 s live target" />
              <div
                className="wait-bar-fill is-continuous"
                style={{ width: `${streamBarPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Visual Waveform Ribbon across 8 Checkpoints */}
        <div className="waveform-ribbon" aria-hidden="true">
          {frames.map((frame, index) => {
            const bars = CHECKPOINT_WAVE_HEIGHTS[index] ?? [40, 60, 80, 50, 40];
            const isPast = index < frameIndex;
            const isCurrent = index === frameIndex;
            const isLongPause = frame.breathPauseMs >= 1000;
            return (
              <div
                key={frame.timeSec}
                className={`wave-segment${isCurrent ? " is-current" : ""}${
                  isPast ? " is-past" : ""
                }${isLongPause ? " is-silent-gap" : ""}`}
                onClick={() => handleScrub(index)}
              >
                <div className="wave-bars-cluster">
                  {bars.map((heightPct, barIdx) => (
                    <span
                      key={barIdx}
                      className="wave-mini-bar"
                      style={{ height: `${heightPct}%` }}
                    />
                  ))}
                </div>
                <span className="wave-seg-time">{frame.timeSec}s</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="timeline-controls">
        <div className="timeline-button-group">
          <button
            type="button"
            className="button button-primary has-leading-icon"
            onClick={handlePlayToggle}
            aria-pressed={isPlaying}
          >
            <SwapIcon
              active={isPlaying}
              nudgeInactivePlay
              activeIcon={<Pause size={16} strokeWidth={2} aria-hidden="true" />}
              inactiveIcon={<Play size={16} strokeWidth={2} aria-hidden="true" />}
            />
            <span>
              {isPlaying
                ? "Pause timeline"
                : frameIndex >= maxIndex
                  ? "Replay timeline"
                  : "Play timeline"}
            </span>
          </button>

          <button
            type="button"
            className="button button-secondary has-leading-icon"
            onClick={() => handleScrub(frameIndex - 1)}
            disabled={frameIndex === 0}
            aria-label="Previous speech checkpoint"
          >
            <ChevronLeft size={16} strokeWidth={2} aria-hidden="true" />
            <span>Previous</span>
          </button>

          <button
            type="button"
            className="button button-secondary has-trailing-icon"
            onClick={() => handleScrub(frameIndex + 1)}
            disabled={frameIndex === maxIndex}
            aria-label="Next speech checkpoint"
          >
            <span>Next</span>
            <ChevronRight size={16} strokeWidth={2} aria-hidden="true" />
          </button>

          <button
            type="button"
            className="button button-ghost has-leading-icon"
            onClick={handleReset}
            aria-label="Reset timeline to 0 seconds"
          >
            <RotateCcw size={16} strokeWidth={2} aria-hidden="true" />
            <span>Reset</span>
          </button>
        </div>

        {reducedMotion ? (
          <p className="reduced-motion-hint">
            Reduced motion active: starts paused without animation.
          </p>
        ) : null}

        <div className="scrubber-box">
          <div className="scrubber-label-row">
            <label htmlFor={sliderId} className="scrubber-label">
              Timeline scrubber (0s to {totalSec}s)
            </label>
            <span className="breath-badge">
              Pause at {currentFrame.timeSec}s:{" "}
              <strong>
                {currentFrame.breathPauseMs >= 1000
                  ? `${(currentFrame.breathPauseMs / 1000).toFixed(1)} s silence`
                  : `${currentFrame.breathPauseMs} ms breath`}
              </strong>
            </span>
          </div>

          <input
            id={sliderId}
            type="range"
            className="timeline-range"
            min={0}
            max={maxIndex}
            step={1}
            value={frameIndex}
            onChange={(event) => handleScrub(Number(event.target.value))}
            aria-valuetext={`${currentFrame.timeSec} seconds elapsed, ${currentFrame.breathPauseMs} millisecond pause`}
          />

          <div className="timeline-markers" role="group" aria-label="Speech pause checkpoints">
            {frames.map((frame, index) => {
              const isActive = index === frameIndex;
              const isLongPause = frame.breathPauseMs >= 1000;
              return (
                <button
                  key={frame.timeSec}
                  type="button"
                  className={`marker-pill${isActive ? " is-active" : ""}${
                    isLongPause ? " is-long-pause" : ""
                  }`}
                  onClick={() => handleScrub(index)}
                  aria-pressed={isActive}
                >
                  <span className="marker-time">{frame.timeSec}s</span>
                  <span className="marker-pause">
                    {isLongPause
                      ? `${(frame.breathPauseMs / 1000).toFixed(1)}s`
                      : `${frame.breathPauseMs}ms`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="speaker-stream-card">
        <div className="speaker-stream-meta">
          <span className="eyebrow">Speaker reference</span>
          <span className="speaker-timestamp">t = {currentFrame.timeSec}s</span>
        </div>
        <p className="speaker-stream-text">&ldquo;{currentFrame.speakerLine}&rdquo;</p>
      </div>

      <div className="grid-2 timeline-tracks">
        <article
          className={`track-card track-turn-based status-${currentFrame.turnBasedStatus}`}
          aria-label="Track A: Turn-based endpoint"
        >
          <div className="track-header">
            <div>
              <span className="track-kicker">Track A · Turn-based endpoint</span>
              <h4 className="track-title">Waits for extended silence (~60 s stall)</h4>
            </div>
            {renderTurnBasedBadge(currentFrame.turnBasedStatus)}
          </div>

          <div className="track-screen">
            <p
              className={`track-caption${
                currentFrame.turnBasedStatus === "dumped" ? " is-wall-of-text" : ""
              }`}
            >
              {currentFrame.turnBasedCaption}
            </p>
          </div>
        </article>

        <article
          className={`track-card track-continuous status-${currentFrame.continuousStatus}`}
          aria-label="Track B: Continuous streaming"
        >
          <div className="track-header">
            <div>
              <span className="track-kicker">Track B · Continuous streaming</span>
              <h4 className="track-title">Clause-by-clause delivery (&lt; 1.5 s cadence)</h4>
            </div>
            {renderContinuousBadge(currentFrame.continuousStatus)}
          </div>

          <div className="track-screen">
            <p className="track-caption">{currentFrame.continuousCaption}</p>
          </div>
        </article>
      </div>

      <p className="timeline-takeaway" aria-live="polite">
        <strong>At {currentFrame.timeSec}s:</strong> {currentFrame.latencyNote}
      </p>
    </section>
  );
}
