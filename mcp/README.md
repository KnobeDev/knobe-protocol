# knobe-mcp

Sealed knowledge objects, readable by agents.

An MCP server for [KNOBE Protocol v1](https://knobe.org). It lets any MCP client
(Claude Desktop, Claude Code, Cursor, Windsurf, or a custom agent) verify, read,
create, and transform sealed `.knobe.md` knowledge objects, and ask what an
object's own sealed terms permit.

A KNOBE is a plain-text file that keeps its context attached: declared
provenance, transformation history, fidelity limits, use conditions, and a
SHA-256 integrity hash, all sealed inside the file and verifiable locally. The
[specification](https://knobe.org/spec) is frozen at v1.0.

The boundary is deliberate: `knobe-core.js` is the protocol engine; `knobe-mcp`
is one surface over it. ([Studio](https://knobe.org/studio/) is another. Every
future integration is a thin adapter over the same core.)

Everything runs in the local server process. No network requests, no telemetry,
no accounts, no state between calls.

## Tools

| Tool | What it does |
|------|--------------|
| `knobe_verify` | Integrity and conformance verdict for a file or pasted text: the protocol's four states (`verified`, `verified-body-modified`, `failed`, `unreadable`), a separate conformance axis with each issue listed, both hashes, and `lens.py`'s exit code. |
| `knobe_read` | An obligations-first read: the first content block is the sealed-context preamble (integrity verdict, provenance, license, trust posture, and the obligations that travel with the object), so an agent reads the conditions before the content. The second block carries the payload metadata and markdown body. |
| `knobe_create` | Assemble and seal a new object from fields and a body. Required fields default per the engine; the sealed file self-verifies before it is returned, and can be written to a path (with an explicit `overwrite` flag guarding existing files). |
| `knobe_transform` | Seal a derivative of a verified original. The derivative's `parents` field records the original's title and payload hash automatically; a broken seal cannot anchor a chain. |
| `knobe_permits` | Evaluate a proposed action (`summarize`, `excerpt`, `translate`, `train`, `redistribute`, `publish`, `transform`, ...) against the object's own sealed terms. |

## Resources and prompt

The 31-fixture corpus ships with the package and is browsable as MCP resources:

- `knobe://examples/…` — sealed real-world KNOBEs (verify as verified/valid)
- `knobe://vectors/…` — conformance and adversarial vectors with known verdicts
- `knobe://guide` — orientation for agents

A `knobe-guarded-summarize` prompt encodes the basic KNOBE agent procedure:

```text
verify → permits → act, qualify, or decline with a cited clause
```

## What `knobe_permits` returns

The evaluation reads the sealed record itself: quarantine status, privacy
level, license posture, and any namespaced extension terms the author declared.
The verdict is `true`, `false`, or `"conditional"`, with the obligations that
apply and a `basis` list citing each sealed field that produced it:

```json
{
  "action": "redistribute",
  "allowed": false,
  "obligations": ["quarantined: inspect and establish trust before relying on the content"],
  "basis": [
    { "field": "privacy_level", "value": "sensitive", "effect": "deny distribution actions" },
    { "field": "license", "value": "All rights reserved", "effect": "no redistribution granted" }
  ],
  "integrity": { "state": "verified", "conformance": "valid" }
}
```

An agent that consults this before acting can decline with a quoted source
rather than a guess. Two boundaries hold throughout: a file whose seal fails
verification permits nothing, and the verdict reports what the object declares.
Enforcement belongs to the caller; a verified seal confirms integrity, not
truth.

## Install

With the package published to npm:

```json
{
  "mcpServers": {
    "knobe": {
      "command": "npx",
      "args": ["-y", "knobe-mcp"]
    }
  }
}
```

From a local checkout (no install step beyond `npm install` in this directory):

```json
{
  "mcpServers": {
    "knobe": {
      "command": "node",
      "args": ["/absolute/path/to/knobe-protocol/mcp/server.mjs"]
    }
  }
}
```

- **Claude Desktop**: add the block to `claude_desktop_config.json` (Settings → Developer → Edit Config).
- **Claude Code**: `claude mcp add knobe -- npx -y knobe-mcp` (or point at the local `server.mjs`).
- **Cursor / Windsurf / others**: add the same server block to the client's MCP configuration file.

Requires Node 20 or later.

## Data flow

Files are read from the paths you pass (or from pasted text), processed in the
server process, and optionally written to a path you name. Nothing is
transmitted anywhere. The server has no network code.

## Verification

The engine is `knobe-core.js`, a single dependency-free ES module whose
verdicts are checked against `lens.py`, the reference verifier, across the
published test corpus (`node knobe-core.selftest.mjs` in the repository root).
The vendored engine copy is byte-compared against the repository copy in this
package's test suite (`npm test`), which also drives every tool through a full
MCP client/server round-trip.

Where any implementation disagrees with `lens.py`, `lens.py` is right.

## License

Apache-2.0 (full text in [`LICENSE`](LICENSE)). The KNOBE specification and
documentation are CC BY 4.0 at [knobe.org](https://knobe.org).
