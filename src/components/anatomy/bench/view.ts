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

export const SOUNDBOARD_BOX: Plan = { x: -156, y: -34, w: 58, d: 68, r: 4 };
export const VAULT_A: Plan = { x: -78, y: -62, w: 94, d: 44, r: 4 };
export const CARRIAGE_BED: Plan = { x: -82, y: -6, w: 80, d: 48, r: 3 };
export const CASSETTE_B: Plan = { x: 28, y: -56, w: 54, d: 40, r: 4 };

export const ROD_X_FROM = -77;
export const ROD_X_TO = -7;
export const ROD_Y_BACK = 5;
export const ROD_Y_FRONT = 31;
export const ROD_Z = 7.6;
export const ROD_HALF = 1.6;
export const COIL_R = 3.8;
export const COIL_TURNS = 5;

export const CARRIAGE_REST_X = -46;
export const CARRIAGE_W = 28;
export const CARRIAGE_Z = 9.2;
export const CARRIAGE_H = 3.0;

export const DIAL_CENTER: Flat = [58, 15];
export const DIAL_R = 18.5;
export const DIAL_Z = 34;
export const DIAL_H = 10;
export const DIAL_TOP = DIAL_Z + DIAL_H;

export const FADER_X = -146;
export const FADER_Y_MIN = -16;
export const FADER_Y_MAX = 16;
export const FADER_Z = 24;

export const COUNTER_BODY: Plan = { x: 96, y: -52, w: 42, d: 36, r: 3 };
export const PROJECTOR_BODY: Plan = { x: 120, y: 2, w: 40, d: 10, r: 2.5 };
export const PHONE_BODY: Plan = { x: 128, y: 31, w: 24, d: 9, r: 2 };

const stageExtremes: Point3[] = [
  [-173 + EXPLODE_VECTORS["stage-01"][0], -36 + EXPLODE_VECTORS["stage-01"][1], 29 + EXPLODE_VECTORS["stage-01"][2]],
  [-80 + EXPLODE_VECTORS["stage-02"][0], -64 + EXPLODE_VECTORS["stage-02"][1], 37 + EXPLODE_VECTORS["stage-02"][2]],
  [84 + EXPLODE_VECTORS["stage-03"][0], 34 + EXPLODE_VECTORS["stage-03"][1], DIAL_TOP + EXPLODE_VECTORS["stage-03"][2]],
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
