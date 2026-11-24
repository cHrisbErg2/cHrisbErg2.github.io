import type { IkiLangShowcaseData, MaturityStatus } from "./types";

export const MATURITY_LABELS: Record<MaturityStatus, string> = {
  proven: "Proven Today",
  validating: "Active Validation",
  gated: "Deliberately Gated",
};

export const IKILANG_DATA: IkiLangShowcaseData = {
  productName: "IkiLang / KinyaVoice",
  coBrandLabel: "KinyaVoice · Powered by IkiLang",
  tagline:
    "Continuous low-resource speech translation engineered for live rooms, personal privacy, and bidirectional community dignity.",
  heroSummary:
    "Starting with Kinyarwanda as Blueprint #1, IkiLang investigates how to move low-resource live translation past slow turn-based stalls into sub-1.5 s continuous captions — built for soundboards, zero-download visitor phones, and verifiable offline evaluation.",
  lastVerifiedDate: "2026-11-23",
  blackBoxNotice:
    "Proprietary internals — including model routing, prompts, curated domain glossaries, quality-estimation scoring rules, turn-boundary thresholds, and unit-economics math — are intentionally black-boxed and excluded from this public repository.",
  timelineProvenanceNotice:
    "Illustrative timing comparison modeled on observed uninterrupted-speech behavior (200–500 ms breath pauses) — not live API inference.",
  previewProvenanceNotice:
    "Illustrative UI layout preview using synthetic sample text — not live model output.",
  audioDisarmedNotice:
    "Audio Deliberately Disarmed During Phase 1A Caption Trials",
  cryptographicHonestyNotice:
    "Cryptographic Honesty: Live audio and captions travel over encrypted HTTPS/WSS transport, while real-time inference necessarily processes audio server-side. IkiLang never mislabels cloud streaming as 'End-to-End Encrypted (E2EE)'.",

  founderStory: {
    heading: "Why I'm Building This",
    subtitle:
      "Closing the gap between living languages and real-time voice systems — in both directions.",
    paragraphs: [
      "Language barriers hit hardest in ordinary, high-trust moments. Too often, newcomers and multilingual residents walking into a medical clinic, government office, non-profit intake room, or Sunday church gathering have to lean on a bilingual child or ask a third-party human intermediary to sit inside a private family or health conversation. People deserve the confidence, dignity, and confidentiality to understand what is being said on their own screen without handing away their privacy.",
      "The exact same gap works in the opposite direction. When NGOs, non-profits, evangelical missionaries, visiting clinics, educators, and tourists travel into low-resource-language regions, real connection stalls whenever local communities are expected to switch into an outside language. Respectful engagement should be effortless in both directions — letting visitors participate alongside local speakers rather than standing behind a translation bottleneck.",
      "Existing translation apps rarely survive live rooms for low-resource languages. Turn-based interfaces freeze for tens of seconds when a speaker talks rapidly without pausing, drop grammatical continuity across sentences, flatten tone and expression, and lock venues into closed standalone apps instead of pluggable workflows that work cleanly with existing soundboards and mobile browsers.",
      "I am building IkiLang from the ground up as a disciplined, evaluation-first speech blueprint — starting with Kinyarwanda, my everyday mother tongue, and validating every design choice directly with everyday speakers, pastors, and church technical volunteers before expanding to additional East African and underserved languages.",
    ],
    languageStewardshipNote:
      "Kinyarwanda is my everyday mother tongue, paired with direct community validation from live speakers and technical volunteers — ensuring linguistic accuracy is judged by real comprehension rather than synthetic textbook benchmarks.",
    blueprintPrinciple:
      "Blueprint #1 proves clean audio ingest, continuous caption pacing, offline error tracking, and privacy-minimal delivery on Kinyarwanda first — creating a repeatable pattern for additional low-resource languages.",
  },

  bridgeDirections: [
    {
      id: "newcomers-residents",
      directionLabel: "Direction 1 · Independent Access in Host Communities",
      title: "Newcomers & Multilingual Residents",
      audience:
        "Immigrants, refugees, older family members, and multilingual residents navigating daily institutions.",
      settings: [
        "Medical Clinics",
        "Government Services",
        "Non-Profit Intake",
        "Church Gatherings",
      ],
      valueStatement:
        "Follow spoken consultations, civic orientations, and sermons privately on a personal phone via a simple QR code — with zero app installation and zero personal sign-up.",
      dignityHighlight:
        "Preserves adult independence and confidentiality without burdening fluent children or disclosing sensitive matters through an informal intermediary.",
    },
    {
      id: "outreach-visitors",
      directionLabel: "Direction 2 · Respectful Engagement in Local Communities",
      title: "NGOs, Non-Profits, Missionaries, Clinics & Travelers",
      audience:
        "Humanitarian teams, non-profits, evangelical missionaries, visiting clinicians, educators, and tourists in low-resource-language regions.",
      settings: [
        "Field Outreach & NGOs",
        "Visiting Health Clinics",
        "Evangelical Ministry",
        "Everyday Travel",
      ],
      valueStatement:
        "Engage seamlessly and respectfully alongside local speakers in everyday mother tongues rather than expecting host communities to accommodate outside languages.",
      dignityHighlight:
        "Built around living-language respect and low-friction room setups so cross-cultural partnerships feel natural instead of transactional.",
    },
  ],

  toolCategories: [
    {
      id: "backend-streaming",
      category: "Backend & Real-Time Streaming",
      purpose:
        "Low-latency PCM audio ingestion, resilient WebSocket delivery, and clean provider boundaries.",
      tools: ["Python", "FastAPI", "WebSockets"],
    },
    {
      id: "frontend-audio",
      category: "Frontend & Browser Capture",
      purpose:
        "Mobile-safe Web Audio capture, accessible multi-screen captions, and zero-download QR viewing.",
      tools: ["React", "TypeScript", "Web Audio API"],
    },
    {
      id: "speech-ecosystems",
      category: "Speech, Translation & Local Runtimes Evaluated",
      purpose:
        "Pluggable streaming APIs and local/hybrid speech toolkits compared behind one narrow interface.",
      tools: [
        "Google Gemini Live API",
        "Google Cloud Speech & Translation",
        "NVIDIA NeMo",
        "ONNX Runtime",
      ],
    },
    {
      id: "verification-delivery",
      category: "Testing, Evaluation & Delivery",
      purpose:
        "Automated regression guards, offline latency/accuracy harnesses, and reproducible deployments.",
      tools: ["pytest", "Vitest", "Docker", "GitHub Actions"],
    },
  ],

  disciplineSignals: [
    {
      id: "automated-tests",
      metric: "420+",
      label: "Automated Tests",
      detail:
        "360 backend tests + 63 frontend tests verifying audio ingest contracts, resilient fallbacks, UI accessibility, and disclosure guardrails.",
    },
    {
      id: "latency-budget",
      metric: "< 1.5 s",
      label: "Target p95 Caption Budget",
      detail:
        "Tracks median and 95th-percentile glass-to-caption delay on realistic continuous clips rather than hiding tail spikes behind averages.",
    },
    {
      id: "zero-pii",
      metric: "Zero PII",
      label: "Anonymous Session Telemetry",
      detail:
        "No attendee names, emails, IP addresses, browser fingerprints, or third-party trackers; transient anonymous tokens only.",
    },
    {
      id: "resilience",
      metric: "0 HTTP 500s",
      label: "Congregation Resilience",
      detail:
        "Public listener endpoints degrade gracefully with user-safe status captions so transient upstream hiccups never crash visitor phones.",
    },
    {
      id: "accessibility",
      metric: "WCAG AA/AAA",
      label: "Accessible Multi-Screen UI",
      detail:
        "High-contrast sanctuary typography, 48 px minimum touch targets, full keyboard support, and non-color-only state indicators.",
    },
    {
      id: "eval-gate",
      metric: "Eval First",
      label: "Fine-Tuning Gate",
      detail:
        "Requires 30–50+ hand-labeled segments per domain, documented baselines, and context/glossary fixes before any model fine-tuning begins.",
    },
  ],

  timelineFrames: [
    {
      timeSec: 0,
      speakerLine:
        "Good morning everyone, thank you for gathering together with your families and neighbors today.",
      breathPauseMs: 220,
      turnBasedCaption: "Listening… waiting for end of speaker turn.",
      turnBasedStatus: "waiting",
      continuousCaption:
        "Good morning everyone — thank you for gathering with your families and neighbors today.",
      continuousStatus: "delivered",
      latencyNote: "Continuous stream publishes opening clause in ~1.1 s; turn-based endpoint stays blank.",
    },
    {
      timeSec: 9,
      speakerLine:
        "Before we open today's reading, please welcome every visitor joining our community room for the first time.",
      breathPauseMs: 280,
      turnBasedCaption: "Still waiting… 280 ms breath pause too short to trigger turn end.",
      turnBasedStatus: "stalled",
      continuousCaption:
        "Before we begin today's reading, please welcome every visitor joining us for the first time.",
      continuousStatus: "delivered",
      latencyNote: "Short 280 ms breath keeps turn-based buffer open; continuous delivery stays synced (~1.2 s).",
    },
    {
      timeSec: 19,
      speakerLine:
        "When someone walks through these doors carrying a heavy week, hospitality starts with helping them understand every word clearly.",
      breathPauseMs: 310,
      turnBasedCaption: "19 s elapsed — screen still blank for listeners.",
      turnBasedStatus: "stalled",
      continuousCaption:
        "When someone arrives carrying a heavy week, hospitality starts with helping them understand every word clearly.",
      continuousStatus: "delivered",
      latencyNote: "Audience follows the speaker's point in real time without asking the speaker to slow down.",
    },
    {
      timeSec: 30,
      speakerLine:
        "This week our neighborhood care team also partnered with local volunteers to support new families settling into school and clinics.",
      breathPauseMs: 260,
      turnBasedCaption: "30 s elapsed — turn-based listener view remains stalled.",
      turnBasedStatus: "stalled",
      continuousCaption:
        "This week our care team partnered with local volunteers to help new families settle into schools and clinics.",
      continuousStatus: "delivered",
      latencyNote: "Continuous cadence holds under 1.4 s; turn-based viewers assume captions have broken.",
    },
    {
      timeSec: 42,
      speakerLine:
        "If your household needs a quiet room after the service to review community intake schedules, two coordinators will be right by the east desk.",
      breathPauseMs: 390,
      turnBasedCaption: "42 s elapsed — rapid delivery prevents turn-based flush.",
      turnBasedStatus: "stalled",
      continuousCaption:
        "If your household needs a quiet room afterward to review community schedules, two coordinators will meet you by the east desk.",
      continuousStatus: "delivered",
      latencyNote: "Practical room details arrive immediately while still actionable; turn-based remains silent.",
    },
    {
      timeSec: 53,
      speakerLine:
        "Let us take a moment to listen with patience, care for one another faithfully, and leave space for every voice in our community.",
      breathPauseMs: 340,
      turnBasedCaption: "53 s elapsed — buffer still accumulating uninterrupted speech.",
      turnBasedStatus: "stalled",
      continuousCaption:
        "Let us listen with patience, care for one another faithfully, and make room for every voice in our community.",
      continuousStatus: "delivered",
      latencyNote: "Fifth consecutive clause delivered smoothly; turn-based latency has crossed 50 seconds.",
    },
    {
      timeSec: 61,
      speakerLine:
        "[Speaker finishes section and pauses for 1.8 seconds before turning a page.]",
      breathPauseMs: 1800,
      turnBasedCaption:
        "Good morning everyone thank you for gathering together with your families and neighbors today before we open today's reading please welcome every visitor joining our community room for the first time when someone walks through these doors carrying a heavy week hospitality starts with helping them understand every word clearly this week our neighborhood care team also partnered with local volunteers to support new families settling into school and clinics if your household needs a quiet room after the service to review community intake schedules two coordinators will be right by the east desk let us take a moment to listen with patience care for one another faithfully and leave space for every voice in our community.",
      turnBasedStatus: "dumped",
      continuousCaption:
        "Pause detected cleanly — prior clauses remain readable above in chronological book-scroll order.",
      continuousStatus: "delivered",
      latencyNote: "Turn-based dumps a 61-second unformatted wall of text all at once, overwhelming phone screens.",
    },
    {
      timeSec: 65,
      speakerLine:
        "Now let us read the opening paragraph together from page four of the bulletin.",
      breathPauseMs: 240,
      turnBasedCaption: "Listening… waiting for next extended silence while viewers still scroll the late block.",
      turnBasedStatus: "waiting",
      continuousCaption:
        "Now let us read the opening paragraph together from page four of the bulletin.",
      continuousStatus: "streaming",
      latencyNote: "Continuous stream transitions cleanly to the next clause (< 1.3 s) with zero speaker burden.",
    },
  ],

  previewScenarios: [
    {
      id: "sanctuary",
      label: "Sanctuary / Community Worship",
      directionTag: "Direction 1 · Host-Country Gathering",
      contextLabel: "Sanctuary · Captions-Only Live Trial",
      pcmHint: "16 kHz Mono PCM · Soundboard Aux Line-Out",
      priorLines: [
        "Welcome to everyone joining our Sunday gathering in person and in the overflow hall.",
        "Today we are reflecting on patience, reconciliation, and caring for our neighbors throughout the week.",
      ],
      justSaid:
        "True hospitality means making sure no family sits in the back row feeling disconnected from the message.",
      activeLine:
        "After the closing hymn, community hospitality volunteers will be available in the foyer with translated welcome cards.",
      audienceNote:
        "Captions-only mode active. Audience audio is intentionally disarmed during Phase 1A to prevent sanctuary speaker feedback.",
      utteranceSteps: [
        {
          priorLines: [
            "Welcome to everyone joining our Sunday gathering in person and in the overflow hall.",
          ],
          justSaid:
            "Today we are reflecting on patience, reconciliation, and caring for our neighbors throughout the week.",
          activeLine:
            "True hospitality means making sure no family sits in the back row feeling disconnected from the message.",
          speakerPaceNote: "Steady pulpit delivery · 260 ms breath pause",
        },
        {
          priorLines: [
            "Welcome to everyone joining our Sunday gathering in person and in the overflow hall.",
            "Today we are reflecting on patience, reconciliation, and caring for our neighbors throughout the week.",
          ],
          justSaid:
            "True hospitality means making sure no family sits in the back row feeling disconnected from the message.",
          activeLine:
            "After the closing hymn, community hospitality volunteers will be available in the foyer with translated welcome cards.",
          speakerPaceNote: "Rapid uninterrupted clause · sub-1.5 s target cadence",
        },
        {
          priorLines: [
            "Today we are reflecting on patience, reconciliation, and caring for our neighbors throughout the week.",
            "True hospitality means making sure no family sits in the back row feeling disconnected from the message.",
          ],
          justSaid:
            "After the closing hymn, community hospitality volunteers will be available in the foyer with translated welcome cards.",
          activeLine:
            "Please greet someone sitting nearby before heading downstairs for tea and fellowship.",
          speakerPaceNote: "Natural transition · chronological upward book-scroll",
        },
      ],
    },
    {
      id: "clinic-ngo",
      label: "Medical Clinic / NGO Intake",
      directionTag: "Direction 1 · Independent Access & Privacy",
      contextLabel: "Clinic / NGO Orientation · Private Mobile View",
      pcmHint: "16 kHz Mono PCM · Desk Directional Mic",
      priorLines: [
        "Thank you for coming to the community clinic orientation desk this morning.",
        "First, our intake coordinator will verify your appointment card and explain the pharmacy pickup hours.",
      ],
      justSaid:
        "You can read these orientation steps privately on your own phone without asking a family member to interpret in the waiting room.",
      activeLine:
        "When we move into the examination room for clinical advice or medical consent, a certified human interpreter will join us.",
      audienceNote:
        "Zero visitor PII logged on audience view. Certified human interpreters remain essential for clinical diagnosis and medical consent.",
      utteranceSteps: [
        {
          priorLines: [
            "Thank you for coming to the community clinic orientation desk this morning.",
          ],
          justSaid:
            "First, our intake coordinator will verify your appointment card and explain the pharmacy pickup hours.",
          activeLine:
            "You can read these orientation steps privately on your own phone without asking a family member to interpret in the waiting room.",
          speakerPaceNote: "Calm intake briefing · 340 ms pause",
        },
        {
          priorLines: [
            "Thank you for coming to the community clinic orientation desk this morning.",
            "First, our intake coordinator will verify your appointment card and explain the pharmacy pickup hours.",
          ],
          justSaid:
            "You can read these orientation steps privately on your own phone without asking a family member to interpret in the waiting room.",
          activeLine:
            "When we move into the examination room for clinical advice or medical consent, a certified human interpreter will join us.",
          speakerPaceNote: "Human-in-the-loop boundary stated clearly",
        },
        {
          priorLines: [
            "First, our intake coordinator will verify your appointment card and explain the pharmacy pickup hours.",
            "You can read these orientation steps privately on your own phone without asking a family member to interpret in the waiting room.",
          ],
          justSaid:
            "When we move into the examination room for clinical advice or medical consent, a certified human interpreter will join us.",
          activeLine:
            "If you need bus vouchers or housing paperwork copies, the non-profit support desk is right across the hallway.",
          speakerPaceNote: "Clear follow-up instructions · zero-PII session",
        },
      ],
    },
    {
      id: "field-outreach",
      label: "Field Outreach & Visitor Exchange",
      directionTag: "Direction 2 · NGOs, Missionaries & Visitors",
      contextLabel: "Field Outreach · Community Partnership",
      pcmHint: "16 kHz Mono PCM · Portable USB Interface",
      priorLines: [
        "Our local community health hosts are opening today's clean-water workshop in their everyday mother tongue.",
        "Visiting NGO engineers, clinic partners, and ministry volunteers follow every local insight directly on mobile browsers.",
      ],
      justSaid:
        "Local leaders stay at the center of the conversation without slowing down or switching languages for visiting guests.",
      activeLine:
        "During afternoon Q&A, local hosts share maintenance priorities for the next rainy season while visiting teams take accurate notes.",
      audienceNote:
        "Demonstrates Direction 2 local-host comprehension for visiting teams. Outbound EN -> RW translation remains deliberately gated until Phase 2.",
      utteranceSteps: [
        {
          priorLines: [
            "Our local community health hosts are opening today's clean-water workshop in their everyday mother tongue.",
          ],
          justSaid:
            "Visiting NGO engineers, clinic partners, and ministry volunteers follow every local insight directly on mobile browsers.",
          activeLine:
            "Local leaders stay at the center of the conversation without slowing down or switching languages for visiting guests.",
          speakerPaceNote: "Community workshop speech · portable interface",
        },
        {
          priorLines: [
            "Our local community health hosts are opening today's clean-water workshop in their everyday mother tongue.",
            "Visiting NGO engineers, clinic partners, and ministry volunteers follow every local insight directly on mobile browsers.",
          ],
          justSaid:
            "Local leaders stay at the center of the conversation without slowing down or switching languages for visiting guests.",
          activeLine:
            "During afternoon Q&A, local hosts share maintenance priorities for the next rainy season while visiting teams take accurate notes.",
          speakerPaceNote: "Bidirectional respect · zero app download for visitors",
        },
        {
          priorLines: [
            "Visiting NGO engineers, clinic partners, and ministry volunteers follow every local insight directly on mobile browsers.",
            "Local leaders stay at the center of the conversation without slowing down or switching languages for visiting guests.",
          ],
          justSaid:
            "During afternoon Q&A, local hosts share maintenance priorities for the next rainy season while visiting teams take accurate notes.",
          activeLine:
            "Thank you to the village committee for hosting our visiting partners and guiding today's agenda.",
          speakerPaceNote: "Respectful closing · EN -> RW gated for Phase 2",
        },
      ],
    },
  ],

  architectureLayers: [
    {
      id: "audio-ingest",
      step: 1,
      name: "Audio Ingest",
      role: "Captures clean, unclipped mono 16 kHz PCM audio from a soundboard USB interface or mobile browser microphone with explicit sample-rate validation.",
      inputContract:
        "Soundboard Aux/Matrix line-out via USB audio interface, or browser MediaStream microphone frames.",
      outputContract:
        "Continuous mono 16 kHz PCM frames streamed over encrypted WebSocket (WSS) transport.",
      toolsEvaluated: ["Web Audio API", "TypeScript", "WebSockets", "FastAPI"],
      invariants: [
        "Verified 16 kHz mono sample-rate contract between browser capture and backend ingest.",
        "Explicit AudioContext gesture-resume handling on mobile browsers to prevent silent capture.",
        "Zero speaker burden: presenters speak naturally without pausing or monitoring screens.",
      ],
      trialLimits:
        "Open-room microphones degrade under heavy PA reverberation; soundboard line-out is standard for live sanctuary trials.",
      isBlackBox: false,
    },
    {
      id: "speech-translation",
      step: 2,
      name: "Pluggable Speech & Translation Interface",
      role: "Isolates real-time streaming speech recognition and translation behind a narrow speech -> text -> translation boundary so providers can be evaluated or rolled back cleanly.",
      inputContract:
        "Continuous 16 kHz mono PCM stream plus active session language-direction configuration.",
      outputContract:
        "Incremental translated caption clauses with timing markers and normalized error events.",
      toolsEvaluated: [
        "Python",
        "FastAPI",
        "Google Gemini Live API",
        "Google Cloud Speech & Translation",
        "NVIDIA NeMo",
        "ONNX Runtime",
      ],
      invariants: [
        "Pluggable provider abstraction with explicit rollback path — never hard-wired into UI delivery.",
        "No silent provider switching during an active live stream.",
        "Continuous streaming posture designed to avoid multi-second turn-waiting stalls on rapid speech.",
      ],
      trialLimits:
        "Active live validation covers Kinyarwanda -> English captions; outbound EN -> RW and custom fine-tuned models remain deliberately gated.",
      isBlackBox: true,
    },
    {
      id: "domain-evaluation",
      step: 3,
      name: "Domain Context & Evaluation Boundary",
      role: "Separates domain adaptation (church, clinic, NGO terminology and multi-clause discourse continuity) and offline evaluation harnesses from core inference providers.",
      inputContract:
        "Streaming caption candidates, room context selection, and offline labeled audio-text evaluation sets.",
      outputContract:
        "Publication-safe caption updates or graceful uncertainty notices; offline error taxonomy and latency percentile reports.",
      toolsEvaluated: ["Python", "pytest", "ONNX Runtime"],
      invariants: [
        "Accuracy over filler: unclear speech triggers a calm status notice rather than confident hallucinated text.",
        "Preserves discourse continuity across consecutive clauses for Bantu 16-noun-class pronoun resolution.",
        "Evaluation-before-fine-tuning gate: prompt, context, and glossary levers are measured before any model training.",
      ],
      trialLimits:
        "Early sanctuary trials run in observation mode to gather real error patterns before enforcing automated rejection gates.",
      isBlackBox: true,
    },
    {
      id: "privacy-telemetry",
      step: 4,
      name: "Privacy-Minimal Telemetry",
      role: "Provides non-blocking, thread-safe operational visibility and post-service health summaries without logging attendee identities or interrupting live speech.",
      inputContract:
        "Transient anonymous session tokens, stage latency timings, clause counts, and optional 1–5 comprehension ratings.",
      outputContract:
        "Local aggregated post-service reports for engineers and church technical volunteers.",
      toolsEvaluated: ["Python", "pytest"],
      invariants: [
        "Strict zero-PII boundary: never logs attendee names, emails, IP addresses, or browser fingerprints.",
        "Logging or disk write errors are isolated so they never interrupt live caption streaming.",
        "Optional operator debugging recordings stay strictly off by default, private, and inaccessible from audience links.",
      ],
      trialLimits:
        "Built for lean single-venue diagnostics rather than centralized multi-tenant analytics clouds.",
      isBlackBox: false,
    },
    {
      id: "audience-delivery",
      step: 5,
      name: "Multi-Screen Audience Delivery",
      role: "Delivers readable live captions simultaneously to visitor smartphones (via QR code, no app install) and sanctuary projectors with accessible controls.",
      inputContract:
        "Session-scoped live caption feed events initialized from the listener's join timestamp (never dumping stale history).",
      outputContract:
        "Accessible HTML5 captions in upward book-scroll order with graceful HTTP 200 fallback messaging.",
      toolsEvaluated: ["React", "TypeScript", "Vitest", "WebSockets"],
      invariants: [
        "Public congregation endpoints never return unhandled HTTP 500 errors to visitor phones.",
        "WCAG 2.1 AA/AAA typography, high-contrast options, 48 px touch targets, and non-color-only state cues.",
        "Audience audio playback stays visibly disarmed during Phase 1A captions-only live trials.",
      ],
      trialLimits:
        "Captions-only delivery during Phase 1A; requires active venue Wi-Fi or cellular data for live updates.",
      isBlackBox: false,
    },
  ],

  maturityMatrix: [
    {
      capability: "Mono 16 kHz PCM Audio Ingest & Mobile Capture Hygiene",
      status: "proven",
      evidence:
        "Sample-rate verification and mobile Web Audio gesture-resume protections verified across backend and frontend test suites.",
      boundaryNote:
        "Soundboard line-out via USB interface remains required for reverberant sanctuary spaces.",
    },
    {
      capability: "Continuous Streaming Caption Architecture (< 1.5 s Target)",
      status: "proven",
      evidence:
        "Continuous streaming pipeline and latency measurement scripts verified on realistic speech clips tracking median and p95 latency.",
      boundaryNote:
        "Real-world tail latency remains sensitive to venue internet stability and upstream network jitter.",
    },
    {
      capability: "Captions-Only Multi-Screen Delivery (Mobile QR & Projector)",
      status: "proven",
      evidence:
        "Zero-download QR listener view, upward book-scroll projector display, and never-HTTP-500 fallback contracts covered by 420+ tests.",
      boundaryNote:
        "Deliberately scoped to captions-only output during Phase 1A live trials.",
    },
    {
      capability: "Zero-PII Anonymous Telemetry & Automated Verification",
      status: "proven",
      evidence:
        "360 backend + 63 frontend automated tests plus non-blocking anonymous session logging with zero IP or fingerprint retention.",
      boundaryNote:
        "Designed for single-venue post-service review rather than multi-tenant cloud reporting.",
    },
    {
      capability: "Offline Evaluation Harness & Domain Error Taxonomy",
      status: "proven",
      evidence:
        "Scripted offline evaluation measuring latency, clause segmentation, and categorized domain errors prior to any model training.",
      boundaryNote:
        "Expansion of hand-labeled consented clips across clinics and NGOs is ongoing.",
    },
    {
      capability: "Live Sanctuary Captions-Only Trials (RW -> EN)",
      status: "validating",
      evidence:
        "Field validation in observation mode with community speakers and church technical volunteers using soundboard capture.",
      boundaryNote:
        "Gathering multi-service comprehension ratings and p95 latency stability before expanding scope.",
    },
    {
      capability: "Bantu 16-Noun-Class Discourse Continuity & Domain Overlays",
      status: "validating",
      evidence:
        "Active community-reviewer evaluation across church, clinic, and NGO scenarios tracking pronoun coreference and specialized terminology.",
      boundaryNote:
        "Rare idioms and rapid domain switches can still introduce occasional literal phrasing.",
    },
    {
      capability: "Cross-Provider Offline Benchmarking (Cloud & Local Ecosystems)",
      status: "validating",
      evidence:
        "Comparative offline tests across streaming cloud APIs and local speech ecosystems behind the pluggable provider interface.",
      boundaryNote:
        "Benchmarks run offline as separate comparisons; live streams never switch providers silently.",
    },
    {
      capability: "Live Audience Audio Streaming (Listener TTS / Audio Playback)",
      status: "gated",
      evidence:
        "Intentionally disabled across UI controls and backend subscriptions during Phase 1A captions-only trials.",
      boundaryNote:
        "Prevents accidental sanctuary speaker blasts and preserves single-outcome focus until caption quality clears Phase 1 gates.",
    },
    {
      capability: "Bidirectional EN -> RW Live Translation",
      status: "gated",
      evidence:
        "Architecturally planned within the pluggable provider seam and bidirectional roadmap, not active in current live trials.",
      boundaryNote:
        "Gated until RW -> EN streaming baselines, community review loops, and domain error taxonomies stabilize.",
    },
    {
      capability: "Custom Model & Voice Fine-Tuning",
      status: "gated",
      evidence:
        "Governed by a strict fine-tuning gate requiring consented data and documented non-training baselines first.",
      boundaryNote:
        "Will not start until 30–50+ hand-labeled segments per domain exist and context/glossary levers are exhausted.",
    },
    {
      capability: "Multi-Tenant Production Scale & Autonomous High-Stakes Use",
      status: "gated",
      evidence:
        "Current architecture targets focused single-venue trials with human operational oversight.",
      boundaryNote:
        "Requires multi-venue reliability evidence, formal compliance work, and strict human-interpreter boundaries.",
    },
  ],

  shortcomingsAndHumanBoundary: {
    heading: "Where It Currently Falls Short & When Humans Are Still Essential",
    summary:
      "Honest engineering means naming real constraints up front. Live AI captions expand everyday understanding when no interpreter is present, but they do not replace trained human judgment in high-stakes rooms.",
    currentLimits: [
      "Acoustic environment matters: an unisolated room mic picking up PA echo, coughing, or congregational singing degrades transcription far more than a clean soundboard line-out feed.",
      "Fast morphological density: rapid uninterrupted Kinyarwanda speech across 16 noun classes can still cause occasional pronoun drift or overly literal rendering of uncommon idioms.",
      "Phase 1A direction and modality scope: active live trials cover RW -> EN captions only; outbound EN -> RW translation and listener audio remain deliberately gated.",
      "Connectivity dependency: zero-download browser captions rely on reliable venue Wi-Fi or cellular data; real-time offline on-device translation is not yet proven.",
    ],
    humanEssentialScenarios: [
      "Clinical medical diagnosis, surgical consent, emergency triage, and mental health or trauma counseling.",
      "Legal hearings, immigration interviews, and binding government or financial attestations requiring certified interpretation.",
      "Sensitive pastoral counseling or delicate family mediation where cultural nuance, empathy, and accountability cannot be automated.",
    ],
    closingPrinciple:
      "AI captions earn trust by staying inside proven boundaries — expanding access in everyday community rooms while clearly handing off to human interpreters when the stakes are highest.",
  },

  privacyCommitments: [
    {
      title: "Zero Attendee PII & Tracker-Free Viewing",
      detail:
        "Listeners scan a QR code and read captions immediately — no accounts, no names or emails, no IP-address logging, no browser fingerprinting, and zero third-party analytics trackers.",
    },
    {
      title: "Transient Anonymous Session Tokens",
      detail:
        "Operational attendance counts and optional 1–5 star comprehension ratings rely solely on short-lived anonymous tokens that cannot be linked back to a person.",
    },
    {
      title: "Encrypted Transport — Never Mislabeled as E2EE",
      detail:
        "Browser audio and captions move over encrypted HTTPS/WSS transport, while real-time cloud inference necessarily processes audio server-side. Transport security is never misrepresented as End-to-End Encryption.",
    },
    {
      title: "Default-Off Private Diagnostics & Consent-First Data",
      detail:
        "Optional speaker-side diagnostic recordings stay off by default, completely isolated from audience links, outside version control, and strictly excluded from unconsented model training.",
    },
  ],

  fieldSpecSteps: [
    {
      step: 1,
      label: "Soundboard Line-Out",
      detail: "Pre-fader Aux/Matrix feed isolates the speaker mic from sanctuary echo and crowd noise.",
    },
    {
      step: 2,
      label: "USB Audio Interface",
      detail: "Balanced analog-to-digital input prevents clipping and laptop mic feedback.",
    },
    {
      step: 3,
      label: "Capture Device",
      detail: "Verifies mono 16 kHz PCM lock, live signal levels, and domain context before going live.",
    },
    {
      step: 4,
      label: "Streaming Boundary",
      detail: "Encrypted WSS transport into the pluggable translation seam with resilient fallback handling.",
    },
    {
      step: 5,
      label: "QR Mobile & Projector Captions",
      detail: "Zero app download for visitors — captions-only phones plus high-contrast room display.",
    },
  ],

  roadmapPhases: [
    {
      id: "phase-1a",
      phase: "Phase 1A",
      title: "Sanctuary Captions-Only Live Trials",
      status: "validating",
      objective:
        "Prove reliable, sub-1.5 s RW -> EN live captions on real soundboard audio with zero speaker burden and zero-PII QR + projector delivery while listener audio remains disarmed.",
      exitGate:
        "Sustained p95 caption latency < 1.5 s across repeated live services, zero HTTP 500 audience failures, and verified post-service comprehension scores.",
    },
    {
      id: "phase-1b",
      phase: "Phase 1B",
      title: "Consented Evaluation Corpus & Context Calibration",
      status: "validating",
      objective:
        "Expand hand-labeled, community-consented evaluation segments across church, clinic, and NGO contexts and exhaust prompt/glossary/domain improvements before any fine-tuning.",
      exitGate:
        "30–50+ hand-labeled segments per priority domain with documented baseline WER/CER, clause-boundary accuracy, and domain correctness reports.",
    },
    {
      id: "phase-2",
      phase: "Phase 2A / 2B",
      title: "Bidirectional EN -> RW & Controlled Audio Rollout",
      status: "gated",
      objective:
        "Unlock outbound EN -> RW translation for clinics, NGOs, outreach teams, and travelers alongside carefully gated headphone-safe listener audio once caption reliability passes Phase 1.",
      exitGate:
        "Verified bidirectional community accuracy reviews, mute-by-default headphone UX, and zero regression in caption latency.",
    },
    {
      id: "phase-3",
      phase: "Phase 3",
      title: "Pluggable Domain Adapters & Hybrid/Local Runtimes",
      status: "gated",
      objective:
        "Introduce consent-governed fine-tuned adapters (only where baseline gaps remain) and evaluate local/hybrid speech runtimes for low-connectivity field outreach and clinics.",
      exitGate:
        "Measurable before/after offline benchmark gains over base providers behind the pluggable interface with instant rollback.",
    },
    {
      id: "phase-4",
      phase: "Phase 4",
      title: "Multi-Language East African & Low-Resource Blueprint",
      status: "gated",
      objective:
        "Replicate the community-validated Kinyarwanda blueprint across additional East African and underserved living languages alongside institutional and community partners.",
      exitGate:
        "Repeatable language-onboarding playbook, documented community data consent governance, and multi-venue operational hardening.",
    },
  ],

  changelog: [
    {
      date: "2026-11-23",
      tag: "Public Showcase",
      title: "Launched IkiLang / KinyaVoice Interactive Blueprint & Disclosure Guard",
      summary:
        "Published the standalone portfolio showcase featuring zero-API interactive timing/UI labs, canonical Proven/Validating/Gated maturity boundaries, and an automated disclosure-guard test suite.",
      status: "validating",
    },
    {
      date: "2026-11-18",
      tag: "Sanctuary Pre-Flight",
      title: "Hardened Phase 1A Captions-Only Live Trial Safeguards",
      summary:
        "Enforced disarmed audience audio controls for sanctuary trials, finalized upward book-scroll projector hierarchy, and anchored listener feed polling to live join timestamps.",
      status: "proven",
    },
    {
      date: "2026-11-10",
      tag: "Verification",
      title: "Crossed 420+ Automated Backend & Frontend Tests",
      summary:
        "Expanded automated coverage (360 backend + 63 frontend) across never-HTTP-500 congregation fallbacks, thread-safe zero-PII telemetry logging, and Android Web Audio gesture-resume capture.",
      status: "proven",
    },
    {
      date: "2026-10-29",
      tag: "Evaluation",
      title: "Established Offline Latency & Domain Error-Taxonomy Harness",
      summary:
        "Built repeatable offline measurement scripts tracking median/p95 glass-to-caption delay, clause-boundary segmentation, and domain terminology errors ahead of any fine-tuning work.",
      status: "validating",
    },
    {
      date: "2026-10-14",
      tag: "Architecture",
      title: "Completed Continuous Mono 16 kHz PCM Streaming Seam",
      summary:
        "Moved past turn-stalling request patterns into a continuous streaming architecture behind a pluggable speech-to-translation boundary built for fast uninterrupted speakers.",
      status: "proven",
    },
  ],
};
