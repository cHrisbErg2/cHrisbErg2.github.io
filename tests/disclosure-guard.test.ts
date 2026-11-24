import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { PROFILE } from "../src/data/profile";
import { PUBLIC_PROJECTS } from "../src/data/projects";
import { IKILANG_DATA } from "../src/projects/ikilang/data";

const THIS_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(THIS_DIR, "..");

const FORBIDDEN_PATTERNS: { category: string; label: string; pattern: RegExp }[] = [
  // Forbidden exact model IDs & versions
  { category: "model-id", label: "gemini-3.5-live-translate", pattern: /gemini-3\.5-live-translate/i },
  { category: "model-id", label: "gemini-3.5-flash-lite", pattern: /gemini-3\.5-flash-lite/i },
  { category: "model-id", label: "gemini-3.5-transcribe", pattern: /gemini-3\.5-transcribe/i },
  { category: "model-id", label: "gemini-3.5-*", pattern: /gemini-3\.5/i },
  { category: "model-id", label: "gemini-3.8-live", pattern: /gemini-3\.8-live/i },
  { category: "model-id", label: "gemini-3.8-flash", pattern: /gemini-3\.8-flash/i },
  { category: "model-id", label: "gemini-3.8-*", pattern: /gemini-3\.8/i },
  { category: "model-id", label: "gemini-2.5*", pattern: /gemini-2\.5/i },

  // Forbidden internal architecture, turn-decision & QE identifiers
  { category: "internal-arch", label: "CaptionReconstructor", pattern: /CaptionReconstructor/i },
  { category: "internal-arch", label: "TurnDecisionModule", pattern: /TurnDecisionModule/i },
  { category: "internal-arch", label: "Smart Turn", pattern: /Smart Turn/i },
  { category: "internal-arch", label: "smart-turn-v3", pattern: /smart-turn-v3/i },
  { category: "internal-arch", label: "Cue v1", pattern: /Cue v1/i },
  { category: "internal-arch", label: "combined_end", pattern: /combined_end/i },
  { category: "internal-arch", label: "p_voice", pattern: /p_voice/i },
  { category: "internal-arch", label: "KinyCOMET", pattern: /KinyCOMET/i },
  { category: "internal-arch", label: "Clef-flash", pattern: /Clef-flash/i },
  { category: "internal-arch", label: "PacingEngine", pattern: /PacingEngine/i },
  { category: "internal-arch", label: "RollingContextBuffer", pattern: /RollingContextBuffer/i },
  { category: "internal-arch", label: "SourceLanguageGate", pattern: /SourceLanguageGate/i },
  { category: "internal-arch", label: "SourceLanguageMismatch", pattern: /SourceLanguageMismatch/i },
  { category: "internal-arch", label: "QE_GATE_LOG_ONLY", pattern: /QE_GATE_LOG_ONLY/i },
  { category: "internal-arch", label: "AUDIENCE_AUDIO_ENABLED", pattern: /AUDIENCE_AUDIO_ENABLED/i },
  { category: "internal-arch", label: "systemInstruction", pattern: /systemInstruction/i },

  // Forbidden private repo names, debug paths, glossaries & unit-economics math
  { category: "private-asset", label: "Rwaanslator", pattern: /Rwaanslator/i },
  { category: "private-asset", label: "Rwaansslator", pattern: /Rwaansslator/i },
  { category: "private-asset", label: ".debug-recordings", pattern: /\.debug-recordings/i },
  { category: "private-glossary", label: "Umusamariyakazi", pattern: /Umusamariyakazi/i },
  { category: "private-glossary", label: "Namaramaje", pattern: /Namaramaje/i },
  { category: "private-glossary", label: "unkozeho", pattern: /unkozeho/i },
  { category: "private-glossary", label: "iriba ni rirerire", pattern: /iriba ni rirerire/i },
  { category: "private-glossary", label: "abakozi", pattern: /abakozi/i },
  { category: "private-glossary", label: "abagabo", pattern: /abagabo/i },
  { category: "unit-economics", label: "0.0368", pattern: /0\.0368/ },
  { category: "unit-economics", label: "0.0315", pattern: /0\.0315/ },
  { category: "unit-economics", label: "85.6%", pattern: /85\.6%/ },

  // Forbidden biographical / origin claims & non-preferred generic contact alias
  { category: "private-contact", label: "kos536@usask.ca", pattern: /kos536@usask\.ca/i },
  { category: "biographical", label: "from Rwanda", pattern: /from Rwanda/i },
  { category: "biographical", label: "born in Rwanda", pattern: /born in Rwanda/i },
  { category: "biographical", label: "grew up in Rwanda", pattern: /grew up in Rwanda/i },
  { category: "biographical", label: "Rwandan-born", pattern: /Rwandan-born/i },
  { category: "biographical", label: "Rwandan student", pattern: /Rwandan student/i },
  { category: "biographical", label: "originally from Rwanda", pattern: /originally from Rwanda/i },
  { category: "biographical", label: "native of Rwanda", pattern: /native of Rwanda/i },
];

const SELF_RELATIVE_PATH = path.normalize("tests/disclosure-guard.test.ts");

function collectPublicFiles(rootDir: string): string[] {
  const results: string[] = [];

  function walkDir(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
      return;
    }
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      const relPath = path.normalize(path.relative(rootDir, fullPath));
      if (relPath === SELF_RELATIVE_PATH) {
        continue;
      }
      if (entry.isDirectory()) {
        if (entry.name === "node_modules" || entry.name === ".git" || entry.name === "dist") {
          continue;
        }
        walkDir(fullPath);
      } else if (entry.isFile()) {
        results.push(fullPath);
      }
    }
  }

  walkDir(path.join(rootDir, "src"));
  walkDir(path.join(rootDir, "public"));

  for (const singleFile of ["index.html", "README.md"]) {
    const candidate = path.join(rootDir, singleFile);
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      results.push(candidate);
    }
  }

  return results.sort();
}

describe("Public Portfolio Secret-Sauce & Biographical Disclosure Guard", () => {
  const scannedFiles = collectPublicFiles(REPO_ROOT);

  it("scans all public source, asset, HTML, and README files without skipping the repo", () => {
    const relativePaths = scannedFiles.map((filePath) =>
      path.relative(REPO_ROOT, filePath).replace(/\\/g, "/"),
    );

    expect(relativePaths).toContain("src/data/profile.ts");
    expect(relativePaths).toContain("src/data/projects.ts");
    expect(relativePaths).toContain("src/projects/ikilang/types.ts");
    expect(relativePaths).toContain("src/projects/ikilang/data.ts");
    expect(relativePaths).toContain("index.html");
    expect(relativePaths).toContain("README.md");
    expect(relativePaths.some((p) => p.startsWith("public/"))).toBe(true);
    expect(relativePaths).not.toContain("tests/disclosure-guard.test.ts");
  });

  it("contains zero forbidden model IDs, internal architecture terms, private glossaries, pricing math, or origin claims", () => {
    const violations: string[] = [];

    for (const filePath of scannedFiles) {
      const content = fs.readFileSync(filePath, "utf8");
      const relPath = path.relative(REPO_ROOT, filePath).replace(/\\/g, "/");

      for (const rule of FORBIDDEN_PATTERNS) {
        const match = content.match(rule.pattern);
        if (match) {
          violations.push(
            `[${rule.category}] ${relPath} matched "${rule.label}" -> "${match[0]}"`,
          );
        }
      }
    }

    expect(violations).toEqual([]);
  });

  it("enforces canonical honesty invariants on IKILANG_DATA maturity boundaries", () => {
    const gatedOnlyMatchers = [
      { label: "audience/listener audio streaming", pattern: /listener audio|audience audio|tts|audio playback/i },
      { label: "EN -> RW translation", pattern: /en\s*(->|→|to)\s*rw/i },
      { label: "custom model/voice fine-tuning", pattern: /fine-tun/i },
      { label: "multi-tenant production scale", pattern: /multi-tenant/i },
    ];

    for (const { label, pattern } of gatedOnlyMatchers) {
      const matchingItems = IKILANG_DATA.maturityMatrix.filter((item) =>
        pattern.test(item.capability),
      );

      expect(
        matchingItems.length,
        `Expected maturityMatrix to explicitly list and gate "${label}"`,
      ).toBeGreaterThan(0);

      for (const item of matchingItems) {
        expect(
          item.status,
          `Capability "${item.capability}" must remain deliberately gated, never proven`,
        ).toBe("gated");
      }
    }
  });

  it("includes explicit simulation provenance, black-box disclosure, audio-disarmed, and cryptographic honesty notices", () => {
    expect(IKILANG_DATA.timelineProvenanceNotice).toMatch(/illustrative/i);
    expect(IKILANG_DATA.timelineProvenanceNotice).toMatch(/not live/i);

    expect(IKILANG_DATA.previewProvenanceNotice).toMatch(/illustrative/i);
    expect(IKILANG_DATA.previewProvenanceNotice).toMatch(/not live/i);

    expect(IKILANG_DATA.blackBoxNotice).toMatch(/black-box/i);
    expect(IKILANG_DATA.blackBoxNotice).toMatch(/excluded|private/i);

    expect(IKILANG_DATA.audioDisarmedNotice).toMatch(/disarmed/i);

    expect(IKILANG_DATA.cryptographicHonestyNotice).toMatch(/HTTPS\/WSS/i);
    expect(IKILANG_DATA.cryptographicHonestyNotice).toMatch(/E2EE|End-to-End/i);
  });

  it("maintains bidirectional framing and clean profile/project metadata", () => {
    expect(PROFILE.name).toBe("Christian Muhirwa");
    expect(PROFILE.affiliation).toBe("University of Saskatchewan");
    expect(PROFILE.githubUrl).toBe("https://github.com/cHrisbErg2");
    expect(PROFILE.email).toBe("christian.muhirwa@usask.ca");

    const projectIds = PUBLIC_PROJECTS.map((project) => project.id);
    expect(projectIds).toContain("ikilang");
    expect(projectIds).toContain("agri-for-prairie");

    const agriProject = PUBLIC_PROJECTS.find((p) => p.id === "agri-for-prairie");
    expect(agriProject?.externalUrl).toBe("https://github.com/cHrisbErg2/AgrI-For-Prairie");

    // Verify bidirectional impact is explicitly documented in both directions
    expect(IKILANG_DATA.bridgeDirections.length).toBeGreaterThanOrEqual(2);
    const combinedBridgeText = IKILANG_DATA.bridgeDirections
      .map((d) => `${d.title} ${d.audience} ${d.settings.join(" ")} ${d.valueStatement} ${d.dignityHighlight}`)
      .join(" ");
    expect(combinedBridgeText).toMatch(/newcomer|resident/i);
    expect(combinedBridgeText).toMatch(/clinic/i);
    expect(combinedBridgeText).toMatch(/government/i);
    expect(combinedBridgeText).toMatch(/church/i);
    expect(combinedBridgeText).toMatch(/ngo|non-profit/i);
    expect(combinedBridgeText).toMatch(/missionar/i);
    expect(combinedBridgeText).toMatch(/tourist|traveler/i);

    // Verify everyday mother tongue + community validation framing
    const storyText = [
      ...IKILANG_DATA.founderStory.paragraphs,
      IKILANG_DATA.founderStory.languageStewardshipNote,
    ].join(" ");
    expect(storyText).toMatch(/everyday mother tongue/i);
    expect(storyText).toMatch(/community validation/i);
  });
});
