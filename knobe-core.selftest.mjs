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
import { verify, exitCode, safe, seal, createKnobe, permits } from "./knobe-core.js";

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

// Where String.prototype.isWellFormed is missing, the unpaired-surrogate check
// falls back to a regular expression. Safari on iOS before 16.4 cannot parse a
// regex lookbehind, and a script holding one it cannot parse does not load at
// all, so neither knobe-core.js nor any page or script the site serves may
// contain one. With isWellFormed removed, the fallback must reject exactly the
// payloads that hold an unpaired surrogate, in a key, a value or a nested value.
const SITE = join(HERE, "site");
const browserFiles = [join(HERE, "knobe-core.js"), ...(await readdir(SITE))
  .filter((n) => n.endsWith(".js") || n.endsWith(".html")).map((n) => join(SITE, n))];
for (const file of browserFiles) {
  if (/\(\?<[=!]/.test(await readFile(file, "utf-8"))) {
    disagreements.push({ f: file, note: "contains a regex lookbehind, which Safari on iOS before 16.4 cannot parse" });
  }
}
const SURROGATE_PROBES = ["\ud800", "a\udbff", "\ud800a", "\udc00", "a\udfff", "\udc00a",
  "\udc00\ud800", "\ud800\ud800\udc00", "\ud800\udc00\udc00", "\ud800\udc00", "\udbff\udfff",
  "e\u0301\u{1F600}x", "\ud7ff\ue000"];
// Array.from splits a string into code points; an unpaired surrogate stays alone.
const hasUnpaired = (s) => Array.from(s).some((ch) => ch.length === 1 && ch >= "\ud800" && ch <= "\udfff");
// JSON.stringify writes an unpaired surrogate as a \uXXXX escape.
const probeFile = (payload) => "---\ntitle: \"p\"\nspec_version: \"1.0\"\n---\n\nbody\n\n"
  + "-----BEGIN KNOBE B64-----\n" + Buffer.from(JSON.stringify(payload), "utf-8").toString("base64")
  + "\n-----END KNOBE B64-----\n";
const IS_WELL_FORMED = Object.getOwnPropertyDescriptor(String.prototype, "isWellFormed");
delete String.prototype.isWellFormed;
try {
  for (const s of SURROGATE_PROBES) {
    for (const payload of [{ spec_version: "1.0", a: s }, { spec_version: "1.0", [s]: 1 },
                           { spec_version: "1.0", a: [{ b: s }] }]) {
      const r = await verify(probeFile(payload));
      const rejected = (r.reason || "").startsWith("payload contains characters that cannot be UTF-8 encoded");
      if (rejected !== hasUnpaired(s)) {
        disagreements.push({ f: SEALER, note: `without isWellFormed, verify() ${rejected ? "rejects" : "accepts"} ${JSON.stringify(payload)}` });
      }
    }
  }
} catch (e) {
  disagreements.push({ f: SEALER, note: "verify() threw without isWellFormed: " + (e.message || e) });
} finally {
  if (IS_WELL_FORMED) Object.defineProperty(String.prototype, "isWellFormed", IS_WELL_FORMED);
}

// permits() must never give an action more than the sealed terms grant
// (issue #42). Four inspection verbs are refused by no license. Every other
// verb is held to the license: the listed distribution and derivative verbs
// by their class, "quote" and "summarise" as the listed verbs they name, and
// any verb on no list as both classes at once, because it could be either.
// A result with obligations is "conditional", never true.
{
  const sealedReport = async (fields) => verify((await createKnobe({
    fields: { title: "t", summary: "s", privacy_level: "public", quarantine_status: "trusted", ...fields },
    body: "b", author: "A" })).text);
  const INSPECTION = ["read", "use", "inspect", "verify"];
  const UNLISTED = ["paraphrase", "fine-tune", "reproduce", "xyzzy", ""];
  const expectAllowed = (name, report, action, want) => {
    const got = permits(report, action);
    if (got.allowed !== want) {
      disagreements.push({ f: SEALER, note: `permits(${name}, ${JSON.stringify(action)}) is ${JSON.stringify(got.allowed)}, expected ${JSON.stringify(want)}` });
    }
    return got;
  };
  const basisSays = (name, got, re) => {
    if (!got.basis.some((b) => re.test(String(b.effect)))) {
      disagreements.push({ f: SEALER, note: `permits(${name}, ${JSON.stringify(got.action)}) has no basis matching ${re}` });
    }
  };

  // All rights reserved: only inspection is left.
  const reserved = await sealedReport({ license: "All rights reserved" });
  for (const a of INSPECTION) expectAllowed("all rights reserved", reserved, a, "conditional");
  for (const a of ["excerpt", "summarize", "train", "redistribute"]) expectAllowed("all rights reserved", reserved, a, false);
  basisSays("all rights reserved", expectAllowed("all rights reserved", reserved, "quote", false), /evaluated as "excerpt"/);
  basisSays("all rights reserved", expectAllowed("all rights reserved", reserved, "summarise", false), /evaluated as "summarize"/);
  expectAllowed("all rights reserved", reserved, "  Quote ", false);
  for (const a of UNLISTED) {
    basisSays("all rights reserved", expectAllowed("all rights reserved", reserved, a, false), /unrecognized action: no permission assumed/);
  }
  expectAllowed("all rights reserved", reserved, undefined, false);
  // Case and surrounding whitespace do not change which verb was asked.
  for (const a of ["READ", " Read ", "\ufeffread\n"]) expectAllowed("all rights reserved", reserved, a, "conditional");
  // A look-alike or a compound is not the inspection verb it resembles.
  for (const a of ["\uff52\uff45\uff41\uff44", "read\u200b", "re ad", "read,publish", "use to train", "\u0130nspect"]) {
    expectAllowed("all rights reserved", reserved, a, false);
  }
  // Property names of ordinary objects are just unrecognized verbs.
  for (const a of ["__proto__", "constructor", "toString", "hasOwnProperty"]) expectAllowed("all rights reserved", reserved, a, false);
  // Not a string: null, 0 and false read as no action; the rest by their text.
  for (const a of [null, 0, false, 5, {}, ["read", "publish"]]) expectAllowed("all rights reserved", reserved, a, false);
  // Verbs the design notes plan to add are unrecognized until they are added.
  for (const a of ["embed", "archive"]) expectAllowed("all rights reserved", reserved, a, false);

  // A license that grants both classes grants an unlisted verb too, and says how it was read.
  const ccBy = await sealedReport({ license: "CC BY 4.0" });
  basisSays("CC BY 4.0", expectAllowed("CC BY 4.0", ccBy, "paraphrase", "conditional"), /unrecognized action: no permission assumed/);
  expectAllowed("CC BY 4.0", ccBy, "quote", "conditional");
  expectAllowed("CC BY 4.0", ccBy, "train", "conditional");

  // NoDerivatives: redistribution is licensed, derivatives are not. An
  // unlisted verb might be a derivative, so it is refused as one.
  const ccByNd = await sealedReport({ license: "CC BY-ND 4.0" });
  expectAllowed("CC BY-ND 4.0", ccByNd, "redistribute", "conditional");
  for (const a of ["excerpt", "quote", "summarise", "paraphrase", "xyzzy"]) expectAllowed("CC BY-ND 4.0", ccByNd, a, false);
  for (const a of INSPECTION) expectAllowed("CC BY-ND 4.0", ccByNd, a, "conditional");

  // Quarantine and a non-public privacy level refuse distribution; an
  // unlisted verb might distribute, so they refuse it too.
  const quarantined = await sealedReport({ license: "CC BY 4.0", quarantine_status: "quarantine" });
  const internal = await sealedReport({ license: "CC BY 4.0", privacy_level: "internal" });
  for (const [name, report] of [["quarantined CC BY", quarantined], ["internal CC BY", internal]]) {
    expectAllowed(name, report, "redistribute", false);
    for (const a of ["paraphrase", "xyzzy"]) expectAllowed(name, report, a, false);
    expectAllowed(name, report, "summarize", "conditional");
    expectAllowed(name, report, "quote", "conditional");
    for (const a of INSPECTION) expectAllowed(name, report, a, "conditional");
  }

  // A rejected object and a broken seal permit nothing, inspection included.
  const rejected = await sealedReport({ license: "CC0-1.0", quarantine_status: "rejected" });
  for (const a of [...INSPECTION, "summarize", "xyzzy"]) expectAllowed("rejected", rejected, a, false);
  for (const a of [...INSPECTION, "xyzzy"]) expectAllowed("failed seal", { state: "failed", conformance: "valid" }, a, false);

  // true means no obligations at all. A modified body or a non-conformant
  // file adds an obligation, so the answer is "conditional".
  const bare = { license: "CC0-1.0", privacy_level: "public", quarantine_status: "trusted" };
  expectAllowed("clean CC0", { state: "verified", conformance: "valid", payload: bare }, "read", true);
  expectAllowed("clean CC0", { state: "verified", conformance: "valid", payload: bare }, "train", true);
  // An unrecognized verb is never answered with a plain true, even where the terms grant everything.
  {
    const got = expectAllowed("clean CC0", { state: "verified", conformance: "valid", payload: bare }, "xyzzy", "conditional");
    if (!got.obligations.some((o) => o.startsWith("unrecognized action:"))) {
      disagreements.push({ f: SEALER, note: "permits(clean CC0, \"xyzzy\") names no obligation for the unrecognized action" });
    }
  }
  expectAllowed("CC0, body modified", { state: "verified-body-modified", conformance: "valid", payload: bare }, "read", "conditional");
  expectAllowed("CC0, non-conformant", { state: "verified", conformance: "invalid", conformance_issues: ["x"], payload: bare }, "read", "conditional");
  for (const f of files) {
    const report = await verify(new Uint8Array(await readFile(f)));
    for (const a of [...INSPECTION, "summarize", "excerpt", "quote", "redistribute", "train", ...UNLISTED]) {
      const got = permits(report, a);
      if (got.allowed === true && got.obligations.length) {
        disagreements.push({ f, note: `permits(${JSON.stringify(a)}) is true with ${got.obligations.length} obligation(s)` });
      }
    }
  }
}

console.log(`KNOBE verifier parity: ${agree}/${files.length} files agree (knobe-core.js vs lens.py, and both vs the published expected results)`);
console.log(`  (${KNOWN_TEXT_DIFFS.size} files with known reason or issue wording differences)`);
for (const d of disagreements) {
  console.log("DISAGREE " + relative(HERE, d.f));
  for (const line of (d.diffs || [d.note])) console.log("   " + line);
}
process.exit(disagreements.length ? 1 : 0);
