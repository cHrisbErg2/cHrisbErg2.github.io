import {
  cameraOf,
  corners,
  cylinder,
  haloOf,
  insetPlan,
  joinPaths,
  lineOnTop,
  pathOf,
  planOutline,
  ring,
  roundedPlan,
  sideSeam,
  slabOf,
  topTicks,
  type Plan,
  type SolidPaths,
} from "../../iso/iso-kit";
import { sideMatrix } from "../../iso/iso-kit";
import {
  CAPTURE_TERMINAL,
  CASSETTE_B,
  FOOT_H,
  P,
  PACKET_REST_X,
  PACKET_W,
  PHONE_BODY,
  PLATE,
  PLATE_H,
  PLUGIN_HUB,
  PROJECTOR_BODY,
  STREAM_BUS_BED,
  TELEMETRY_PANEL,
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
// 00 ARCHITECTURE PLATFORM DECK (Stationary: 11 solids)
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
// STAGE 01: Audio Stream Capture Terminal (15 solids)
// =========================================================================
const S01_PLINTH: Plan = { x: -158, y: -34, w: 60, d: 68, r: 4 };
const S01_DISPLAY_STAND: Plan = { x: -152, y: -24, w: 32, d: 10, r: 2.2 };
const AUDIO_SCREEN = { x0: -149, x1: -123, z0: 23.5, z1: 35.5, r: 1.6, depth: 1.4 };
const S01_VU_PLANS: Plan[] = Array.from({ length: 8 }, (_, idx) => ({
  x: -115,
  y: -24 + idx * 5.2,
  w: 11,
  d: 3.6,
  r: 0.8,
}));

export const STAGE01_ART = {
  plinth: solid(S01_PLINTH, 0, 3, 5, 0.4),
  box: solid(CAPTURE_TERMINAL, 3, 18, 6, 1.0),
  boxSeam: sideSeam(CAPTURE_TERMINAL, 15, P, 6),
  boxInset: planOutline(insetPlan(CAPTURE_TERMINAL, 3), 21, P, 5),
  boxScrews: corners(CAPTURE_TERMINAL, 4.5).map(([x, y]) => at([x, y, 21])),
  displayStand: solid(S01_DISPLAY_STAND, 21, 17, 4, 0.6),
  displaySeam: sideSeam(S01_DISPLAY_STAND, 24, P, 4),
  audioRecess: buildRecess("ikilang-bench-audio-clip", AUDIO_SCREEN, S01_DISPLAY_STAND.y + S01_DISPLAY_STAND.d),
  audioWaveBars: [
    { x: AUDIO_SCREEN.x0 + 3, z: AUDIO_SCREEN.z0 + 3.5, w: 3.2, h: 4.5, active: false },
    { x: AUDIO_SCREEN.x0 + 8, z: AUDIO_SCREEN.z0 + 2.5, w: 3.2, h: 7.0, active: true },
    { x: AUDIO_SCREEN.x0 + 13, z: AUDIO_SCREEN.z0 + 3.0, w: 3.2, h: 5.5, active: true },
    { x: AUDIO_SCREEN.x0 + 18, z: AUDIO_SCREEN.z0 + 2.0, w: 3.2, h: 8.0, active: true },
    { x: AUDIO_SCREEN.x0 + 23, z: AUDIO_SCREEN.z0 + 4.0, w: 2.5, h: 3.5, active: false },
  ],
  deckStrip: solid({ x: -152, y: 2, w: 32, d: 18, r: 2 }, 21, 2, 4, 0.3),
  deckStripLine: planOutline(insetPlan({ x: -152, y: 2, w: 32, d: 18, r: 2 }, 2.2), 23, P, 3),
  vuBars: S01_VU_PLANS.map((plan) => solid(plan, 21, 2.2, 3, 0.3)),
  ingressPort: solid({ x: -160, y: -4, w: 4, d: 12, r: 1.5 }, 8, 10, 3, 0.4),
  outStub: solid({ x: -100, y: -4, w: 5, d: 10, r: 1.2 }, 9, 8, 3, 0.3),
};

// =========================================================================
// STAGE 02: Context-Aware Translation Core (Cloud/Local Host + Sealed Vault A, 20 solids)
// =========================================================================
const VAULT_PLINTH: Plan = { x: -82, y: -64, w: 100, d: 48, r: 3 };
const VAULT_SHIELD: Plan = { x: -66, y: -52, w: 64, d: 24, r: 2 };
const VAULT_STUDS = corners(VAULT_A, 5.5);
const VAULT_RIBS: Plan[] = Array.from({ length: 6 }, (_, i) => ({
  x: -66 + i * 11,
  y: -62,
  w: 4.8,
  d: 8,
  r: 1,
}));

const CLOUD_CARTRIDGE: Plan = { x: -74, y: 2, w: 30, d: 14, r: 2 };
const LOCAL_CARTRIDGE: Plan = { x: -38, y: 2, w: 30, d: 14, r: 2 };
const BUS_CHANNEL: Plan = { x: -78, y: 21, w: 76, d: 12, r: 2 };
const PACKET_BLOCK: Plan = { x: PACKET_REST_X, y: 22.5, w: PACKET_W, d: 9, r: 1.5 };

export const STAGE02_ART = {
  // Sealed Black-Box Core Vault A (15 solids)
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
  // Cloud & Local Host Runtime Bays + Data Stream Channel (5 solids)
  busBed: solid(STREAM_BUS_BED, 0, 3, 4, 0.4),
  busGrid: planOutline(insetPlan(STREAM_BUS_BED, 3), 3, P, 4),
  cloudCartridge: solid(CLOUD_CARTRIDGE, 3, 8, 4, 0.5),
  cloudLine: planOutline(insetPlan(CLOUD_CARTRIDGE, 2.2), 11, P, 3),
  localCartridge: solid(LOCAL_CARTRIDGE, 3, 8, 4, 0.5),
  localLine: planOutline(insetPlan(LOCAL_CARTRIDGE, 2.2), 11, P, 3),
  busChannel: solid(BUS_CHANNEL, 3, 3, 3, 0.3),
  packetBlock: solid(PACKET_BLOCK, 6, 6, 4, 0.5),
  packetLine: planOutline(insetPlan(PACKET_BLOCK, 2), 12, P, 3),
};

// =========================================================================
// STAGE 03: Sealed Guardrail Cassette B + Digital Latency Monitor (14 solids)
// =========================================================================
const CASSETTE_BASE: Plan = { x: 26, y: -58, w: 58, d: 44, r: 3 };
const CASSETTE_PLATE: Plan = { x: 35, y: -49, w: 40, d: 26, r: 2 };
const CASSETTE_STUDS = corners(CASSETTE_B, 4.2);
const TELEMETRY_MONITOR: Plan = { x: 32, y: 12, w: 40, d: 11, r: 2.5 };
const LATENCY_SCREEN = { x0: 35.5, x1: 68.5, z0: 14, z1: 36, r: 1.8, depth: 1.6 };

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
  // Digital Latency & Accuracy Readout Display (6 solids)
  telemetryStand: solid(TELEMETRY_PANEL, 0, 4, 4, 0.5),
  telemetryDots: corners(TELEMETRY_PANEL, 4).map(([x, y]) => at([x, y, 4])),
  telemetryBridge: solid({ x: 2, y: 21, w: 24, d: 10, r: 1.5 }, 3, 4, 3, 0.3),
  monitorBody: solid(TELEMETRY_MONITOR, 4, 36, 5, 0.8),
  monitorSeam: sideSeam(TELEMETRY_MONITOR, 10, P, 5),
  monitorRecess: buildRecess("ikilang-bench-latency-clip", LATENCY_SCREEN, TELEMETRY_MONITOR.y + TELEMETRY_MONITOR.d),
  latencyScreenMeta: {
    x0: LATENCY_SCREEN.x0 + 3,
    zTrack: LATENCY_SCREEN.z0 + 5.5,
    wMax: 27,
    hBar: 4.5,
    xTarget: LATENCY_SCREEN.x0 + 3 + 27 * (1.5 / 2.0),
    zTopLine: LATENCY_SCREEN.z1 - 5.5,
  },
  statusPod: solid({ x: 35, y: 26, w: 34, d: 6, r: 1.5 }, 4, 3, 3, 0.3),
};

// =========================================================================
// STAGE 04: Zero-PII Privacy Shield + Media/Hosting Plugin Dock (12 solids)
// =========================================================================
const PRIVACY_SHIELD_PLAN: Plan = { x: 96, y: -52, w: 26, d: 36, r: 3 };
const PLUGIN_DOCK_PLAN: Plan = { x: 126, y: -52, w: 28, d: 36, r: 3 };
const PLUGIN_SLOTS: Plan[] = [0, 1, 2].map((i) => ({
  x: 129,
  y: -48 + i * 10.5,
  w: 22,
  d: 7.5,
  r: 1.4,
}));

export const STAGE04_ART = {
  plinth: solid({ x: 94, y: -54, w: 62, d: 42, r: 3 }, 0, 3, 4, 0.4),
  privacyBlock: solid(PRIVACY_SHIELD_PLAN, 3, 17, 5, 0.8),
  privacySeam: sideSeam(PRIVACY_SHIELD_PLAN, 14, P, 5),
  privacyRingOuter: ring(109, -34, 7.5, 20, P, 24),
  privacyRingInner: ring(109, -34, 4.0, 20, P, 20),
  privacyCenterDot: [at([109, -34, 20])],
  pluginDock: solid(PLUGIN_DOCK_PLAN, 3, 10, 4, 0.6),
  pluginSlots: PLUGIN_SLOTS.map((plan) => solid(plan, 13, 5, 3, 0.3)),
  pluginLines: joinPaths(PLUGIN_SLOTS.map((plan) => planOutline(insetPlan(plan, 1.4), 18, P, 2))),
};

// =========================================================================
// STAGE 05: QR Web App + Projector + Phone + Future Voice Audio Capsule (12 solids)
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
  audioCapsuleBase: solid({ x: 112, y: 42, w: 12, d: 10, r: 2 }, 0, 5, 3, 0.4),
  audioCapsuleTop: solid({ x: 114, y: 44, w: 8, d: 6, r: 1.2 }, 5, 3, 3, 0.3),
  audioCapsuleSeal: planOutline({ x: 115.5, y: 45.5, w: 5, d: 3, r: 0.6 }, 8, P, 2),
};

export const BENCH_SOLID_COUNT =
  // Base: 4*2 feet + slab + ruler + nameplate = 11
  BASE_ART.feet.length * 2 +
  3 +
  // Stage 01: plinth + box + displayStand + deckStrip + 8 vuBars + ingressPort + outStub = 14
  6 +
  STAGE01_ART.vuBars.length +
  // Stage 02: vaultPlinth + vaultBody + vaultShield + 4 studs + 6 ribs + vaultRail + vaultGland + busBed + 2 cartridges + busChannel + packetBlock = 20
  10 +
  STAGE02_ART.vaultStuds.length +
  STAGE02_ART.vaultRibs.length +
  // Stage 03: cassetteBase + cassetteBody + cassettePlate + 4 studs + latch + telemetryStand + telemetryBridge + monitorBody + statusPod = 13
  9 +
  STAGE03_ART.cassetteStuds.length +
  // Stage 04: plinth + privacyBlock + pluginDock + 3 pluginSlots = 6
  3 +
  STAGE04_ART.pluginSlots.length +
  // Stage 05: qrPlinth + qrTile + projFoot + projPost + projKnuckle + projBody + phoneDock + phoneBody + 2 audioCapsule = 10
  10;
