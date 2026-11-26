import { LATENCY_MAX_SEC } from "./model";
import { STAGE03_ART } from "./geometry";
import { translateVec } from "./view";

export interface BenchDynamicPose {
  packetTransform: string;
  latencyBarWidth: number;
}

export function dynamicPoseOf(packetOffset: number, latencySec: number): BenchDynamicPose {
  const clampedLatency = Math.min(LATENCY_MAX_SEC, Math.max(0.1, latencySec));
  const latencyBarWidth = Math.round((clampedLatency / LATENCY_MAX_SEC) * STAGE03_ART.latencyScreenMeta.wMax * 10) / 10;

  return {
    packetTransform: translateVec([packetOffset, 0, 0]),
    latencyBarWidth,
  };
}
