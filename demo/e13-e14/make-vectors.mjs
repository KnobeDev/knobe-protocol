// Builds the three interpretation vectors proposed in #22 for E13 and E14,
// in the shape of the existing interpretation set: a two-line frontmatter
// (title, spec_version), a body that states the expected result, and one
// payload block sealed by knobe-core.js's seal().
//
//   node demo/e13-e14/make-vectors.mjs     (from the repository root)
//
// Writes each file to test-vectors/interpretation/ and to its mirror under
// site/test-vectors/interpretation/. Output is deterministic.

import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { seal, canonicalize, normalizeBody, sha256Hex } from "../../knobe-core.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const OUT_DIRS = ["test-vectors/interpretation", "site/test-vectors/interpretation"];

const BEGIN = "-----BEGIN KNOBE B64-----";
const END = "-----END KNOBE B64-----";

function b64Wrapped(str, width = 76) {
  const b64 = Buffer.from(str, "utf8").toString("base64");
  const lines = [];
  for (let i = 0; i < b64.length; i += width) lines.push(b64.slice(i, i + width));
  return lines.join("\n");
}

function basePayload(title, summary) {
  return {
    attribution: { sources: [{ author: "Joshua Hori", contribution: "Test vector author" }] },
    content_type: "original",
    created_date: "2026-11-23",
    license: "CC0 1.0",
    privacy_level: "public",
    quarantine_status: "quarantine",
    spec_version: "1.0",
    summary,
    title,
  };
}

// frontmatter: lines between the delimiters. body: the body text.
// sealBody: whether the payload seals a body_hash. preamble: text placed
// above the opening delimiter after sealing.
async function build({ title, summary, frontmatter, body, sealBody, preamble = "" }) {
  const payload = basePayload(title, summary);
  if (sealBody) payload.body_hash = await sha256Hex(normalizeBody(body));
  const { payload: sealed } = await seal(payload);
  return preamble
    + ["---", ...frontmatter, "---"].join("\n") + "\n\n"
    + body + "\n\n"
    + BEGIN + "\n" + b64Wrapped(canonicalize(sealed)) + "\n" + END + "\n";
}

const RULED_BODY = (title, lead, expected) => [
  `# ${title}`,
  "",
  lead,
  "",
  "---",
  "",
  "The two horizontal rules in this body are ordinary Markdown. They are not",
  "frontmatter delimiters, and the body_hash sealed in the payload covers them.",
  "",
  "---",
  "",
  expected,
].join("\n");

const VECTORS = [
  {
    file: "frontmatter-no-spec-version.knobe.md",
    title: "Frontmatter Without Spec Version",
    summary: "Pins that a frontmatter block which does not declare spec_version makes the file nonconforming without affecting integrity (proposed E13).",
    frontmatter: ['title: "Frontmatter Without Spec Version"'],
    body: [
      "# Frontmatter Without Spec Version",
      "",
      "The YAML frontmatter above declares a title but no spec_version, which spec §3.1 and §10 require. The sealed payload declares 1.0 and stays authoritative for verification. Integrity is unaffected; only conformance changes. Expected status: verified, body_verified: omitted, conformance: invalid, with one issue saying the frontmatter does not declare spec_version.",
    ].join("\n"),
    sealBody: false,
  },
  {
    file: "body-after-preamble.knobe.md",
    title: "Body After Preamble",
    summary: "Pins that frontmatter must begin on line 1: with a line of text above the opening delimiter the file has no frontmatter, and a sealed body_hash makes it unreadable (proposed E14).",
    preamble: "Forwarded note: please read the file below before class.\n",
    frontmatter: ['title: "Body After Preamble"', 'spec_version: "1.0"'],
    body: RULED_BODY(
      "Body After Preamble",
      "A line of text sits above this file's opening delimiter, so line 1 is not `---` and the file has no frontmatter. A verifier must not search further down for a `---` pair: the opening delimiter is line 1 and nowhere else.",
      "The payload seals a body_hash, and with no frontmatter there is no closing delimiter to locate the body from. Expected status: unreadable, body_verified: omitted, conformance: invalid.",
    ),
    sealBody: true,
  },
  {
    file: "body-horizontal-rules.knobe.md",
    title: "Body Horizontal Rules",
    summary: "Positive control for E14: horizontal rules in the body are ordinary content and the body verifies (proposed E14).",
    frontmatter: ['title: "Body Horizontal Rules"', 'spec_version: "1.0"'],
    body: RULED_BODY(
      "Body Horizontal Rules",
      "The frontmatter begins on line 1 and closes at the next line that is exactly `---`. Every later `---` line is body content.",
      "Expected status: verified, body_verified: yes, conformance: valid.",
    ),
    sealBody: true,
  },
];

for (const v of VECTORS) {
  const text = await build(v);
  for (const d of OUT_DIRS) writeFileSync(join(ROOT, d, v.file), text);
  console.log(v.file);
}
