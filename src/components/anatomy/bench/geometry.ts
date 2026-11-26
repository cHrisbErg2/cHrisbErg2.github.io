import {
  cameraOf,
  circleRing,
  corners,
  cylinder,
  extrude,
  haloOf,
  insetPlan,
  joinPaths,
  knurl,
  lineOnTop,
  onTop,
  pathOf,
  planOutline,
  radialTicks,
  ring,
  roundedPlan,
  segment,
  sideArc,
  sideMatrix,
  sideSeam,
  slabOf,
  topMatrix,
  topTicks,
  type Flat,
  type Plan,
  type Plane,
  type Point3,
  type SolidPaths,
} from "../../iso/iso-kit";
import { DIAL_MAX_SEC, DIAL_MIN_SEC, DIAL_SWEEP_SPAN, DIAL_SWEEP_START, DIAL_TARGET_SEC } from "./model";
import {
  CARRIAGE_BED,
  CARRIAGE_H,
  CARRIAGE_REST_X,
  CARRIAGE_W,
  CARRIAGE_Z,
  CASSETTE_B,
  COUNTER_BODY,
  DIAL_CENTER,
  DIAL_H,
  DIAL_R,
  DIAL_TOP,
  DIAL_Z,
  FADER_X,
  FADER_Y_MAX,
  FADER_Y_MIN,
  FADER_Z,
  FOOT_H,
  P,
  PHONE_BODY,
  PLATE,
  PLATE_H,
  PROJECTOR_BODY,
  ROD_HALF,
  ROD_X_FROM,
  ROD_X_TO,
  ROD_Y_BACK,
  ROD_Y_FRONT,
  ROD_Z,
  SOUNDBOARD_BOX,
  VAULT_A,
  at,
  byDepth,
} from "./view";

const solid = (plan: Plan, z: number, h: number, steps = 6, bevel = 0): SolidPaths => slabOf(plan, z, h, P, steps, bevel);
const cyl = (cx: number, cy: number, r: number, z: number, h: number, steps = 32, bevel = 0): SolidPaths =>
  cylinder(cx, cy, r, z, h, P, steps, bevel);

function flatRect(x0: number, z0: number, x1: number, z1: number, r: number, steps = 5): string {
  return pathOf(
    roundedPlan({ x: x0, y: z0, w: x1 - x0, d: z1 - z0, r }, steps).map(([u, z]) => [u, -z]),
    true,
  );
}

export interface RecessSpec {
  clipId: string;
  clipPathD: string;
  faceTransform: string;
  backTransform: string;
  topsD: string;
  shadesD: [string, string, string, string];
  shapeD: string;
}

function buildRecess(
  clipId: string,
  { x0, x1, z0, z1, r, depth }: { x0: number; x1: number; z0: number; z1: number; r: number; depth: number },
  y: number,
): RecessSpec {
  const ringPts = roundedPlan({ x: x0, y: z0, w: x1 - x0, d: z1 - z0, r }, 5);
  const cx = (x0 + x1) / 2;
  const cz = (z0 + z1) / 2;
  const { sinA } = cameraOf(P);
  const tops: string[] = [];
  const sides: [string[], string[], string[], string[]] = [[], [], [], []];
  ringPts.forEach(([ax, az], index) => {
    const [bx, bz] = ringPts[(index + 1) % ringPts.length]!;
    const length = Math.hypot(bx - ax, bz - az) || 1;
    let nx = (bz - az) / length;
    let nz = -(bx - ax) / length;
    if (nx * (cx - (ax + bx) / 2) + nz * (cz - (az + bz) / 2) < 0) {
      nx = -nx;
      nz = -nz;
    }
    if (nx <= 0 && nz <= 0) return;
    const quad = pathOf([at([ax, y, az]), at([bx, y, bz]), at([bx, y - depth, bz]), at([ax, y - depth, az])], true);
    if (nz >= nx) {
      tops.push(quad);
    } else {
      const shadeIdx = Math.min(3, Math.max(0, Math.floor(((nx * -sinA + 1) / 2) * 4)));
      sides[shadeIdx]!.push(quad);
    }
  });
  const shapeD = flatRect(x0, z0, x1, z1, r, 5);
  const faceTransform = sideMatrix([0, y], 0, P, "left");
  const backTransform = sideMatrix([0, y - depth], 0, P, "left");
  return {
    clipId,
    clipPathD: shapeD,
    faceTransform,
    backTransform,
    topsD: tops.join(""),
    shadesD: [sides[0].join(""), sides[1].join(""), sides[2].join(""), sides[3].join("")],
    shapeD,
  };
}

// =========================================================================
// 00 BENCH BASE (Stationary: 11 extruded solids)
// =========================================================================
const FEET_PTS = byDepth(corners(PLATE, 22));
const BASE_SCREWS = corners(PLATE, 10);
const RULER_STRIP: Plan = { x: -102, y: 61, w: 238, d: 7, r: 1 };
const RULER_TICKS = topTicks(RULER_STRIP.x + 6, RULER_STRIP.x + RULER_STRIP.w - 6, 4, 5, RULER_STRIP.y, 0.7, [2.0, 3.6], P);
const NAMEPLATE: Plan = { x: -156, y: 58, w: 46, d: 12, r: 1.5 };

export const BASE_ART = {
  halo: haloOf(PLATE, -PLATE_H - FOOT_H, PLATE_H, P),
  feet: FEET_PTS.map(([x, y]) => ({
    flange: cyl(x, y, 7.0, -PLATE_H - FOOT_H, 1.6, 28),
    pad: cyl(x, y, 5.4, -PLATE_H - FOOT_H + 1.6, FOOT_H - 1.6, 28),
  })),
  slab: solid(PLATE, -PLATE_H, PLATE_H, 8, 1.6),
  groove: planOutline(insetPlan(PLATE, 5), 0, P),
  screwRings: joinPaths(BASE_SCREWS.map(([x, y]) => ring(x, y, 2.2, 0, P, 16))),
  screws: BASE_SCREWS.map(([x, y]) => at([x, y, 0])),
  ruler: solid(RULER_STRIP, 0, 0.7, 3),
  rulerMinor: RULER_TICKS.minor,
  rulerMajor: RULER_TICKS.major,
  rulerRivets: [
    at([RULER_STRIP.x + 2.5, RULER_STRIP.y + RULER_STRIP.d / 2, 0.7]),
    at([RULER_STRIP.x + RULER_STRIP.w - 2.5, RULER_STRIP.y + RULER_STRIP.d / 2, 0.7]),
  ],
  plate: solid(NAMEPLATE, 0, 0.8, 4),
  plateLine: planOutline(insetPlan(NAMEPLATE, 1.6), 0.8, P),
  plateRule: joinPaths(
    [32, 22, 28].map((w, row) =>
      lineOnTop([NAMEPLATE.x + 7, NAMEPLATE.y + 3.3 + row * 2.5], [NAMEPLATE.x + 7 + w, NAMEPLATE.y + 3.3 + row * 2.5], 0.8, P),
    ),
  ),
  plateRivets: [
    at([NAMEPLATE.x + 3.5, NAMEPLATE.y + NAMEPLATE.d / 2, 0.8]),
    at([NAMEPLATE.x + NAMEPLATE.w - 3.5, NAMEPLATE.y + NAMEPLATE.d / 2, 0.8]),
  ],
};

// =========================================================================
// STAGE 01: Audio Ingest — Soundboard DI Box (19 extruded solids)
// =========================================================================
const S01_PLINTH: Plan = { x: -158, y: -36, w: 62, d: 72, r: 4 };
const S01_SLOT: Plan = { x: FADER_X, y: FADER_Y_MIN - 6, w: 8, d: FADER_Y_MAX - FADER_Y_MIN + 12, r: 1.5 };
const S01_GAIN_XY: Plane = [-124, 19];
const S01_GAIN_Z = 23;
const S01_GAIN_R = 6.0;
const S01_VU_PLANS: Plan[] = Array.from({ length: 8 }, (_, idx) => ({
  x: -115,
  y: -24 + idx * 5.2,
  w: 11,
  d: 3.6,
  r: 0.8,
}));

export const STAGE01_ART = {
  plinth: solid(S01_PLINTH, 0, 3, 5, 0.4),
  box: solid(SOUNDBOARD_BOX, 3, 20, 6, 1.0),
  boxSeam: sideSeam(SOUNDBOARD_BOX, 18, P, 6),
  boxInset: planOutline(insetPlan(SOUNDBOARD_BOX, 3), 23, P, 5),
  boxScrews: corners(SOUNDBOARD_BOX, 4.5).map(([x, y]) => at([x, y, 23])),
  faderSlot: solid(S01_SLOT, 23, 1, 3),
  faderCapRest: solid({ x: FADER_X - 1, y: -3.5, w: 10, d: 7, r: 1.2 }, FADER_Z, 4.5, 3, 0.4),
  gainCollar: cyl(S01_GAIN_XY[0], S01_GAIN_XY[1], 7.6, S01_GAIN_Z, 1.5, 28),
  gainKnob: cyl(S01_GAIN_XY[0], S01_GAIN_XY[1], S01_GAIN_R, S01_GAIN_Z + 1.5, 4.5, 32),
  gainKnurl: knurl(S01_GAIN_XY[0], S01_GAIN_XY[1], S01_GAIN_R, S01_GAIN_Z + 1.5, S01_GAIN_Z + 6.0, 32, P),
  gainPointer: lineOnTop(
    S01_GAIN_XY,
    [S01_GAIN_XY[0] + S01_GAIN_R * Math.cos(-0.65), S01_GAIN_XY[1] + S01_GAIN_R * Math.sin(-0.65)],
    S01_GAIN_Z + 6.0,
    P,
  ),
  gainCenterDot: [at([S01_GAIN_XY[0], S01_GAIN_XY[1], S01_GAIN_Z + 6.0])],
  vuBars: S01_VU_PLANS.map((plan) => solid(plan, 23, 2.2, 3, 0.3)),
  xlrCollar: solid({ x: -160, y: -4, w: 4, d: 14, r: 1.5 }, 8, 12, 3, 0.4),
  xlrBarrel: solid({ x: -168, y: -1, w: 8, d: 8, r: 2 }, 10, 8, 4, 0.4),
  xlrBoot: solid({ x: -173, y: 1, w: 5, d: 4, r: 1.5 }, 11.5, 5, 3),
  cordAnchor: solid({ x: -166, y: 24, w: 8, d: 10, r: 1.5 }, 0, 4, 3, 0.3),
  cordFrom: at([-173, 3, 14]),
  cordVia: [at([-177, 3, 14]), at([-177, 18, 9]), at([-162, 29, 8.5])],
  cordTo: at([-162, 29, 4]),
  outStub: solid({ x: -98, y: -4, w: 5, d: 10, r: 1.2 }, 9, 8, 3, 0.3),
};

// =========================================================================
// STAGE 02: Sprung Clause Carriage & Sealed Black-Box Vault A (26 solids)
// =========================================================================
const VAULT_PLINTH: Plan = { x: -80, y: -64, w: 98, d: 48, r: 3 };
const VAULT_SHIELD: Plan = { x: -64, y: -52, w: 62, d: 24, r: 2 };
const VAULT_STUDS = corners(VAULT_A, 5.5);
const VAULT_RIBS: Plan[] = Array.from({ length: 6 }, (_, i) => ({
  x: -66 + i * 11,
  y: -62,
  w: 4.8,
  d: 8,
  r: 1,
}));
const CARRIAGE_PLATE: Plan = { x: CARRIAGE_REST_X - CARRIAGE_W / 2, y: -1, w: CARRIAGE_W, d: 38, r: 2.5 };
const CARRIAGE_BUSHINGS: Plan[] = [-1, 1].flatMap((side) =>
  [ROD_Y_BACK, ROD_Y_FRONT].map((y) => ({
    x: side < 0 ? CARRIAGE_PLATE.x - 1 : CARRIAGE_PLATE.x + CARRIAGE_W - 7,
    y: y - 4.5,
    w: 8,
    d: 9,
    r: 1.5,
  })),
);

export const STAGE02_ART = {
  // Sealed Black-Box Vault A (15 solids)
  vaultPlinth: solid(VAULT_PLINTH, 0, 4, 5, 0.4),
  vaultBody: solid(VAULT_A, 4, 29, 6, 1.2),
  vaultSeam: sideSeam(VAULT_A, 25, P, 6),
  vaultShield: solid(VAULT_SHIELD, 33, 3, 4, 0.4),
  vaultShieldLine: planOutline(insetPlan(VAULT_SHIELD, 2), 36, P, 4),
  vaultStuds: VAULT_STUDS.map(([x, y]) => cyl(x, y, 2.5, 33, 2.4, 16)),
  vaultStudDots: VAULT_STUDS.map(([x, y]) => at([x, y, 35.4])),
  vaultRibs: VAULT_RIBS.map((plan) => solid(plan, 33, 3.2, 3, 0.3)),
  vaultRail: solid({ x: -34, y: -18, w: 34, d: 6, r: 1 }, 4, 9, 3, 0.3),
  vaultGland: solid({ x: 16, y: -45, w: 5, d: 10, r: 1.5 }, 10, 10, 3, 0.3),
  // Sprung Clause Carriage (11 solids)
  carriageBed: solid(CARRIAGE_BED, 0, 3, 4, 0.4),
  carriageGrid: planOutline(insetPlan(CARRIAGE_BED, 3), 3, P, 4),
  endStops: [ROD_X_FROM - 5, ROD_X_TO].map((x) => solid({ x, y: -4, w: 5, d: 44, r: 1.2 }, 3, 10, 3, 0.4)),
  endStopDots: [ROD_X_FROM - 2.5, ROD_X_TO + 2.5].flatMap((x) => [at([x, 5, 13]), at([x, 31, 13])]),
  rods: [ROD_Y_BACK, ROD_Y_FRONT].map((y) =>
    solid({ x: ROD_X_FROM, y: y - ROD_HALF, w: ROD_X_TO - ROD_X_FROM, d: ROD_HALF * 2, r: ROD_HALF - 0.2 }, ROD_Z - ROD_HALF, ROD_HALF * 2, 3),
  ),
  carriageBushings: CARRIAGE_BUSHINGS.map((plan) => solid(plan, CARRIAGE_Z, CARRIAGE_H, 3, 0.4)),
  carriageBushDots: CARRIAGE_BUSHINGS.map((plan) => at([plan.x + plan.w / 2, plan.y + plan.d / 2, CARRIAGE_Z + CARRIAGE_H])),
  carriagePlate: solid(CARRIAGE_PLATE, CARRIAGE_Z + CARRIAGE_H, 4.0, 5, 0.6),
  clauseBlock: solid({ x: CARRIAGE_REST_X - 10, y: 6, w: 20, d: 24, r: 1.5 }, CARRIAGE_Z + CARRIAGE_H + 4.0, 7, 4, 0.6),
  clauseBlockOutline: planOutline(insetPlan({ x: CARRIAGE_REST_X - 10, y: 6, w: 20, d: 24, r: 1.5 }, 2.2), CARRIAGE_Z + CARRIAGE_H + 11.0, P, 4),
};

// =========================================================================
// STAGE 03: Sealed Cassette B + Plunger + Radial Dial Gauge (22 solids)
// =========================================================================
const CASSETTE_BASE: Plan = { x: 26, y: -58, w: 58, d: 44, r: 3 };
const CASSETTE_PLATE: Plan = { x: 35, y: -49, w: 40, d: 26, r: 2 };
const CASSETTE_STUDS = corners(CASSETTE_B, 4.2);
const [DX, DY] = DIAL_CENTER;
const DIAL_STAND: Plan = { x: 26, y: -2, w: 50, d: 34, r: 3 };
const DIAL_CLAMP: Plan = { x: DX - 9, y: DY - 9, w: 18, d: 18, r: 2.5 };
const DIAL_TICKS = radialTicks(DX, DY, DIAL_R - 2.4, 40, 5, DIAL_TOP, [1.2, 2.4], P, DIAL_SWEEP_START, DIAL_SWEEP_SPAN);
const TARGET_ANGLE = DIAL_SWEEP_START + ((DIAL_TARGET_SEC - DIAL_MIN_SEC) / (DIAL_MAX_SEC - DIAL_MIN_SEC)) * DIAL_SWEEP_SPAN;
const TARGET_R = DIAL_R - 5.0;

export const STAGE03_ART = {
  // Sealed Black-Box Cassette B (8 solids)
  cassetteBase: solid(CASSETTE_BASE, 0, 3, 4, 0.4),
  cassetteBody: solid(CASSETTE_B, 3, 22, 6, 1.0),
  cassetteSeam: sideSeam(CASSETTE_B, 19, P, 6),
  cassettePlate: solid(CASSETTE_PLATE, 25, 2.5, 4, 0.4),
  cassettePlateLine: planOutline(insetPlan(CASSETTE_PLATE, 2), 27.5, P, 4),
  cassetteStuds: CASSETTE_STUDS.map(([x, y]) => cyl(x, y, 2.2, 25, 2.0, 16)),
  cassetteStudDots: CASSETTE_STUDS.map(([x, y]) => at([x, y, 27.0])),
  cassetteLatch: solid({ x: 24, y: -41, w: 4, d: 10, r: 1 }, 9, 8, 3, 0.3),
  // Plunger & Vertical Stand Dial Gauge (15 solids)
  dialStand: solid(DIAL_STAND, 0, 4, 4, 0.5),
  dialStandDots: corners(DIAL_STAND, 4).map(([x, y]) => at([x, y, 4])),
  plungerRodLeft: solid({ x: 4, y: 13, w: 14, d: 4, r: 1.6 }, 6, 4, 3),
  plungerCollar: solid({ x: 18, y: 12, w: 3, d: 6, r: 1 }, 5, 6, 3, 0.3),
  plungerRodRight: solid({ x: 21, y: 13, w: 7, d: 4, r: 1.6 }, 6, 4, 3),
  plungerSleeve: solid({ x: 28, y: 11, w: 22.4, d: 8, r: 1.5 }, 4, 8, 3, 0.4),
  dialCollar: cyl(DX, DY, 7.6, 4, 3, 28),
  dialColumnLow: cyl(DX, DY, 4.8, 7, 15, 28),
  dialColumnHigh: cyl(DX, DY, 4.8, 32, 2, 28),
  dialColumnSeams: joinPaths([12, 17].map((z) => sideArc(DX, DY, 4.8, z, P, 16))),
  dialClamp: solid(DIAL_CLAMP, 22, 10, 4, 0.5),
  dialThumbNeck: solid({ x: DX - 1.5, y: DY + 9, w: 3, d: 1.9, r: 0.6 }, 24, 5, 2),
  dialThumb: cyl(DX, DY + 13.5, 2.6, 23, 6, 20),
  dialThumbKnurl: knurl(DX, DY + 13.5, 2.6, 23, 29, 16, P),
  dialLug: solid({ x: DX - 3, y: DY - DIAL_R - 4.0, w: 6, d: 4.0, r: 1.2 }, DIAL_Z + 1, 5, 3),
  dialPuck: cyl(DX, DY, DIAL_R, DIAL_Z, DIAL_H, 64, 0.8),
  dialKnurl: knurl(DX, DY, DIAL_R, DIAL_TOP - 3.4, DIAL_TOP, 84, P, 0.3),
  dialBand: sideArc(DX, DY, DIAL_R, DIAL_TOP - 3.4, P, 40),
  dialBezel: ring(DX, DY, DIAL_R - 1.0, DIAL_TOP, P, 64),
  dialFace: ring(DX, DY, DIAL_R - 2.4, DIAL_TOP, P, 64),
  dialMinor: DIAL_TICKS.minor,
  dialMajor: DIAL_TICKS.major,
  dialTargetDot: [at([DX + Math.sin(TARGET_ANGLE) * TARGET_R, DY - Math.cos(TARGET_ANGLE) * TARGET_R, DIAL_TOP])],
  dialHub: ring(DX, DY, 1.8, DIAL_TOP, P, 16),
  dialLabelTransform: topMatrix([DX, DY + 7.2], DIAL_TOP, P, "x"),
  dialCrownStem: solid({ x: DX + DIAL_R, y: DY - 2.2, w: 4.2, d: 4.4, r: 1.0 }, DIAL_Z + 2, 4.6, 3),
  dialCrownCap: solid({ x: DX + DIAL_R + 4.2, y: DY - 3.0, w: 2.6, d: 6.0, r: 1.2 }, DIAL_Z + 1.2, 6.2, 3),
};

// =========================================================================
// STAGE 04: Mechanical Clause Tally + 0 PII Ground Post (12 solids)
// =========================================================================
const COUNTER_PLINTH: Plan = { x: 94, y: -54, w: 60, d: 42, r: 3 };
const COUNTER_BEZEL: Plan = { x: 102, y: -44, w: 30, d: 16, r: 2 };
const DIGIT_WHEELS: Plan[] = [0, 1, 2].map((i) => ({
  x: 104.5 + i * 9,
  y: -41,
  w: 7,
  d: 10,
  r: 1.5,
}));
const GROUND_XY: Plane = [148, -20];

export const STAGE04_ART = {
  plinth: solid(COUNTER_PLINTH, 0, 3, 4, 0.4),
  body: solid(COUNTER_BODY, 3, 16, 5, 0.8),
  bodySeam: sideSeam(COUNTER_BODY, 14, P, 5),
  bezel: solid(COUNTER_BEZEL, 19, 1, 4, 0.2),
  wheels: DIGIT_WHEELS.map((plan) => solid(plan, 20, 2.2, 3, 0.3)),
  wheelMarks: joinPaths(DIGIT_WHEELS.map((plan) => planOutline(insetPlan(plan, 1.4), 22.2, P, 2))),
  resetNeck: solid({ x: 138, y: -36, w: 1.9, d: 4, r: 0.8 }, 10, 4, 2),
  resetKnob: cyl(143.5, -34, 3.6, 8, 8, 24),
  resetKnurl: knurl(143.5, -34, 3.6, 8, 16, 20, P),
  groundBase: cyl(GROUND_XY[0], GROUND_XY[1], 6.0, 3, 2, 28),
  groundPost: cyl(GROUND_XY[0], GROUND_XY[1], 3.2, 5, 7, 24),
  groundNut: cyl(GROUND_XY[0], GROUND_XY[1], 4.4, 12, 3, 24),
  groundCap: cyl(GROUND_XY[0], GROUND_XY[1], 3.4, 15, 2, 24),
  groundRing: ring(GROUND_XY[0], GROUND_XY[1], 2.0, 17, P, 16),
};

// =========================================================================
// STAGE 05: QR Tile + Recessed Projector + Cradled Phone (10 solids)
// =========================================================================
const QR_PLINTH: Plan = { x: 88, y: 12, w: 30, d: 30, r: 3 };
const QR_TILE: Plan = { x: 90, y: 14, w: 26, d: 26, r: 2 };
const QR_FINDERS: Plan[] = [
  { x: 93, y: 17, w: 6.5, d: 6.5, r: 0.6 },
  { x: 106.5, y: 17, w: 6.5, d: 6.5, r: 0.6 },
  { x: 93, y: 30.5, w: 6.5, d: 6.5, r: 0.6 },
];
const QR_CELLS: Plan[] = [
  { x: 101.5, y: 18, w: 3, d: 3, r: 0.4 },
  { x: 101.5, y: 24.5, w: 4, d: 4, r: 0.4 },
  { x: 107.5, y: 26, w: 4.5, d: 4.5, r: 0.4 },
  { x: 102, y: 31.5, w: 3.5, d: 3.5, r: 0.4 },
  { x: 108, y: 32, w: 4.5, d: 4.5, r: 0.4 },
];

const PROJ_SCREEN = { x0: 123.5, x1: 156.5, z0: 18, z1: 40.5, r: 2, depth: 1.8 };
const PHONE_SCREEN = { x0: 130.5, x1: 149.5, z0: 9.5, z1: 29.5, r: 1.6, depth: 1.4 };

export const STAGE05_ART = {
  qrPlinth: solid(QR_PLINTH, 0, 4, 4, 0.4),
  qrTile: solid(QR_TILE, 4, 2, 4, 0.3),
  qrFinders: joinPaths(QR_FINDERS.flatMap((p) => [planOutline(p, 6, P, 2), planOutline(insetPlan(p, 2), 6, P, 2)])),
  qrCells: joinPaths(QR_CELLS.map((p) => planOutline(p, 6, P, 2))),
  projFoot: cyl(140, 8, 7.0, 0, 3, 28),
  projPost: cyl(140, 8, 3.4, 3, 8, 24),
  projKnuckle: solid({ x: 136, y: 4, w: 8, d: 8, r: 1.5 }, 11, 3, 3),
  projBody: solid(PROJECTOR_BODY, 14, 30, 5, 0.8),
  projSeam: sideSeam(PROJECTOR_BODY, 20, P, 5),
  projRecess: buildRecess("ikilang-bench-proj-clip", PROJ_SCREEN, PROJECTOR_BODY.y + PROJECTOR_BODY.d),
  projBars: [
    { x: PROJ_SCREEN.x0 + 3, z: PROJ_SCREEN.z1 - 4.5, w: 12, h: 1.8, active: false },
    { x: PROJ_SCREEN.x0 + 3, z: PROJ_SCREEN.z1 - 9.5, w: 23, h: 2.2, active: false },
    { x: PROJ_SCREEN.x0 + 3, z: PROJ_SCREEN.z1 - 14.5, w: 26, h: 2.6, active: false },
    { x: PROJ_SCREEN.x0 + 3, z: PROJ_SCREEN.z0 + 4.5, w: 27, h: 3.4, active: true },
  ],
  phoneDock: solid({ x: 124, y: 26, w: 32, d: 24, r: 3 }, 0, 6, 4, 0.5),
  phoneBody: solid(PHONE_BODY, 6, 26, 4, 0.7),
  phoneRecess: buildRecess("ikilang-bench-phone-clip", PHONE_SCREEN, PHONE_BODY.y + PHONE_BODY.d),
  phoneBars: [
    { x: PHONE_SCREEN.x0 + 2.2, z: PHONE_SCREEN.z1 - 4.2, w: 10, h: 1.8, active: false },
    { x: PHONE_SCREEN.x0 + 2.2, z: PHONE_SCREEN.z1 - 8.8, w: 13.5, h: 2.2, active: false },
    { x: PHONE_SCREEN.x0 + 2.2, z: PHONE_SCREEN.z0 + 4.2, w: 14.2, h: 3.0, active: true },
  ],
  muteBlock: solid({ x: 116, y: 44, w: 8, d: 8, r: 1.5 }, 0, 5, 3, 0.3),
  muteCap: cyl(120, 48, 2.8, 5, 3, 20),
  muteSeal: planOutline({ x: 118.6, y: 46.6, w: 2.8, d: 2.8, r: 0.6 }, 8, P, 2),
};

export const BENCH_SOLID_COUNT =
  // Base: 4*2 feet + slab + ruler + nameplate = 11
  BASE_ART.feet.length * 2 +
  3 +
  // Stage 01: plinth + box + faderSlot + faderCap + gainCollar + gainKnob + 8 vuBars + 3 xlr + cordAnchor + outStub = 19
  11 +
  STAGE01_ART.vuBars.length +
  // Stage 02: vaultPlinth + vaultBody + vaultShield + 4 studs + 6 ribs + vaultRail + vaultGland + carriageBed + 2 endStops + 2 rods + carriagePlate + 4 bushings + clauseBlock = 26
  11 +
  STAGE02_ART.vaultStuds.length +
  STAGE02_ART.vaultRibs.length +
  STAGE02_ART.endStops.length +
  STAGE02_ART.rods.length +
  STAGE02_ART.carriageBushings.length +
  // Stage 03: cassetteBase + cassetteBody + cassettePlate + 4 studs + latch + dialStand + 4 plunger + collar + 2 col + clamp + neck + thumb + lug + puck + 2 crown = 23
  19 +
  STAGE03_ART.cassetteStuds.length +
  // Stage 04: plinth + body + bezel + 3 wheels + neck + knob + 4 ground = 12
  9 +
  STAGE04_ART.wheels.length +
  // Stage 05: qrPlinth + qrTile + 3 proj + projBody + dock + phoneBody + muteBlock + muteCap = 10
  10;
