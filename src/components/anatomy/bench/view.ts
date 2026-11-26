import { axisVector, boxCorners, depthOf, fitProjection, iso, type Flat, type Plan, type Point3, type Projection } from "../../iso/iso-kit";
import { EXPLODE_VECTORS, STAGE_IDS, type StageId } from "./model";

export const WIDTH = 640;
export const HEIGHT = 380;
export const AZIMUTH = 54;
export const ELEVATION = 31;
const PAD = 30;

export const PLATE: Plan = { x: -168, y: -78, w: 336, d: 156, r: 9 };
export const PLATE_H = 12;
export const FOOT_H = 5;

export const CAPTURE_TERMINAL: Plan = { x: -156, y: -32, w: 56, d: 64, r: 4 };
export const VAULT_A: Plan = { x: -80, y: -62, w: 96, d: 44, r: 4 };
export const STREAM_BUS_BED: Plan = { x: -82, y: -4, w: 84, d: 42, r: 3 };
export const CASSETTE_B: Plan = { x: 28, y: -56, w: 54, d: 40, r: 4 };
export const TELEMETRY_PANEL: Plan = { x: 26, y: -2, w: 52, d: 36, r: 3 };

export const PACKET_REST_X = -68;
export const PACKET_W = 22;

export const PLUGIN_HUB: Plan = { x: 96, y: -52, w: 56, d: 38, r: 3 };
export const PROJECTOR_BODY: Plan = { x: 120, y: 2, w: 40, d: 10, r: 2.5 };
export const PHONE_BODY: Plan = { x: 128, y: 31, w: 24, d: 9, r: 2 };

const stageExtremes: Point3[] = [
  [-166 + EXPLODE_VECTORS["stage-01"][0], -34 + EXPLODE_VECTORS["stage-01"][1], 36 + EXPLODE_VECTORS["stage-01"][2]],
  [-82 + EXPLODE_VECTORS["stage-02"][0], -64 + EXPLODE_VECTORS["stage-02"][1], 37 + EXPLODE_VECTORS["stage-02"][2]],
  [84 + EXPLODE_VECTORS["stage-03"][0], 34 + EXPLODE_VECTORS["stage-03"][1], 42 + EXPLODE_VECTORS["stage-03"][2]],
  [156 + EXPLODE_VECTORS["stage-04"][0], -54 + EXPLODE_VECTORS["stage-04"][1], 24 + EXPLODE_VECTORS["stage-04"][2]],
  [160 + EXPLODE_VECTORS["stage-05"][0], 54 + EXPLODE_VECTORS["stage-05"][1], 44 + EXPLODE_VECTORS["stage-05"][2]],
];

export const P: Projection = fitProjection(
  [...boxCorners(PLATE, -PLATE_H - FOOT_H, 0), ...stageExtremes],
  WIDTH,
  HEIGHT,
  { pad: PAD, azimuth: AZIMUTH, elevation: ELEVATION },
);

export const at = (point: Point3): Flat => iso(point, P);
export const EX = axisVector(P, [1, 0, 0]);
export const EY = axisVector(P, [0, 1, 0]);
export const EZ = axisVector(P, [0, 0, 1]);

const fine = (value: number) => Math.round(value * 100) / 100;

export function translateVec([dx, dy, dz]: Point3, share = 1): string {
  if (share === 0) return "";
  const sx = (EX[0] * dx + EY[0] * dy + EZ[0] * dz) * share;
  const sy = (EX[1] * dx + EY[1] * dy + EZ[1] * dz) * share;
  return `translate(${fine(sx)} ${fine(sy)})`;
}

export const byDepth = <T extends [number, number]>(pts: T[]): T[] =>
  [...pts].sort((a, b) => depthOf([a[0], a[1], 0], P) - depthOf([b[0], b[1], 0], P));

export const STAGE_TRANSFORMS_APART: Record<StageId, string> = Object.fromEntries(
  STAGE_IDS.map((id) => [id, translateVec(EXPLODE_VECTORS[id], 1)]),
) as Record<StageId, string>;
