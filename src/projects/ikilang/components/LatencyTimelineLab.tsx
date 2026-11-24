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
import { IKILANG_DATA } from "../data";
import type { ContinuousStatus, TurnBasedStatus } from "../types";

const STEP_INTERVAL_MS = 2200;

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
        <AlertOctagon size={14} aria-hidden="true" />
        <span>Late wall-of-text dump</span>
      </span>
    );
  }
  if (status === "stalled") {
    return (
      <span className="badge badge-validating">
        <AlertTriangle size={14} aria-hidden="true" />
        <span>Stalled · waiting for silence</span>
      </span>
    );
  }
  return (
    <span className="badge badge-gated">
      <Clock size={14} aria-hidden="true" />
      <span>Waiting for turn end</span>
    </span>
  );
}

function renderContinuousBadge(status: ContinuousStatus) {
  if (status === "streaming") {
    return (
      <span className="badge badge-proven">
        <Radio size={14} aria-hidden="true" />
        <span>Streaming (&lt; 1.5 s)</span>
      </span>
    );
  }
  return (
    <span className="badge badge-proven">
      <CheckCircle2 size={14} aria-hidden="true" />
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
            <Activity size={14} aria-hidden="true" />
            Lab 01 · Streaming vs. turn-based cadence
          </span>
          <h3 id={headingId} className="lab-title">
            Why rapid speech stalls turn-based translation
          </h3>
          <p className="lab-subtitle">
            Scrub 65 s of uninterrupted speech with 200–500 ms pauses to compare turn-based stalls
            against sub-1.5 s continuous captions.
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
        <Info size={16} aria-hidden="true" />
        <span>{IKILANG_DATA.timelineProvenanceNotice}</span>
      </div>

      <div className="timeline-controls">
        <div className="timeline-button-group">
          <button
            type="button"
            className="button button-primary"
            onClick={handlePlayToggle}
            aria-pressed={isPlaying}
          >
            {isPlaying ? (
              <>
                <Pause size={16} aria-hidden="true" />
                <span>Pause timeline</span>
              </>
            ) : (
              <>
                <Play size={16} aria-hidden="true" />
                <span>{frameIndex >= maxIndex ? "Replay timeline" : "Play timeline"}</span>
              </>
            )}
          </button>

          <button
            type="button"
            className="button button-secondary"
            onClick={() => handleScrub(frameIndex - 1)}
            disabled={frameIndex === 0}
            aria-label="Previous speech checkpoint"
          >
            <ChevronLeft size={16} aria-hidden="true" />
            <span>Previous</span>
          </button>

          <button
            type="button"
            className="button button-secondary"
            onClick={() => handleScrub(frameIndex + 1)}
            disabled={frameIndex === maxIndex}
            aria-label="Next speech checkpoint"
          >
            <span>Next</span>
            <ChevronRight size={16} aria-hidden="true" />
          </button>

          <button
            type="button"
            className="button button-ghost"
            onClick={handleReset}
            aria-label="Reset timeline to 0 seconds"
          >
            <RotateCcw size={16} aria-hidden="true" />
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
          <span className="eyebrow">Speaker reference (simulated cadence)</span>
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
