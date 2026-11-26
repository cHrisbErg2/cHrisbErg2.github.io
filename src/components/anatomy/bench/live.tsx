"use client";

import * as React from "react";
import { IsoFigure, Solid } from "../../iso/draw";
import type { SolidPaths } from "../../iso/iso-kit";
import { asksForStillness, follow, useInView, useReadout } from "../../iso/live";
import {
  BENCH_CLAUSES,
  BENCH_STAGES,
  CARRIAGE_REST_OFFSET,
  DIAL_REST_SEC,
  EXPLODE_VECTORS,
  SPRING,
  STAGGER_CLOSE,
  STAGGER_OPEN,
  STAGE_IDS,
  formatBenchReadout,
  type StageId,
} from "./model";
import { dynamicPoseOf } from "./pose";
import { HEIGHT, WIDTH, translateVec } from "./view";

const TOUR_FIRST_MS = 1400;
const TOUR_RESUME_MS = 3600;
const CLAUSE_HOLD_SEC = 2.4;
const MOST_DT = 1 / 30;

const BENCH_LABEL =
  "The Live Translation Bench: a stationary base plate holding five modular assemblies. From left to right: Stage 1 soundboard box with moving fader and 16 kilohertz meter; Stage 2 sprung clause carriage on twin rods feeding a tamper-bolted streaming vault; Stage 3 tamper-bolted guardrail cassette and radial dial gauge reading +1.02 seconds under a 1.5 second mark; Stage 4 mechanical clause tally counter and zero-PII ground post; and Stage 5 bench QR tile, sanctuary projector panel, and cradled phone with audio muted.";

interface SpringEntry {
  x: number;
  v: number;
  target: number;
  pending: { value: number; at: number } | null;
}

interface BenchLiveProps {
  base: React.ReactNode;
  stage01Static: React.ReactNode;
  stage01FaderCap: React.ReactNode;
  stage01VuBars: SolidPaths[];
  stage02Vault: React.ReactNode;
  stage02BedBack: React.ReactNode;
  stage02Rods: React.ReactNode;
  stage02Carriage: React.ReactNode;
  stage02StopFront: React.ReactNode;
  stage03Static: React.ReactNode;
  stage04Static: React.ReactNode;
  stage05Static: React.ReactNode;
  selectedStage?: number | null;
  onSelectStage?: (stageIndex: number) => void;
  showExplodeControl?: boolean;
}

export function BenchLive({
  base,
  stage01Static,
  stage01FaderCap,
  stage01VuBars,
  stage02Vault,
  stage02BedBack,
  stage02Rods,
  stage02Carriage,
  stage02StopFront,
  stage03Static,
  stage04Static,
  stage05Static,
  selectedStage,
  onSelectStage,
  showExplodeControl = true,
}: BenchLiveProps) {
  const { anchor, say } = useReadout<HTMLDivElement>();
  const stageRoot = React.useRef<HTMLDivElement | null>(null);
  const inView = useInView(stageRoot);

  const stageRefs = React.useRef<Record<StageId, SVGGElement | null>>({
    "stage-01": null,
    "stage-02": null,
    "stage-03": null,
    "stage-04": null,
    "stage-05": null,
  });
  const faderRef = React.useRef<SVGGElement | null>(null);
  const carriageRef = React.useRef<SVGGElement | null>(null);
  const coilsBackRef = React.useRef<SVGPathElement | null>(null);
  const coilsLeftFrontRef = React.useRef<SVGPathElement | null>(null);
  const coilsRightFrontRef = React.useRef<SVGPathElement | null>(null);
  const needleRef = React.useRef<SVGPathElement | null>(null);
  const vuRefs = React.useRef<Array<SVGGElement | null>>([]);
  const liveRegionRef = React.useRef<HTMLSpanElement | null>(null);

  const [hoveredStage, setHoveredStage] = React.useState<number | null>(null);
  const [localSelected, setLocalSelected] = React.useState<number | null>(null);
  const [apart, setApart] = React.useState(false);

  const controlled = selectedStage !== undefined;
  const committedStage = controlled ? selectedStage : localSelected;
  const activeStage = hoveredStage !== null ? hoveredStage : committedStage;

  const restPose = React.useMemo(
    () => dynamicPoseOf(CARRIAGE_REST_OFFSET, BENCH_CLAUSES[0]!.faderNorm, DIAL_REST_SEC),
    [],
  );

  // Mutable animation state for 60fps DOM ref updates (zero React re-renders per frame)
  const anim = React.useRef({
    clock: 0,
    tourClock: 0,
    lastTs: 0,
    frameId: 0,
    touring: false,
    engaged: false,
    apart: false,
    activeStage: null as number | null,
    clauseIndex: 0,
    carriageOffset: CARRIAGE_REST_OFFSET,
    faderNorm: BENCH_CLAUSES[0]!.faderNorm,
    latencySec: DIAL_REST_SEC,
    springs: Object.fromEntries(
      STAGE_IDS.map((id) => [id, { x: 0, v: 0, target: 0, pending: null }]),
    ) as Record<StageId, SpringEntry>,
  });

  const announce = React.useCallback((message: string) => {
    if (liveRegionRef.current && liveRegionRef.current.textContent !== message) {
      liveRegionRef.current.textContent = message;
    }
  }, []);

  const drawFrame = React.useCallback(() => {
    const s = anim.current;
    const pose = dynamicPoseOf(s.carriageOffset, s.faderNorm, s.latencySec);

    faderRef.current?.setAttribute("transform", pose.faderTransform);
    carriageRef.current?.setAttribute("transform", pose.carriageTransform);
    coilsBackRef.current?.setAttribute("d", pose.coilsBackD);
    coilsLeftFrontRef.current?.setAttribute("d", pose.coilsLeftFrontD);
    coilsRightFrontRef.current?.setAttribute("d", pose.coilsRightFrontD);
    needleRef.current?.setAttribute("d", pose.needleD);

    const activeClause = BENCH_CLAUSES[s.clauseIndex] ?? BENCH_CLAUSES[0]!;
    vuRefs.current.forEach((node, idx) => {
      const solidEl = node?.querySelector(".iso-solid") ?? node;
      if (!solidEl) return;
      if (idx < activeClause.vuBars) solidEl.setAttribute("data-lit", "");
      else solidEl.removeAttribute("data-lit");
    });

    let moving = false;
    for (const id of STAGE_IDS) {
      const entry = s.springs[id];
      const el = stageRefs.current[id];
      if (!el) continue;
      if (Math.abs(entry.x - entry.target) > 0.002 || entry.pending !== null) {
        moving = true;
      }
      if (entry.x === 0) {
        if (el.hasAttribute("transform")) el.removeAttribute("transform");
      } else {
        el.setAttribute("transform", translateVec(EXPLODE_VECTORS[id], entry.x));
      }
    }

    say(
      formatBenchReadout({
        stageIndex: s.activeStage,
        apart: s.apart,
        moving,
        clauseIndex: s.clauseIndex,
        latencySec: s.latencySec,
      }),
    );
  }, [say]);

  const stopLoop = React.useCallback(() => {
    if (anim.current.frameId && typeof cancelAnimationFrame === "function") {
      cancelAnimationFrame(anim.current.frameId);
    }
    anim.current.frameId = 0;
  }, []);

  const kickLoop = React.useCallback(() => {
    const s = anim.current;
    if (s.frameId || typeof requestAnimationFrame !== "function") return;
    s.lastTs = 0;

    const tick = (now: number) => {
      const dt = s.lastTs ? Math.min((now - s.lastTs) / 1000, MOST_DT) : 1 / 60;
      s.lastTs = now;
      s.clock += dt;

      const calm = asksForStillness();

      if (s.touring && !calm && !s.engaged) {
        s.tourClock += dt;
        s.clauseIndex = Math.floor(s.tourClock / CLAUSE_HOLD_SEC) % BENCH_CLAUSES.length;
      }

      const clause = BENCH_CLAUSES[s.clauseIndex] ?? BENCH_CLAUSES[0]!;
      s.carriageOffset = follow(s.carriageOffset, clause.carriageOffset, dt, 0.24, calm);
      s.faderNorm = follow(s.faderNorm, clause.faderNorm, dt, 0.18, calm);
      s.latencySec = follow(s.latencySec, clause.latencySec, dt, 0.22, calm);

      let springsMoving = false;
      for (const id of STAGE_IDS) {
        const sp = s.springs[id];
        if (sp.pending && s.clock >= sp.pending.at) {
          sp.target = sp.pending.value;
          sp.pending = null;
        }
        if (calm) {
          sp.x = sp.target;
          sp.v = 0;
          continue;
        }
        for (let step = 0; step < SPRING.substeps; step++) {
          const h = dt / SPRING.substeps;
          sp.v += ((sp.target - sp.x) * SPRING.stiffness - sp.v * SPRING.damping) * h;
          sp.x += sp.v * h;
        }
        if (Math.abs(sp.target - sp.x) < 2e-4 && Math.abs(sp.v) < 2e-4) {
          sp.x = sp.target;
          sp.v = 0;
          if (sp.pending !== null) springsMoving = true;
        } else {
          springsMoving = true;
        }
      }

      drawFrame();

      const dynamicsMoving =
        s.carriageOffset !== clause.carriageOffset ||
        s.faderNorm !== clause.faderNorm ||
        s.latencySec !== clause.latencySec;

      if (inView && (springsMoving || dynamicsMoving || (s.touring && !calm && !s.engaged))) {
        s.frameId = requestAnimationFrame(tick);
      } else {
        s.frameId = 0;
      }
    };

    s.frameId = requestAnimationFrame(tick);
  }, [drawFrame, inView]);

  const scheduleApart = React.useCallback(
    (nextApart: boolean) => {
      const s = anim.current;
      s.apart = nextApart;
      const goal = nextApart ? 1 : 0;
      const order = nextApart ? STAGGER_OPEN : STAGGER_CLOSE;
      const calm = asksForStillness();
      let staggerIdx = 0;

      for (const id of order) {
        const sp = s.springs[id];
        if (sp.target === goal) {
          sp.pending = null;
        } else {
          sp.pending = {
            value: goal,
            at: s.clock + (calm ? 0 : staggerIdx++ * SPRING.stagger),
          };
        }
      }

      if (calm) {
        for (const id of STAGE_IDS) {
          const sp = s.springs[id];
          if (sp.pending) {
            sp.target = sp.pending.value;
            sp.pending = null;
          }
          sp.x = sp.target;
          sp.v = 0;
        }
        drawFrame();
      } else {
        kickLoop();
      }
    },
    [drawFrame, kickLoop],
  );

  // Sync activeStage to anim ref and update readout immediately
  React.useEffect(() => {
    anim.current.activeStage = activeStage;
    drawFrame();
  }, [activeStage, drawFrame]);

  // Sync apart state to spring scheduler
  React.useEffect(() => {
    scheduleApart(apart);
  }, [apart, scheduleApart]);

  // Manage idle tour lifecycle and intersection pausing
  React.useEffect(() => {
    if (!inView) {
      anim.current.touring = false;
      stopLoop();
      return;
    }

    if (asksForStillness()) {
      anim.current.touring = false;
      drawFrame();
      return;
    }

    const delay = anim.current.engaged ? TOUR_RESUME_MS : TOUR_FIRST_MS;
    const timer = window.setTimeout(() => {
      if (!anim.current.engaged && !asksForStillness()) {
        anim.current.touring = true;
        kickLoop();
      }
    }, delay);

    return () => {
      window.clearTimeout(timer);
      stopLoop();
    };
  }, [inView, hoveredStage, committedStage, apart, kickLoop, stopLoop, drawFrame]);

  const pauseTourTemporarily = React.useCallback(() => {
    anim.current.engaged = true;
    anim.current.touring = false;
  }, []);

  const resumeTourLater = React.useCallback(() => {
    anim.current.engaged = false;
    if (inView && !asksForStillness()) {
      kickLoop();
    }
  }, [inView, kickLoop]);

  const selectStage = React.useCallback(
    (index: number) => {
      pauseTourTemporarily();
      if (!controlled) {
        setLocalSelected(index);
      }
      onSelectStage?.(index);
      const spec = BENCH_STAGES[index];
      if (spec) {
        announce(spec.ariaSummary);
      }
      // Advance sample clause visually on stage tap for crisp mechanical feedback
      anim.current.clauseIndex = index % BENCH_CLAUSES.length;
      kickLoop();
    },
    [announce, controlled, kickLoop, onSelectStage, pauseTourTemporarily],
  );

  const toggleApart = React.useCallback(() => {
    pauseTourTemporarily();
    setApart((prev) => {
      const next = !prev;
      announce(
        next
          ? "Exploded bench into 5 module boundaries; translation and guardrail vaults remain sealed."
          : "Assembled bench modules back to rest.",
      );
      return next;
    });
  }, [announce, pauseTourTemporarily]);

  const stageFromEvent = (target: EventTarget | null): number | null => {
    if (!(target instanceof Element)) return null;
    const hit = target.closest("[data-stage]");
    if (!hit) return null;
    const raw = hit.getAttribute("data-stage");
    if (raw === null) return null;
    const parsed = Number(raw);
    return Number.isInteger(parsed) && parsed >= 0 && parsed < BENCH_STAGES.length ? parsed : null;
  };

  const bindStage = (id: StageId) => (node: SVGGElement | null) => {
    stageRefs.current[id] = node;
  };

  const isFocused = activeStage !== null;

  return (
    <div className="bench-interactive-shell">
      <div
        ref={(node) => {
          stageRoot.current = node;
          anchor.current = node;
        }}
        className="bench-stage"
        role="group"
        tabIndex={0}
        aria-label="Interactive isometric translation bench. Hover or click modules 1 to 5 to inspect contracts, use arrow keys to step stages, and press Space to explode or assemble seams."
        data-focus={isFocused ? "" : undefined}
        onPointerMove={(event) => {
          if (event.pointerType === "touch") return;
          pauseTourTemporarily();
          const idx = stageFromEvent(event.target);
          setHoveredStage(idx);
        }}
        onPointerLeave={(event) => {
          if (event.pointerType === "touch") return;
          setHoveredStage(null);
          resumeTourLater();
        }}
        onClick={(event) => {
          const idx = stageFromEvent(event.target);
          if (idx !== null) {
            selectStage(idx);
          } else if (!controlled) {
            setLocalSelected(null);
          }
        }}
        onFocus={() => {
          pauseTourTemporarily();
        }}
        onBlur={() => {
          setHoveredStage(null);
          resumeTourLater();
        }}
        onKeyDown={(event) => {
          if (event.key === " " || event.key === "Enter") {
            event.preventDefault();
            if (event.repeat) return;
            toggleApart();
            return;
          }
          if (event.key === "Escape") {
            event.preventDefault();
            setHoveredStage(null);
            if (!controlled) setLocalSelected(null);
            if (apart) {
              setApart(false);
              announce("Assembled bench modules back to rest.");
            }
            return;
          }
          const current = activeStage ?? 0;
          let next: number | null = null;
          if (event.key === "ArrowRight" || event.key === "ArrowDown") {
            next = (current + 1) % BENCH_STAGES.length;
          } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
            next = (current - 1 + BENCH_STAGES.length) % BENCH_STAGES.length;
          } else if (event.key === "Home") {
            next = 0;
          } else if (event.key === "End") {
            next = BENCH_STAGES.length - 1;
          }
          if (next === null) return;
          event.preventDefault();
          selectStage(next);
        }}
      >
        <IsoFigure width={WIDTH} height={HEIGHT} label={BENCH_LABEL}>
          {base}

          {/* Stage 01: Audio Ingest — Soundboard Box */}
          <g
            ref={bindStage("stage-01")}
            className="bench-piece"
            data-piece="stage-01"
            data-stage="0"
            data-on={activeStage === 0 ? "" : undefined}
          >
            {stage01Static}
            <g ref={faderRef} transform={restPose.faderTransform}>
              {stage01FaderCap}
            </g>
            <g className="bench-vu-bank">
              {stage01VuBars.map((paths, idx) => (
                <g
                  key={idx}
                  ref={(node) => {
                    vuRefs.current[idx] = node;
                  }}
                >
                  <Solid
                    paths={paths}
                    tone="mid"
                    crease="none"
                    lit={idx < BENCH_CLAUSES[0]!.vuBars}
                  />
                </g>
              ))}
            </g>
          </g>

          {/* Stage 02: Sprung Clause Carriage & Sealed Black-Box Vault A */}
          <g
            ref={bindStage("stage-02")}
            className="bench-piece"
            data-piece="stage-02"
            data-stage="1"
            data-on={activeStage === 1 ? "" : undefined}
          >
            {stage02Vault}
            {stage02BedBack}
            <path ref={coilsBackRef} className="iso-line bench-coil" data-tone="lo" d={restPose.coilsBackD} />
            {stage02Rods}
            <path ref={coilsLeftFrontRef} className="iso-line bench-coil" data-tone="mid" d={restPose.coilsLeftFrontD} />
            <g ref={carriageRef} transform={restPose.carriageTransform}>
              {stage02Carriage}
            </g>
            <path ref={coilsRightFrontRef} className="iso-line bench-coil" data-tone="mid" d={restPose.coilsRightFrontD} />
            {stage02StopFront}
          </g>

          {/* Stage 03: Sealed Black-Box Cassette B + Plunger + Radial +1.02 s Dial Gauge */}
          <g
            ref={bindStage("stage-03")}
            className="bench-piece"
            data-piece="stage-03"
            data-stage="2"
            data-on={activeStage === 2 ? "" : undefined}
          >
            {stage03Static}
            <path
              ref={needleRef}
              className="iso-line bench-needle"
              data-tone="lit"
              data-free=""
              d={restPose.needleD}
            />
          </g>

          {/* Stage 04: Mechanical Clause Tally + 0 PII Ground Post */}
          <g
            ref={bindStage("stage-04")}
            className="bench-piece"
            data-piece="stage-04"
            data-stage="3"
            data-on={activeStage === 3 ? "" : undefined}
          >
            {stage04Static}
          </g>

          {/* Stage 05: QR Tile + Sanctuary Projector Panel + Cradled Phone */}
          <g
            ref={bindStage("stage-05")}
            className="bench-piece"
            data-piece="stage-05"
            data-stage="4"
            data-on={activeStage === 4 ? "" : undefined}
          >
            {stage05Static}
          </g>
        </IsoFigure>
      </div>

      {showExplodeControl ? (
        <div className="bench-controls">
          <button
            type="button"
            className="bench-explode-btn"
            aria-pressed={apart}
            onClick={toggleApart}
          >
            <span className="bench-explode-dot" aria-hidden="true" />
            <span>{apart ? "Assemble" : "Explode seams"}</span>
          </button>
          <span className="bench-live-sr" aria-live="polite" ref={liveRegionRef} />
        </div>
      ) : (
        <span className="bench-live-sr" aria-live="polite" ref={liveRegionRef} />
      )}
    </div>
  );
}
