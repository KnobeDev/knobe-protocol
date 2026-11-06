# KNOBE Protocol v1

[![Verifier parity](https://github.com/KnobeOne/knobe-protocol/actions/workflows/parity.yml/badge.svg)](https://github.com/KnobeOne/knobe-protocol/actions/workflows/parity.yml)
[![knobe-mcp on npm](https://img.shields.io/npm/v/knobe-mcp?label=knobe-mcp)](https://www.npmjs.com/package/knobe-mcp)
[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.21298913.svg)](https://doi.org/10.5281/zenodo.21298913)

**Portable knowledge objects: plain-text files that carry the knowing, who made them, under what terms, with what limits, wherever they move.**

A KNOBE is a single markdown file with three layers:

1. **YAML frontmatter**: human-scannable metadata
2. **Markdown body**: the document itself, opens in any editor
3. **Base64 JSON payload**: attribution, transformation history, fidelity limits, use conditions, accessibility lineage, and a SHA-256 integrity hash

A human reads the first two layers. A machine decodes the third. A verifier checks the hash. No sidecar files, no platform, no account required.

Abridged from a sealed example in this repository ([the white paper](examples/knobe-v1-white-paper.knobe.md), which documents the protocol as a KNOBE); `...` marks elisions:

```markdown
---
title: "KNOBE Protocol v1: A Context Protocol for Responsible Knowledge Movement"
...
author: David Kyle
content_type: compression
spec_version: "1.0"
license: CC BY 4.0
...
created_date: "2026-06-11"
---

# KNOBE Protocol v1: A Context Protocol for Responsible Knowledge Movement

...

KNOBE Protocol v1 is an open protocol for responsible knowledge movement. It defines a plain-text `.knobe.md` file that lets a knowledge object carry its readable content together with a machine-legible, hash-sealed record of attribution, source relations, transformation history, fidelity limits...

-----BEGIN KNOBE B64-----
eyJhY2Nlc3NpYmlsaXR5IjogeyJhZGFwdGF0aW9uX3R5cGVfdm9jYWJ1bGFyeSI6IFsiY2FwdGlv
...
-----END KNOBE B64-----
```

The base64 block decodes to a JSON payload; the seal is the SHA-256 hash of its canonical form (spec §5: `payload_hash` removed, keys sorted, NFC-normalized, no whitespace). One command checks it:

```bash
python3 lens.py examples/knobe-v1-white-paper.knobe.md
```

## What this protocol does

KNOBE makes it harder for fragments to pass as whole objects. It carries interpretive context (fidelity limits, consent terms, attribution, transformation history) alongside the content itself, in plain text, verifiable without infrastructure.

## What this protocol does not do

It is not DRM, not a truth machine, not an identity verification system, and not a replacement for institutional systems. It declares interpretive obligations; it does not enforce them. See the [specification](https://knobe.org/spec) §11 (Honest limits) and the [threat model](https://knobe.org/threat-model) for the precise account.

## Tools

All four run locally, in the browser or on your machine, and require no account.

- **[Studio](https://knobe.org/studio/)**: a browser app to create, verify, and transform KNOBEs. Everything runs client-side; nothing is uploaded. The fastest way to seal a first object without touching the command line.
- **[MCP server](https://knobe.org/mcp)** (`knobe-mcp` on npm): exposes verify, read, create, transform, and a `permits` tool to any MCP client (Claude Desktop, Claude Code, Cursor, and others), so an AI agent can check a document's sealed terms before acting on it. Install with `npx -y knobe-mcp`; source in [`mcp/`](mcp/).
- **[Grove](https://knobe.org/grove/)**: a guided, no-AI walkthrough that teaches the format by sealing one real KNOBE with you.
- **[Lens](https://knobe.org/lens)**: a drag-and-drop browser verifier for a single file.

## Verifying a KNOBE

```bash
python3 lens.py examples/knobe-v1-white-paper.knobe.md
```

To confirm the JavaScript sibling verifier agrees with the reference across
every vector and example in this repository (requires Node ≥ 20.10 and Python 3):

```bash
node knobe-core.selftest.mjs
```

Output includes three independent dimensions:

- **status** (integrity): `verified` · `verified-body-modified` · `failed` · `unreadable`
- **body_verified** (body-hash check): `yes` · `modified` · `omitted`
- **conformance** (schema compliance): `valid` · `warnings` · `invalid`

A `verified` result proves the payload is byte-identical to what was hashed at sealing. It does not prove the content is accurate, the attribution is honest, the consent was actually obtained, or the object is appropriate for any particular use. Integrity is the substrate; interpretive context is the point.

## Repository layout

```
.
├── site/spec.html         The normative v1 specification (served at knobe.org/spec)
├── lens.py                Python reference verifier, no external dependencies
├── knobe-core.js          JavaScript sibling verifier and engine (Node ≥ 20.10 and browsers), no dependencies
├── knobe-core.selftest.mjs  Cross-checks knobe-core.js against lens.py over every vector and example
├── test-vectors/          Nine conformance vectors, seventeen adversarial, seven interpretation
├── examples/              Sealed example KNOBEs (white paper, education chain, etc.)
├── site/studio/           Studio browser app (served at knobe.org/studio)
└── mcp/                   knobe-mcp MCP server (published to npm as knobe-mcp)
```

## Implementing a verifier

The reference verifier `lens.py` is a standard-library Python file with no external dependencies. To build a conformant verifier in another language:

1. Read the [specification](https://knobe.org/spec), particularly §3.3 (Payload block), §5 (Canonical hash rule), §6 (Body hash), §7 (Verification states)
2. Reproduce the canonical hash algorithm: sort keys recursively, NFC-normalize all keys and string values, no whitespace between tokens, literal UTF-8, SHA-256
3. Run your implementation against all nine test vectors in `test-vectors/` and confirm expected outputs match the README in that directory

An implementation that reproduces all nine expected results is canonically compatible with KNOBE Protocol v1. Beyond that bar, ten [adversarial vectors](test-vectors/adversarial/) exercise hostile input, six [interpretation vectors](test-vectors/interpretation/) pin the documented rulings in [ERRATA.md](ERRATA.md) for questions the specification text left open, and a reported ambiguity that survives scrutiny earns a ruling and a pinning vector, with credit.

Two JavaScript verifiers already exist. The browser Lens ([`site/lens.html`](site/lens.html), live at [knobe.org/lens](https://knobe.org/lens)) is a pure-JavaScript verifier built to the same specification, sharing no code with `lens.py`; it reproduces `lens.py`'s verdicts across the conformance and adversarial vectors, declining to issue a hash verdict on bare-numeric payloads (a §5 violation) in the browser and deferring to `lens.py` there. [`knobe-core.js`](knobe-core.js) is a single standalone JavaScript file (a sibling verifier, written by studying `lens.py`, sharing no code but sharing lineage) that reproduces `lens.py`'s verdicts including the bare-numeric case, and also seals, creates, and derives KNOBEs. Run `node knobe-core.selftest.mjs` to check `knobe-core.js` against `lens.py` over every vector and example. Multiple implementations agreeing on the vectors is the practical test that the spec is buildable from text. See [knobe.org/implementations](https://knobe.org/implementations).

## License

| Material | License |
|----------|---------|
| Specification, white paper, profiles, and all prose | [CC BY 4.0](LICENSE) |
| Verifier code: `lens.py`, `knobe-core.js`, and the browser Lens (`site/lens.html`) | [Apache-2.0](LICENSE-CODE) |
| Test vectors (`test-vectors/`) | [CC0-1.0](test-vectors/LICENSE): copy them into your test suite freely, no attribution required |

The steward asserts no patents covering KNOBE Protocol v1 and will not assert any patent against conformant implementations. See [GOVERNANCE.md](GOVERNANCE.md).

## Contributing

Errata, hostile test vectors, and independent verifier implementations are the most valuable contributions. See [CONTRIBUTING.md](CONTRIBUTING.md) for process and [SECURITY.md](SECURITY.md) for reporting verification-bypass issues. The v1 freeze contract and stewardship commitments are in [GOVERNANCE.md](GOVERNANCE.md).

## Steward

David Kyle, author and steward · University of California, Davis
david@knobe.org · [knobe.org](https://knobe.org)

## Citation

```bibtex
@misc{kyle2026knobe,
  author       = {Kyle, David},
  title        = {KNOBE Protocol v1: A Context Protocol for Responsible Knowledge Movement},
  year         = {2026},
  month        = {jun},
  note         = {Published 28 June 2026},
  publisher    = {Zenodo},
  doi          = {10.5281/zenodo.21298913},
  url          = {https://doi.org/10.5281/zenodo.21298913}
}
```

---

KNOBE is an open protocol for plain-text knowledge objects that carry their source, history, limits, and obligations across human and AI systems.
