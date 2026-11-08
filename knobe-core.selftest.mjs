#!/usr/bin/env node
/**
 * knobe-core.selftest.mjs — parity check between the two KNOBE verifiers.
 *
 * For every .knobe.md test vector and example in this repository, this runs
 * BOTH implementations — the JavaScript sibling verifier (knobe-core.js) and
 * the Python reference verifier (lens.py) — and confirms they return the same
 * verdict: status, conformance level, body result, computed and stored hash,
 * block counts, and exit code. Both engines must also match the expected
 * result published for each vector in the test-vectors READMEs (every vector
 * needs a row there), and every sealed example must verify and be valid.
 * It also checks that the two engines give the
 * same reason and conformance issues, word for word, except on the files
 * listed in KNOWN_TEXT_DIFFS; and that neither engine lets a display hazard
 * through: lens.py's human report and knobe-core.js's safe() must never
 * output a raw control, bidi or separator character or an unpaired surrogate.
 *
 *   node knobe-core.selftest.mjs
 *
 * Exit 0 = every file agreed. Exit 1 = a disagreement (printed). Requires
 * Node >= 20 and python3 on PATH; it is a cross-language check by design.
 */
import { readFile, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { verify, exitCode, safe, seal } from "./knobe-core.js";

const execFileP = promisify(execFile);
const HERE = dirname(fileURLToPath(import.meta.url));
const LENS = join(HERE, "lens.py");
const GATE = ["state", "conformance", "body_verified", "computed", "stored",
              "block_count", "multiple_blocks", "exit_code"];

// Files on which the engines still word a reason or issue differently. Each
// is a known difference, listed under "Not in this PR" in PR #19. The check
// fails if a listed file starts to agree, so its entry can be removed.
const KNOWN_TEXT_DIFFS = new Map([
  ["test-vectors/adversarial/float-overflow.knobe.md",
   "lens.py names the non-JSON constant; knobe-core.js reports a parse failure"],
  ["test-vectors/adversarial/spec-version-array.knobe.md",
   "a non-string value is shown with Python repr() in lens.py, as JSON in knobe-core.js"],
]);

// The first code point in text that a display must never show raw: C0
// controls other than line feed, DEL, C1 controls, the bidi overrides and
// isolates (U+202A-202E, U+2066-2069), U+2028/2029, and unpaired surrogates.
// This is the set both engines' safe() escape. Returns null if there is none.
function displayHazard(text) {
  for (let i = 0; i < text.length; i++) {
    const c = text.charCodeAt(i);
    if (c >= 0xd800 && c <= 0xdbff) {
      const next = text.charCodeAt(i + 1);
      if (next >= 0xdc00 && next <= 0xdfff) { i++; continue; }
      return c;
    }
    if ((c >= 0xdc00 && c <= 0xdfff) || (c < 0x20 && c !== 0x0a)
        || (c >= 0x7f && c <= 0x9f) || (c >= 0x202a && c <= 0x202e)
        || (c >= 0x2066 && c <= 0x2069) || c === 0x2028 || c === 0x2029) return c;
  }
  return null;
}
const hex = (c) => "U+" + c.toString(16).toUpperCase().padStart(4, "0");

// lens.py's human report, decoded as strict UTF-8.
async function lensHuman(f) {
  let out;
  try { out = (await execFileP("python3", [LENS, f], { encoding: "buffer" })).stdout; }
  catch (e) { out = e.stdout; }
  if (!out || !out.length) return { error: "lens.py printed no human report" };
  try { return { text: new TextDecoder("utf-8", { fatal: true }).decode(out) }; }
  catch { return { error: "lens.py's human report is not valid UTF-8" }; }
}

// Every value a display would show from a knobe-core.js report, through safe().
function jsDisplayTexts(r) {
  const values = [r.reason, r.stored, ...(r.conformance_issues || []),
                  ...Object.values(r.payload && typeof r.payload === "object" ? r.payload : {})];
  return values.filter((v) => v !== null && v !== undefined).map((v) => safe(v, null));
}

// The published expected results: the tables in test-vectors/README.md,
// adversarial/README.md and interpretation/README.md. They are the arbiter of
// conformance, so both engines are held to them, not only to each other.
async function expectedResults() {
  const out = new Map();
  for (const [readme, dir, hasBody] of [
    ["test-vectors/README.md", "test-vectors/", true],
    ["test-vectors/adversarial/README.md", "test-vectors/adversarial/", true],
    ["test-vectors/interpretation/README.md", "test-vectors/interpretation/", true],
  ]) {
    for (const line of (await readFile(join(HERE, readme), "utf-8")).split("\n")) {
      const m = /^\|\s*`([^`]+\.knobe\.md)`\s*\|(.*)$/.exec(line);
      if (!m) continue;
      // "verified (last block)" and "valid (where readable)" keep the first word.
      const cells = m[2].split("|").map((c) => c.trim().split(" ")[0]);
      out.set(dir + m[1], hasBody
        ? { state: cells[0], body_verified: cells[1], conformance: cells[2] }
        : { state: cells[0], conformance: cells[1] });
    }
  }
  return out;
}

// Where a report differs from its file's published expected result. A sealed
// example must verify and be valid. A "—" for body_verified is the omitted of
// spec section 7, spelled null or "omitted" (ERRATA E11).
function unexpected(rel, got, want) {
  if (rel.startsWith("examples/")) want = { state: "verified", conformance: "valid" };
  const out = [];
  for (const k of ["state", "conformance"]) {
    if (got[k] !== want[k]) out.push(`${k} ${JSON.stringify(got[k])}, expected ${JSON.stringify(want[k])}`);
  }
  if (want.body_verified !== undefined) {
    const ok = want.body_verified === "—"
      ? got.body_verified === null || got.body_verified === "omitted"
      : got.body_verified === want.body_verified;
    if (!ok) out.push(`body_verified ${JSON.stringify(got.body_verified)}, expected ${JSON.stringify(want.body_verified)}`);
  }
  return out;
}

async function collect(dir) {
  const out = [];
  async function walk(d) {
    for (const e of await readdir(d, { withFileTypes: true })) {
      const p = join(d, e.name);
      if (e.isDirectory()) await walk(p);
      else if (e.name.endsWith(".knobe.md")) out.push(p);
    }
  }
  if (existsSync(dir)) await walk(dir);
  return out;
}

const files = [
  ...await collect(join(HERE, "test-vectors")),
  ...await collect(join(HERE, "examples")),
].sort();
if (!files.length) { console.error("no .knobe.md files found next to this script"); process.exit(2); }
if (!existsSync(LENS)) { console.error("lens.py not found next to this script"); process.exit(2); }
const EXPECTED = await expectedResults();

let agree = 0;
const disagreements = [];

for (const f of files) {
  // JavaScript sibling verifier
  let r;
  try { r = await verify(new Uint8Array(await readFile(f))); }
  catch (e) { disagreements.push({ f, note: "knobe-core.js threw: " + (e.message || e) }); continue; }
  const js = {
    state: r.state, conformance: r.conformance, body_verified: r.body_verified,
    computed: r.computed, stored: r.stored, block_count: r.block_count,
    multiple_blocks: r.multiple_blocks, exit_code: exitCode(r),
  };
  // Python reference verifier. lens.py prints JSON to stdout and encodes the
  // verdict in its process exit code (0 ok, 1 fail/invalid, 2 unreadable).
  let py, pyExit;
  try {
    const { stdout } = await execFileP("python3", [LENS, "--json", f]);
    py = JSON.parse(stdout); pyExit = 0;
  } catch (e) {
    if (e.stdout) { py = JSON.parse(e.stdout); pyExit = typeof e.code === "number" ? e.code : null; }
    else { disagreements.push({ f, note: "lens.py produced no JSON: " + (e.message || e) }); continue; }
  }
  const ref = {
    state: py.state, conformance: py.conformance, body_verified: py.body_verified,
    computed: py.computed, stored: py.stored, block_count: py.block_count,
    multiple_blocks: py.multiple_blocks, exit_code: pyExit,
  };
  const diffs = GATE.filter((k) => JSON.stringify(js[k] ?? null) !== JSON.stringify(ref[k] ?? null))
    .map((k) => `${k}: js=${JSON.stringify(js[k])} ref=${JSON.stringify(ref[k])}`);

  // Both engines against the published expected result.
  const rel = relative(HERE, f).split(sep).join("/");
  if (!EXPECTED.has(rel) && !rel.startsWith("examples/")) {
    diffs.push("no expected result in the test-vectors READMEs");
  } else {
    for (const [name, got] of [["lens.py", ref], ["knobe-core.js", js]]) {
      for (const d of unexpected(rel, got, EXPECTED.get(rel))) diffs.push(`${name}: ${d}`);
    }
  }

  // Reason and issue text, word for word.
  const textDiffs = ["reason", "conformance_issues"]
    .filter((k) => JSON.stringify(r[k] ?? null) !== JSON.stringify(py[k] ?? null));
  if (KNOWN_TEXT_DIFFS.has(rel)) {
    if (!textDiffs.length) diffs.push("listed in KNOWN_TEXT_DIFFS but the engines now agree; remove the entry");
  } else {
    for (const k of textDiffs) diffs.push(`${k}: js=${JSON.stringify(r[k])} ref=${JSON.stringify(py[k])}`);
  }

  // Display safety in both engines.
  const human = await lensHuman(f);
  if (human.error) diffs.push(human.error);
  else if (displayHazard(human.text) !== null) {
    diffs.push(`lens.py's human report shows a raw ${hex(displayHazard(human.text))}`);
  }
  try {
    const raw = jsDisplayTexts(r).map(displayHazard).find((c) => c !== null);
    if (raw !== undefined) diffs.push(`knobe-core.js safe() passes a raw ${hex(raw)}`);
  } catch (e) { diffs.push("knobe-core.js safe() threw: " + (e.message || e)); }

  if (diffs.length) disagreements.push({ f, diffs });
  else agree++;
}

// A README row whose file is gone would otherwise drop out of the check unseen.
const present = new Set(files.map((f) => relative(HERE, f).split(sep).join("/")));
for (const rel of EXPECTED.keys()) {
  if (!present.has(rel)) disagreements.push({ f: join(HERE, rel), note: "listed in the test-vectors READMEs, but the file is missing" });
}

// The reference sealer refuses a code point unassigned in its Unicode tables
// (issue #33): U+0378 is unassigned in every Unicode version to date.
const SEALER = join(HERE, "knobe-core.js");
try {
  await seal({ spec_version: "1.0", title: "ok \u00e9" });
} catch (e) { disagreements.push({ f: SEALER, note: "seal() refused an assigned string: " + (e.message || e) }); }
for (const bad of [{ title: "x\u0378" }, { ["k\u0378"]: "v" }, { a: ["x\u0378"] }]) {
  try {
    await seal({ spec_version: "1.0", ...bad });
    disagreements.push({ f: SEALER, note: "seal() accepted an unassigned code point: " + JSON.stringify(bad) });
  } catch { /* refused, as required */ }
}

console.log(`KNOBE verifier parity: ${agree}/${files.length} files agree (knobe-core.js vs lens.py, and both vs the published expected results)`);
console.log(`  (${KNOWN_TEXT_DIFFS.size} files with known reason or issue wording differences)`);
for (const d of disagreements) {
  console.log("DISAGREE " + relative(HERE, d.f));
  for (const line of (d.diffs || [d.note])) console.log("   " + line);
}
process.exit(disagreements.length ? 1 : 0);
