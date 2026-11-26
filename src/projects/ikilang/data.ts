import type { IkiLangShowcaseData, MaturityStatus } from "./types";

export const MATURITY_LABELS: Record<MaturityStatus, string> = {
  proven: "Proven today",
  validating: "Active validation",
  gated: "Deliberately gated",
};

export const IKILANG_DATA: IkiLangShowcaseData = {
  productName: "IkiLang / KinyaVoice",
  coBrandLabel: "KinyaVoice · Powered by IkiLang",
  tagline:
    "Live Kinyarwanda-to-English captions for churches, clinics, and community rooms — in ~1 second on any phone browser.",
  heroSummary:
    "Plug into a room's soundboard or open a phone mic. Visitors scan a QR code and read live English captions with zero app download and zero personal data collected.",
  lastVerifiedDate: "2026-11-24",
  blackBoxNotice:
    "Core pipeline internals (model routing, prompts, domain glossaries, quality thresholds, and pricing) are black-boxed and excluded from this public repo.",
  timelineProvenanceNotice:
    "Illustrative 65-second timing simulation based on observed fast-speech pauses — not live model inference.",
  previewProvenanceNotice:
    "Illustrative multi-screen UI preview using sample text — not live model output.",
  audioDisarmedNotice:
    "Listener audio is disarmed during Phase 1A caption trials to prevent phone-speaker echo.",
  cryptographicHonestyNotice:
    "Audio and captions travel over encrypted HTTPS/WSS, while speech inference runs server-side — so it is never labeled End-to-End Encrypted (E2EE).",

  founderStory: {
    heading: "Why I'm building this",
    subtitle: "Language access that works both ways — without putting kids on the spot.",
    paragraphs: [
      "When newcomers visit a medical clinic, government office, non-profit, or church service, they often have to lean on their fluent children to translate — or bring an outside interpreter into a private conversation. The same barrier hits in reverse when NGOs, non-profits, evangelical missionaries, visiting clinics, and travelers work alongside local communities and expect everyone else to switch to English.",
      "Standard translation apps fail in live rooms. Turn-based tools wait for a long silence that fast speakers never give, freeze for up to a minute, and lose context across Kinyarwanda's 16 noun classes. I am building IkiLang starting with Kinyarwanda — my everyday mother tongue, shaped by direct community validation — to prove fast, reliable streaming on a low-resource language first and reuse the same architecture for others.",
    ],
    languageStewardshipNote:
      "Kinyarwanda is my everyday mother tongue, guided by direct community validation from daily speakers and church soundboard volunteers.",
    blueprintPrinciple:
      "Get 16 kHz capture, sub-1.5 s streaming, and offline error benchmarks right for Kinyarwanda first — then add new languages behind the same interface.",
  },

  bridgeDirections: [
    {
      id: "newcomers-residents",
      directionLabel: "Direction 1 · For newcomers & residents",
      title: "Newcomers & multilingual residents",
      audience: "Immigrants, refugees, elders, and residents navigating essential daily services.",
      settings: ["Medical clinics", "Government offices", "Non-profit intake", "Church worship"],
      valueStatement:
        "Scan a QR code to follow consultations and sermons privately on your own phone — no app install or sign-up.",
      dignityHighlight:
        "Keeps personal moments private without pulling fluent kids out of school or relying on an outside interpreter.",
    },
    {
      id: "outreach-visitors",
      directionLabel: "Direction 2 · For visiting teams",
      title: "NGOs, non-profits, missionaries, clinics & travelers",
      audience:
        "Humanitarian teams, evangelical missionaries, visiting clinicians, educators, and tourists.",
      settings: ["NGO programs", "Visiting clinics", "Ministry outreach", "Travel"],
      valueStatement:
        "Follow local hosts speaking naturally in their everyday mother tongue instead of asking the whole room to switch languages.",
      dignityHighlight:
        "Lets local speakers lead at natural pace over a soundboard or portable USB mic.",
    },
  ],

  toolCategories: [
    {
      id: "backend-streaming",
      category: "Backend & streaming",
      purpose: "16 kHz PCM capture, resilient WebSockets, and a swappable model interface.",
      tools: ["Python", "FastAPI", "WebSockets"],
    },
    {
      id: "frontend-audio",
      category: "Browser audio & screens",
      purpose: "Phone/soundboard capture in Chrome/Safari plus readable mobile and projector views.",
      tools: ["React", "TypeScript", "Web Audio API"],
    },
    {
      id: "speech-ecosystems",
      category: "Speech models tested",
      purpose: "Cloud streaming APIs and local runtimes benchmarked behind one backend boundary.",
      tools: [
        "Google Gemini Live API",
        "Google Cloud Speech & Translation",
        "NVIDIA NeMo",
        "ONNX Runtime",
      ],
    },
    {
      id: "verification-delivery",
      category: "Testing & deployment",
      purpose: "Automated backend/frontend tests, offline latency scripts, and GitHub Pages CI.",
      tools: ["pytest", "Vitest", "Docker", "GitHub Actions"],
    },
  ],

  disciplineSignals: [
    {
      id: "automated-tests",
      metric: "451 tests",
      label: "Automated test suite",
      detail: "385 Python pytest + 66 TypeScript Vitest tests passing with zero lint errors.",
    },
    {
      id: "latency-budget",
      metric: "+1.02 s",
      label: "Replay caption delay",
      detail: "Time from speech end to first English caption over live 16 kHz PCM WebSockets.",
    },
    {
      id: "guardrail-overhead",
      metric: "0.10 ms",
      label: "p95 guardrail check",
      detail: "0.044 ms median across 7,000 clean and adversarial quality checks.",
    },
    {
      id: "clause-eval",
      metric: "0% cutoffs",
      label: "Clause-split fixture",
      detail: "Mid-sentence cutoffs down from 85.7% on a fixed silence-timer baseline.",
    },
    {
      id: "zero-pii",
      metric: "Zero PII",
      label: "Anonymous QR join",
      detail: "No user accounts, names, IPs, or analytics trackers on listener links.",
    },
    {
      id: "eval-gate",
      metric: "Eval first",
      label: "Training gate",
      detail: "No fine-tuning until 30–50+ consented segments per domain are measured first.",
    },
  ],

  timelineFrames: [
    {
      timeSec: 0,
      speakerLine: "Good morning everyone, thank you for gathering with your families today.",
      breathPauseMs: 220,
      turnBasedCaption: "Listening… waiting for end of speaker turn.",
      turnBasedStatus: "waiting",
      continuousCaption: "Good morning everyone — thank you for gathering with your families today.",
      continuousStatus: "delivered",
      latencyNote: "Continuous captions appear in ~1.1 s; the turn-based screen stays blank.",
    },
    {
      timeSec: 9,
      speakerLine: "Please welcome every visitor joining our community room for the first time.",
      breathPauseMs: 280,
      turnBasedCaption: "Still waiting… 280 ms breath pause too short to close turn.",
      turnBasedStatus: "stalled",
      continuousCaption: "Please welcome every visitor joining our community room for the first time.",
      continuousStatus: "delivered",
      latencyNote: "A 280 ms breath keeps turn detection open, while streaming publishes on time.",
    },
    {
      timeSec: 19,
      speakerLine: "Hospitality begins by helping newcomers follow every word clearly.",
      breathPauseMs: 310,
      turnBasedCaption: "19 s elapsed — listener screen still blank.",
      turnBasedStatus: "stalled",
      continuousCaption: "Hospitality begins by helping newcomers follow every word clearly.",
      continuousStatus: "delivered",
      latencyNote: "Listeners stay synced without asking the speaker to pause after every line.",
    },
    {
      timeSec: 30,
      speakerLine: "Our volunteer team is ready to support new families with school and clinic schedules.",
      breathPauseMs: 260,
      turnBasedCaption: "30 s elapsed — turn-based listener view remains stalled.",
      turnBasedStatus: "stalled",
      continuousCaption: "Our volunteer team is ready to support new families with school and clinic schedules.",
      continuousStatus: "delivered",
      latencyNote: "Half a minute in, turn-based users still see nothing while stream delay stays < 1.5 s.",
    },
    {
      timeSec: 42,
      speakerLine: "If you need quiet intake support afterward, coordinators are at the east desk.",
      breathPauseMs: 390,
      turnBasedCaption: "42 s elapsed — rapid delivery prevents flush.",
      turnBasedStatus: "stalled",
      continuousCaption: "If you need quiet intake support afterward, coordinators are at the east desk.",
      continuousStatus: "delivered",
      latencyNote: "Room directions reach visitor phones right as they are spoken.",
    },
    {
      timeSec: 53,
      speakerLine: "Let us listen patiently and leave space for every voice in our room.",
      breathPauseMs: 340,
      turnBasedCaption: "53 s elapsed — buffer still accumulating uninterrupted speech.",
      turnBasedStatus: "stalled",
      continuousCaption: "Let us listen patiently and leave space for every voice in our room.",
      continuousStatus: "delivered",
      latencyNote: "Sixth clause delivered smoothly while the turn-based buffer sits stalled past 50 s.",
    },
    {
      timeSec: 61,
      speakerLine: "[Speaker pauses for 1.8 s while turning a page.]",
      breathPauseMs: 1800,
      turnBasedCaption:
        "Good morning everyone thank you for gathering with your families today please welcome every visitor joining our community room hospitality begins by helping newcomers follow every word clearly our volunteer team is ready to support new families if you need quiet intake support coordinators are at the east desk let us listen patiently.",
      turnBasedStatus: "dumped",
      continuousCaption: "Pause detected — earlier clauses remain readable in book-scroll order above.",
      continuousStatus: "delivered",
      latencyNote: "After a page turn, the turn-based screen dumps a 61 s unpunctuated wall of text.",
    },
    {
      timeSec: 65,
      speakerLine: "Now let us read page four of the bulletin together.",
      breathPauseMs: 240,
      turnBasedCaption: "Listening… waiting for next long silence while readers scroll.",
      turnBasedStatus: "waiting",
      continuousCaption: "Now let us read page four of the bulletin together.",
      continuousStatus: "streaming",
      latencyNote: "Continuous streaming moves straight to the next sentence while readers catch up.",
    },
  ],

  previewScenarios: [
    {
      id: "sanctuary",
      label: "Sanctuary",
      directionTag: "Direction 1 · Community worship",
      contextLabel: "Sanctuary · Captions-only live trial",
      pcmHint: "16 kHz Mono PCM · Soundboard Line-Out",
      priorLines: [
        "Welcome to everyone joining our gathering in person and in the overflow hall.",
        "Today we reflect on patience, reconciliation, and caring for our neighbors.",
      ],
      justSaid: "Hospitality means no family sits in the back row disconnected from the message.",
      activeLine: "Volunteers will be in the foyer after service with translated welcome cards.",
      audienceNote:
        "Audience audio stays disarmed during Phase 1A so phone speakers cannot echo in the sanctuary.",
      utteranceSteps: [
        {
          priorLines: [
            "Welcome to everyone joining our gathering in person and in the overflow hall.",
          ],
          justSaid: "Today we reflect on patience, reconciliation, and caring for our neighbors.",
          activeLine:
            "Hospitality means no family sits in the back row disconnected from the message.",
          speakerPaceNote: "Steady delivery · 260 ms breath",
        },
        {
          priorLines: [
            "Welcome to everyone joining our gathering in person and in the overflow hall.",
            "Today we reflect on patience, reconciliation, and caring for our neighbors.",
          ],
          justSaid:
            "Hospitality means no family sits in the back row disconnected from the message.",
          activeLine: "Volunteers will be in the foyer after service with translated welcome cards.",
          speakerPaceNote: "Rapid clause · < 1.5 s cadence",
        },
        {
          priorLines: [
            "Today we reflect on patience, reconciliation, and caring for our neighbors.",
            "Hospitality means no family sits in the back row disconnected from the message.",
          ],
          justSaid: "Volunteers will be in the foyer after service with translated welcome cards.",
          activeLine: "Please greet someone nearby before heading downstairs for fellowship.",
          speakerPaceNote: "Upward book-scroll order",
        },
      ],
    },
    {
      id: "clinic-ngo",
      label: "Clinic / NGO",
      directionTag: "Direction 1 · Private reception access",
      contextLabel: "Clinic / NGO · Private mobile view",
      pcmHint: "16 kHz Mono PCM · Desk Directional Mic",
      priorLines: [
        "Welcome to the community clinic orientation desk this morning.",
        "First, our coordinator will verify your appointment card and pharmacy hours.",
      ],
      justSaid: "Read intake steps privately on your phone without asking a family member to interpret.",
      activeLine: "A certified human interpreter joins inside the exam room for medical consent.",
      audienceNote:
        "Zero visitor data logged. Certified human interpreters still handle medical diagnosis and consent.",
      utteranceSteps: [
        {
          priorLines: ["Welcome to the community clinic orientation desk this morning."],
          justSaid: "First, our coordinator will verify your appointment card and pharmacy hours.",
          activeLine:
            "Read intake steps privately on your phone without asking a family member to interpret.",
          speakerPaceNote: "Intake desk · 340 ms pause",
        },
        {
          priorLines: [
            "Welcome to the community clinic orientation desk this morning.",
            "First, our coordinator will verify your appointment card and pharmacy hours.",
          ],
          justSaid:
            "Read intake steps privately on your phone without asking a family member to interpret.",
          activeLine: "A certified human interpreter joins inside the exam room for medical consent.",
          speakerPaceNote: "Human handoff rule",
        },
        {
          priorLines: [
            "First, our coordinator will verify your appointment card and pharmacy hours.",
            "Read intake steps privately on your phone without asking a family member to interpret.",
          ],
          justSaid: "A certified human interpreter joins inside the exam room for medical consent.",
          activeLine: "Bus vouchers and housing forms are available at the non-profit desk across the hall.",
          speakerPaceNote: "Follow-up routing · zero-PII link",
        },
      ],
    },
    {
      id: "field-outreach",
      label: "Field outreach",
      directionTag: "Direction 2 · NGOs, Ministry & Travel",
      contextLabel: "Field outreach · Community partnership",
      pcmHint: "16 kHz Mono PCM · Portable USB Interface",
      priorLines: [
        "Local health hosts are opening today's clean-water workshop in their everyday mother tongue.",
        "Visiting NGO engineers and clinic partners follow directly on mobile browsers.",
      ],
      justSaid: "Local leaders speak naturally without slowing down or switching languages for guests.",
      activeLine: "Afternoon Q&A covers rainy-season maintenance priorities led by village coordinators.",
      audienceNote:
        "Shows live English captions for visiting teams. Outbound EN -> RW stays gated until Phase 2.",
      utteranceSteps: [
        {
          priorLines: [
            "Local health hosts are opening today's clean-water workshop in their everyday mother tongue.",
          ],
          justSaid:
            "Visiting NGO engineers and clinic partners follow directly on mobile browsers.",
          activeLine:
            "Local leaders speak naturally without slowing down or switching languages for guests.",
          speakerPaceNote: "Workshop speech · USB mic",
        },
        {
          priorLines: [
            "Local health hosts are opening today's clean-water workshop in their everyday mother tongue.",
            "Visiting NGO engineers and clinic partners follow directly on mobile browsers.",
          ],
          justSaid:
            "Local leaders speak naturally without slowing down or switching languages for guests.",
          activeLine:
            "Afternoon Q&A covers rainy-season maintenance priorities led by village coordinators.",
          speakerPaceNote: "No app needed for guests",
        },
        {
          priorLines: [
            "Visiting NGO engineers and clinic partners follow directly on mobile browsers.",
            "Local leaders speak naturally without slowing down or switching languages for guests.",
          ],
          justSaid:
            "Afternoon Q&A covers rainy-season maintenance priorities led by village coordinators.",
          activeLine: "Thank you to the village committee for hosting and guiding today's agenda.",
          speakerPaceNote: "EN -> RW gated for Phase 2",
        },
      ],
    },
  ],

  architectureLayers: [
    {
      id: "audio-ingest",
      step: 1,
      name: "Audio ingest",
      role: "Captures clean mono 16 kHz PCM from a USB soundboard feed or phone browser mic without clipping.",
      inputContract: "Soundboard Aux/Matrix USB interface or browser microphone stream.",
      outputContract: "Continuous mono 16 kHz PCM audio frames over WebSockets (WSS).",
      toolsEvaluated: ["Web Audio API", "TypeScript", "WebSockets", "FastAPI"],
      invariants: [
        "Verifies 16 kHz mono sample rate end-to-end between browser and backend.",
        "Resumes mobile AudioContext on tap so Android capture never sends silent zeros.",
        "Speakers focus 100% on the room without watching a control screen.",
      ],
      trialLimits: "Room mics pick up PA echo; direct soundboard line-out is standard.",
      isBlackBox: false,
    },
    {
      id: "speech-translation",
      step: 2,
      name: "Streaming translation",
      role: "Wraps real-time speech recognition and translation behind a swappable Cloud-to-NVIDIA cartridge boundary so providers can be tested offline or rolled back without disrupting rooms.",
      inputContract: "16 kHz mono PCM frames plus active language pair.",
      outputContract: "Translated English clauses with timing data and typed errors.",
      toolsEvaluated: [
        "Python",
        "FastAPI",
        "Google Gemini Live API",
        "Google Cloud Speech & Translation",
        "NVIDIA NeMo",
        "ONNX Runtime",
      ],
      invariants: [
        "Provider switches happen only in config or offline tests, never mid-sermon.",
        "Continuous streaming prevents ~60 s blackouts during rapid speaking.",
        "Private prompt logic and routing rules stay decoupled from the UI.",
      ],
      trialLimits: "Live trials support RW -> EN captions; EN -> RW and custom fine-tuning stay gated.",
      isBlackBox: true,
    },
    {
      id: "domain-evaluation",
      step: 3,
      name: "Quality & context",
      role: "Runs fast text checks, tracks multi-sentence context, and measures offline accuracy/latency outside core model weights.",
      inputContract: "Candidate English captions, room domain, and labeled test clips.",
      outputContract: "Approved captions or a calm uncertainty message, plus offline WER/latency logs.",
      toolsEvaluated: ["Python", "pytest", "ONNX Runtime"],
      invariants: [
        "Hot-path quality checks finish in 0.10 ms p95 so they never stall live delivery.",
        "Maintains multi-sentence history to resolve Kinyarwanda's 16 noun-class pronouns.",
        "No fine-tuning proceeds without 30–50+ labeled segments per domain first.",
      ],
      trialLimits: "Live trials run in observation mode to log real errors without blocking captions.",
      isBlackBox: true,
    },
    {
      id: "privacy-telemetry",
      step: 4,
      name: "Anonymous telemetry",
      role: "Logs timing metrics, error counts, and session health without storing any listener identities.",
      inputContract: "Transient session IDs, stage timings, clause counts, and 1–5 star feedback.",
      outputContract: "Local post-event summary metrics for debugging latency and quality.",
      toolsEvaluated: ["Python", "pytest"],
      invariants: [
        "Never stores visitor names, emails, IP addresses, or browser fingerprints.",
        "Disk write errors cannot crash or pause active live caption delivery.",
        "Diagnostic test recordings stay off by default and hidden from audience URLs.",
      ],
      trialLimits: "Built for single-room diagnostics rather than cloud user analytics.",
      isBlackBox: false,
    },
    {
      id: "audience-delivery",
      step: 5,
      name: "Audience UI",
      role: "Pushes synced live captions simultaneously to QR-joined phones and a dark high-contrast projector screen.",
      inputContract: "Session captions anchored to each listener's join timestamp.",
      outputContract: "Accessible HTML5 captions in upward book-scroll order with zero HTTP 500s.",
      toolsEvaluated: ["React", "TypeScript", "Vitest", "WebSockets"],
      invariants: [
        "Audience endpoints catch downstream errors cleanly and never return HTTP 500.",
        "48 px touch targets, WCAG AA/AAA contrast, and shape/label status indicators.",
        "Audio playback remains disabled in UI and backend subscriptions during Phase 1A.",
      ],
      trialLimits: "Requires venue Wi-Fi or mobile data while streaming to cloud models.",
      isBlackBox: false,
    },
  ],

  maturityMatrix: [
    {
      capability: "Mono 16 kHz PCM ingest & continuous caption pacing (< 1.5 s target)",
      status: "proven",
      evidence: "+1.02 s live replay caption delay; 0% premature cutoffs on 16-clause fixture.",
      boundaryNote: "Single-clip check; reverberant venues require soundboard line-out.",
    },
    {
      capability: "Captions-only multi-screen UI (QR mobile, projector & never-500 fallback)",
      status: "proven",
      evidence: "451 tests (385 backend, 66 frontend) verifying QR join, book-scroll, and fallbacks.",
      boundaryNote: "Scoped to captions-only output during Phase 1A live trials.",
    },
    {
      capability: "Sub-millisecond quality guardrails & zero-PII anonymous telemetry",
      status: "proven",
      evidence: "0.044 ms median / 0.101 ms p95 across 7,000 checks; anonymous session logs.",
      boundaryNote: "Built for single-venue diagnostics rather than multi-tenant analytics.",
    },
    {
      capability: "Live sanctuary RW -> EN trials & 16-noun-class discourse tracking",
      status: "validating",
      evidence: "Observation-mode trials with community reviewers across worship and clinic contexts.",
      boundaryNote: "Tracking real idioms and pronoun continuity before strict enforcement.",
    },
    {
      capability: "Offline multi-provider benchmarking (cloud & local speech runtimes)",
      status: "validating",
      evidence: "Offline comparisons behind one swappable speech -> text -> translation seam.",
      boundaryNote: "Runs offline only; active live sessions never auto-switch providers.",
    },
    {
      capability: "Live audience audio streaming (listener TTS / audio playback)",
      status: "gated",
      evidence: "Visibly disabled in UI and backend subscriptions during Phase 1A trials.",
      boundaryNote: "Prevents speaker-blast hazards until Phase 1 caption accuracy stabilizes.",
    },
    {
      capability: "Bidirectional EN -> RW live translation",
      status: "gated",
      evidence: "Planned inside the pluggable provider seam; inactive in live trials.",
      boundaryNote: "Waiting on RW -> EN stability and community baseline reviews.",
    },
    {
      capability: "Custom model & voice fine-tuning",
      status: "gated",
      evidence: "Blocked behind an evaluation-first gate with consented baselines.",
      boundaryNote: "Requires 30–50+ labeled segments per domain and prompt tuning first.",
    },
    {
      capability: "Multi-tenant production scale & autonomous high-stakes use",
      status: "gated",
      evidence: "Current deployment targets supervised single-venue sessions.",
      boundaryNote: "Requires multi-venue reliability data and explicit human handoffs.",
    },
  ],

  shortcomingsAndHumanBoundary: {
    heading: "Limits & when humans remain essential",
    summary:
      "Live captions open access when no interpreter is available, but never replace certified human judgment when decisions carry high risk.",
    currentLimits: [
      "Room echo: open laptop/phone mics degrade in reverberant halls compared to a soundboard USB feed.",
      "Fast grammar shifts: rare idioms or rapid topic switches across 16 noun classes can still drift.",
      "Phase 1A scope: live RW -> EN captions only; EN -> RW translation and listener audio stay gated.",
      "Network dependency: live trials need stable room Wi-Fi or cell service.",
    ],
    humanEssentialScenarios: [
      "Medical diagnosis, surgical consent, emergency triage, and trauma counseling.",
      "Court hearings, immigration interviews, and legally binding contracts.",
      "Sensitive pastoral mediation requiring human empathy and cultural judgment.",
    ],
    closingPrinciple:
      "Honest software states what fails today and hands off clearly to human interpreters when stakes are high.",
  },

  privacyCommitments: [
    {
      title: "Zero personal data or trackers",
      detail: "Visitor QR pages collect no names, emails, IP addresses, or browser fingerprints.",
    },
    {
      title: "Transient anonymous IDs",
      detail: "Room counts and optional 1–5 ratings attach only to temporary session tokens.",
    },
    {
      title: "Honest encryption labels",
      detail: "Uses encrypted HTTPS/WSS in transit; server-side inference is never called End-to-End Encrypted.",
    },
    {
      title: "Default-off diagnostics",
      detail: "Debug test recordings stay off unless toggled per test and are never exposed on listener links.",
    },
  ],

  fieldSpecSteps: [
    { step: 1, label: "Soundboard line-out", detail: "Aux/Matrix output isolates clean vocal audio." },
    { step: 2, label: "USB interface", detail: "Converts balanced line signal without clipping." },
    { step: 3, label: "16 kHz capture", detail: "Locks mono PCM rate in browser or Python client." },
    { step: 4, label: "WSS stream", detail: "Streams audio chunks and returns clauses in ~1 s." },
    { step: 5, label: "QR & projector", detail: "Phone browsers and room displays update live." },
  ],

  roadmapPhases: [
    {
      id: "phase-1a",
      phase: "Phase 1A",
      title: "Live room captions-only trials",
      status: "validating",
      objective: "Keep RW -> EN captions under 1.5 s from a soundboard with listener audio off.",
      exitGate: "Sub-1.5 s p95 delay in live rooms, 0 HTTP 500s, verified listener feedback.",
    },
    {
      id: "phase-1b",
      phase: "Phase 1B",
      title: "Labeled multi-domain eval set",
      status: "validating",
      objective: "Build consented audio-text benchmarks for church, clinic, and NGO rooms.",
      exitGate: "30–50+ hand-labeled segments per domain with WER and error breakdown.",
    },
    {
      id: "phase-2",
      phase: "Phase 2A / 2B",
      title: "EN -> RW replies & mute-first audio",
      status: "gated",
      objective: "Enable English-to-Kinyarwanda captions plus opt-in headphones audio.",
      exitGate: "Community accuracy sign-off without slowing down Phase 1 captions.",
    },
    {
      id: "phase-3-4",
      phase: "Phase 3 & 4",
      title: "Custom adapters & more languages",
      status: "gated",
      objective: "Train lightweight adapters only if baselines show clear gaps, then onboard new languages.",
      exitGate: "Proven accuracy win over base models using consented local data.",
    },
  ],

  nvidiaMigrationGoal: {
    eyebrow: "NVIDIA Inception roadmap",
    heading: "Long-Term Goal: Cloud → NVIDIA Migration Gate",
    summary:
      "Move toward a self-hosted and edge speech stack with NVIDIA NeMo and ONNX Runtime without ever risking active live rooms.",
    liveBaselineLabel: "Current live baseline · Protected today",
    liveBaselineTitle: "Google Gemini Live API",
    liveBaselineDetail:
      "Proven sub-1.5 s cloud streaming remains the active live path for rooms until a self-hosted stack beats it in real audio tests.",
    longTermTargetLabel: "Long-term target · Self-hosted & edge",
    longTermTargetTitle: "NVIDIA NeMo & ONNX Runtime",
    longTermTargetDetail:
      "Quantized local inference and NVIDIA Inception-ready tooling evaluated offline behind the swappable Stage 02/03 boundary.",
    gatesHeading: "Four gates required before any live switchover",
    gates: [
      {
        id: "language-coverage",
        gateNumber: "01",
        title: "Language coverage gate",
        requirement:
          "Confirm Kinyarwanda and East African speech accuracy on official model cards and consented community audio.",
        guardrail: "Never assume low-resource language support from general marketing claims.",
      },
      {
        id: "license-community-trust",
        gateNumber: "02",
        title: "License & community trust gate",
        requirement:
          "Verify open and commercial license terms alongside consent-based community data governance before training or shipping.",
        guardrail: "Block any dataset or model weight that lacks clear consent or compatible licensing.",
      },
      {
        id: "mode-isolation",
        gateNumber: "03",
        title: "Mode isolation gate",
        requirement:
          "Keep live streaming, offline batch evaluation, fine-tuning prep, and local inference behind separate Stage 02/03 seams.",
        guardrail: "Never mix experimental adapters or batch evaluation code into live room servers.",
      },
      {
        id: "live-fallback-protection",
        gateNumber: "04",
        title: "Live fallback protection gate",
        requirement:
          "Keep the proven Google Gemini Live API path intact behind a feature flag during every local or edge trial.",
        guardrail: "Refuse live cutover until the NVIDIA path beats < 1.5 s latency and room accuracy targets.",
      },
    ],
    cutoverRule:
      "Live rooms never beta-test unverified models: cloud streaming stays the protected fallback until all four gates pass in real room acoustics.",
  },

  changelog: [
    {
      date: "2026-11-24",
      tag: "Verification",
      title: "Verified +1.02 s live replay latency, 0.10 ms guardrail & 451 tests",
      summary:
        "Measured +1.019 s caption delay after speech end on live WebSockets, 0% clause cutoffs, and overhauled showcase UX.",
      status: "proven",
    },
    {
      date: "2026-11-23",
      tag: "Showcase",
      title: "Launched standalone portfolio hub & CI disclosure check",
      summary: "Built interactive timeline, multi-screen preview, architecture explorer, and automated secret-sauce tests.",
      status: "validating",
    },
    {
      date: "2026-11-18",
      tag: "Room safety",
      title: "Locked captions-only safeguards for live church tests",
      summary: "Disabled audience audio, added upward book-scroll order, and anchored feeds to join time.",
      status: "proven",
    },
    {
      date: "2026-10-29",
      tag: "Benchmarks",
      title: "Built offline WebSocket latency & clause-split scripts",
      summary: "Added repeatable scripts to measure glass-to-caption speed and boundary accuracy before any training.",
      status: "validating",
    },
  ],
};
