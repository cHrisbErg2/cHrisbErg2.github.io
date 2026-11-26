const piece = (id) => `[data-piece="${id}"]`;

export default {
  page: "../../../.gemini/antigravity/brain/1eea7ef0-b32a-4c1f-885f-607412248ff2/scratch/bench-light.html",
  out: "ikilang-bench",
  kicker: "IkiLang / KinyaVoice · Technical Drawing",
  name: "Live translation bench",
  title: "The Live Translation Bench: 5-Stage Captions Pipeline",
  number: "IK-001",
  tagline: "16 kHz PCM · Sealed core boundary · 0 PII",

  views: {
    rest: {},
    apart: {
      actions: [["key", " "], ["wait", 2200]],
      reset: [["key", " "], ["wait", 2200]],
    },
  },

  spec: [
    ["Audio", "16 kHz mono PCM"],
    ["Latency", "+1.02 s (< 1.5 s)"],
    ["Guardrail", "0.10 ms p95 check"],
    ["Tests", "451 automated"],
    ["Privacy", "0 PII · Audio off"],
    ["Migration", "Cloud → NVIDIA Gate"],
  ],

  parts: [
    {
      id: "stage-01",
      name: "Audio ingest box",
      say: "Balanced XLR feed, moving fader, gain knob, and 16 kHz meter.",
      select: piece("stage-01"),
    },
    {
      id: "stage-02",
      name: "Streaming core (sealed)",
      say: "Sprung clause carriage and tamper-bolted Vault A boundary.",
      select: piece("stage-02"),
    },
    {
      id: "stage-03",
      name: "Guardrail & dial (sealed)",
      say: "Sealed Cassette B coupled to the +1.02 s radial dial gauge.",
      select: piece("stage-03"),
    },
    {
      id: "stage-04",
      name: "Anonymous tally & 0 PII",
      say: "Mechanical clause counter paired with isolated zero-PII ground.",
      select: piece("stage-04"),
    },
    {
      id: "stage-05",
      name: "Audience QR & displays",
      say: "Bench QR tile, projector panel, and muted visitor phone.",
      select: piece("stage-05"),
    },
  ],

  main: { view: "apart" },
  inset: { label: "Assembled", view: "rest" },

  steps: [
    { view: "apart", title: "Capture 16 kHz mono PCM", focus: ["stage-01"] },
    { view: "apart", title: "Cloud → NVIDIA Migration Gate", focus: ["stage-02"] },
    { view: "apart", title: "0.10 ms check, +1.02 s dial", focus: ["stage-03"] },
    { view: "apart", title: "Log 451-test, 0 PII tally", focus: ["stage-04"] },
    { view: "apart", title: "Publish QR & muted displays", focus: ["stage-05"] },
  ],
};
