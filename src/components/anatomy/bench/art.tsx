import * as React from "react";
import { Dots, FaceText, Line, Solid, Wire } from "../../iso/draw";
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
    <Solid paths={STAGE01_ART.cordAnchor} tone="mid" crease="faint" />
    <Solid paths={STAGE01_ART.xlrBoot} tone="mid" crease="faint" />
    <Solid paths={STAGE01_ART.xlrBarrel} tone="mid" crease="faint" />
    <Solid paths={STAGE01_ART.xlrCollar} tone="mid" crease="faint" />
    <Wire from={STAGE01_ART.cordFrom} via={STAGE01_ART.cordVia} to={STAGE01_ART.cordTo} tone="mid" ends="both" size={0.9} />
    <Solid paths={STAGE01_ART.box} tone="mid" crease="faint" inner={<Line d={STAGE01_ART.boxSeam} tone="faint" />} />
    <Line d={STAGE01_ART.boxInset} tone="faint" />
    <Dots points={STAGE01_ART.boxScrews} size={0.45} tone="mid" />
    <Solid paths={STAGE01_ART.outStub} tone="mid" crease="faint" />
    <Solid paths={STAGE01_ART.faderSlot} tone="lo" crease="none" />
    <Solid paths={STAGE01_ART.gainCollar} tone="lo" crease="faint" />
    <Solid paths={STAGE01_ART.gainKnob} tone="mid" crease="faint" />
    <Line d={STAGE01_ART.gainKnurl} tone="lo" />
    <Line d={STAGE01_ART.gainPointer} tone="hi" />
    <Dots points={STAGE01_ART.gainCenterDot} size={0.45} tone="hi" />
  </g>
);

const STAGE_01_FADER_CAP = (
  <g key="stage-01-fader-cap">
    <Solid paths={STAGE01_ART.faderCapRest} tone="hi" crease="faint" />
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

const STAGE_02_BED_BACK = (
  <g key="stage-02-bed-back">
    <Solid paths={STAGE02_ART.carriageBed} tone="lo" crease="faint" />
    <Line d={STAGE02_ART.carriageGrid} tone="faint" />
    <Solid paths={STAGE02_ART.endStops[0]!} tone="mid" crease="faint" />
  </g>
);

const STAGE_02_RODS = (
  <g key="stage-02-rods">
    {STAGE02_ART.rods.map((paths, idx) => (
      <Solid key={idx} paths={paths} tone="mid" crease="none" />
    ))}
  </g>
);

const STAGE_02_CARRIAGE = (
  <g key="stage-02-carriage">
    {STAGE02_ART.carriageBushings.map((paths, idx) => (
      <Solid key={idx} paths={paths} tone="mid" crease="faint" />
    ))}
    <Dots points={STAGE02_ART.carriageBushDots} size={0.42} tone="mid" />
    <Solid paths={STAGE02_ART.carriagePlate} tone="mid" crease="faint" />
    <Solid paths={STAGE02_ART.clauseBlock} tone="hi" crease="lo" />
    <Line d={STAGE02_ART.clauseBlockOutline} tone="faint" />
  </g>
);

const STAGE_02_STOP_FRONT = (
  <g key="stage-02-stop-front">
    <Solid paths={STAGE02_ART.endStops[1]!} tone="mid" crease="faint" />
    <Dots points={STAGE02_ART.endStopDots} size={0.45} tone="mid" />
  </g>
);

const STAGE_03_STATIC = (
  <g key="stage-03-static">
    {/* Sealed Cassette B */}
    <Solid paths={STAGE03_ART.cassetteBase} tone="lo" crease="faint" />
    <Solid paths={STAGE03_ART.cassetteBody} tone="hi" crease="lo" inner={<Line d={STAGE03_ART.cassetteSeam} tone="faint" />} />
    <Solid paths={STAGE03_ART.cassetteLatch} tone="mid" crease="faint" />
    <Solid paths={STAGE03_ART.cassettePlate} tone="mid" crease="faint" />
    <Line d={STAGE03_ART.cassettePlateLine} tone="faint" />
    {STAGE03_ART.cassetteStuds.map((paths, idx) => (
      <Solid key={idx} paths={paths} tone="hi" crease="none" />
    ))}
    <Dots points={STAGE03_ART.cassetteStudDots} size={0.45} tone="hi" />
    {/* Coupling Plunger & Vertical Stand Dial Gauge */}
    <Solid paths={STAGE03_ART.dialStand} tone="lo" crease="faint" />
    <Dots points={STAGE03_ART.dialStandDots} size={0.45} tone="mid" />
    <Solid paths={STAGE03_ART.plungerRodLeft} tone="mid" crease="none" />
    <Solid paths={STAGE03_ART.plungerCollar} tone="hi" crease="faint" />
    <Solid paths={STAGE03_ART.plungerRodRight} tone="mid" crease="none" />
    <Solid paths={STAGE03_ART.plungerSleeve} tone="mid" crease="faint" />
    <Solid paths={STAGE03_ART.dialCollar} tone="mid" crease="faint" />
    <Solid paths={STAGE03_ART.dialColumnLow} tone="mid" crease="none" />
    <Line d={STAGE03_ART.dialColumnSeams} tone="faint" />
    <Solid paths={STAGE03_ART.dialClamp} tone="mid" crease="faint" />
    <Solid paths={STAGE03_ART.dialColumnHigh} tone="mid" crease="none" />
    <Solid paths={STAGE03_ART.dialThumbNeck} tone="mid" crease="none" />
    <Solid paths={STAGE03_ART.dialThumb} tone="mid" crease="faint" />
    <Line d={STAGE03_ART.dialThumbKnurl} tone="lo" />
    <Solid paths={STAGE03_ART.dialLug} tone="mid" crease="faint" />
    <Solid paths={STAGE03_ART.dialPuck} tone="hi" crease="lo" />
    <Line d={STAGE03_ART.dialBand} tone="faint" />
    <Line d={STAGE03_ART.dialKnurl} tone="lo" />
    <Line d={STAGE03_ART.dialBezel} tone="lo" />
    <Line d={STAGE03_ART.dialFace} tone="faint" />
    <Line d={STAGE03_ART.dialMinor} tone="lo" />
    <Line d={STAGE03_ART.dialMajor} tone="mid" />
    <Dots points={STAGE03_ART.dialTargetDot} size={0.75} tone="hi" />
    <Line d={STAGE03_ART.dialHub} tone="mid" />
    <FaceText transform={STAGE03_ART.dialLabelTransform} size={2.7} tone="lo" anchor="middle">
      s
    </FaceText>
    <Solid paths={STAGE03_ART.dialCrownStem} tone="mid" crease="faint" />
    <Solid paths={STAGE03_ART.dialCrownCap} tone="mid" crease="faint" />
  </g>
);

const STAGE_04_STATIC = (
  <g key="stage-04-static">
    <Solid paths={STAGE04_ART.plinth} tone="lo" crease="faint" />
    <Solid paths={STAGE04_ART.body} tone="mid" crease="faint" inner={<Line d={STAGE04_ART.bodySeam} tone="faint" />} />
    <Solid paths={STAGE04_ART.bezel} tone="mid" crease="faint" />
    {STAGE04_ART.wheels.map((paths, idx) => (
      <Solid key={idx} paths={paths} tone="hi" crease="faint" />
    ))}
    <Line d={STAGE04_ART.wheelMarks} tone="faint" />
    <Solid paths={STAGE04_ART.resetNeck} tone="mid" crease="none" />
    <Solid paths={STAGE04_ART.resetKnob} tone="mid" crease="faint" />
    <Line d={STAGE04_ART.resetKnurl} tone="lo" />
    {/* Isolated 0 PII Open Ground Post */}
    <Solid paths={STAGE04_ART.groundBase} tone="lo" crease="faint" />
    <Solid paths={STAGE04_ART.groundPost} tone="mid" crease="none" />
    <Solid paths={STAGE04_ART.groundNut} tone="hi" crease="faint" />
    <Solid paths={STAGE04_ART.groundCap} tone="mid" crease="faint" />
    <Line d={STAGE04_ART.groundRing} tone="lo" />
  </g>
);

const STAGE_05_STATIC = (
  <g key="stage-05-static">
    {/* Raised QR Tile Plinth */}
    <Solid paths={STAGE05_ART.qrPlinth} tone="lo" crease="faint" />
    <Solid paths={STAGE05_ART.qrTile} tone="hi" crease="faint" />
    <Line d={STAGE05_ART.qrFinders} tone="hi" />
    <Line d={STAGE05_ART.qrCells} tone="mid" />
    {/* Sanctuary Projector Panel on Swivel Post */}
    <Solid paths={STAGE05_ART.projFoot} tone="lo" crease="faint" />
    <Solid paths={STAGE05_ART.projPost} tone="mid" crease="none" />
    <Solid paths={STAGE05_ART.projKnuckle} tone="mid" crease="faint" />
    <Solid paths={STAGE05_ART.projBody} tone="mid" crease="faint" inner={<Line d={STAGE05_ART.projSeam} tone="faint" />} />
    <RecessScreen recess={STAGE05_ART.projRecess} bars={STAGE05_ART.projBars} />
    {/* Cradled Visitor Phone in Milled Dock + Muted Audio Lock Cap */}
    <Solid paths={STAGE05_ART.phoneDock} tone="lo" crease="faint" />
    <Solid paths={STAGE05_ART.phoneBody} tone="hi" crease="faint" />
    <RecessScreen recess={STAGE05_ART.phoneRecess} bars={STAGE05_ART.phoneBars} />
    <Solid paths={STAGE05_ART.muteBlock} tone="mid" crease="faint" />
    <Solid paths={STAGE05_ART.muteCap} tone="mid" crease="faint" />
    <Line d={STAGE05_ART.muteSeal} tone="hi" />
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
      stage01FaderCap={STAGE_01_FADER_CAP}
      stage01VuBars={STAGE01_ART.vuBars}
      stage02Vault={STAGE_02_VAULT}
      stage02BedBack={STAGE_02_BED_BACK}
      stage02Rods={STAGE_02_RODS}
      stage02Carriage={STAGE_02_CARRIAGE}
      stage02StopFront={STAGE_02_STOP_FRONT}
      stage03Static={STAGE_03_STATIC}
      stage04Static={STAGE_04_STATIC}
      stage05Static={STAGE_05_STATIC}
      selectedStage={selectedStage}
      onSelectStage={onSelectStage}
      showExplodeControl={showExplodeControl}
    />
  );
}
