import * as React from "react";
import { Dots, Line, Solid } from "../../iso/draw";
import { BASE_ART, STAGE01_ART, STAGE02_ART, STAGE03_ART, STAGE04_ART, STAGE05_ART, type RecessSpec } from "./geometry";
import { BenchLive } from "./live";

function RecessScreen({
  recess,
  bars,
}: {
  recess: RecessSpec;
  bars: Array<{ x: number; z: number; w: number; h: number; active: boolean }>;
}) {
  return (
    <g className="bench-recess">
      <defs>
        <clipPath id={recess.clipId}>
          <path transform={recess.faceTransform} d={recess.clipPathD} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${recess.clipId})`}>
        {recess.topsD ? <path className="iso-top" d={recess.topsD} /> : null}
        {recess.shadesD.map((d, idx) => (d ? <path key={idx} className="iso-shade" data-shade={idx} d={d} /> : null))}
        <g transform={recess.backTransform}>
          <path className="bench-screen-cavity" d={recess.shapeD} />
          {bars.map((bar, idx) => (
            <rect
              key={idx}
              className={bar.active ? "bench-screen-bar is-active" : "bench-screen-bar"}
              x={bar.x}
              y={-(bar.z + bar.h)}
              width={bar.w}
              height={bar.h}
              rx={0.6}
            />
          ))}
          <path className="iso-line" data-tone="faint" d={recess.shapeD} />
        </g>
      </g>
      <g transform={recess.faceTransform}>
        <path className="iso-line" data-tone="lo" d={recess.shapeD} />
      </g>
    </g>
  );
}

const BASE = (
  <g key="base">
    <path className="iso-halo" d={BASE_ART.halo} />
    {BASE_ART.feet.map((foot, index) => (
      <g key={index}>
        <Solid paths={foot.flange} tone="lo" crease="faint" />
        <Solid paths={foot.pad} tone="mid" crease="faint" />
      </g>
    ))}
    <Solid paths={BASE_ART.slab} tone="mid" crease="faint" />
    <Line d={BASE_ART.groove} tone="lo" />
    <Line d={BASE_ART.screwRings} tone="lo" />
    <Dots points={BASE_ART.screws} size={0.5} tone="mid" />
    <Solid paths={BASE_ART.ruler} tone="lo" crease="none" />
    <Line d={BASE_ART.rulerMinor} tone="lo" />
    <Line d={BASE_ART.rulerMajor} tone="mid" />
    <Dots points={BASE_ART.rulerRivets} size={0.45} tone="mid" />
    <Solid paths={BASE_ART.plate} tone="lo" crease="none" />
    <Line d={BASE_ART.plateLine} tone="faint" />
    <Line d={BASE_ART.plateRule} tone="lo" free />
    <Dots points={BASE_ART.plateRivets} size={0.45} tone="mid" />
  </g>
);

const STAGE_01_STATIC = (
  <g key="stage-01-static">
    <Solid paths={STAGE01_ART.plinth} tone="lo" crease="faint" />
    <Solid paths={STAGE01_ART.ingressPort} tone="mid" crease="faint" />
    <Solid paths={STAGE01_ART.box} tone="mid" crease="faint" inner={<Line d={STAGE01_ART.boxSeam} tone="faint" />} />
    <Line d={STAGE01_ART.boxInset} tone="faint" />
    <Dots points={STAGE01_ART.boxScrews} size={0.45} tone="mid" />
    <Solid paths={STAGE01_ART.outStub} tone="mid" crease="faint" />
    <Solid paths={STAGE01_ART.displayStand} tone="hi" crease="faint" inner={<Line d={STAGE01_ART.displaySeam} tone="faint" />} />
    <RecessScreen recess={STAGE01_ART.audioRecess} bars={STAGE01_ART.audioWaveBars} />
    <Solid paths={STAGE01_ART.deckStrip} tone="lo" crease="faint" />
    <Line d={STAGE01_ART.deckStripLine} tone="faint" />
  </g>
);

const STAGE_02_VAULT = (
  <g key="stage-02-vault">
    <Solid paths={STAGE02_ART.vaultPlinth} tone="lo" crease="faint" />
    <Solid paths={STAGE02_ART.vaultBody} tone="hi" crease="lo" inner={<Line d={STAGE02_ART.vaultSeam} tone="faint" />} />
    <Solid paths={STAGE02_ART.vaultRail} tone="mid" crease="faint" />
    <Solid paths={STAGE02_ART.vaultGland} tone="mid" crease="faint" />
    {STAGE02_ART.vaultRibs.map((paths, idx) => (
      <Solid key={idx} paths={paths} tone="mid" crease="faint" />
    ))}
    <Solid paths={STAGE02_ART.vaultShield} tone="mid" crease="faint" />
    <Line d={STAGE02_ART.vaultShieldLine} tone="faint" />
    {STAGE02_ART.vaultStuds.map((paths, idx) => (
      <Solid key={idx} paths={paths} tone="hi" crease="none" />
    ))}
    <Dots points={STAGE02_ART.vaultStudDots} size={0.45} tone="hi" />
  </g>
);

const STAGE_02_BUS_BASE = (
  <g key="stage-02-bus-base">
    <Solid paths={STAGE02_ART.busBed} tone="lo" crease="faint" />
    <Line d={STAGE02_ART.busGrid} tone="faint" />
    <Solid paths={STAGE02_ART.cloudCartridge} tone="hi" crease="faint" lit />
    <Line d={STAGE02_ART.cloudLine} tone="lo" />
    <Solid paths={STAGE02_ART.localCartridge} tone="mid" crease="faint" />
    <Line d={STAGE02_ART.localLine} tone="faint" />
    <Solid paths={STAGE02_ART.busChannel} tone="lo" crease="faint" />
  </g>
);

const STAGE_02_PACKET = (
  <g key="stage-02-packet">
    <Solid paths={STAGE02_ART.packetBlock} tone="hi" crease="lo" lit />
    <Line d={STAGE02_ART.packetLine} tone="lo" />
  </g>
);

const STAGE_03_STATIC_BASE = (
  <g key="stage-03-static-base">
    {/* Sealed Black-Box Cassette B */}
    <Solid paths={STAGE03_ART.cassetteBase} tone="lo" crease="faint" />
    <Solid paths={STAGE03_ART.cassetteBody} tone="hi" crease="lo" inner={<Line d={STAGE03_ART.cassetteSeam} tone="faint" />} />
    <Solid paths={STAGE03_ART.cassetteLatch} tone="mid" crease="faint" />
    <Solid paths={STAGE03_ART.cassettePlate} tone="mid" crease="faint" />
    <Line d={STAGE03_ART.cassettePlateLine} tone="faint" />
    {STAGE03_ART.cassetteStuds.map((paths, idx) => (
      <Solid key={idx} paths={paths} tone="hi" crease="none" />
    ))}
    <Dots points={STAGE03_ART.cassetteStudDots} size={0.45} tone="hi" />
    {/* Digital Latency & Privacy Monitor */}
    <Solid paths={STAGE03_ART.telemetryStand} tone="lo" crease="faint" />
    <Dots points={STAGE03_ART.telemetryDots} size={0.45} tone="mid" />
    <Solid paths={STAGE03_ART.telemetryBridge} tone="mid" crease="faint" />
    <Solid paths={STAGE03_ART.monitorBody} tone="hi" crease="faint" inner={<Line d={STAGE03_ART.monitorSeam} tone="faint" />} />
    <Solid paths={STAGE03_ART.statusPod} tone="mid" crease="faint" />
  </g>
);

const STAGE_04_STATIC = (
  <g key="stage-04-static">
    <Solid paths={STAGE04_ART.plinth} tone="lo" crease="faint" />
    <Solid paths={STAGE04_ART.privacyBlock} tone="hi" crease="faint" inner={<Line d={STAGE04_ART.privacySeam} tone="faint" />} />
    <Line d={STAGE04_ART.privacyRingOuter} tone="mid" />
    <Line d={STAGE04_ART.privacyRingInner} tone="hi" />
    <Dots points={STAGE04_ART.privacyCenterDot} size={0.55} tone="hi" />
    <Solid paths={STAGE04_ART.pluginDock} tone="mid" crease="faint" />
    {STAGE04_ART.pluginSlots.map((paths, idx) => (
      <Solid key={idx} paths={paths} tone="hi" crease="faint" />
    ))}
    <Line d={STAGE04_ART.pluginLines} tone="faint" />
  </g>
);

const STAGE_05_STATIC = (
  <g key="stage-05-static">
    {/* QR Web App Tile */}
    <Solid paths={STAGE05_ART.qrPlinth} tone="lo" crease="faint" />
    <Solid paths={STAGE05_ART.qrTile} tone="hi" crease="faint" />
    <Line d={STAGE05_ART.qrFinders} tone="hi" />
    <Line d={STAGE05_ART.qrCells} tone="mid" />
    {/* Sanctuary Projector Screen */}
    <Solid paths={STAGE05_ART.projFoot} tone="lo" crease="faint" />
    <Solid paths={STAGE05_ART.projPost} tone="mid" crease="none" />
    <Solid paths={STAGE05_ART.projKnuckle} tone="mid" crease="faint" />
    <Solid paths={STAGE05_ART.projBody} tone="mid" crease="faint" inner={<Line d={STAGE05_ART.projSeam} tone="faint" />} />
    <RecessScreen recess={STAGE05_ART.projRecess} bars={STAGE05_ART.projBars} />
    {/* Cradled Visitor Phone + Future Expressive Audio Capsule */}
    <Solid paths={STAGE05_ART.phoneDock} tone="lo" crease="faint" />
    <Solid paths={STAGE05_ART.phoneBody} tone="hi" crease="faint" />
    <RecessScreen recess={STAGE05_ART.phoneRecess} bars={STAGE05_ART.phoneBars} />
    <Solid paths={STAGE05_ART.audioCapsuleBase} tone="mid" crease="faint" />
    <Solid paths={STAGE05_ART.audioCapsuleTop} tone="mid" crease="faint" />
    <Line d={STAGE05_ART.audioCapsuleSeal} tone="hi" />
  </g>
);

export interface BenchArtProps {
  selectedStage?: number | null;
  onSelectStage?: (stageIndex: number) => void;
  showExplodeControl?: boolean;
}

export function BenchArt({ selectedStage, onSelectStage, showExplodeControl = true }: BenchArtProps) {
  return (
    <BenchLive
      base={BASE}
      stage01Static={STAGE_01_STATIC}
      stage01VuBars={STAGE01_ART.vuBars}
      stage02Vault={STAGE_02_VAULT}
      stage02BusBase={STAGE_02_BUS_BASE}
      stage02Packet={STAGE_02_PACKET}
      stage03StaticBase={STAGE_03_STATIC_BASE}
      stage03MonitorRecess={STAGE03_ART.monitorRecess}
      stage04Static={STAGE_04_STATIC}
      stage05Static={STAGE_05_STATIC}
      selectedStage={selectedStage}
      onSelectStage={onSelectStage}
      showExplodeControl={showExplodeControl}
    />
  );
}
