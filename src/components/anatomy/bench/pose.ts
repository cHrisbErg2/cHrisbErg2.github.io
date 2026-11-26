import { coil, pathOf } from "../../iso/iso-kit";
import { dialAngleRad } from "./model";
import {
  CARRIAGE_REST_X,
  CARRIAGE_W,
  COIL_R,
  COIL_TURNS,
  DIAL_CENTER,
  DIAL_R,
  DIAL_TOP,
  FADER_Y_MAX,
  FADER_Y_MIN,
  P,
  ROD_X_FROM,
  ROD_X_TO,
  ROD_Y_BACK,
  ROD_Y_FRONT,
  ROD_Z,
  at,
  translateVec,
} from "./view";

export interface BenchDynamicPose {
  carriageTransform: string;
  faderTransform: string;
  coilsBackD: string;
  coilsLeftFrontD: string;
  coilsRightFrontD: string;
  needleD: string;
}

export function needlePathAt(seconds: number): string {
  const angle = dialAngleRad(seconds);
  const sx = Math.sin(angle);
  const sy = -Math.cos(angle);
  const [dx, dy] = DIAL_CENTER;
  const tail = at([dx - sx * 3.4, dy - sy * 3.4, DIAL_TOP + 0.2]);
  const tip = at([dx + sx * (DIAL_R - 4.0), dy + sy * (DIAL_R - 4.0), DIAL_TOP + 0.2]);
  return pathOf([tail, tip]);
}

export function dynamicPoseOf(carriageOffset: number, faderNorm: number, latencySec: number): BenchDynamicPose {
  const carriageLeft = CARRIAGE_REST_X - CARRIAGE_W / 2 + carriageOffset;
  const carriageRight = carriageLeft + CARRIAGE_W;
  const coils = [
    coil(ROD_X_FROM, carriageLeft - 1, [ROD_Y_BACK, ROD_Z], COIL_R, COIL_TURNS, "x", P, 14),
    coil(ROD_X_FROM, carriageLeft - 1, [ROD_Y_FRONT, ROD_Z], COIL_R, COIL_TURNS, "x", P, 14),
    coil(carriageRight + 1, ROD_X_TO, [ROD_Y_BACK, ROD_Z], COIL_R, COIL_TURNS, "x", P, 14),
    coil(carriageRight + 1, ROD_X_TO, [ROD_Y_FRONT, ROD_Z], COIL_R, COIL_TURNS, "x", P, 14),
  ];

  const faderY = FADER_Y_MIN + (FADER_Y_MAX - FADER_Y_MIN) * Math.min(1, Math.max(0, faderNorm));

  return {
    carriageTransform: translateVec([carriageOffset, 0, 0]),
    faderTransform: translateVec([0, faderY, 0]),
    coilsBackD: coils.map((c) => c.back).join(""),
    coilsLeftFrontD: coils[0]!.front + coils[1]!.front,
    coilsRightFrontD: coils[2]!.front + coils[3]!.front,
    needleD: needlePathAt(latencySec),
  };
}
