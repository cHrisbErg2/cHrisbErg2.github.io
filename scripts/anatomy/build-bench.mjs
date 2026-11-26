import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import * as k from "file:///C:/Users/chris/.gemini/config/skills/anatomy/kit/iso-kit.mjs";
import * as G from "file:///C:/Users/chris/.gemini/config/skills/anatomy/kit/lathe.mjs";
import * as A from "file:///C:/Users/chris/.gemini/config/skills/anatomy/kit/audit.mjs";
import { kitScript } from "file:///C:/Users/chris/.gemini/config/skills/anatomy/scripts/inline-kit.mjs";

const SCRATCH_DIR = "C:\\Users\\chris\\.gemini\\antigravity\\brain\\1eea7ef0-b32a-4c1f-885f-607412248ff2\\scratch";
const THEME = process.argv.includes("--light") ? "light" : "dark";

// =========================================================================
// Domain & Physics Model (mirrors src/components/anatomy/bench/model.ts)
// =========================================================================
const STAGE_IDS = ["stage-01", "stage-02", "stage-03", "stage-04", "stage-05"];

const BENCH_STAGES = [
  { id: "stage-01", index: 0, step: 1, name: "Audio ingest", readout: "01 AUDIO IN · 16 KHZ MONO PCM" },
  { id: "stage-02", index: 1, step: 2, name: "Streaming translation", readout: "02 STREAMING CORE · SEALED · +1.02 S" },
  { id: "stage-03", index: 2, step: 3, name: "Quality & context", readout: "03 GUARDRAIL · SEALED · 0.10 MS P95" },
  { id: "stage-04", index: 3, step: 4, name: "Anonymous telemetry", readout: "04 TELEMETRY · 451 TESTS · 0 PII" },
  { id: "stage-05", index: 4, step: 5, name: "Audience UI", readout: "05 QR + PROJECTOR · 0 PII · AUDIO OFF" },
];

const BENCH_CLAUSES = [
  { id: "clause-1", latencySec: 1.02, faderNorm: 0.72, vuBars: 6, carriageOffset: 6.0 },
  { id: "clause-2", latencySec: 1.14, faderNorm: 0.86, vuBars: 7, carriageOffset: 11.5 },
  { id: "clause-3", latencySec: 1.06, faderNorm: 0.56, vuBars: 5, carriageOffset: 8.5 },
];

const DIAL_MIN_SEC = 0.0;
const DIAL_MAX_SEC = 2.0;
const DIAL_TARGET_SEC = 1.5;
const DIAL_REST_SEC = BENCH_CLAUSES[0].latencySec;
const DIAL_SWEEP_START = -Math.PI * 0.75;
const DIAL_SWEEP_SPAN = Math.PI * 1.5;

const dialAngleRad = (seconds) => {
  const clamped = Math.min(DIAL_MAX_SEC, Math.max(DIAL_MIN_SEC, seconds));
  const share = (clamped - DIAL_MIN_SEC) / (DIAL_MAX_SEC - DIAL_MIN_SEC);
  return DIAL_SWEEP_START + share * DIAL_SWEEP_SPAN;
};

const CARRIAGE_REST_OFFSET = BENCH_CLAUSES[0].carriageOffset;

const SPRING = { stagger: 0.035, stiffness: 64, damping: 14.2, substeps: 4 };
const STAGGER_OPEN = ["stage-05", "stage-01", "stage-04", "stage-03", "stage-02"];
const STAGGER_CLOSE = ["stage-02", "stage-03", "stage-04", "stage-01", "stage-05"];

const EXPLODE_VECTORS = {
  "stage-01": [-22, -10, 20],
  "stage-02": [-6, -16, 36],
  "stage-03": [4, 14, 44],
  "stage-04": [14, -18, 28],
  "stage-05": [24, 12, 24],
};

// =========================================================================
// View & Projection (mirrors src/components/anatomy/bench/view.ts)
// =========================================================================
const WIDTH = 640;
const HEIGHT = 380;
const AZIMUTH = 54;
const ELEVATION = 31;
const PAD = 30;

const PLATE = { x: -168, y: -78, w: 336, d: 156, r: 9 };
const PLATE_H = 12;
const FOOT_H = 5;

const SOUNDBOARD_BOX = { x: -156, y: -34, w: 58, d: 68, r: 4 };
const VAULT_A = { x: -78, y: -62, w: 94, d: 44, r: 4 };
const CARRIAGE_BED = { x: -82, y: -6, w: 80, d: 48, r: 3 };
const CASSETTE_B = { x: 28, y: -56, w: 54, d: 40, r: 4 };

const ROD_X_FROM = -77;
const ROD_X_TO = -7;
const ROD_Y_BACK = 5;
const ROD_Y_FRONT = 31;
const ROD_Z = 7.6;
const ROD_HALF = 1.6;
const COIL_R = 3.8;
const COIL_TURNS = 5;

const CARRIAGE_REST_X = -46;
const CARRIAGE_W = 28;
const CARRIAGE_Z = 9.2;
const CARRIAGE_H = 3.0;

const DIAL_CENTER = [58, 15];
const DIAL_R = 18.5;
const DIAL_Z = 34;
const DIAL_H = 10;
const DIAL_TOP = DIAL_Z + DIAL_H;

const FADER_X = -146;
const FADER_Y_MIN = -16;
const FADER_Y_MAX = 16;
const FADER_Z = 24;

const COUNTER_BODY = { x: 96, y: -52, w: 42, d: 36, r: 3 };
const PROJECTOR_BODY = { x: 120, y: 2, w: 40, d: 10, r: 2.5 };
const PHONE_BODY = { x: 128, y: 31, w: 24, d: 9, r: 2 };

const stageExtremes = [
  [-173 + EXPLODE_VECTORS["stage-01"][0], -36 + EXPLODE_VECTORS["stage-01"][1], 29 + EXPLODE_VECTORS["stage-01"][2]],
  [-80 + EXPLODE_VECTORS["stage-02"][0], -64 + EXPLODE_VECTORS["stage-02"][1], 37 + EXPLODE_VECTORS["stage-02"][2]],
  [84 + EXPLODE_VECTORS["stage-03"][0], 34 + EXPLODE_VECTORS["stage-03"][1], DIAL_TOP + EXPLODE_VECTORS["stage-03"][2]],
  [156 + EXPLODE_VECTORS["stage-04"][0], -54 + EXPLODE_VECTORS["stage-04"][1], 24 + EXPLODE_VECTORS["stage-04"][2]],
  [160 + EXPLODE_VECTORS["stage-05"][0], 54 + EXPLODE_VECTORS["stage-05"][1], 44 + EXPLODE_VECTORS["stage-05"][2]],
];

const P = k.fitProjection(
  [...k.boxCorners(PLATE, -PLATE_H - FOOT_H, 0), ...stageExtremes],
  WIDTH,
  HEIGHT,
  { pad: PAD, azimuth: AZIMUTH, elevation: ELEVATION },
);

const at = (pt) => k.iso(pt, P);
const KS = G.scaleOf(P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (points, style) => k.dotsSvg(points, style);
const W = (from, to, opts) => k.wireSvg(from, to, opts);
const solid = (plan, z, h, steps = 6, bevel = 0) => k.slabOf(plan, z, h, P, steps, bevel);
const cyl = (cx, cy, r, z, h, steps = 32, bevel = 0) => k.cylinder(cx, cy, r, z, h, P, steps, bevel);

const byDepth = (pts) => [...pts].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P));
const centerOf = (plan, z, h) => [plan.x + plan.w / 2, plan.y + plan.d / 2, z + h / 2];

// =========================================================================
// Audit Recorder Setup
// =========================================================================
const R = A.recorder(P, { order: STAGGER_OPEN, spring: SPRING });
const recSlab = (plan, z, h, meta, steps = 6) => R.solid(A.slab(plan, z, h, meta, steps));
const recCyl = (cx, cy, r, z, h, meta) => R.solid(A.cylinder(cx, cy, r, z, h, meta));

const putItem = (piece, ref, svg, shapes, opts = {}) => {
  const move = piece === "base" ? [0, 0, 0] : EXPLODE_VECTORS[piece];
  return R.put({
    piece,
    ride: piece,
    at: ref,
    move,
    svg,
    shapes,
    ...opts,
  });
};

// =========================================================================
// Recess Builder (mirrors geometry.ts)
// =========================================================================
function flatRect(x0, z0, x1, z1, r, steps = 5) {
  return k.pathOf(
    k.roundedPlan({ x: x0, y: z0, w: x1 - x0, d: z1 - z0, r }, steps).map(([u, z]) => [u, -z]),
    true,
  );
}

function buildRecess(clipId, { x0, x1, z0, z1, r, depth }, y) {
  const ringPts = k.roundedPlan({ x: x0, y: z0, w: x1 - x0, d: z1 - z0, r }, 5);
  const cx = (x0 + x1) / 2;
  const cz = (z0 + z1) / 2;
  const { sinA } = k.cameraOf(P);
  const tops = [];
  const sides = [[], [], [], []];
  ringPts.forEach(([ax, az], index) => {
    const [bx, bz] = ringPts[(index + 1) % ringPts.length];
    const length = Math.hypot(bx - ax, bz - az) || 1;
    let nx = (bz - az) / length;
    let nz = -(bx - ax) / length;
    if (nx * (cx - (ax + bx) / 2) + nz * (cz - (az + bz) / 2) < 0) {
      nx = -nx;
      nz = -nz;
    }
    if (nx <= 0 && nz <= 0) return;
    const quad = k.pathOf([at([ax, y, az]), at([bx, y, bz]), at([bx, y - depth, bz]), at([ax, y - depth, az])], true);
    if (nz >= nx) {
      tops.push(quad);
    } else {
      const shadeIdx = Math.min(3, Math.max(0, Math.floor(((nx * -sinA + 1) / 2) * 4)));
      sides[shadeIdx].push(quad);
    }
  });
  const shapeD = flatRect(x0, z0, x1, z1, r, 5);
  return {
    clipId,
    clipPathD: shapeD,
    faceTransform: k.sideMatrix([0, y], 0, P, "left"),
    backTransform: k.sideMatrix([0, y - depth], 0, P, "left"),
    topsD: tops.join(""),
    shadesD: [sides[0].join(""), sides[1].join(""), sides[2].join(""), sides[3].join("")],
    shapeD,
  };
}

function recessSvg(recess, bars) {
  const shades = recess.shadesD.map((d, idx) => (d ? `<path class="iso-shade" data-shade="${idx}" d="${d}"/>` : "")).join("");
  const rects = bars
    .map((b) => `<rect class="${b.active ? "bench-screen-bar is-active" : "bench-screen-bar"}" x="${b.x}" y="${-(b.z + b.h)}" width="${b.w}" height="${b.h}" rx="0.6"/>`)
    .join("");
  return `<g class="bench-recess"><defs><clipPath id="${recess.clipId}"><path transform="${recess.faceTransform}" d="${recess.clipPathD}"/></clipPath></defs><g clip-path="url(#${recess.clipId})">${recess.topsD ? `<path class="iso-top" d="${recess.topsD}"/>` : ""}${shades}<g transform="${recess.backTransform}"><path class="bench-screen-cavity" d="${recess.shapeD}"/>${rects}<path class="iso-line" data-tone="faint" d="${recess.shapeD}"/></g></g><g transform="${recess.faceTransform}"><path class="iso-line" data-tone="lo" d="${recess.shapeD}"/></g></g>`;
}

// =========================================================================
// Build Geometry + Record Audit Shapes
// =========================================================================
const BASE_HTML = (() => {
  const parts = [`<path class="iso-halo" d="${k.haloOf(PLATE, -PLATE_H - FOOT_H, PLATE_H, P)}"/>`];
  const feetPts = byDepth(k.corners(PLATE, 22));
  feetPts.forEach(([x, y], i) => {
    const fSvg = S(cyl(x, y, 7.0, -PLATE_H - FOOT_H, 1.6, 28), { tone: "lo", crease: "faint" });
    const pSvg = S(cyl(x, y, 5.4, -PLATE_H - FOOT_H + 1.6, FOOT_H - 1.6, 28), { tone: "mid", crease: "faint" });
    putItem("base", [x, y, -PLATE_H - FOOT_H + 0.8], fSvg, [recCyl(x, y, 7.0, -PLATE_H - FOOT_H, 1.6, { name: `stand.footFlange.${i}`, ground: true })], { name: `stand.footFlange.${i}` });
    putItem("base", [x, y, -PLATE_H - (FOOT_H - 1.6) / 2], pSvg, [recCyl(x, y, 5.4, -PLATE_H - FOOT_H + 1.6, FOOT_H - 1.6, { name: `stand.footPad.${i}` })], { name: `stand.footPad.${i}` });
    parts.push(`<g>${fSvg}${pSvg}</g>`);
  });

  const baseScrews = k.corners(PLATE, 10);
  const slabSvg =
    S(solid(PLATE, -PLATE_H, PLATE_H, 8, 1.6), { tone: "mid", crease: "faint" }) +
    L(k.planOutline(k.insetPlan(PLATE, 5), 0, P), { tone: "lo" }) +
    L(k.joinPaths(baseScrews.map(([x, y]) => k.ring(x, y, 2.2, 0, P, 16))), { tone: "lo" }) +
    D(baseScrews.map(([x, y]) => at([x, y, 0])), { size: 0.5, tone: "mid" });
  putItem("base", centerOf(PLATE, -PLATE_H, PLATE_H), slabSvg, [recSlab(PLATE, -PLATE_H, PLATE_H, { name: "base.slab" }, 8)], { name: "base.slab" });
  parts.push(slabSvg);

  const RULER_STRIP = { x: -102, y: 61, w: 238, d: 7, r: 1 };
  const rulerTicks = k.topTicks(RULER_STRIP.x + 6, RULER_STRIP.x + RULER_STRIP.w - 6, 4, 5, RULER_STRIP.y, 0.7, [2.0, 3.6], P);
  const rulerSvg =
    S(solid(RULER_STRIP, 0, 0.7, 3), { tone: "lo", crease: "none" }) +
    L(rulerTicks.minor, { tone: "lo" }) +
    L(rulerTicks.major, { tone: "mid" }) +
    D([at([RULER_STRIP.x + 2.5, RULER_STRIP.y + RULER_STRIP.d / 2, 0.7]), at([RULER_STRIP.x + RULER_STRIP.w - 2.5, RULER_STRIP.y + RULER_STRIP.d / 2, 0.7])], { size: 0.45, tone: "mid" });
  putItem("base", centerOf(RULER_STRIP, 0, 0.7), rulerSvg, [recSlab(RULER_STRIP, 0, 0.7, { name: "base.ruler" }, 3)], { name: "base.ruler" });
  parts.push(rulerSvg);

  const NAMEPLATE = { x: -156, y: 58, w: 46, d: 12, r: 1.5 };
  const plateSvg =
    S(solid(NAMEPLATE, 0, 0.8, 4), { tone: "lo", crease: "none" }) +
    L(k.planOutline(k.insetPlan(NAMEPLATE, 1.6), 0.8, P), { tone: "faint" }) +
    L(k.joinPaths([32, 22, 28].map((w, row) => k.lineOnTop([NAMEPLATE.x + 7, NAMEPLATE.y + 3.3 + row * 2.5], [NAMEPLATE.x + 7 + w, NAMEPLATE.y + 3.3 + row * 2.5], 0.8, P))), { tone: "lo", free: true }) +
    D([at([NAMEPLATE.x + 3.5, NAMEPLATE.y + NAMEPLATE.d / 2, 0.8]), at([NAMEPLATE.x + NAMEPLATE.w - 3.5, NAMEPLATE.y + NAMEPLATE.d / 2, 0.8])], { size: 0.45, tone: "mid" });
  putItem("base", centerOf(NAMEPLATE, 0, 0.8), plateSvg, [recSlab(NAMEPLATE, 0, 0.8, { name: "base.nameplate" }, 4)], { name: "base.nameplate" });
  parts.push(plateSvg);

  return `<g>${parts.join("")}</g>`;
})();

// STAGE 01
const S01_PLINTH = { x: -158, y: -36, w: 62, d: 72, r: 4 };
const S01_SLOT = { x: FADER_X, y: FADER_Y_MIN - 6, w: 8, d: FADER_Y_MAX - FADER_Y_MIN + 12, r: 1.5 };
const S01_GAIN_XY = [-124, 19];
const S01_GAIN_Z = 23;
const S01_GAIN_R = 6.0;
const S01_VU_PLANS = Array.from({ length: 8 }, (_, idx) => ({ x: -115, y: -24 + idx * 5.2, w: 11, d: 3.6, r: 0.8 }));
const S01_FADER_CAP = { x: FADER_X - 1, y: -3.5, w: 10, d: 7, r: 1.2 };
const S01_XLR_COLLAR = { x: -160, y: -4, w: 4, d: 14, r: 1.5 };
const S01_XLR_BARREL = { x: -168, y: -1, w: 8, d: 8, r: 2 };
const S01_XLR_BOOT = { x: -173, y: 1, w: 5, d: 4, r: 1.5 };
const S01_CORD_ANCHOR = { x: -166, y: 24, w: 8, d: 10, r: 1.5 };
const S01_OUT_STUB = { x: -98, y: -4, w: 5, d: 10, r: 1.2 };
const S01_CORD_PTS = [[-173, 3, 14], [-177, 3, 14], [-177, 18, 9], [-162, 29, 8.5], [-162, 29, 4]];

const STAGE01_BUILT = (() => {
  const owner = "stage-01";
  const plinthSvg = S(solid(S01_PLINTH, 0, 3, 5, 0.4), { tone: "lo", crease: "faint" });
  putItem("stage-01", centerOf(S01_PLINTH, 0, 3), plinthSvg, [recSlab(S01_PLINTH, 0, 3, { name: "s01.plinth", owner }, 5)]);

  const anchorSvg = S(solid(S01_CORD_ANCHOR, 0, 4, 3, 0.3), { tone: "mid", crease: "faint" });
  putItem("stage-01", centerOf(S01_CORD_ANCHOR, 0, 4), anchorSvg, [recSlab(S01_CORD_ANCHOR, 0, 4, { name: "s01.cordAnchor", owner }, 3)]);

  const bootSvg = S(solid(S01_XLR_BOOT, 11.5, 5, 3), { tone: "mid", crease: "faint" });
  putItem("stage-01", centerOf(S01_XLR_BOOT, 11.5, 5), bootSvg, [recSlab(S01_XLR_BOOT, 11.5, 5, { name: "s01.xlrBoot", owner }, 3)]);

  const barrelSvg = S(solid(S01_XLR_BARREL, 10, 8, 4, 0.4), { tone: "mid", crease: "faint" });
  putItem("stage-01", centerOf(S01_XLR_BARREL, 10, 8), barrelSvg, [recSlab(S01_XLR_BARREL, 10, 8, { name: "s01.xlrBarrel", owner }, 4)]);

  const collarSvg = S(solid(S01_XLR_COLLAR, 8, 12, 3, 0.4), { tone: "mid", crease: "faint" });
  putItem("stage-01", centerOf(S01_XLR_COLLAR, 8, 12), collarSvg, [recSlab(S01_XLR_COLLAR, 8, 12, { name: "s01.xlrCollar", owner }, 3)]);

  const cordPts2d = S01_CORD_PTS.map(at);
  const wireSvg = W(cordPts2d[0], cordPts2d[3], { via: cordPts2d.slice(1, 3), tone: "mid", ends: "both", size: 0.9 });
  const cordR = 0.9 / KS;
  R.route("s01.cord", S01_CORD_PTS, cordR, { owner: "s01.cord", limp: true, piece: "stage-01", move: EXPLODE_VECTORS["stage-01"] });
  putItem("stage-01", [-173, 16, 8], wireSvg, [A.tube(S01_CORD_PTS, cordR, { name: "s01.cord", owner: "s01.cord" })], { name: "s01.cord" });

  const boxSvg =
    S(solid(SOUNDBOARD_BOX, 3, 20, 6, 1.0), { tone: "mid", crease: "faint", inner: L(k.sideSeam(SOUNDBOARD_BOX, 18, P, 6), { tone: "faint" }) }) +
    L(k.planOutline(k.insetPlan(SOUNDBOARD_BOX, 3), 23, P, 5), { tone: "faint" }) +
    D(k.corners(SOUNDBOARD_BOX, 4.5).map(([x, y]) => at([x, y, 23])), { size: 0.45, tone: "mid" });
  putItem("stage-01", centerOf(SOUNDBOARD_BOX, 3, 20), boxSvg, [recSlab(SOUNDBOARD_BOX, 3, 20, { name: "s01.box", owner }, 6)]);

  const stubSvg = S(solid(S01_OUT_STUB, 9, 8, 3, 0.3), { tone: "mid", crease: "faint" });
  putItem("stage-01", centerOf(S01_OUT_STUB, 9, 8), stubSvg, [recSlab(S01_OUT_STUB, 9, 8, { name: "s01.outStub", owner }, 3)]);

  const slotSvg = S(solid(S01_SLOT, 23, 1, 3), { tone: "lo", crease: "none" });
  putItem("stage-01", centerOf(S01_SLOT, 23, 1), slotSvg, [recSlab(S01_SLOT, 23, 1, { name: "s01.faderSlot", owner }, 3)]);

  const gainCollarSvg = S(cyl(S01_GAIN_XY[0], S01_GAIN_XY[1], 7.6, S01_GAIN_Z, 1.5, 28), { tone: "lo", crease: "faint" });
  putItem("stage-01", [S01_GAIN_XY[0], S01_GAIN_XY[1], S01_GAIN_Z + 0.75], gainCollarSvg, [recCyl(S01_GAIN_XY[0], S01_GAIN_XY[1], 7.6, S01_GAIN_Z, 1.5, { name: "s01.gainCollar", owner })]);

  const gainKnobSvg =
    S(cyl(S01_GAIN_XY[0], S01_GAIN_XY[1], S01_GAIN_R, S01_GAIN_Z + 1.5, 4.5, 32), { tone: "mid", crease: "faint" }) +
    L(k.knurl(S01_GAIN_XY[0], S01_GAIN_XY[1], S01_GAIN_R, S01_GAIN_Z + 1.5, S01_GAIN_Z + 6.0, 32, P), { tone: "lo" }) +
    L(k.lineOnTop(S01_GAIN_XY, [S01_GAIN_XY[0] + S01_GAIN_R * Math.cos(-0.65), S01_GAIN_XY[1] + S01_GAIN_R * Math.sin(-0.65)], S01_GAIN_Z + 6.0, P), { tone: "hi" }) +
    D([at([S01_GAIN_XY[0], S01_GAIN_XY[1], S01_GAIN_Z + 6.0])], { size: 0.45, tone: "hi" });
  putItem("stage-01", [S01_GAIN_XY[0], S01_GAIN_XY[1], S01_GAIN_Z + 3.75], gainKnobSvg, [recCyl(S01_GAIN_XY[0], S01_GAIN_XY[1], S01_GAIN_R, S01_GAIN_Z + 1.5, 4.5, { name: "s01.gainKnob", owner })]);

  const faderCapSvg = S(solid(S01_FADER_CAP, FADER_Z, 4.5, 3, 0.4), { tone: "hi", crease: "faint" });
  putItem("stage-01", centerOf(S01_FADER_CAP, FADER_Z, 4.5), faderCapSvg, [recSlab(S01_FADER_CAP, FADER_Z, 4.5, { name: "s01.faderCap", owner }, 3)]);

  const vuSvgs = S01_VU_PLANS.map((plan, idx) => {
    const svg = S(solid(plan, 23, 2.2, 3, 0.3), { tone: "mid", crease: "none", lit: idx < BENCH_CLAUSES[0].vuBars });
    putItem("stage-01", centerOf(plan, 23, 2.2), svg, [recSlab(plan, 23, 2.2, { name: `s01.vu.${idx}`, owner }, 3)]);
    return `<g class="bench-vu-item">${svg}</g>`;
  });

  const staticHtml = `<g>${plinthSvg}${anchorSvg}${bootSvg}${barrelSvg}${collarSvg}${wireSvg}${boxSvg}${stubSvg}${slotSvg}${gainCollarSvg}${gainKnobSvg}</g>`;
  return { staticHtml, faderCapSvg, vuBankHtml: `<g class="bench-vu-bank">${vuSvgs.join("")}</g>` };
})();

// STAGE 02
const VAULT_PLINTH = { x: -80, y: -64, w: 98, d: 48, r: 3 };
const VAULT_SHIELD = { x: -64, y: -52, w: 62, d: 24, r: 2 };
const VAULT_STUDS = k.corners(VAULT_A, 5.5);
const VAULT_RIBS = Array.from({ length: 6 }, (_, i) => ({ x: -66 + i * 11, y: -62, w: 4.8, d: 8, r: 1 }));
const VAULT_RAIL = { x: -34, y: -18, w: 34, d: 6, r: 1 };
const VAULT_GLAND = { x: 16, y: -45, w: 5, d: 10, r: 1.5 };
const CARRIAGE_PLATE = { x: CARRIAGE_REST_X - CARRIAGE_W / 2, y: -1, w: CARRIAGE_W, d: 38, r: 2.5 };
const CARRIAGE_BUSHINGS = [-1, 1].flatMap((side) =>
  [ROD_Y_BACK, ROD_Y_FRONT].map((y) => ({
    x: side < 0 ? CARRIAGE_PLATE.x - 1 : CARRIAGE_PLATE.x + CARRIAGE_W - 7,
    y: y - 4.5,
    w: 8,
    d: 9,
    r: 1.5,
  })),
);
const CLAUSE_BLOCK = { x: CARRIAGE_REST_X - 10, y: 6, w: 20, d: 24, r: 1.5 };

const STAGE02_BUILT = (() => {
  const owner = "stage-02";
  const vpSvg = S(solid(VAULT_PLINTH, 0, 4, 5, 0.4), { tone: "lo", crease: "faint" });
  putItem("stage-02", centerOf(VAULT_PLINTH, 0, 4), vpSvg, [recSlab(VAULT_PLINTH, 0, 4, { name: "s02.vaultPlinth", owner }, 5)]);

  const vbSvg = S(solid(VAULT_A, 4, 29, 6, 1.2), { tone: "hi", crease: "lo", inner: L(k.sideSeam(VAULT_A, 25, P, 6), { tone: "faint" }) });
  putItem("stage-02", centerOf(VAULT_A, 4, 29), vbSvg, [recSlab(VAULT_A, 4, 29, { name: "s02.vaultBody", owner }, 6)]);

  const vrSvg = S(solid(VAULT_RAIL, 4, 9, 3, 0.3), { tone: "mid", crease: "faint" });
  putItem("stage-02", centerOf(VAULT_RAIL, 4, 9), vrSvg, [recSlab(VAULT_RAIL, 4, 9, { name: "s02.vaultRail", owner }, 3)]);

  const vgSvg = S(solid(VAULT_GLAND, 10, 10, 3, 0.3), { tone: "mid", crease: "faint" });
  putItem("stage-02", centerOf(VAULT_GLAND, 10, 10), vgSvg, [recSlab(VAULT_GLAND, 10, 10, { name: "s02.vaultGland", owner }, 3)]);

  const ribSvgs = VAULT_RIBS.map((plan, i) => {
    const svg = S(solid(plan, 33, 3.2, 3, 0.3), { tone: "mid", crease: "faint" });
    putItem("stage-02", centerOf(plan, 33, 3.2), svg, [recSlab(plan, 33, 3.2, { name: `s02.rib.${i}`, owner }, 3)]);
    return svg;
  }).join("");

  const shieldSvg = S(solid(VAULT_SHIELD, 33, 3, 4, 0.4), { tone: "mid", crease: "faint" }) + L(k.planOutline(k.insetPlan(VAULT_SHIELD, 2), 36, P, 4), { tone: "faint" });
  putItem("stage-02", centerOf(VAULT_SHIELD, 33, 3), shieldSvg, [recSlab(VAULT_SHIELD, 33, 3, { name: "s02.vaultShield", owner }, 4)]);

  const studSvgs = VAULT_STUDS.map(([x, y], i) => {
    const svg = S(cyl(x, y, 2.5, 33, 2.4, 16), { tone: "hi", crease: "none" }) + D([at([x, y, 35.4])], { size: 0.45, tone: "hi" });
    putItem("stage-02", [x, y, 34.2], svg, [recCyl(x, y, 2.5, 33, 2.4, { name: `s02.stud.${i}`, owner })]);
    return svg;
  }).join("");

  const vaultHtml = `<g>${vpSvg}${vbSvg}${vrSvg}${vgSvg}${ribSvgs}${shieldSvg}${studSvgs}</g>`;

  const bedSvg = S(solid(CARRIAGE_BED, 0, 3, 4, 0.4), { tone: "lo", crease: "faint" }) + L(k.planOutline(k.insetPlan(CARRIAGE_BED, 3), 3, P, 4), { tone: "faint" });
  putItem("stage-02", centerOf(CARRIAGE_BED, 0, 3), bedSvg, [recSlab(CARRIAGE_BED, 0, 3, { name: "s02.carriageBed", owner }, 4)]);

  const stopPlans = [ROD_X_FROM - 5, ROD_X_TO].map((x) => ({ x, y: -4, w: 5, d: 44, r: 1.2 }));
  const stop0Svg = S(solid(stopPlans[0], 3, 10, 3, 0.4), { tone: "mid", crease: "faint" }) + D([at([ROD_X_FROM - 2.5, 5, 13]), at([ROD_X_FROM - 2.5, 31, 13])], { size: 0.45, tone: "mid" });
  putItem("stage-02", centerOf(stopPlans[0], 3, 10), stop0Svg, [recSlab(stopPlans[0], 3, 10, { name: "s02.endStop0", owner }, 3)]);

  const rodSvgs = [ROD_Y_BACK, ROD_Y_FRONT].map((y, i) => {
    const plan = { x: ROD_X_FROM, y: y - ROD_HALF, w: ROD_X_TO - ROD_X_FROM, d: ROD_HALF * 2, r: ROD_HALF - 0.2 };
    const svg = S(solid(plan, ROD_Z - ROD_HALF, ROD_HALF * 2, 3), { tone: "mid", crease: "none" });
    putItem("stage-02", centerOf(plan, ROD_Z - ROD_HALF, ROD_HALF * 2), svg, [recSlab(plan, ROD_Z - ROD_HALF, ROD_HALF * 2, { name: `s02.rod.${i}`, owner }, 3)]);
    return svg;
  }).join("");

  const bushSvgs = CARRIAGE_BUSHINGS.map((plan, i) => {
    const svg = S(solid(plan, CARRIAGE_Z, CARRIAGE_H, 3, 0.4), { tone: "mid", crease: "faint" }) + D([at([plan.x + plan.w / 2, plan.y + plan.d / 2, CARRIAGE_Z + CARRIAGE_H])], { size: 0.42, tone: "mid" });
    putItem("stage-02", centerOf(plan, CARRIAGE_Z, CARRIAGE_H), svg, [recSlab(plan, CARRIAGE_Z, CARRIAGE_H, { name: `s02.bushing.${i}`, owner }, 3)]);
    return svg;
  }).join("");

  const cpSvg = S(solid(CARRIAGE_PLATE, CARRIAGE_Z + CARRIAGE_H, 4.0, 5, 0.6), { tone: "mid", crease: "faint" });
  putItem("stage-02", centerOf(CARRIAGE_PLATE, CARRIAGE_Z + CARRIAGE_H, 4.0), cpSvg, [recSlab(CARRIAGE_PLATE, CARRIAGE_Z + CARRIAGE_H, 4.0, { name: "s02.carriagePlate", owner }, 5)]);

  const cbSvg = S(solid(CLAUSE_BLOCK, CARRIAGE_Z + CARRIAGE_H + 4.0, 7, 4, 0.6), { tone: "hi", crease: "lo" }) + L(k.planOutline(k.insetPlan(CLAUSE_BLOCK, 2.2), CARRIAGE_Z + CARRIAGE_H + 11.0, P, 4), { tone: "faint" });
  putItem("stage-02", centerOf(CLAUSE_BLOCK, CARRIAGE_Z + CARRIAGE_H + 4.0, 7), cbSvg, [recSlab(CLAUSE_BLOCK, CARRIAGE_Z + CARRIAGE_H + 4.0, 7, { name: "s02.clauseBlock", owner }, 4)]);

  const stop1Svg = S(solid(stopPlans[1], 3, 10, 3, 0.4), { tone: "mid", crease: "faint" }) + D([at([ROD_X_TO + 2.5, 5, 13]), at([ROD_X_TO + 2.5, 31, 13])], { size: 0.45, tone: "mid" });
  putItem("stage-02", centerOf(stopPlans[1], 3, 10), stop1Svg, [recSlab(stopPlans[1], 3, 10, { name: "s02.endStop1", owner }, 3)]);

  return {
    vaultHtml,
    bedBackHtml: `<g>${bedSvg}${stop0Svg}</g>`,
    rodsHtml: `<g>${rodSvgs}</g>`,
    carriageHtml: `<g>${bushSvgs}${cpSvg}${cbSvg}</g>`,
    stopFrontHtml: `<g>${stop1Svg}</g>`,
  };
})();

// STAGE 03
const CASSETTE_BASE = { x: 26, y: -58, w: 58, d: 44, r: 3 };
const CASSETTE_PLATE = { x: 35, y: -49, w: 40, d: 26, r: 2 };
const CASSETTE_STUDS = k.corners(CASSETTE_B, 4.2);
const CASSETTE_LATCH = { x: 24, y: -41, w: 4, d: 10, r: 1 };
const [DX, DY] = DIAL_CENTER;
const DIAL_STAND = { x: 26, y: -2, w: 50, d: 34, r: 3 };
const DIAL_CLAMP = { x: DX - 9, y: DY - 9, w: 18, d: 18, r: 2.5 };
const DIAL_TICKS = k.radialTicks(DX, DY, DIAL_R - 2.4, 40, 5, DIAL_TOP, [1.2, 2.4], P, DIAL_SWEEP_START, DIAL_SWEEP_SPAN);
const TARGET_ANGLE = DIAL_SWEEP_START + ((DIAL_TARGET_SEC - DIAL_MIN_SEC) / (DIAL_MAX_SEC - DIAL_MIN_SEC)) * DIAL_SWEEP_SPAN;
const TARGET_R = DIAL_R - 5.0;
const PLUNGER_ROD_LEFT = { x: 4, y: 13, w: 14, d: 4, r: 1.6 };
const PLUNGER_COLLAR = { x: 18, y: 12, w: 3, d: 6, r: 1 };
const PLUNGER_ROD_RIGHT = { x: 21, y: 13, w: 7, d: 4, r: 1.6 };
const PLUNGER_SLEEVE = { x: 28, y: 11, w: 22.4, d: 8, r: 1.5 };
const DIAL_THUMB_NECK = { x: DX - 1.5, y: DY + 9, w: 3, d: 1.9, r: 0.6 };
const DIAL_LUG = { x: DX - 3, y: DY - DIAL_R - 4.0, w: 6, d: 4.0, r: 1.2 };
const DIAL_CROWN_STEM = { x: DX + DIAL_R, y: DY - 2.2, w: 4.2, d: 4.4, r: 1.0 };
const DIAL_CROWN_CAP = { x: DX + DIAL_R + 4.2, y: DY - 3.0, w: 2.6, d: 6.0, r: 1.2 };

const STAGE03_HTML = (() => {
  const owner = "stage-03";
  const parts = [];
  const addSlab = (plan, z, h, style, name, steps = 4, bevel = 0.4, extra = "") => {
    const svg = S(solid(plan, z, h, steps, bevel), style) + extra;
    putItem("stage-03", centerOf(plan, z, h), svg, [recSlab(plan, z, h, { name, owner }, steps)]);
    parts.push(svg);
  };
  const addCyl = (cx, cy, r, z, h, steps, bevel, style, name, extra = "") => {
    const svg = S(cyl(cx, cy, r, z, h, steps, bevel), style) + extra;
    putItem("stage-03", [cx, cy, z + h / 2], svg, [recCyl(cx, cy, r, z, h, { name, owner })]);
    parts.push(svg);
  };

  addSlab(CASSETTE_BASE, 0, 3, { tone: "lo", crease: "faint" }, "s03.cassetteBase", 4, 0.4);
  addSlab(CASSETTE_B, 3, 22, { tone: "hi", crease: "lo", inner: L(k.sideSeam(CASSETTE_B, 19, P, 6), { tone: "faint" }) }, "s03.cassetteBody", 6, 1.0);
  addSlab(CASSETTE_LATCH, 9, 8, { tone: "mid", crease: "faint" }, "s03.cassetteLatch", 3, 0.3);
  addSlab(CASSETTE_PLATE, 25, 2.5, { tone: "mid", crease: "faint" }, "s03.cassettePlate", 4, 0.4, L(k.planOutline(k.insetPlan(CASSETTE_PLATE, 2), 27.5, P, 4), { tone: "faint" }));
  CASSETTE_STUDS.forEach(([x, y], i) => addCyl(x, y, 2.2, 25, 2.0, 16, 0, { tone: "hi", crease: "none" }, `s03.stud.${i}`, D([at([x, y, 27.0])], { size: 0.45, tone: "hi" })));

  addSlab(DIAL_STAND, 0, 4, { tone: "lo", crease: "faint" }, "s03.dialStand", 4, 0.5, D(k.corners(DIAL_STAND, 4).map(([x, y]) => at([x, y, 4])), { size: 0.45, tone: "mid" }));
  addSlab(PLUNGER_ROD_LEFT, 6, 4, { tone: "mid", crease: "none" }, "s03.plungerRodLeft", 3, 0);
  addSlab(PLUNGER_COLLAR, 5, 6, { tone: "hi", crease: "faint" }, "s03.plungerCollar", 3, 0.3);
  addSlab(PLUNGER_ROD_RIGHT, 6, 4, { tone: "mid", crease: "none" }, "s03.plungerRodRight", 3, 0);
  addSlab(PLUNGER_SLEEVE, 4, 8, { tone: "mid", crease: "faint" }, "s03.plungerSleeve", 3, 0.4);
  addCyl(DX, DY, 7.6, 4, 3, 28, 0, { tone: "mid", crease: "faint" }, "s03.dialCollar");
  addCyl(DX, DY, 4.8, 7, 15, 28, 0, { tone: "mid", crease: "none" }, "s03.dialColumnLow", L(k.joinPaths([12, 17].map((z) => k.sideArc(DX, DY, 4.8, z, P, 16))), { tone: "faint" }));
  addSlab(DIAL_CLAMP, 22, 10, { tone: "mid", crease: "faint" }, "s03.dialClamp", 4, 0.5);
  addCyl(DX, DY, 4.8, 32, 2, 28, 0, { tone: "mid", crease: "none" }, "s03.dialColumnHigh");
  addSlab(DIAL_THUMB_NECK, 24, 5, { tone: "mid", crease: "none" }, "s03.dialThumbNeck", 2, 0);
  addCyl(DX, DY + 13.5, 2.6, 23, 6, 20, 0, { tone: "mid", crease: "faint" }, "s03.dialThumb", L(k.knurl(DX, DY + 13.5, 2.6, 23, 29, 16, P), { tone: "lo" }));
  addSlab(DIAL_LUG, DIAL_Z + 1, 5, { tone: "mid", crease: "faint" }, "s03.dialLug", 3, 0);

  const dialFaceExtra =
    L(k.sideArc(DX, DY, DIAL_R, DIAL_TOP - 3.4, P, 40), { tone: "faint" }) +
    L(k.knurl(DX, DY, DIAL_R, DIAL_TOP - 3.4, DIAL_TOP, 84, P, 0.3), { tone: "lo" }) +
    L(k.ring(DX, DY, DIAL_R - 1.0, DIAL_TOP, P, 64), { tone: "lo" }) +
    L(k.ring(DX, DY, DIAL_R - 2.4, DIAL_TOP, P, 64), { tone: "faint" }) +
    L(DIAL_TICKS.minor, { tone: "lo" }) +
    L(DIAL_TICKS.major, { tone: "mid" }) +
    D([at([DX + Math.sin(TARGET_ANGLE) * TARGET_R, DY - Math.cos(TARGET_ANGLE) * TARGET_R, DIAL_TOP])], { size: 0.75, tone: "hi" }) +
    L(k.ring(DX, DY, 1.8, DIAL_TOP, P, 16), { tone: "mid" }) +
    k.faceTextSvg(k.topMatrix([DX, DY + 7.2], DIAL_TOP, P, "x"), "s", { size: 2.7, tone: "lo", anchor: "middle" });
  addCyl(DX, DY, DIAL_R, DIAL_Z, DIAL_H, 64, 0.8, { tone: "hi", crease: "lo" }, "s03.dialPuck", dialFaceExtra);
  addSlab(DIAL_CROWN_STEM, DIAL_Z + 2, 4.6, { tone: "mid", crease: "faint" }, "s03.dialCrownStem", 3, 0);
  addSlab(DIAL_CROWN_CAP, DIAL_Z + 1.2, 6.2, { tone: "mid", crease: "faint" }, "s03.dialCrownCap", 3, 0);

  return `<g>${parts.join("")}</g>`;
})();

// STAGE 04
const COUNTER_PLINTH = { x: 94, y: -54, w: 60, d: 42, r: 3 };
const COUNTER_BEZEL = { x: 102, y: -44, w: 30, d: 16, r: 2 };
const DIGIT_WHEELS = [0, 1, 2].map((i) => ({ x: 104.5 + i * 9, y: -41, w: 7, d: 10, r: 1.5 }));
const RESET_NECK = { x: 138, y: -36, w: 1.9, d: 4, r: 0.8 };
const GROUND_XY = [148, -20];

const STAGE04_HTML = (() => {
  const owner = "stage-04";
  const parts = [];
  const addSlab = (plan, z, h, style, name, steps = 4, bevel = 0.4, extra = "") => {
    const svg = S(solid(plan, z, h, steps, bevel), style) + extra;
    putItem("stage-04", centerOf(plan, z, h), svg, [recSlab(plan, z, h, { name, owner }, steps)]);
    parts.push(svg);
  };
  const addCyl = (cx, cy, r, z, h, steps, style, name, extra = "") => {
    const svg = S(cyl(cx, cy, r, z, h, steps, 0), style) + extra;
    putItem("stage-04", [cx, cy, z + h / 2], svg, [recCyl(cx, cy, r, z, h, { name, owner })]);
    parts.push(svg);
  };

  addSlab(COUNTER_PLINTH, 0, 3, { tone: "lo", crease: "faint" }, "s04.plinth", 4, 0.4);
  addSlab(COUNTER_BODY, 3, 16, { tone: "mid", crease: "faint", inner: L(k.sideSeam(COUNTER_BODY, 14, P, 5), { tone: "faint" }) }, "s04.body", 5, 0.8);
  addSlab(COUNTER_BEZEL, 19, 1, { tone: "mid", crease: "faint" }, "s04.bezel", 4, 0.2);
  DIGIT_WHEELS.forEach((plan, i) => addSlab(plan, 20, 2.2, { tone: "hi", crease: "faint" }, `s04.wheel.${i}`, 3, 0.3, L(k.planOutline(k.insetPlan(plan, 1.4), 22.2, P, 2), { tone: "faint" })));
  addSlab(RESET_NECK, 10, 4, { tone: "mid", crease: "none" }, "s04.resetNeck", 2, 0);
  addCyl(143.5, -34, 3.6, 8, 8, 24, { tone: "mid", crease: "faint" }, "s04.resetKnob", L(k.knurl(143.5, -34, 3.6, 8, 16, 20, P), { tone: "lo" }));
  addCyl(GROUND_XY[0], GROUND_XY[1], 6.0, 3, 2, 28, { tone: "lo", crease: "faint" }, "s04.groundBase");
  addCyl(GROUND_XY[0], GROUND_XY[1], 3.2, 5, 7, 24, { tone: "mid", crease: "none" }, "s04.groundPost");
  addCyl(GROUND_XY[0], GROUND_XY[1], 4.4, 12, 3, 24, { tone: "hi", crease: "faint" }, "s04.groundNut");
  addCyl(GROUND_XY[0], GROUND_XY[1], 3.4, 15, 2, 24, { tone: "mid", crease: "faint" }, "s04.groundCap", L(k.ring(GROUND_XY[0], GROUND_XY[1], 2.0, 17, P, 16), { tone: "lo" }));

  return `<g>${parts.join("")}</g>`;
})();

// STAGE 05
const QR_PLINTH = { x: 88, y: 12, w: 30, d: 30, r: 3 };
const QR_TILE = { x: 90, y: 14, w: 26, d: 26, r: 2 };
const QR_FINDERS = [
  { x: 93, y: 17, w: 6.5, d: 6.5, r: 0.6 },
  { x: 106.5, y: 17, w: 6.5, d: 6.5, r: 0.6 },
  { x: 93, y: 30.5, w: 6.5, d: 6.5, r: 0.6 },
];
const QR_CELLS = [
  { x: 101.5, y: 18, w: 3, d: 3, r: 0.4 },
  { x: 101.5, y: 24.5, w: 4, d: 4, r: 0.4 },
  { x: 107.5, y: 26, w: 4.5, d: 4.5, r: 0.4 },
  { x: 102, y: 31.5, w: 3.5, d: 3.5, r: 0.4 },
  { x: 108, y: 32, w: 4.5, d: 4.5, r: 0.4 },
];
const PROJ_SCREEN = { x0: 123.5, x1: 156.5, z0: 18, z1: 40.5, r: 2, depth: 1.8 };
const PHONE_SCREEN = { x0: 130.5, x1: 149.5, z0: 9.5, z1: 29.5, r: 1.6, depth: 1.4 };
const PROJ_KNUCKLE = { x: 136, y: 4, w: 8, d: 8, r: 1.5 };
const PHONE_DOCK = { x: 124, y: 26, w: 32, d: 24, r: 3 };
const MUTE_BLOCK = { x: 116, y: 44, w: 8, d: 8, r: 1.5 };

const STAGE05_HTML = (() => {
  const owner = "stage-05";
  const parts = [];
  const addSlab = (plan, z, h, style, name, steps = 4, bevel = 0.4, extra = "") => {
    const svg = S(solid(plan, z, h, steps, bevel), style) + extra;
    putItem("stage-05", centerOf(plan, z, h), svg, [recSlab(plan, z, h, { name, owner }, steps)]);
    parts.push(svg);
  };
  const addCyl = (cx, cy, r, z, h, steps, style, name, extra = "") => {
    const svg = S(cyl(cx, cy, r, z, h, steps, 0), style) + extra;
    putItem("stage-05", [cx, cy, z + h / 2], svg, [recCyl(cx, cy, r, z, h, { name, owner })]);
    parts.push(svg);
  };

  addSlab(QR_PLINTH, 0, 4, { tone: "lo", crease: "faint" }, "s05.qrPlinth", 4, 0.4);
  addSlab(
    QR_TILE,
    4,
    2,
    { tone: "hi", crease: "faint" },
    "s05.qrTile",
    4,
    0.3,
    L(k.joinPaths(QR_FINDERS.flatMap((p) => [k.planOutline(p, 6, P, 2), k.planOutline(k.insetPlan(p, 2), 6, P, 2)])), { tone: "hi" }) +
      L(k.joinPaths(QR_CELLS.map((p) => k.planOutline(p, 6, P, 2))), { tone: "mid" }),
  );
  addCyl(140, 8, 7.0, 0, 3, 28, { tone: "lo", crease: "faint" }, "s05.projFoot");
  addCyl(140, 8, 3.4, 3, 8, 24, { tone: "mid", crease: "none" }, "s05.projPost");
  addSlab(PROJ_KNUCKLE, 11, 3, { tone: "mid", crease: "faint" }, "s05.projKnuckle", 3, 0);

  const projRecess = buildRecess("ikilang-bench-proj-clip", PROJ_SCREEN, PROJECTOR_BODY.y + PROJECTOR_BODY.d);
  const projBars = [
    { x: PROJ_SCREEN.x0 + 3, z: PROJ_SCREEN.z1 - 4.5, w: 12, h: 1.8, active: false },
    { x: PROJ_SCREEN.x0 + 3, z: PROJ_SCREEN.z1 - 9.5, w: 23, h: 2.2, active: false },
    { x: PROJ_SCREEN.x0 + 3, z: PROJ_SCREEN.z1 - 14.5, w: 26, h: 2.6, active: false },
    { x: PROJ_SCREEN.x0 + 3, z: PROJ_SCREEN.z0 + 4.5, w: 27, h: 3.4, active: true },
  ];
  addSlab(PROJECTOR_BODY, 14, 30, { tone: "mid", crease: "faint", inner: L(k.sideSeam(PROJECTOR_BODY, 20, P, 5), { tone: "faint" }) }, "s05.projBody", 5, 0.8, recessSvg(projRecess, projBars));

  addSlab(PHONE_DOCK, 0, 6, { tone: "lo", crease: "faint" }, "s05.phoneDock", 4, 0.5);
  const phoneRecess = buildRecess("ikilang-bench-phone-clip", PHONE_SCREEN, PHONE_BODY.y + PHONE_BODY.d);
  const phoneBars = [
    { x: PHONE_SCREEN.x0 + 2.2, z: PHONE_SCREEN.z1 - 4.2, w: 10, h: 1.8, active: false },
    { x: PHONE_SCREEN.x0 + 2.2, z: PHONE_SCREEN.z1 - 8.8, w: 13.5, h: 2.2, active: false },
    { x: PHONE_SCREEN.x0 + 2.2, z: PHONE_SCREEN.z0 + 4.2, w: 14.2, h: 3.0, active: true },
  ];
  addSlab(PHONE_BODY, 6, 26, { tone: "hi", crease: "faint" }, "s05.phoneBody", 4, 0.7, recessSvg(phoneRecess, phoneBars));
  addSlab(MUTE_BLOCK, 0, 5, { tone: "mid", crease: "faint" }, "s05.muteBlock", 3, 0.3);
  addCyl(120, 48, 2.8, 5, 3, 20, { tone: "mid", crease: "faint" }, "s05.muteCap", L(k.planOutline({ x: 118.6, y: 46.6, w: 2.8, d: 2.8, r: 0.6 }, 8, P, 2), { tone: "hi" }));

  return `<g>${parts.join("")}</g>`;
})();

// =========================================================================
// Settle Keys & Run Audit (--audit)
// =========================================================================
A.settle(R, P);
R.items.sort((a, b) => a.key - b.key);
A.auditOrExit(R, P, { crowd: [] });

// =========================================================================
// Pose Helpers & Standalone HTML Emission
// =========================================================================
const EX = k.axisVector(P, [1, 0, 0]);
const EY = k.axisVector(P, [0, 1, 0]);
const EZ = k.axisVector(P, [0, 0, 1]);
const fine = (v) => Math.round(v * 100) / 100;
const translateVec = ([dx, dy, dz], share = 1) => {
  if (share === 0) return "";
  return `translate(${fine((EX[0] * dx + EY[0] * dy + EZ[0] * dz) * share)} ${fine((EX[1] * dx + EY[1] * dy + EZ[1] * dz) * share)})`;
};

function dynamicPoseOf(carriageOffset, faderNorm, latencySec) {
  const carriageLeft = CARRIAGE_REST_X - CARRIAGE_W / 2 + carriageOffset;
  const carriageRight = carriageLeft + CARRIAGE_W;
  const coils = [
    k.coil(ROD_X_FROM, carriageLeft - 1, [ROD_Y_BACK, ROD_Z], COIL_R, COIL_TURNS, "x", P, 14),
    k.coil(ROD_X_FROM, carriageLeft - 1, [ROD_Y_FRONT, ROD_Z], COIL_R, COIL_TURNS, "x", P, 14),
    k.coil(carriageRight + 1, ROD_X_TO, [ROD_Y_BACK, ROD_Z], COIL_R, COIL_TURNS, "x", P, 14),
    k.coil(carriageRight + 1, ROD_X_TO, [ROD_Y_FRONT, ROD_Z], COIL_R, COIL_TURNS, "x", P, 14),
  ];
  const angle = dialAngleRad(latencySec);
  const sx = Math.sin(angle);
  const sy = -Math.cos(angle);
  const tail = at([DX - sx * 3.4, DY - sy * 3.4, DIAL_TOP + 0.2]);
  const tip = at([DX + sx * (DIAL_R - 4.0), DY + sy * (DIAL_R - 4.0), DIAL_TOP + 0.2]);
  const faderY = FADER_Y_MIN + (FADER_Y_MAX - FADER_Y_MIN) * Math.min(1, Math.max(0, faderNorm));
  return {
    carriageTransform: translateVec([carriageOffset, 0, 0]),
    faderTransform: translateVec([0, faderY, 0]),
    coilsBackD: coils.map((c) => c.back).join(""),
    coilsLeftFrontD: coils.slice(0, 2).map((c) => c.front).join(""),
    coilsRightFrontD: coils.slice(2, 4).map((c) => c.front).join(""),
    needleD: k.pathOf([tail, tip]),
  };
}

const restPose = dynamicPoseOf(CARRIAGE_REST_OFFSET, BENCH_CLAUSES[0].faderNorm, DIAL_REST_SEC);

const BENCH_SVG = k.figureSvg({
  width: WIDTH,
  height: HEIGHT,
  label: "The Live Translation Bench: five modular assemblies on a benchtop base plate.",
  body: [
    BASE_HTML,
    `<g class="bench-piece" data-piece="stage-01" data-stage="0">${STAGE01_BUILT.staticHtml}<g class="bench-fader" transform="${restPose.faderTransform}">${STAGE01_BUILT.faderCapSvg}</g>${STAGE01_BUILT.vuBankHtml}</g>`,
    `<g class="bench-piece" data-piece="stage-02" data-stage="1">${STAGE02_BUILT.vaultHtml}${STAGE02_BUILT.bedBackHtml}<path class="iso-line bench-coil-back" data-tone="lo" d="${restPose.coilsBackD}"/>${STAGE02_BUILT.rodsHtml}<path class="iso-line bench-coil-left-front" data-tone="mid" d="${restPose.coilsLeftFrontD}"/><g class="bench-carriage" transform="${restPose.carriageTransform}">${STAGE02_BUILT.carriageHtml}</g><path class="iso-line bench-coil-right-front" data-tone="mid" d="${restPose.coilsRightFrontD}"/>${STAGE02_BUILT.stopFrontHtml}</g>`,
    `<g class="bench-piece" data-piece="stage-03" data-stage="2">${STAGE03_HTML}<path class="iso-line bench-needle" data-tone="lit" data-free="" d="${restPose.needleD}"/></g>`,
    `<g class="bench-piece" data-piece="stage-04" data-stage="3">${STAGE04_HTML}</g>`,
    `<g class="bench-piece" data-piece="stage-05" data-stage="4">${STAGE05_HTML}</g>`,
  ],
});

const BENCH_CSS = `
.iso.ikilang-bench{
  --anatomy-card:#fafbf8;--anatomy-paper:#fafbf8;--anatomy-face:#ffffff;--anatomy-top:#ffffff;
  --anatomy-shade-0:#dce3d9;--anatomy-shade-1:#e5ebe2;--anatomy-shade-2:#edf2ea;--anatomy-shade-3:#f4f7f2;
  --anatomy-hi:#1b2d24;--anatomy-mid:#6d7f74;--anatomy-lo:#a5b4aa;--anatomy-faint:#cbd5ce;
  --anatomy-lit:#16563c;--anatomy-lit-top:#ffffff;--anatomy-lit-shade:#e3efe7;
  --anatomy-text:#31443a;--anatomy-strong:#16261f;--anatomy-muted:#55645b;
  --anatomy-halo:#6a7d71;--anatomy-halo-opacity:0.28;--anatomy-dot:#244033;
  --bench-screen-bg:#101713;--bench-screen-bar:#6f8679;--bench-screen-bar-lit:#86d9a4;
}
.iso.ikilang-bench[data-theme="dark"]{
  --anatomy-page:#0c130f;--anatomy-card:#141f19;--anatomy-paper:#141f19;--anatomy-face:#1c2a22;--anatomy-top:#1f2f26;
  --anatomy-shade-0:#0f1813;--anatomy-shade-1:#131e18;--anatomy-shade-2:#17241d;--anatomy-shade-3:#1b2a21;
  --anatomy-hi:#dce6de;--anatomy-mid:#748c7d;--anatomy-lo:#43574b;--anatomy-faint:#2b3c32;
  --anatomy-lit:#9be4b4;--anatomy-lit-top:#233a2d;--anatomy-lit-shade:#1a2d22;
  --anatomy-text:#cfdbd2;--anatomy-strong:#f0f4ee;--anatomy-muted:#a2b1a5;
  --anatomy-halo:#050806;--anatomy-halo-opacity:0.85;--anatomy-dot:#dce6de;
  --bench-screen-bg:#0c120f;--bench-screen-bar:#556c5f;--bench-screen-bar-lit:#86d9a4;
}
.iso.ikilang-bench[data-theme="light"]{--anatomy-page:#f1f4ef}
.ikilang-bench .iso-plate{padding:50px 20px 64px;border-radius:16px;box-shadow:0 0 0 1px var(--anatomy-mid);overflow:hidden}
.bench-stage{border-radius:10px;cursor:pointer}
.bench-stage[data-focus] .bench-piece:not([data-on]){--anatomy-hi:var(--anatomy-mid);--anatomy-mid:var(--anatomy-lo)}
.bench-piece[data-on]{--anatomy-hi:var(--anatomy-lit);--anatomy-mid:var(--anatomy-hi)}
.bench-piece[data-on] .iso-top{fill:var(--anatomy-lit-top)}
.bench-piece[data-on] .iso-shade{fill:var(--anatomy-lit-shade)}
.bench-piece[data-on] .iso-edge{stroke:var(--anatomy-lit)}
.bench-coil-back,.bench-coil-left-front,.bench-coil-right-front{stroke-linejoin:round}
.bench-needle{stroke-width:1.15}
.bench-screen-cavity{fill:var(--bench-screen-bg);stroke:none}
.bench-screen-bar{fill:var(--bench-screen-bar);stroke:none}
.bench-screen-bar.is-active{fill:var(--bench-screen-bar-lit)}
`;

const LIVE_SCRIPT = `
const P = ${JSON.stringify(P)};
const BENCH_STAGES = ${JSON.stringify(BENCH_STAGES)};
const BENCH_CLAUSES = ${JSON.stringify(BENCH_CLAUSES)};
const EXPLODE_VECTORS = ${JSON.stringify(EXPLODE_VECTORS)};
const STAGGER_OPEN = ${JSON.stringify(STAGGER_OPEN)};
const STAGGER_CLOSE = ${JSON.stringify(STAGGER_CLOSE)};
const STAGE_IDS = ${JSON.stringify(STAGE_IDS)};
const SPRING = ${JSON.stringify(SPRING)};
const CARRIAGE_REST_X = ${CARRIAGE_REST_X}, CARRIAGE_W = ${CARRIAGE_W}, COIL_R = ${COIL_R}, COIL_TURNS = ${COIL_TURNS};
const ROD_X_FROM = ${ROD_X_FROM}, ROD_X_TO = ${ROD_X_TO}, ROD_Y_BACK = ${ROD_Y_BACK}, ROD_Y_FRONT = ${ROD_Y_FRONT}, ROD_Z = ${ROD_Z};
const FADER_Y_MIN = ${FADER_Y_MIN}, FADER_Y_MAX = ${FADER_Y_MAX};
const DIAL_CENTER = ${JSON.stringify(DIAL_CENTER)}, DIAL_R = ${DIAL_R}, DIAL_TOP = ${DIAL_TOP};
const DIAL_MIN_SEC = ${DIAL_MIN_SEC}, DIAL_MAX_SEC = ${DIAL_MAX_SEC}, DIAL_SWEEP_START = ${DIAL_SWEEP_START}, DIAL_SWEEP_SPAN = ${DIAL_SWEEP_SPAN};

document.body.classList.add("ikilang-bench");
const stage = document.querySelector(".iso-stage");
const svg = stage.querySelector("svg");
const readout = document.querySelector("[data-readout]");
const still = matchMedia("(prefers-reduced-motion: reduce)");
const EX = axisVector(P, [1, 0, 0]), EY = axisVector(P, [0, 1, 0]), EZ = axisVector(P, [0, 0, 1]);
const fineVal = (v) => Math.round(v * 100) / 100;
const translateVec = ([dx, dy, dz], share = 1) => share === 0 ? "" : "translate(" + fineVal((EX[0]*dx + EY[0]*dy + EZ[0]*dz)*share) + " " + fineVal((EX[1]*dx + EY[1]*dy + EZ[1]*dz)*share) + ")";
const dialAngleRad = (s) => DIAL_SWEEP_START + (Math.min(DIAL_MAX_SEC, Math.max(DIAL_MIN_SEC, s)) - DIAL_MIN_SEC) / (DIAL_MAX_SEC - DIAL_MIN_SEC) * DIAL_SWEEP_SPAN;
const follow = (cur, target, dt, sec, calm) => calm || Math.abs(target - cur) < 1e-4 ? target : cur + (target - cur) * (1 - Math.exp(-dt / sec));

const stageEls = Object.fromEntries(STAGE_IDS.map((id) => [id, svg.querySelector('[data-piece="' + id + '"]')]));
const faderEl = svg.querySelector(".bench-fader");
const carriageEl = svg.querySelector(".bench-carriage");
const coilsBackEl = svg.querySelector(".bench-coil-back");
const coilsLeftFrontEl = svg.querySelector(".bench-coil-left-front");
const coilsRightFrontEl = svg.querySelector(".bench-coil-right-front");
const needleEl = svg.querySelector(".bench-needle");
const vuEls = [...svg.querySelectorAll(".bench-vu-item .iso-solid")];

const springs = Object.fromEntries(STAGE_IDS.map((id) => [id, { x: 0, v: 0, target: 0, pending: null }]));
let clock = 0, tourClock = 0, lastTs = 0, frameId = 0, touring = !still.matches, engaged = false, apart = false, activeStage = null;
let clauseIndex = 0, carriageOffset = ${CARRIAGE_REST_OFFSET}, faderNorm = BENCH_CLAUSES[0].faderNorm, latencySec = ${DIAL_REST_SEC};

function draw() {
  const carriageLeft = CARRIAGE_REST_X - CARRIAGE_W / 2 + carriageOffset;
  const carriageRight = carriageLeft + CARRIAGE_W;
  const coils = [
    coil(ROD_X_FROM, carriageLeft - 1, [ROD_Y_BACK, ROD_Z], COIL_R, COIL_TURNS, "x", P, 14),
    coil(ROD_X_FROM, carriageLeft - 1, [ROD_Y_FRONT, ROD_Z], COIL_R, COIL_TURNS, "x", P, 14),
    coil(carriageRight + 1, ROD_X_TO, [ROD_Y_BACK, ROD_Z], COIL_R, COIL_TURNS, "x", P, 14),
    coil(carriageRight + 1, ROD_X_TO, [ROD_Y_FRONT, ROD_Z], COIL_R, COIL_TURNS, "x", P, 14),
  ];
  const faderY = FADER_Y_MIN + (FADER_Y_MAX - FADER_Y_MIN) * Math.min(1, Math.max(0, faderNorm));
  faderEl.setAttribute("transform", translateVec([0, faderY, 0]));
  carriageEl.setAttribute("transform", translateVec([carriageOffset, 0, 0]));
  coilsBackEl.setAttribute("d", coils.map((c) => c.back).join(""));
  coilsLeftFrontEl.setAttribute("d", coils.slice(0, 2).map((c) => c.front).join(""));
  coilsRightFrontEl.setAttribute("d", coils.slice(2, 4).map((c) => c.front).join(""));
  const ang = dialAngleRad(latencySec);
  const sx = Math.sin(ang), sy = -Math.cos(ang);
  needleEl.setAttribute("d", pathOf([iso([DIAL_CENTER[0] - sx * 3.4, DIAL_CENTER[1] - sy * 3.4, DIAL_TOP + 0.2], P), iso([DIAL_CENTER[0] + sx * (DIAL_R - 4), DIAL_CENTER[1] + sy * (DIAL_R - 4), DIAL_TOP + 0.2], P)]));
  const c = BENCH_CLAUSES[clauseIndex];
  vuEls.forEach((el, idx) => { if (idx < c.vuBars) el.setAttribute("data-lit", ""); else el.removeAttribute("data-lit"); });
  let moving = false;
  for (const id of STAGE_IDS) {
    const sp = springs[id], el = stageEls[id];
    if (Math.abs(sp.x - sp.target) > 0.002 || sp.pending !== null) moving = true;
    if (sp.x === 0) el.removeAttribute("transform"); else el.setAttribute("transform", translateVec(EXPLODE_VECTORS[id], sp.x));
    if (activeStage !== null && BENCH_STAGES[activeStage].id === id) el.setAttribute("data-on", ""); else el.removeAttribute("data-on");
  }
  if (activeStage !== null) stage.setAttribute("data-focus", ""); else stage.removeAttribute("data-focus");
  const text = moving ? (apart ? "OPENING SEAMS…" : "CLOSING UP…") : activeStage !== null ? BENCH_STAGES[activeStage].readout : apart ? "APART · 5 BOUNDARIES · CORES SEALED" : "CLAUSE " + (clauseIndex + 1) + "/3 · +" + latencySec.toFixed(2) + " S (< 1.5 S)";
  if (readout.textContent !== text) readout.textContent = text;
}

function tick(now) {
  const dt = lastTs ? Math.min((now - lastTs) / 1000, 1 / 30) : 1 / 60;
  lastTs = now;
  clock += dt;
  const calm = still.matches;
  if (touring && !calm && !engaged) { tourClock += dt; clauseIndex = Math.floor(tourClock / 2.4) % BENCH_CLAUSES.length; }
  const cl = BENCH_CLAUSES[clauseIndex];
  carriageOffset = follow(carriageOffset, cl.carriageOffset, dt, 0.24, calm);
  faderNorm = follow(faderNorm, cl.faderNorm, dt, 0.18, calm);
  latencySec = follow(latencySec, cl.latencySec, dt, 0.22, calm);
  let springsMoving = false;
  for (const id of STAGE_IDS) {
    const sp = springs[id];
    if (sp.pending && clock >= sp.pending.at) { sp.target = sp.pending.value; sp.pending = null; }
    if (calm) { sp.x = sp.target; sp.v = 0; continue; }
    for (let s = 0; s < SPRING.substeps; s++) {
      const h = dt / SPRING.substeps;
      sp.v += ((sp.target - sp.x) * SPRING.stiffness - sp.v * SPRING.damping) * h;
      sp.x += sp.v * h;
    }
    if (Math.abs(sp.target - sp.x) < 2e-4 && Math.abs(sp.v) < 2e-4) { sp.x = sp.target; sp.v = 0; if (sp.pending !== null) springsMoving = true; }
    else springsMoving = true;
  }
  draw();
  if (springsMoving || carriageOffset !== cl.carriageOffset || faderNorm !== cl.faderNorm || latencySec !== cl.latencySec || (touring && !calm && !engaged)) {
    frameId = requestAnimationFrame(tick);
  } else frameId = 0;
}
const kick = () => { if (!frameId) { lastTs = 0; frameId = requestAnimationFrame(tick); } };

function setApart(next) {
  apart = next;
  const goal = apart ? 1 : 0;
  const order = apart ? STAGGER_OPEN : STAGGER_CLOSE;
  const calm = still.matches;
  let idx = 0;
  for (const id of order) {
    const sp = springs[id];
    if (sp.target === goal) sp.pending = null;
    else sp.pending = { value: goal, at: clock + (calm ? 0 : idx++ * SPRING.stagger) };
  }
  if (calm) {
    for (const id of STAGE_IDS) { const sp = springs[id]; if (sp.pending) { sp.target = sp.pending.value; sp.pending = null; } sp.x = sp.target; sp.v = 0; }
    draw();
  } else kick();
}

stage.addEventListener("pointermove", (e) => {
  engaged = true; touring = false;
  const hit = e.target.closest("[data-stage]");
  activeStage = hit ? Number(hit.getAttribute("data-stage")) : null;
  draw();
});
stage.addEventListener("pointerleave", () => { engaged = false; activeStage = null; draw(); });
stage.addEventListener("keydown", (e) => {
  if (e.key === " " || e.key === "Enter") { e.preventDefault(); engaged = true; touring = false; setApart(!apart); }
  else if (e.key === "Escape") { e.preventDefault(); activeStage = null; if (apart) setApart(false); else draw(); }
  else if (e.key === "ArrowRight") { e.preventDefault(); engaged = true; touring = false; activeStage = ((activeStage ?? -1) + 1) % 5; clauseIndex = activeStage % 3; draw(); kick(); }
  else if (e.key === "ArrowLeft") { e.preventDefault(); engaged = true; touring = false; activeStage = ((activeStage ?? 0) + 4) % 5; clauseIndex = activeStage % 3; draw(); kick(); }
});
draw();
if (!still.matches) setTimeout(() => { if (!engaged) { touring = true; kick(); } }, 1400);
`;

const BODY = k.plateHtml({
  fig: "Fig 1",
  title: "Live translation bench",
  hint: "Hover stages · Space to explode",
  readout: `CLAUSE 1/3 · +${DIAL_REST_SEC.toFixed(2)} S (< 1.5 S)`,
  keys: [
    { mark: "lit", label: "Active stage · +1.02 s dial needle" },
    { mark: "raised", label: "Sealed black-box core (02 & 03)" },
    { mark: "edge", label: "Public 16 kHz / QR boundary" },
  ],
  caption: "Soundboard 16 kHz PCM -> sealed translation & guardrail vaults -> 0 PII QR & projector displays.",
  body: `<div class="bench-stage iso-stage" tabindex="0" role="group" aria-label="Interactive isometric translation bench">${BENCH_SVG}</div>`,
});

mkdirSync(SCRATCH_DIR, { recursive: true });
const outName = THEME === "light" ? "bench-light.html" : "bench.html";
const outPath = join(SCRATCH_DIR, outName);
writeFileSync(
  outPath,
  k.pageHtml({
    title: "Live translation bench",
    theme: THEME,
    width: 720,
    body: `<style>${BENCH_CSS}</style>${BODY}`,
    script: kitScript() + LIVE_SCRIPT,
  }),
);
console.log("wrote", outPath);
