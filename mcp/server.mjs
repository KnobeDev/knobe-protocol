#!/usr/bin/env node
/**
 * knobe-mcp — MCP server for KNOBE Protocol v1.
 *
 * A stdio adapter over knobe-core.js (verdict parity with lens.py across the
 * published corpus). Five tools:
 *
 *   knobe_verify     integrity + conformance verdict (lens.py semantics)
 *   knobe_read       obligations-FIRST read: the sealed use-conditions arrive
 *                    as a preamble block before the content
 *   knobe_create     author + seal a new KNOBE; self-verifies before returning
 *   knobe_transform  derive with lineage (parents[] chain); refuses broken seals
 *   knobe_permits    evaluate a proposed action against the SEALED governance
 *                    fields, citing the clauses that produced the verdict
 *
 * Plus: the 31-fixture corpus as knobe:// resources, an orientation guide,
 * and a guarded-summarize prompt encoding verify → permits → act-or-decline.
 *
 * Everything runs in this process. No network requests, no telemetry, no
 * state between calls. stdout is the JSON-RPC channel; logging goes to stderr.
 */

import { readFile, writeFile, mkdir, readdir } from "node:fs/promises";
import { existsSync, realpathSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  verify, read, exitCode, createKnobe, transformKnobe, permits, safe,
} from "./knobe-core.js";

const HERE = dirname(fileURLToPath(import.meta.url));
const FIXTURES = join(HERE, "fixtures");
const VERSION = "0.1.2";

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------

/** JSON.stringify that survives BigInt payload values. */
const jsonSafe = (o, indent = 2) =>
  JSON.stringify(o, (k, v) => (typeof v === "bigint" ? v.toString() : v), indent);

const inputShape = {
  file_path: z.string().optional()
    .describe("Absolute path to a .knobe.md file"),
  text: z.string().optional()
    .describe("Raw .knobe.md content (alternative to file_path)"),
};

/** Resolve tool input to bytes/text, or a lens.py-style unreadable report. */
async function loadInput({ file_path, text }) {
  if (typeof text === "string" && text.length) {
    return { ok: true, data: text, source: "(inline text)" };
  }
  if (!file_path) {
    return { ok: false, error: "Provide either file_path or text." };
  }
  try {
    return { ok: true, data: new Uint8Array(await readFile(file_path)), source: file_path };
  } catch (e) {
    return {
      ok: false,
      error: `could not read file: ${e.message}`,
      report: {
        state: "unreadable", reason: `could not read file: ${e.message}`,
        conformance: "invalid", conformance_issues: [`could not read file: ${e.message}`],
        multiple_blocks: false, block_count: 0, block_used: 0,
        computed: null, stored: null, payload: null,
        body_verified: null, body: null, missing: [],
      },
    };
  }
}

/** lens.py --json keys + exit_code (payload omitted: use knobe_read). */
function verdictJSON(r) {
  return {
    state: r.state, computed: r.computed, stored: r.stored,
    body_verified: r.body_verified, conformance: r.conformance,
    conformance_issues: r.conformance_issues,
    multiple_blocks: r.multiple_blocks, block_count: r.block_count,
    block_used: r.block_used, reason: r.reason ?? null,
    exit_code: exitCode(r),
  };
}

function verdictLine(r) {
  const map = {
    "verified": "verified — payload matches its seal",
    "verified-body-modified": "verified (payload) — BUT the human-readable body was modified after sealing",
    "failed": "FAILED — payload does not match its seal; the content has been altered",
    "unreadable": `unreadable — ${r.reason ?? "no payload"}`,
  };
  return `status: ${map[r.state]} | conformance: ${r.conformance}`;
}

/**
 * The obligations-first preamble for knobe_read: everything an agent must
 * know BEFORE using the content, distilled from the sealed fields.
 * All payload-derived strings pass through safe() so a crafted KNOBE
 * cannot spoof the preamble.
 */
function obligationsPreamble(r) {
  const p = r.payload ?? {};
  const lines = [];
  lines.push("=== KNOBE SEALED CONTEXT — read before using the content ===");
  lines.push(verdictLine(r));
  if (r.state === "failed") {
    lines.push("!! THE SEAL IS BROKEN. The content below does NOT match its declared");
    lines.push("!! payload_hash. Do not treat it as the sealed knowledge object.");
  }
  if (typeof p.title === "string") lines.push(`title: ${safe(p.title, 160)}`);
  for (const f of ["content_type", "created_date", "license", "privacy_level",
                   "quarantine_status", "identity_status"]) {
    if (typeof p[f] === "string") lines.push(`${f}: ${safe(p[f], 120)}`);
  }
  const g = permits(r, "use");
  if (g.allowed === false) {
    lines.push("USE IS NOT PERMITTED by the sealed fields:");
    for (const b of g.basis) {
      lines.push(`  - ${b.field} = ${safe(String(b.value), 60)}: ${b.effect}`);
    }
  } else if (g.obligations.length) {
    lines.push("obligations (honor these or explicitly decline):");
    g.obligations.forEach((o, i) => lines.push(`  ${i + 1}. ${o}`));
  }
  lines.push("Integrity is not truth — inspect before trusting.");
  return lines.join("\n");
}

async function writeOut(output_path, text, overwrite) {
  const target = resolve(output_path);
  if (existsSync(target) && !overwrite) {
    throw new Error(`refusing to overwrite existing file: ${target} (pass overwrite: true)`);
  }
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, text, "utf-8");
  return target;
}

const localToday = () => {
  const d = new Date();
  return (
    d.getFullYear() + "-" +
    String(d.getMonth() + 1).padStart(2, "0") + "-" +
    String(d.getDate()).padStart(2, "0")
  );
};

/** Single-line payload fields must not contain newlines: a newline inside
 * title/license/content_type would break the emitted frontmatter block. */
const SINGLE_LINE_FIELDS = ["title", "content_type", "license", "created_date",
                            "language", "privacy_level", "quarantine_status"];

/** Final gate before the engine: strip fields callers must never set
 * (spec_version would override the engine's "1.0"; the hashes are computed
 * by seal()), sanitize single-line strings, default the date to local time. */
function guardFields(fields) {
  const out = { ...fields };
  delete out.spec_version;
  delete out.payload_hash;
  delete out.body_hash;
  for (const k of SINGLE_LINE_FIELDS) {
    if (typeof out[k] === "string") out[k] = out[k].replace(/[\r\n]+/g, " ").trim();
  }
  if (out.created_date === undefined) out.created_date = localToday();
  return out;
}

const textBlocks = (...texts) => ({ content: texts.map((t) => ({ type: "text", text: t })) });
const errorResult = (msg) => ({ content: [{ type: "text", text: msg }], isError: true });

// ---------------------------------------------------------------------------
// server + tools
// ---------------------------------------------------------------------------

/** Build the MCP server with tools, resources, and the prompt registered. */
export async function buildServer() {
  const server = new McpServer(
    { name: "knobe", version: VERSION },
    {
      instructions:
        "KNOBE Protocol v1 tools. A KNOBE (.knobe.md) is a sealed knowledge object: "
        + "its provenance, license, trust posture, and use-conditions travel inside the "
        + "file, cryptographically sealed (SHA-256). Recommended order: knobe_verify "
        + "(is the seal intact?) → knobe_permits (may I do X with it?) → knobe_read "
        + "(obligations arrive before the content). Author new objects with "
        + "knobe_create; derive with lineage via knobe_transform. A verified seal "
        + "proves integrity, not truth — inspect before trusting.",
    },
  );

  server.registerTool("knobe_verify", {
    title: "Verify a KNOBE",
    description:
      "Check a KNOBE's integrity and spec conformance, with the exact semantics of "
      + "lens.py (the reference verifier). Returns two independent dimensions: "
      + "status (verified | verified-body-modified | failed | unreadable) and "
      + "conformance (valid | warnings | invalid), plus computed vs stored hash and "
      + "exit_code (0 ok, 1 fail/invalid, 2 unreadable). A match proves integrity, "
      + "not truth.",
    inputSchema: { ...inputShape },
    annotations: { readOnlyHint: true },
  }, async (args) => {
    const inp = await loadInput(args);
    if (!inp.ok && !inp.report) return errorResult(inp.error);
    const r = inp.report ?? await verify(inp.data);
    return textBlocks(verdictLine(r), jsonSafe(verdictJSON(r)));
  });

  server.registerTool("knobe_read", {
    title: "Read a KNOBE (obligations first)",
    description:
      "Verify and read a KNOBE. The FIRST content block is the sealed-context "
      + "preamble — integrity verdict, provenance, license, trust posture, and the "
      + "obligations that travel with the object. Read and honor it before using "
      + "the content in the second block (sealed payload metadata + markdown body). "
      + "This is how a KNOBE's use-conditions survive the AI boundary.",
    inputSchema: { ...inputShape },
    annotations: { readOnlyHint: true },
  }, async (args) => {
    const inp = await loadInput(args);
    if (!inp.ok && !inp.report) return errorResult(inp.error);
    if (inp.report) {
      return textBlocks(obligationsPreamble(inp.report),
        jsonSafe({ verdict: verdictJSON(inp.report), metadata: null, body: null }));
    }
    const { report, body, payload } = await read(inp.data);
    return textBlocks(
      obligationsPreamble(report),
      jsonSafe({ verdict: verdictJSON(report), metadata: payload, body }),
    );
  });

  const createShape = {
    title: z.string().describe("Title of the knowledge object"),
    summary: z.string().describe("One-sentence summary of what this object is"),
    body: z.string().optional()
      .describe("Markdown body. When provided, its hash is sealed into the payload (body_hash), so later edits to the body are detectable."),
    content_type: z.string().optional()
      .describe("Canonical: original | synthesis | adaptation | compression | annotation | seed | collection | translation. Default: original."),
    license: z.string().optional().describe("Default: CC BY 4.0"),
    privacy_level: z.string().optional()
      .describe("Canonical: public | internal | sensitive | restricted. Default: public."),
    quarantine_status: z.string().optional()
      .describe("Canonical: quarantine | trusted | rejected. Default: quarantine (new objects start untrusted)."),
    author: z.string().optional().describe("Author name for attribution.sources[0]"),
    contribution: z.string().optional().describe("What the author contributed. Default: author"),
    sources: z.array(z.record(z.string(), z.any())).optional()
      .describe("Full attribution.sources array (overrides author/contribution). Objects like {author, contribution, role, rights_bearing}. Values must be strings or booleans — bare numbers violate spec §5."),
    fidelity_limits: z.record(z.string(), z.any()).optional()
      .describe("Object with represents, trust_as, and do_not_infer[] — what this object is and is not to be trusted as."),
    use_conditions: z.record(z.string(), z.any()).optional()
      .describe("Object with permitted[], requested_preservations[], consent_note."),
    tags: z.array(z.string()).optional(),
    language: z.string().optional().describe("e.g. en"),
    extra_fields: z.record(z.string(), z.any()).optional()
      .describe("Additional payload fields. Namespace custom vocabulary with 'ext-' or 'domain:' prefixes per spec §8."),
    output_path: z.string().optional()
      .describe("Absolute path to write the sealed .knobe.md file"),
    overwrite: z.boolean().optional().describe("Allow overwriting output_path if it exists"),
  };

  function buildCreateFields(a) {
    const attribution = a.sources?.length
      ? { sources: a.sources }
      : a.author
        ? { sources: [{ author: a.author, contribution: a.contribution ?? "author" }] }
        : undefined;
    return guardFields({
      title: a.title,
      summary: a.summary,
      ...(a.content_type ? { content_type: a.content_type } : {}),
      ...(a.license ? { license: a.license } : {}),
      ...(a.privacy_level ? { privacy_level: a.privacy_level } : {}),
      ...(a.quarantine_status ? { quarantine_status: a.quarantine_status } : {}),
      ...(attribution ? { attribution } : {}),
      ...(a.fidelity_limits ? { fidelity_limits: a.fidelity_limits } : {}),
      ...(a.use_conditions ? { use_conditions: a.use_conditions } : {}),
      ...(a.tags ? { tags: a.tags } : {}),
      ...(a.language ? { language: a.language } : {}),
      ...(a.extra_fields ?? {}),
    });
  }

  server.registerTool("knobe_create", {
    title: "Create and seal a KNOBE",
    description:
      "Author a new KNOBE: assemble the payload (spec v1 required fields with "
      + "sensible defaults), compute the §5 canonical SHA-256 seal, and emit the "
      + "complete .knobe.md file. The result is self-verified before it is "
      + "returned — this tool cannot emit a file that fails verification. "
      + "Optionally writes the file to output_path. The seal records the "
      + "declarations; it does not establish that they are true.",
    inputSchema: createShape,
  }, async (a) => {
    try {
      const fields = buildCreateFields(a);
      const { text, payloadHash, report } = await createKnobe({ fields, body: a.body ?? "" });
      let where = "(not written to disk — pass output_path to save)";
      if (a.output_path) where = "written to: " + await writeOut(a.output_path, text, a.overwrite);
      return textBlocks(
        `sealed. payload_hash: ${payloadHash}\n${verdictLine(report)}\n${where}`,
        text,
      );
    } catch (e) {
      return errorResult(`knobe_create failed: ${e.message}`);
    }
  });

  server.registerTool("knobe_transform", {
    title: "Derive a KNOBE with lineage",
    description:
      "Create a derivative KNOBE from a verified original. The original's "
      + "payload_hash is chained into parents[], so the transformation is part of "
      + "the derivative's sealed provenance. The original MUST verify — you cannot "
      + "chain from a broken seal. Declare what kind of transformation via "
      + "content_type (adaptation | compression | translation | synthesis | "
      + "annotation). Whether a derivative is authorized is governed by the "
      + "original's sealed terms (check knobe_permits); this tool records lineage, "
      + "it does not grant permission.",
    inputSchema: {
      source_path: z.string().optional().describe("Absolute path to the original .knobe.md"),
      source_text: z.string().optional().describe("Raw original content (alternative to source_path)"),
      ...createShape,
    },
  }, async (a) => {
    const inp = await loadInput({ file_path: a.source_path, text: a.source_text });
    if (!inp.ok) return errorResult(inp.error ?? "provide source_path or source_text");
    try {
      const fields = buildCreateFields(a);
      if (a.content_type === undefined) fields.content_type = "adaptation";
      const { text, payloadHash, report } = await transformKnobe(inp.data, { fields, body: a.body ?? "" });
      let where = "(not written to disk — pass output_path to save)";
      if (a.output_path) where = "written to: " + await writeOut(a.output_path, text, a.overwrite);
      return textBlocks(
        `sealed derivative. payload_hash: ${payloadHash}\nparent chained in parents[].\n${verdictLine(report)}\n${where}`,
        text,
      );
    } catch (e) {
      return errorResult(`knobe_transform failed: ${e.message}`);
    }
  });

  server.registerTool("knobe_permits", {
    title: "Ask a KNOBE's sealed terms whether an action is permitted",
    description:
      "Evaluate whether a proposed action is permitted by the object's SEALED "
      + "governance fields — integrity state, quarantine_status, privacy_level, "
      + "license clauses, attribution, and namespaced extension obligations. "
      + "Returns allowed: true | false | \"conditional\" with the citable clauses. "
      + "Actions: read, summarize, excerpt, translate, transform, redistribute, "
      + "publish, share, train, integrate. A file whose seal fails verification "
      + "permits nothing. The verdict reports what the object declares; "
      + "enforcement belongs to the caller, and this is not legal advice.",
    inputSchema: {
      ...inputShape,
      action: z.string().describe("The proposed action, e.g. summarize, train, redistribute"),
    },
    annotations: { readOnlyHint: true },
  }, async (args) => {
    const inp = await loadInput(args);
    if (!inp.ok && !inp.report) return errorResult(inp.error);
    const r = inp.report ?? await verify(inp.data);
    const g = permits(r, args.action);
    const head =
      g.allowed === true ? `PERMITTED: "${g.action}" (no sealed obligations found)`
      : g.allowed === "conditional" ? `PERMITTED WITH OBLIGATIONS: "${g.action}" — honor them or decline`
      : `NOT PERMITTED: "${g.action}" — cited clauses below`;
    return textBlocks(head, jsonSafe(g));
  });

  // -------------------------------------------------------------------------
  // resources: the vendored fixture corpus + an orientation guide
  // -------------------------------------------------------------------------

  const groups = [
    ["examples", join(FIXTURES, "examples"),
     "Sealed real-world KNOBE (verifies as verified/valid)"],
    ["vectors", join(FIXTURES, "vectors"),
     "Conformance test vector with a known expected verdict"],
    ["vectors/adversarial", join(FIXTURES, "vectors", "adversarial"),
     "Adversarial hardening vector with a known expected verdict"],
  ];
  for (const [prefix, dir, desc] of groups) {
    let names = [];
    try { names = (await readdir(dir)).sort(); } catch { continue; }
    for (const f of names) {
      if (!f.endsWith(".knobe.md")) continue;
      const uri = `knobe://${prefix}/${f}`;
      server.registerResource(
        `${prefix}/${f}`, uri,
        { title: f, description: desc, mimeType: "text/plain" },
        async (u) => ({
          contents: [{ uri: u.href, mimeType: "text/plain",
                       text: await readFile(join(dir, f), "utf-8") }],
        }),
      );
    }
  }
  server.registerResource(
    "guide", "knobe://guide",
    { title: "KNOBE orientation for agents",
      description: "What a KNOBE is and how to use these tools", mimeType: "text/plain" },
    async (u) => ({
      contents: [{ uri: u.href, mimeType: "text/plain", text:
`KNOBE Protocol v1 — orientation

A KNOBE (.knobe.md) is a sealed knowledge object. It is plain markdown plus a
Base64 JSON payload carrying the object's provenance, license, trust posture
(quarantine_status), privacy level, and attribution — sealed with a SHA-256
payload_hash (spec §5). The context travels WITH the object: no server, no
blockchain, no PKI.

Verdicts have two independent dimensions:
  status:      verified | verified-body-modified | failed | unreadable
  conformance: valid | warnings | invalid
"verified-body-modified" means the sealed payload is intact but the
human-readable body was edited after sealing.

Recommended tool order:
  1. knobe_verify   — is the seal intact?
  2. knobe_permits  — may I do X? (cites sealed clauses)
  3. knobe_read     — obligations preamble first, then content
Author with knobe_create; derive with lineage via knobe_transform.

A verified seal proves integrity, not truth — inspect before trusting.
Spec + reference verifier: https://knobe.org` }],
    }),
  );

  // -------------------------------------------------------------------------
  // prompt: the procedure
  // -------------------------------------------------------------------------

  server.registerPrompt("knobe-guarded-summarize", {
    title: "Summarize a KNOBE only if its sealed conditions permit",
    description:
      "The KNOBE procedure: verify integrity, consult the sealed use-conditions, "
      + "then summarize only if permitted — honoring every obligation, or declining "
      + "with the cited clause.",
    argsSchema: { file_path: z.string().describe("Absolute path to the .knobe.md file") },
  }, ({ file_path }) => ({
    messages: [{
      role: "user",
      content: {
        type: "text",
        text:
`You are handling a KNOBE — a sealed knowledge object whose context and
use-conditions travel with it. File: ${file_path}

Follow this procedure exactly:
1. Call knobe_verify. If status is not "verified" or "verified-body-modified",
   STOP: report the integrity failure instead of summarizing.
2. Call knobe_permits with action "summarize". If allowed is false, DECLINE
   and quote the cited clause(s) verbatim.
3. If allowed (possibly with obligations), call knobe_read and produce the
   summary from the sealed content — honoring every obligation (attribution,
   quarantine caveats, privacy scope). End by listing the obligations you
   honored.`,
      },
    }],
  }));

  return server;
}

// ---------------------------------------------------------------------------

/** Is this file the entry point node was invoked with? Compares real paths,
 * not raw argv[1]/import.meta.url strings — npm's bin mechanism installs a
 * SYMLINK (e.g. node_modules/.bin/knobe-mcp -> ../knobe-mcp/server.mjs), so
 * process.argv[1] is the symlink while import.meta.url is already resolved
 * past it; a raw string comparison never matches under npx/npm bin. */
function isEntryPoint() {
  if (!process.argv[1]) return false;
  try {
    return realpathSync(process.argv[1]) === fileURLToPath(import.meta.url);
  } catch {
    return false;
  }
}

if (isEntryPoint()) {
  const transport = new StdioServerTransport();
  await (await buildServer()).connect(transport);
  console.error(`knobe-mcp ${VERSION} ready (stdio; engine parity with lens.py across the corpus)`);
}
