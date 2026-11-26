const piece = (id) => `[data-piece="${id}"]`;

export default {
  page: "../../../.gemini/antigravity/brain/1eea7ef0-b32a-4c1f-885f-607412248ff2/scratch/bench-light.html",
  out: "ikilang-bench",
  kicker: "IkiLang / KinyaVoice · Software Architecture",
  name: "Streaming software pipeline",
  title: "IkiLang / KinyaVoice: 5-Stage Software Streaming Pipeline",
  number: "IK-001",
  tagline: "16 kHz audio stream · Cloud today, local host future · 0 PII",

  views: {
    rest: {},
    apart: {
      actions: [["key", " "], ["wait", 2200]],
      reset: [["key", " "], ["wait", 2200]],
    },
  },

  spec: [
    ["Audio", "16 kHz mono PCM"],
    ["Replay delay", "+1.02 s (< 1.5 s target)"],
    ["Guardrail", "0.10 ms p95 check"],
    ["Privacy", "0 PII · Audio gated"],
    ["Deployment", "Web app · Future local/plugins"],
    ["Target stack", "NVIDIA NeMo & ONNX"],
  ],

  parts: [
    {
      id: "stage-01",
      name: "Audio stream capture",
      say: "Web Audio capture terminal streaming 16 kHz mono PCM.",
      select: piece("stage-01"),
    },
    {
      id: "stage-02",
      name: "Translation core (sealed)",
      say: "Cloud runtime today, future host-run local model, sealed Vault A.",
      select: piece("stage-02"),
    },
    {
      id: "stage-03",
      name: "Accuracy & latency monitor",
      say: "Sealed verification cassette and live latency bar display.",
      select: piece("stage-03"),
    },
    {
      id: "stage-04",
      name: "Privacy & plugin dock",
      say: "Zero-PII shield paired with future media and hosting plugin slots.",
      select: piece("stage-04"),
    },
    {
      id: "stage-05",
      name: "Web captions & future audio",
      say: "QR web app, projector display, and future expressive voice capsule.",
      select: piece("stage-05"),
    },
  ],

  main: { view: "apart" },
  inset: { label: "Assembled", view: "rest" },

  steps: [
    { view: "apart", title: "Stream 16 kHz mono audio", focus: ["stage-01"] },
    { view: "apart", title: "Translate in cloud or local host", focus: ["stage-02"] },
    { view: "apart", title: "Verify context & < 1.5 s target", focus: ["stage-03"] },
    { view: "apart", title: "Enforce 0 PII & plugin dock", focus: ["stage-04"] },
    { view: "apart", title: "Deliver captions (+ future audio)", focus: ["stage-05"] },
  ],
};
