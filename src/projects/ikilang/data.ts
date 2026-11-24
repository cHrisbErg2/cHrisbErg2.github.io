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
    "Low-latency, privacy-minimal speech translation built for live rooms and bidirectional community dignity.",
  heroSummary:
    "Starting with Kinyarwanda as Blueprint #1, IkiLang targets sub-1.5 s continuous captions across soundboards, zero-download phones, and reproducible offline checks.",
  lastVerifiedDate: "2026-11-24",
  blackBoxNotice:
    "Private internals (model routing, prompts, glossaries, scoring rules, thresholds, and pricing) are intentionally black-boxed and excluded from this repo.",
  timelineProvenanceNotice:
    "Illustrative timing simulation modeled on observed uninterrupted speech — not live inference.",
  previewProvenanceNotice:
    "Illustrative UI preview using synthetic sample text — not live model output.",
  audioDisarmedNotice:
    "Audio deliberately disarmed during Phase 1A caption trials",
  cryptographicHonestyNotice:
    "Live audio and captions use encrypted HTTPS/WSS transport; real-time inference runs server-side and is never labeled End-to-End Encrypted (E2EE).",

  founderStory: {
    heading: "Why I'm building this",
    subtitle: "Dignity in both directions — engineered for real rooms, not static demos.",
    paragraphs: [
      "Newcomers in medical clinics, government offices, non-profits, and churches often have to lean on fluent children or bring a human intermediary into private conversations. The reverse happens just as often: NGOs, non-profits, evangelical missionaries, visiting clinics, and tourists struggle to connect naturally with local communities because outside tools expect locals to adapt to a major language.",
      "Existing apps miss live low-resource speech: turn-based tools stall under fast uninterrupted speakers, drop grammatical continuity, flatten tone and expression, and lock venues into closed standalone apps. I am building IkiLang as a pluggable, evaluation-first blueprint starting with Kinyarwanda — my everyday mother tongue — before expanding to additional underrepresented languages.",
    ],
    languageStewardshipNote:
      "Kinyarwanda is my everyday mother tongue, guided by direct community validation from daily speakers and church technical volunteers.",
    blueprintPrinciple:
      "Proving clean ingest, pacing, offline baselines, and zero-PII delivery on Kinyarwanda creates a repeatable blueprint for additional languages.",
  },

  bridgeDirections: [
    {
      id: "newcomers-residents",
      directionLabel: "Direction 1 · Host communities",
      title: "Newcomers & multilingual residents",
      audience: "Immigrants, refugees, elders, and residents navigating essential daily services.",
      settings: ["Medical clinics", "Government offices", "Non-profit intake", "Church worship"],
      valueStatement:
        "Follow consultations and sermons privately on a personal phone via QR code — no app install or sign-up.",
      dignityHighlight:
        "Protects independence and confidentiality without burdening bilingual children or informal intermediaries.",
    },
    {
      id: "outreach-visitors",
      directionLabel: "Direction 2 · Local partnerships",
      title: "NGOs, non-profits, missionaries, clinics & travelers",
      audience:
        "Humanitarian teams, evangelical missionaries, visiting clinicians, educators, and tourists.",
      settings: ["NGO programs", "Visiting clinics", "Ministry outreach", "Travel"],
      valueStatement:
        "Participate respectfully alongside local speakers in everyday mother tongues instead of forcing outside languages.",
      dignityHighlight:
        "Keeps host speakers at the center with low-friction browser and soundboard workflows.",
    },
  ],

  toolCategories: [
    {
      id: "backend-streaming",
      category: "Backend & streaming",
      purpose: "Low-latency PCM ingestion, resilient WebSockets, and strict provider seams.",
      tools: ["Python", "FastAPI", "WebSockets"],
    },
    {
      id: "frontend-audio",
      category: "Frontend & browser capture",
      purpose: "Mobile Web Audio capture, accessible multi-screen captions, and QR delivery.",
      tools: ["React", "TypeScript", "Web Audio API"],
    },
    {
      id: "speech-ecosystems",
      category: "Speech & translation ecosystems",
      purpose: "Cloud streaming APIs and local runtimes evaluated behind one swappable interface.",
      tools: [
        "Google Gemini Live API",
        "Google Cloud Speech & Translation",
        "NVIDIA NeMo",
        "ONNX Runtime",
      ],
    },
    {
      id: "verification-delivery",
      category: "Verification & CI",
      purpose: "Automated test suites, offline latency/error harnesses, and static Pages CI.",
      tools: ["pytest", "Vitest", "Docker", "GitHub Actions"],
    },
  ],

  disciplineSignals: [
    {
      id: "automated-tests",
      metric: "451 tests",
      label: "Automated verification",
      detail: "385 backend pytest + 66 frontend Vitest tests passing with zero lint errors.",
    },
    {
      id: "latency-budget",
      metric: "+1.02 s",
      label: "Live replay caption delay",
      detail: "Measured after speech end over paced 16 kHz PCM WebSockets (single-clip check).",
    },
    {
      id: "guardrail-overhead",
      metric: "0.10 ms",
      label: "Guardrail p95 overhead",
      detail: "0.044 ms median across 7,000 clean and adversarial hot-path quality checks.",
    },
    {
      id: "clause-eval",
      metric: "0% cutoffs",
      label: "Offline clause fixture",
      detail: "Premature mid-thought cutoffs down from 85.7% on a fixed-debounce baseline.",
    },
    {
      id: "zero-pii",
      metric: "Zero PII",
      label: "Anonymous delivery",
      detail: "No accounts, IPs, fingerprints, or trackers; transient session tokens only.",
    },
    {
      id: "eval-gate",
      metric: "Eval first",
      label: "Fine-tuning gate",
      detail: "Requires 30–50+ consented labeled segments per domain before any training.",
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
      latencyNote: "Continuous stream publishes in ~1.1 s; turn-based endpoint stays blank.",
    },
    {
      timeSec: 9,
      speakerLine: "Please welcome every visitor joining our community room for the first time.",
      breathPauseMs: 280,
      turnBasedCaption: "Still waiting… 280 ms breath pause too short to close turn.",
      turnBasedStatus: "stalled",
      continuousCaption: "Please welcome every visitor joining our community room for the first time.",
      continuousStatus: "delivered",
      latencyNote: "280 ms breath keeps turn buffer open; continuous captions stay synced.",
    },
    {
      timeSec: 19,
      speakerLine: "Hospitality begins by helping newcomers follow every word clearly.",
      breathPauseMs: 310,
      turnBasedCaption: "19 s elapsed — listener screen still blank.",
      turnBasedStatus: "stalled",
      continuousCaption: "Hospitality begins by helping newcomers follow every word clearly.",
      continuousStatus: "delivered",
      latencyNote: "Listeners stay engaged without asking the speaker to slow down.",
    },
    {
      timeSec: 30,
      speakerLine: "Our volunteer team is ready to support new families with school and clinic schedules.",
      breathPauseMs: 260,
      turnBasedCaption: "30 s elapsed — turn-based listener view remains stalled.",
      turnBasedStatus: "stalled",
      continuousCaption: "Our volunteer team is ready to support new families with school and clinic schedules.",
      continuousStatus: "delivered",
      latencyNote: "Continuous cadence holds under 1.5 s; turn-based appears frozen.",
    },
    {
      timeSec: 42,
      speakerLine: "If you need quiet intake support afterward, coordinators are at the east desk.",
      breathPauseMs: 390,
      turnBasedCaption: "42 s elapsed — rapid delivery prevents flush.",
      turnBasedStatus: "stalled",
      continuousCaption: "If you need quiet intake support afterward, coordinators are at the east desk.",
      continuousStatus: "delivered",
      latencyNote: "Actionable details arrive immediately; turn-based remains silent.",
    },
    {
      timeSec: 53,
      speakerLine: "Let us listen patiently and leave space for every voice in our room.",
      breathPauseMs: 340,
      turnBasedCaption: "53 s elapsed — buffer still accumulating uninterrupted speech.",
      turnBasedStatus: "stalled",
      continuousCaption: "Let us listen patiently and leave space for every voice in our room.",
      continuousStatus: "delivered",
      latencyNote: "Sixth clause delivered smoothly while turn-based delay exceeds 50 s.",
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
      latencyNote: "Turn-based dumps a 61 s wall of unpunctuated text all at once.",
    },
    {
      timeSec: 65,
      speakerLine: "Now let us read page four of the bulletin together.",
      breathPauseMs: 240,
      turnBasedCaption: "Listening… waiting for next long silence while readers scroll.",
      turnBasedStatus: "waiting",
      continuousCaption: "Now let us read page four of the bulletin together.",
      continuousStatus: "streaming",
      latencyNote: "Continuous stream transitions cleanly to the next clause (< 1.3 s).",
    },
  ],

  previewScenarios: [
    {
      id: "sanctuary",
      label: "Sanctuary",
      directionTag: "Direction 1 · Host gathering",
      contextLabel: "Sanctuary · Captions-only live trial",
      pcmHint: "16 kHz Mono PCM · Soundboard Line-Out",
      priorLines: [
        "Welcome to everyone joining our gathering in person and in the overflow hall.",
        "Today we reflect on patience, reconciliation, and caring for our neighbors.",
      ],
      justSaid: "Hospitality means no family sits in the back row disconnected from the message.",
      activeLine: "Volunteers will be in the foyer after service with translated welcome cards.",
      audienceNote:
        "Audience audio stays disarmed during Phase 1A to prevent sanctuary speaker feedback.",
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
          speakerPaceNote: "Chronological upward book-scroll",
        },
      ],
    },
    {
      id: "clinic-ngo",
      label: "Clinic / NGO",
      directionTag: "Direction 1 · Independent access",
      contextLabel: "Clinic / NGO · Private mobile view",
      pcmHint: "16 kHz Mono PCM · Desk Directional Mic",
      priorLines: [
        "Welcome to the community clinic orientation desk this morning.",
        "First, our coordinator will verify your appointment card and pharmacy hours.",
      ],
      justSaid: "Read intake steps privately on your phone without asking a family member to interpret.",
      activeLine: "A certified human interpreter joins inside the exam room for medical consent.",
      audienceNote:
        "Zero visitor PII logged. Certified human interpreters remain essential for clinical decisions.",
      utteranceSteps: [
        {
          priorLines: ["Welcome to the community clinic orientation desk this morning."],
          justSaid: "First, our coordinator will verify your appointment card and pharmacy hours.",
          activeLine:
            "Read intake steps privately on your phone without asking a family member to interpret.",
          speakerPaceNote: "Calm intake briefing · 340 ms pause",
        },
        {
          priorLines: [
            "Welcome to the community clinic orientation desk this morning.",
            "First, our coordinator will verify your appointment card and pharmacy hours.",
          ],
          justSaid:
            "Read intake steps privately on your phone without asking a family member to interpret.",
          activeLine: "A certified human interpreter joins inside the exam room for medical consent.",
          speakerPaceNote: "Human-in-the-loop boundary stated",
        },
        {
          priorLines: [
            "First, our coordinator will verify your appointment card and pharmacy hours.",
            "Read intake steps privately on your phone without asking a family member to interpret.",
          ],
          justSaid: "A certified human interpreter joins inside the exam room for medical consent.",
          activeLine: "Bus vouchers and housing forms are available at the non-profit desk across the hall.",
          speakerPaceNote: "Follow-up routing · zero-PII session",
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
        "Shows local-host comprehension for visiting teams. Outbound EN -> RW stays gated until Phase 2.",
      utteranceSteps: [
        {
          priorLines: [
            "Local health hosts are opening today's clean-water workshop in their everyday mother tongue.",
          ],
          justSaid:
            "Visiting NGO engineers and clinic partners follow directly on mobile browsers.",
          activeLine:
            "Local leaders speak naturally without slowing down or switching languages for guests.",
          speakerPaceNote: "Workshop speech · portable interface",
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
          speakerPaceNote: "Zero app download for guests",
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
      role: "Captures unclipped mono 16 kHz PCM from a soundboard USB feed or mobile browser mic with explicit sample-rate checks.",
      inputContract: "Soundboard Aux/Matrix USB feed or browser MediaStream microphone frames.",
      outputContract: "Continuous mono 16 kHz PCM frames over encrypted WebSocket (WSS) transport.",
      toolsEvaluated: ["Web Audio API", "TypeScript", "WebSockets", "FastAPI"],
      invariants: [
        "Enforces 16 kHz mono sample-rate alignment between capture and backend.",
        "Resumes mobile AudioContext on tap so Android capture never drops silently.",
        "Speakers speak naturally with zero screen-monitoring burden.",
      ],
      trialLimits: "Room mics degrade under PA echo; soundboard line-out is standard in venues.",
      isBlackBox: false,
    },
    {
      id: "speech-translation",
      step: 2,
      name: "Speech seam",
      role: "Isolates streaming recognition and translation behind a swappable speech -> text -> translation boundary with clean rollback.",
      inputContract: "Continuous 16 kHz mono PCM stream plus active language-direction config.",
      outputContract: "Incremental translated clauses with timing metadata and normalized errors.",
      toolsEvaluated: [
        "Python",
        "FastAPI",
        "Google Gemini Live API",
        "Google Cloud Speech & Translation",
        "NVIDIA NeMo",
        "ONNX Runtime",
      ],
      invariants: [
        "Provider changes sit behind one boundary with explicit rollback — zero UI coupling.",
        "Live streams never silently switch providers mid-session.",
        "Continuous streaming avoids ~60 s turn-based stalls during rapid preaching.",
      ],
      trialLimits: "Active trials cover RW -> EN captions; EN -> RW and fine-tuning remain gated.",
      isBlackBox: true,
    },
    {
      id: "domain-evaluation",
      step: 3,
      name: "Domain & eval",
      role: "Separates domain adaptation, guardrail checks, and offline error harnesses from core translation providers.",
      inputContract: "Caption candidates, room context, and labeled audio-text evaluation fixtures.",
      outputContract: "Verified captions or calm uncertainty notices; offline p95 and cutoff reports.",
      toolsEvaluated: ["Python", "pytest", "ONNX Runtime"],
      invariants: [
        "Hot-path guardrails hold at 0.10 ms p95; uncertain speech triggers a calm notice.",
        "Preserves clause-boundary and multi-sentence discourse continuity.",
        "Fine-tuning stays gated behind labeled domain baselines and error taxonomies.",
      ],
      trialLimits: "Live sanctuary trials run in observation mode to gather real error patterns.",
      isBlackBox: true,
    },
    {
      id: "privacy-telemetry",
      step: 4,
      name: "Telemetry",
      role: "Records non-blocking operational health and stage timings without storing attendee identities.",
      inputContract: "Transient anonymous session tokens, stage timings, clause counts, and 1–5 ratings.",
      outputContract: "Aggregated local post-service summaries for engineers and venue volunteers.",
      toolsEvaluated: ["Python", "pytest"],
      invariants: [
        "Zero PII: never logs names, emails, IP addresses, or browser fingerprints.",
        "Disk or logging failures never interrupt live caption streaming.",
        "Optional diagnostic recordings stay off by default and isolated from audience links.",
      ],
      trialLimits: "Scoped to single-venue diagnostics rather than multi-tenant cloud dashboards.",
      isBlackBox: false,
    },
    {
      id: "audience-delivery",
      step: 5,
      name: "Audience UI",
      role: "Streams readable live captions simultaneously to QR-joined visitor phones and room projectors.",
      inputContract: "Session-scoped caption events initialized at the listener's join timestamp.",
      outputContract: "Accessible HTML5 captions in upward book-scroll order with safe fallbacks.",
      toolsEvaluated: ["React", "TypeScript", "Vitest", "WebSockets"],
      invariants: [
        "Public listener endpoints never return unhandled HTTP 500 errors.",
        "WCAG AA/AAA contrast, 48 px touch targets, and non-color-only state cues.",
        "Audience audio stays visibly disarmed during Phase 1A caption trials.",
      ],
      trialLimits: "Requires venue Wi-Fi or cellular data during Phase 1A cloud streaming.",
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
      "Live captions widen everyday access when no interpreter is present, never replacing human judgment in high-stakes rooms.",
    currentLimits: [
      "Reverberation: open room mics degrade relative to soundboard line-out.",
      "Fast morphology: 16-noun-class speech can still cause rare pronoun or idiom drift.",
      "Phase 1A scope: live RW -> EN captions only; EN -> RW and audio stay gated.",
      "Connectivity: browser captions require venue Wi-Fi or cellular data.",
    ],
    humanEssentialScenarios: [
      "Clinical diagnosis, surgical consent, triage, and trauma counseling.",
      "Legal hearings, immigration interviews, and binding legal or financial attestations.",
      "Sensitive pastoral counseling or mediation needing human cultural judgment.",
    ],
    closingPrinciple:
      "Trust comes from staying inside proven boundaries and handing off clearly to certified humans when stakes are high.",
  },

  privacyCommitments: [
    {
      title: "Zero attendee PII or trackers",
      detail: "No accounts, names, IPs, fingerprints, or analytics on QR links.",
    },
    {
      title: "Transient anonymous tokens",
      detail: "Attendance and 1–5 comprehension ratings use short-lived unlinked tokens.",
    },
    {
      title: "Honest transport vs. E2EE",
      detail: "Traffic uses HTTPS/WSS encryption; inference runs server-side (never labeled E2EE).",
    },
    {
      title: "Default-off diagnostics",
      detail: "Optional recordings stay off by default, private, and excluded from training.",
    },
  ],

  fieldSpecSteps: [
    { step: 1, label: "Soundboard line-out", detail: "Aux/Matrix feed isolates speaker mic from echo." },
    { step: 2, label: "USB audio interface", detail: "Balanced digital capture prevents clipping." },
    { step: 3, label: "Capture device", detail: "Locks 16 kHz mono PCM and room context." },
    { step: 4, label: "WSS streaming seam", detail: "Encrypted stream with resilient fallback." },
    { step: 5, label: "QR phones & projector", detail: "Zero-install captions across venue screens." },
  ],

  roadmapPhases: [
    {
      id: "phase-1a",
      phase: "Phase 1A",
      title: "Sanctuary captions-only live trials",
      status: "validating",
      objective: "Sustain sub-1.5 s RW -> EN live captions from soundboards with audio off.",
      exitGate: "p95 < 1.5 s across live services, 0 HTTP 500s, verified comprehension.",
    },
    {
      id: "phase-1b",
      phase: "Phase 1B",
      title: "Consented evaluation corpus",
      status: "validating",
      objective: "Build consented audio-text baselines across worship, clinic, and NGO rooms.",
      exitGate: "30–50+ labeled segments per domain with WER/CER and cutoff baselines.",
    },
    {
      id: "phase-2",
      phase: "Phase 2A / 2B",
      title: "Bidirectional EN -> RW & controlled audio",
      status: "gated",
      objective: "Add outbound EN -> RW captions and mute-by-default listener audio.",
      exitGate: "Community accuracy sign-off with zero caption latency regression.",
    },
    {
      id: "phase-3-4",
      phase: "Phase 3 & 4",
      title: "Adapters, hybrid runtimes & language expansion",
      status: "gated",
      objective: "Add consent-governed adapters and replicate the blueprint to new languages.",
      exitGate: "Verified offline gains over base models plus repeatable onboarding.",
    },
  ],

  changelog: [
    {
      date: "2026-11-24",
      tag: "Verification & UX",
      title: "Verified +1.02 s live replay latency, 0.10 ms guardrail & 451 tests",
      summary:
        "Logged +1.019 s live replay delay, 0% offline mid-thought cutoffs, and tighter portfolio UX.",
      status: "proven",
    },
    {
      date: "2026-11-23",
      tag: "Public showcase",
      title: "Launched standalone portfolio hub & disclosure guard",
      summary: "Shipped zero-API interactive labs, System Card, and CI IP checks.",
      status: "validating",
    },
    {
      date: "2026-11-18",
      tag: "Sanctuary pre-flight",
      title: "Hardened Phase 1A captions-only safeguards",
      summary: "Disarmed listener audio, finalized upward book-scroll stage, and anchored joins.",
      status: "proven",
    },
    {
      date: "2026-10-29",
      tag: "Evaluation",
      title: "Built offline latency & clause-boundary harness",
      summary: "Added repeatable scripts measuring WebSocket latency and domain errors.",
      status: "validating",
    },
  ],
};
