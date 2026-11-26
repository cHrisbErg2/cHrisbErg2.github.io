import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import * as k from "file:///C:/Users/chris/.gemini/config/skills/anatomy/kit/iso-kit.mjs";
import * as G from "file:///C:/Users/chris/.gemini/config/skills/anatomy/kit/lathe.mjs";
import * as A from "file:///C:/Users/chris/.gemini/config/skills/anatomy/kit/audit.mjs";
import { kitScript } from "file:///C:/Users/chris/.gemini/config/skills/anatomy/scripts/inline-kit.mjs";

const SCRATCH_DIR = "C:\\Users\\chris\\.gemini\\antigravity\\brain\\1eea7ef0-b32a-4c1f-885f-607412248ff2\\scratch";
const THEME = process.argv.includes("--light") ? "light" : "dark";

// =========================================================================
// Domain & Motion Model (mirrors src/components/anatomy/bench/model.ts)
// =========================================================================
const STAGE_IDS = ["stage-01", "stage-02", "stage-03", "stage-04", "stage-05"];

const BENCH_STAGES = [
  { id: "stage-01", index: 0, step: 1, name: "Audio ingest", readout: "01 AUDIO · 16 KHZ MONO PCM" },
  { id: "stage-02", index: 1, step: 2, name: "Streaming translation", readout: "02 TRANSLATION · CLOUD / LOCAL" },
  { id: "stage-03", index: 2, step: 3, name: "Quality & context", readout: "03 GUARDRAIL · +1.02 S REPLAY" },
  { id: "stage-04", index: 3, step: 4, name: "Anonymous telemetry", readout: "04 ZERO PII · PLUGIN DOCK" },
  { id: "stage-05", index: 4, step: 5, name: "Audience UI", readout: "05 CAPTIONS LIVE · AUDIO SOON" },
];

const BENCH_CLAUSES = [
  { id: "clause-1", latencySec: 1.02, vuBars: 6, packetOffset: 8.0 },
  { id: "clause-2", latencySec: 1.14, vuBars: 7, packetOffset: 24.0 },
  { id: "clause-3", latencySec: 1.06, vuBars: 5, packetOffset: 16.0 },
];

const LATENCY_MAX_SEC = 2.0;
const LATENCY_TARGET_SEC = 1.5;
const LATENCY_REST_SEC = BENCH_CLAUSES[0].latencySec;
const PACKET_REST_OFFSET = BENCH_CLAUSES[0].packetOffset;

const SPRING = { stagger: 0.035, stiffness: 64, damping: 14.2, substeps: 4 };
const STAGGER_OPEN = ["stage-05", "stage-01", "stage-04", "stage-03", "stage-02"];
const STAGGER_CLOSE = ["stage-02", "stage-03", "stage-04", "stage-01", "stage-05"];

const EXPLODE_VECTORS = {
  "stage-01": [-22, -10, 20],
  "stage-02": [-6, -16, 36],
  "stage-03": [4, 14, 42],
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

const CAPTURE_TERMINAL = { x: -156, y: -32, w: 56, d: 64, r: 4 };
const VAULT_A = { x: -80, y: -62, w: 96, d: 44, r: 4 };
const STREAM_BUS_BED = { x: -82, y: -4, w: 84, d: 42, r: 3 };
const CASSETTE_B = { x: 28, y: -56, w: 54, d: 40, r: 4 };
const TELEMETRY_PANEL = { x: 26, y: -2, w: 52, d: 36, r: 3 };

const PACKET_REST_X = -68;
const PACKET_W = 22;

const PLUGIN_HUB = { x: 96, y: -52, w: 56, d: 38, r: 3 };
const PROJECTOR_BODY = { x: 120, y: 2, w: 40, d: 10, r: 2.5 };
const PHONE_BODY = { x: 128, y: 31, w: 24, d: 9, r: 2 };

const stageExtremes = [
  [-166 + EXPLODE_VECTORS["stage-01"][0], -34 + EXPLODE_VECTORS["stage-01"][1], 36 + EXPLODE_VECTORS["stage-01"][2]],
  [-82 + EXPLODE_VECTORS["stage-02"][0], -64 + EXPLODE_VECTORS["stage-02"][1], 37 + EXPLODE_VECTORS["stage-02"][2]],
  [84 + EXPLODE_VECTORS["stage-03"][0], 34 + EXPLODE_VECTORS["stage-03"][1], 42 + EXPLODE_VECTORS["stage-03"][2]],
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
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (points, style) => k.dotsSvg(points, style);
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

function recessSvg(recess, bars, extraInner = "") {
  const shades = recess.shadesD.map((d, idx) => (d ? `<path class="iso-shade" data-shade="${idx}" d="${d}"/>` : "")).join("");
  const rects = bars
    .map((b) => `<rect class="${b.active ? "bench-screen-bar is-active" : "bench-screen-bar"}" x="${b.x}" y="${-(b.z + b.h)}" width="${b.w}" height="${b.h}" rx="0.6"/>`)
    .join("");
  return `<g class="bench-recess"><defs><clipPath id="${recess.clipId}"><path transform="${recess.faceTransform}" d="${recess.clipPathD}"/></clipPath></defs><g clip-path="url(#${recess.clipId})">${recess.topsD ? `<path class="iso-top" d="${recess.topsD}"/>` : ""}${shades}<g transform="${recess.backTransform}"><path class="bench-screen-cavity" d="${recess.shapeD}"/>${rects}${extraInner}<path class="iso-line" data-tone="faint" d="${recess.shapeD}"/></g></g><g transform="${recess.faceTransform}"><path class="iso-line" data-tone="lo" d="${recess.shapeD}"/></g></g>`;
}

// =========================================================================
// 00 ARCHITECTURE PLATFORM DECK
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

// =========================================================================
// STAGE 01: Audio Stream Capture Terminal
// =========================================================================
const S01_PLINTH = { x: -158, y: -34, w: 60, d: 68, r: 4 };
const S01_DISPLAY_STAND = { x: -152, y: -24, w: 32, d: 10, r: 2.2 };
const AUDIO_SCREEN = { x0: -149, x1: -123, z0: 23.5, z1: 35.5, r: 1.6, depth: 1.4 };
const S01_DECK_STRIP = { x: -152, y: 2, w: 32, d: 18, r: 2 };
const S01_INGRESS_PORT = { x: -160, y: -4, w: 4, d: 12, r: 1.5 };
const S01_OUT_STUB = { x: -100, y: -4, w: 5, d: 10, r: 1.2 };
const S01_VU_PLANS = Array.from({ length: 8 }, (_, idx) => ({ x: -115, y: -24 + idx * 5.2, w: 11, d: 3.6, r: 0.8 }));

const STAGE01_BUILT = (() => {
  const owner = "stage-01";
  const plinthSvg = S(solid(S01_PLINTH, 0, 3, 5, 0.4), { tone: "lo", crease: "faint" });
  putItem("stage-01", centerOf(S01_PLINTH, 0, 3), plinthSvg, [recSlab(S01_PLINTH, 0, 3, { name: "s01.plinth", owner }, 5)]);

  const ingressSvg = S(solid(S01_INGRESS_PORT, 8, 10, 3, 0.4), { tone: "mid", crease: "faint" });
  putItem("stage-01", centerOf(S01_INGRESS_PORT, 8, 10), ingressSvg, [recSlab(S01_INGRESS_PORT, 8, 10, { name: "s01.ingressPort", owner }, 3)]);

  const boxSvg =
    S(solid(CAPTURE_TERMINAL, 3, 18, 6, 1.0), { tone: "mid", crease: "faint", inner: L(k.sideSeam(CAPTURE_TERMINAL, 15, P, 6), { tone: "faint" }) }) +
    L(k.planOutline(k.insetPlan(CAPTURE_TERMINAL, 3), 21, P, 5), { tone: "faint" }) +
    D(k.corners(CAPTURE_TERMINAL, 4.5).map(([x, y]) => at([x, y, 21])), { size: 0.45, tone: "mid" });
  putItem("stage-01", centerOf(CAPTURE_TERMINAL, 3, 18), boxSvg, [recSlab(CAPTURE_TERMINAL, 3, 18, { name: "s01.box", owner }, 6)]);

  const stubSvg = S(solid(S01_OUT_STUB, 9, 8, 3, 0.3), { tone: "mid", crease: "faint" });
  putItem("stage-01", centerOf(S01_OUT_STUB, 9, 8), stubSvg, [recSlab(S01_OUT_STUB, 9, 8, { name: "s01.outStub", owner }, 3)]);

  const audioRecess = buildRecess("ikilang-bench-audio-clip", AUDIO_SCREEN, S01_DISPLAY_STAND.y + S01_DISPLAY_STAND.d);
  const audioWaveBars = [
    { x: AUDIO_SCREEN.x0 + 3, z: AUDIO_SCREEN.z0 + 3.5, w: 3.2, h: 4.5, active: false },
    { x: AUDIO_SCREEN.x0 + 8, z: AUDIO_SCREEN.z0 + 2.5, w: 3.2, h: 7.0, active: true },
    { x: AUDIO_SCREEN.x0 + 13, z: AUDIO_SCREEN.z0 + 3.0, w: 3.2, h: 5.5, active: true },
    { x: AUDIO_SCREEN.x0 + 18, z: AUDIO_SCREEN.z0 + 2.0, w: 3.2, h: 8.0, active: true },
    { x: AUDIO_SCREEN.x0 + 23, z: AUDIO_SCREEN.z0 + 4.0, w: 2.5, h: 3.5, active: false },
  ];
  const displaySvg =
    S(solid(S01_DISPLAY_STAND, 21, 17, 4, 0.6), { tone: "hi", crease: "faint", inner: L(k.sideSeam(S01_DISPLAY_STAND, 24, P, 4), { tone: "faint" }) }) +
    recessSvg(audioRecess, audioWaveBars);
  putItem("stage-01", centerOf(S01_DISPLAY_STAND, 21, 17), displaySvg, [recSlab(S01_DISPLAY_STAND, 21, 17, { name: "s01.displayStand", owner }, 4)]);

  const deckStripSvg =
    S(solid(S01_DECK_STRIP, 21, 2, 4, 0.3), { tone: "mid", crease: "faint" }) +
    L(k.planOutline(k.insetPlan(S01_DECK_STRIP, 2.2), 23, P, 3), { tone: "faint" });
  putItem("stage-01", centerOf(S01_DECK_STRIP, 21, 2), deckStripSvg, [recSlab(S01_DECK_STRIP, 21, 2, { name: "s01.deckStrip", owner }, 4)]);

  const vuSvgs = S01_VU_PLANS.map((plan, idx) => {
    const svg = S(solid(plan, 21, 2.2, 3, 0.3), { tone: "mid", crease: "none", lit: idx < BENCH_CLAUSES[0].vuBars });
    putItem("stage-01", centerOf(plan, 21, 2.2), svg, [recSlab(plan, 21, 2.2, { name: `s01.vu.${idx}`, owner }, 3)]);
    return `<g class="bench-vu-item">${svg}</g>`;
  });

  const staticHtml = `<g>${plinthSvg}${ingressSvg}${boxSvg}${stubSvg}${displaySvg}${deckStripSvg}</g>`;
  return { staticHtml, vuBankHtml: `<g class="bench-vu-bank">${vuSvgs.join("")}</g>` };
})();

// =========================================================================
// STAGE 02: Context-Aware Translation Core (Cloud/Local Host + Sealed Vault A)
// =========================================================================
const VAULT_PLINTH = { x: -82, y: -64, w: 100, d: 48, r: 3 };
const VAULT_SHIELD = { x: -66, y: -52, w: 64, d: 24, r: 2 };
const VAULT_STUDS = k.corners(VAULT_A, 5.5);
const VAULT_RIBS = Array.from({ length: 6 }, (_, i) => ({ x: -66 + i * 11, y: -62, w: 4.8, d: 8, r: 1 }));
const VAULT_RAIL = { x: -34, y: -18, w: 34, d: 6, r: 1 };
const VAULT_GLAND = { x: 16, y: -45, w: 5, d: 10, r: 1.5 };

const CLOUD_CARTRIDGE = { x: -74, y: 2, w: 30, d: 14, r: 2 };
const LOCAL_CARTRIDGE = { x: -38, y: 2, w: 30, d: 14, r: 2 };
const BUS_CHANNEL = { x: -78, y: 21, w: 76, d: 12, r: 2 };
const PACKET_BLOCK = { x: PACKET_REST_X, y: 22.5, w: PACKET_W, d: 9, r: 1.5 };

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

  const bedSvg = S(solid(STREAM_BUS_BED, 0, 3, 4, 0.4), { tone: "lo", crease: "faint" }) + L(k.planOutline(k.insetPlan(STREAM_BUS_BED, 3), 3, P, 4), { tone: "faint" });
  putItem("stage-02", centerOf(STREAM_BUS_BED, 0, 3), bedSvg, [recSlab(STREAM_BUS_BED, 0, 3, { name: "s02.busBed", owner }, 4)]);

  const cloudSvg = S(solid(CLOUD_CARTRIDGE, 3, 8, 4, 0.5), { tone: "hi", crease: "faint" }) + L(k.planOutline(k.insetPlan(CLOUD_CARTRIDGE, 2.2), 11, P, 3), { tone: "faint" });
  putItem("stage-02", centerOf(CLOUD_CARTRIDGE, 3, 8), cloudSvg, [recSlab(CLOUD_CARTRIDGE, 3, 8, { name: "s02.cloudCartridge", owner }, 4)]);

  const localSvg = S(solid(LOCAL_CARTRIDGE, 3, 8, 4, 0.5), { tone: "mid", crease: "faint" }) + L(k.planOutline(k.insetPlan(LOCAL_CARTRIDGE, 2.2), 11, P, 3), { tone: "faint" });
  putItem("stage-02", centerOf(LOCAL_CARTRIDGE, 3, 8), localSvg, [recSlab(LOCAL_CARTRIDGE, 3, 8, { name: "s02.localCartridge", owner }, 4)]);

  const busChSvg = S(solid(BUS_CHANNEL, 3, 3, 3, 0.3), { tone: "lo", crease: "faint" });
  putItem("stage-02", centerOf(BUS_CHANNEL, 3, 3), busChSvg, [recSlab(BUS_CHANNEL, 3, 3, { name: "s02.busChannel", owner }, 3)]);

  const packetSvg = S(solid(PACKET_BLOCK, 6, 6, 4, 0.5), { tone: "hi", crease: "lo", lit: true }) + L(k.planOutline(k.insetPlan(PACKET_BLOCK, 2), 12, P, 3), { tone: "faint" });
  putItem("stage-02", centerOf(PACKET_BLOCK, 6, 6), packetSvg, [recSlab(PACKET_BLOCK, 6, 6, { name: "s02.packetBlock", owner }, 4)]);

  return {
    vaultHtml,
    busStaticHtml: `<g>${bedSvg}${cloudSvg}${localSvg}${busChSvg}</g>`,
    packetSvg,
  };
})();

// =========================================================================
// STAGE 03: Sealed Guardrail Cassette B + Digital Latency Monitor
// =========================================================================
const CASSETTE_BASE = { x: 26, y: -58, w: 58, d: 44, r: 3 };
const CASSETTE_PLATE = { x: 35, y: -49, w: 40, d: 26, r: 2 };
const CASSETTE_STUDS = k.corners(CASSETTE_B, 4.2);
const CASSETTE_LATCH = { x: 24, y: -41, w: 4, d: 10, r: 1 };
const TELEMETRY_BRIDGE = { x: 2, y: 21, w: 24, d: 10, r: 1.5 };
const TELEMETRY_MONITOR = { x: 32, y: 12, w: 40, d: 11, r: 2.5 };
const LATENCY_SCREEN = { x0: 35.5, x1: 68.5, z0: 14, z1: 36, r: 1.8, depth: 1.6 };
const STATUS_POD = { x: 35, y: 26, w: 34, d: 6, r: 1.5 };

const LATENCY_META = {
  x0: LATENCY_SCREEN.x0 + 3,
  zTrack: LATENCY_SCREEN.z0 + 5.5,
  wMax: 27,
  hBar: 4.5,
  xTarget: LATENCY_SCREEN.x0 + 3 + 27 * (1.5 / 2.0),
  zTopLine: LATENCY_SCREEN.z1 - 5.5,
};

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

  addSlab(TELEMETRY_PANEL, 0, 4, { tone: "lo", crease: "faint" }, "s03.telemetryStand", 4, 0.5, D(k.corners(TELEMETRY_PANEL, 4).map(([x, y]) => at([x, y, 4])), { size: 0.45, tone: "mid" }));
  addSlab(TELEMETRY_BRIDGE, 3, 4, { tone: "mid", crease: "faint" }, "s03.telemetryBridge", 3, 0.3);

  const monitorRecess = buildRecess("ikilang-bench-latency-clip", LATENCY_SCREEN, TELEMETRY_MONITOR.y + TELEMETRY_MONITOR.d);
  const restBarW = Math.round((LATENCY_REST_SEC / LATENCY_MAX_SEC) * LATENCY_META.wMax * 10) / 10;
  const staticLatencyBars = [
    { x: LATENCY_META.x0, z: LATENCY_META.zTopLine, w: 12, h: 1.8, active: false },
    { x: LATENCY_META.x0, z: LATENCY_META.zTopLine - 4.2, w: 20, h: 1.8, active: false },
  ];
  const dynamicBarExtra =
    `<rect class="bench-screen-bar" x="${LATENCY_META.x0}" y="${-(LATENCY_META.zTrack + LATENCY_META.hBar)}" width="${LATENCY_META.wMax}" height="${LATENCY_META.hBar}" rx="0.8"/>` +
    `<rect class="bench-screen-bar is-active bench-latency-bar" x="${LATENCY_META.x0}" y="${-(LATENCY_META.zTrack + LATENCY_META.hBar)}" width="${restBarW}" height="${LATENCY_META.hBar}" rx="0.8"/>` +
    `<line class="iso-line" data-tone="hi" data-free="" x1="${LATENCY_META.xTarget}" y1="${-(LATENCY_META.zTrack - 1.5)}" x2="${LATENCY_META.xTarget}" y2="${-(LATENCY_META.zTrack + LATENCY_META.hBar + 1.5)}"/>`;

  addSlab(
    TELEMETRY_MONITOR,
    4,
    36,
    { tone: "hi", crease: "faint", inner: L(k.sideSeam(TELEMETRY_MONITOR, 10, P, 5), { tone: "faint" }) },
    "s03.monitorBody",
    5,
    0.8,
    recessSvg(monitorRecess, staticLatencyBars, dynamicBarExtra),
  );
  addSlab(STATUS_POD, 4, 3, { tone: "mid", crease: "faint" }, "s03.statusPod", 3, 0.3);

  return `<g>${parts.join("")}</g>`;
})();

// =========================================================================
// STAGE 04: Zero-PII Privacy Shield + Media/Hosting Plugin Dock
// =========================================================================
const S04_PLINTH = { x: 94, y: -54, w: 62, d: 42, r: 3 };
const PRIVACY_SHIELD_PLAN = { x: 96, y: -52, w: 26, d: 36, r: 3 };
const PLUGIN_DOCK_PLAN = { x: 126, y: -52, w: 28, d: 36, r: 3 };
const PLUGIN_SLOTS = [0, 1, 2].map((i) => ({ x: 129, y: -48 + i * 10.5, w: 22, d: 7.5, r: 1.4 }));

const STAGE04_HTML = (() => {
  const owner = "stage-04";
  const parts = [];
  const addSlab = (plan, z, h, style, name, steps = 4, bevel = 0.4, extra = "") => {
    const svg = S(solid(plan, z, h, steps, bevel), style) + extra;
    putItem("stage-04", centerOf(plan, z, h), svg, [recSlab(plan, z, h, { name, owner }, steps)]);
    parts.push(svg);
  };

  addSlab(S04_PLINTH, 0, 3, { tone: "lo", crease: "faint" }, "s04.plinth", 4, 0.4);
  addSlab(
    PRIVACY_SHIELD_PLAN,
    3,
    17,
    { tone: "mid", crease: "faint", inner: L(k.sideSeam(PRIVACY_SHIELD_PLAN, 14, P, 5), { tone: "faint" }) },
    "s04.privacyBlock",
    5,
    0.8,
    L(k.ring(109, -34, 7.5, 20, P, 24), { tone: "hi" }) +
      L(k.ring(109, -34, 4.0, 20, P, 20), { tone: "mid" }) +
      D([at([109, -34, 20])], { size: 0.55, tone: "hi" }),
  );
  addSlab(PLUGIN_DOCK_PLAN, 3, 10, { tone: "mid", crease: "faint" }, "s04.pluginDock", 4, 0.6);
  PLUGIN_SLOTS.forEach((plan, i) => {
    addSlab(plan, 13, 5, { tone: "hi", crease: "faint" }, `s04.pluginSlot.${i}`, 3, 0.3, L(k.planOutline(k.insetPlan(plan, 1.4), 18, P, 2), { tone: "faint" }));
  });

  return `<g>${parts.join("")}</g>`;
})();

// =========================================================================
// STAGE 05: QR Web App + Projector + Phone + Future Voice Audio Capsule
// =========================================================================
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
const AUDIO_CAPSULE_BASE = { x: 112, y: 42, w: 12, d: 10, r: 2 };
const AUDIO_CAPSULE_TOP = { x: 114, y: 44, w: 8, d: 6, r: 1.2 };

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
  addSlab(AUDIO_CAPSULE_BASE, 0, 5, { tone: "mid", crease: "faint" }, "s05.audioCapsuleBase", 3, 0.4);
  addSlab(AUDIO_CAPSULE_TOP, 5, 3, { tone: "hi", crease: "faint" }, "s05.audioCapsuleTop", 3, 0.3, L(k.planOutline({ x: 115.5, y: 45.5, w: 5, d: 3, r: 0.6 }, 8, P, 2), { tone: "mid" }));

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

const restPacketTransform = translateVec([PACKET_REST_OFFSET, 0, 0]);

const BENCH_SVG = k.figureSvg({
  width: WIDTH,
  height: HEIGHT,
  label: "Interactive isometric software translation pipeline: five modular software stages.",
  body: [
    BASE_HTML,
    `<g class="bench-piece" data-piece="stage-01" data-stage="0">${STAGE01_BUILT.staticHtml}${STAGE01_BUILT.vuBankHtml}</g>`,
    `<g class="bench-piece" data-piece="stage-02" data-stage="1">${STAGE02_BUILT.vaultHtml}${STAGE02_BUILT.busStaticHtml}<g class="bench-packet" transform="${restPacketTransform}">${STAGE02_BUILT.packetSvg}</g></g>`,
    `<g class="bench-piece" data-piece="stage-03" data-stage="2">${STAGE03_HTML}</g>`,
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
const LATENCY_MAX_SEC = ${LATENCY_MAX_SEC};
const LATENCY_W_MAX = ${LATENCY_META.wMax};

document.body.classList.add("ikilang-bench");
const stage = document.querySelector(".iso-stage");
const svg = stage.querySelector("svg");
const readout = document.querySelector("[data-readout]");
const still = matchMedia("(prefers-reduced-motion: reduce)");
const EX = axisVector(P, [1, 0, 0]), EY = axisVector(P, [0, 1, 0]), EZ = axisVector(P, [0, 0, 1]);
const fineVal = (v) => Math.round(v * 100) / 100;
const translateVec = ([dx, dy, dz], share = 1) => share === 0 ? "" : "translate(" + fineVal((EX[0]*dx + EY[0]*dy + EZ[0]*dz)*share) + " " + fineVal((EX[1]*dx + EY[1]*dy + EZ[1]*dz)*share) + ")";
const follow = (cur, target, dt, sec, calm) => calm || Math.abs(target - cur) < 1e-4 ? target : cur + (target - cur) * (1 - Math.exp(-dt / sec));

const stageEls = Object.fromEntries(STAGE_IDS.map((id) => [id, svg.querySelector('[data-piece="' + id + '"]')]));
const packetEl = svg.querySelector(".bench-packet");
const latencyBarEl = svg.querySelector(".bench-latency-bar");
const vuEls = [...svg.querySelectorAll(".bench-vu-item .iso-solid")];

const springs = Object.fromEntries(STAGE_IDS.map((id) => [id, { x: 0, v: 0, target: 0, pending: null }]));
let clock = 0, tourClock = 0, lastTs = 0, frameId = 0, touring = !still.matches, engaged = false, apart = false, activeStage = null;
let clauseIndex = 0, packetOffset = ${PACKET_REST_OFFSET}, latencySec = ${LATENCY_REST_SEC};

function draw() {
  packetEl.setAttribute("transform", translateVec([packetOffset, 0, 0]));
  const clampedLatency = Math.min(LATENCY_MAX_SEC, Math.max(0.1, latencySec));
  const wBar = Math.round((clampedLatency / LATENCY_MAX_SEC) * LATENCY_W_MAX * 10) / 10;
  latencyBarEl.setAttribute("width", String(wBar));
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
  const text = moving ? (apart ? "SEPARATING MODULES…" : "ASSEMBLING PIPELINE…") : activeStage !== null ? BENCH_STAGES[activeStage].readout : apart ? "APART · 5 SOFTWARE MODULES · CORES SEALED" : "STREAM " + (clauseIndex + 1) + "/3 · +" + latencySec.toFixed(2) + " S REPLAY";
  if (readout.textContent !== text) readout.textContent = text;
}

function tick(now) {
  const dt = lastTs ? Math.min((now - lastTs) / 1000, 1 / 30) : 1 / 60;
  lastTs = now;
  clock += dt;
  const calm = still.matches;
  if (touring && !calm && !engaged) { tourClock += dt; clauseIndex = Math.floor(tourClock / 2.4) % BENCH_CLAUSES.length; }
  const cl = BENCH_CLAUSES[clauseIndex];
  packetOffset = follow(packetOffset, cl.packetOffset, dt, 0.24, calm);
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
  if (springsMoving || packetOffset !== cl.packetOffset || latencySec !== cl.latencySec || (touring && !calm && !engaged)) {
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
  title: "Streaming software pipeline",
  hint: "Hover modules · Space to explode",
  readout: `STREAM 1/3 · +${LATENCY_REST_SEC.toFixed(2)} S REPLAY`,
  keys: [
    { mark: "lit", label: "Active stream · +1.02 s live replay" },
    { mark: "raised", label: "Sealed core (Cloud / Local Host)" },
    { mark: "edge", label: "0 PII · Plugins · Future audio" },
  ],
  caption: "16 kHz PCM stream -> context-aware translation (Cloud today / Local Host future) -> 0 PII guardrails & plugins -> live captions + future expressive audio.",
  body: `<div class="bench-stage iso-stage" tabindex="0" role="group" aria-label="Interactive isometric software translation pipeline">${BENCH_SVG}</div>`,
});

mkdirSync(SCRATCH_DIR, { recursive: true });
const outName = THEME === "light" ? "bench-light.html" : "bench.html";
const outPath = join(SCRATCH_DIR, outName);
writeFileSync(
  outPath,
  k.pageHtml({
    title: "Streaming software pipeline",
    theme: THEME,
    width: 720,
    body: `<style>${BENCH_CSS}</style>${BODY}`,
    script: kitScript() + LIVE_SCRIPT,
  }),
);
console.log("wrote", outPath);
