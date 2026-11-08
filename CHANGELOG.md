# Changelog

The protocol itself is frozen at v1.0 (see [GOVERNANCE.md](GOVERNANCE.md)); entries after the freeze are documentation, site, and tooling updates that do not alter v1 semantics.

## v1.0.0 — 2026-06-21

- KNOBE Protocol v1.0 specification frozen: three-layer file format, ten required payload fields, canonical hash rule (§5), optional body hash, four verification states with independent `body_verified` and `conformance` dimensions, versioning contract.
- Public release: 2026-06-28 (the date cited in `CITATION.cff` and the README BibTeX).
- Reference verifier `lens.py` published — single file, Python standard library only.
- Nine conformance test vectors with expected results.
- Sealed examples: white paper, education chain, government record + FOIA release lineage, enterprise synthesis chain.

## Post-freeze updates (non-normative)

### 2026-11-07 (post-freeze, unreleased)

- PR #11, "Fail to unreadable instead of crashing on three hostile
  payloads": `lens.py` fails to `unreadable` instead of crashing on
  hostile payloads, and `knobe-core.js` rejects overflowing numbers as
  `unreadable` instead of throwing.
- PR #12, "Proposal (needs ERRATA ruling): strict hash/date formats and
  ASCII-only block whitespace", ruled as erratum E12 in `ERRATA.md`:
  dates and hashes are ASCII-strict with nothing following, and only
  ASCII space, tab, CR and LF may be stripped from a payload block. No
  published vector or canonical artifact changes verdict. E12 is pinned
  by `test-vectors/interpretation/nel-block-whitespace` (2026-11-05,
  below). `site/ERRATA.md` synced so E12 is served at
  knobe.org/ERRATA.md.
- PR #18, "Front door revamp: new homepage, five-scene illustration,
  door pages, policy and portability".
- PR #19, "Never crash printing a report; escape the same characters in
  lens.py and knobe-core.js".
- `.github/CODEOWNERS` added: steward review required on every path.
- Browser Lens decodes the payload block by the same strict Base64 rule
  as `knobe-core.js` and `lens.py` (padding required, erratum E7; only
  ASCII space, tab, CR and LF stripped, erratum E12), and strips the
  body and handles a leading BOM as they do.
- `knobe-mcp` 0.1.2: packages the current `knobe-core.js` engine and
  ships its Apache-2.0 license as `mcp/LICENSE`.
- `LICENSE` now holds the full CC BY 4.0 legal code. The copyright
  notice and citation moved to `LICENSING.md`, which also lists the
  license for each part; no license terms changed. `SECURITY.md` scope
  now names `knobe-core.js` and `knobe-mcp`.
- Site claims corrected to match what v1 and its tools do and what has
  been tested.

### 2026-11-06

- `test-vectors/adversarial/nested-payload-hash` (#23): a valid payload
  whose `parents` entry carries the parent's `payload_hash`. Spec §5
  leaves out only the top-level `payload_hash`; a verifier that removes
  it at every depth matched `lens.py` on every earlier vector, and now
  reports this one failed. The cross-language corpus grows to 45 files.

### 2026-11-05

- Pinning vectors for the hardening in PRs #11, #12 and #19, which
  landed without any: the seven candidate files from issue #20, added
  byte for byte as the steward supplied them, three renamed.
  `test-vectors/interpretation/nel-block-whitespace` pins ERRATA E12; the
  adversarial set gains `float-overflow`, `lone-surrogate`,
  `spec-version-array`, `bigint-payload`, `bidi-title` and
  `null-payload-hash`. The cross-language corpus grows from 37 to 44
  files.
- `knobe-core.selftest.mjs` now holds both engines to the expected
  results published in the three test-vectors READMEs, not only to each
  other, fails on a vector with no README row, and requires every sealed
  example to be `verified` and `valid`. A change that broke both engines
  the same way used to pass. It also compares reason and issue text word
  for word (two files with known wording differences are listed), and
  fails if `lens.py`'s human report or `knobe-core.js`'s `safe()` shows a
  raw control, bidi or separator character or an unpaired surrogate.
- `parity.yml` gains a copy-drift job: every copy under `site/` and
  `mcp/` must be byte-identical to its source. `site/lens.py`, the
  download served at knobe.org/lens.py, was still the file from before
  PR #11 and is now in sync.
- `.gitattributes` keeps `.knobe.md` files byte-exact, so a Windows
  checkout with `core.autocrlf` does not turn every vector unreadable.

### 2026-07-08

- `ERRATA.md` added: eleven documented interpretations of questions
  raised in real implementation work, each with an authoritative ruling
  and, where practical, a pinning test vector. The questions came from
  a third verifier (Go) built from the specification text; running it
  against both reference implementations also surfaced an inconsistent
  spelling in the reference's own JSON output (the string `omitted` for
  failed files, `null` for unreadable ones, both spellings of the same
  spec §7 mandate), resolved by erratum E11 accepting either.
- Interpretation vector set added at `test-vectors/interpretation/`:
  six files pinning marker line-anchoring, frontmatter/payload
  `spec_version` disagreement, booleans and null, Base64 padding,
  missing-`attribution` issue granularity, and astral-plane literal
  serialization. Both reference verifiers agree on all six; the
  cross-language corpus grows from 31 to 37 files. The canonical
  conformance bar remains the nine core vectors.
- `GOVERNANCE.md`: defined what counts as an independent implementation
  now that AI assistance is ordinary, and named the arbiter order
  (published vectors, then `lens.py`, with rulings in `ERRATA.md`).

### 2026-07-06 – 2026-07-07

- `GOVERNANCE.md`: "Name and mark use" section added, inviting anyone
  building on KNOBE to name their tool freely with one firm boundary,
  honesty about origin. `implementations.html` points readers there.
- `.github/ISSUE_TEMPLATE/listing-request.md` added for the implementations
  registry intake.

### 2026-07-05

- Sitewide tone pass: homepage demo strings, About governance and pilots
  paragraphs, profile fidelity claims and forward links, implementations
  scope note, related-work lead, downloads and white-paper metas. Claims
  tied to mechanisms; solicitation phrasing and prose em dashes removed;
  no technical limits removed. Frozen content (spec body, white-paper
  body, sealed .knobe.md files, grove) untouched.

- Research profile added at `/research-profile`: consent-aware research
  objects (materials keep their consent terms, source context, and derivation
  history as they move), with custody inversion (participant retains the
  sealed original; researchers hold derivatives with lineage) presented as an
  advanced pilot model; an AI-and-cognition study design, hard questions
  answered plainly (withdrawal, timestamps, enforcement, re-identification),
  and the status-labeled ladder from protocol to research agenda. Wired into
  the Uses navigation, the homepage intent router, and `sitemap.xml`.
- Sealed illustrative fixture `site/knobe-research-interview.knobe.md` added
  (synthetic, labeled as such; verifies as `verified/valid`). Site-only: the
  31-file conformance corpus is unchanged.

### 2026-07-04

- `lens.py` hardened: three malformed-input crash paths (unpaired-surrogate
  payload strings, BEGIN-marker-at-byte-0 with a `body_hash`, non-list
  `parents`) now degrade to honest verdicts instead of raising. The §5
  canonical hash rule is unchanged; all 31 published fixtures verify
  identically before and after.
- `knobe-core.js` added: the JavaScript sibling verifier and engine — one
  standalone file, no dependencies, Node ≥ 20.10 and browsers. Reproduces the
  reference verifier's verdicts across all 31 published fixtures, including
  the bare-numeric canonicalization case.
- `knobe-core.selftest.mjs` added: runs both verifiers over every vector and
  example and reports agreement (31/31 at time of commit).
- Implementations page added at `/implementations`, documenting the reference
  verifier, the browser Lens (and its documented bare-numeric deferral), and
  the JavaScript sibling. `sitemap.xml` updated.

### 2026-07-01

- Root `spec.html` brought to parity with the deployed spec: conformance count corrected (six → nine), "Integrity, not truth," "For implementers," and "For agent builders" sections restored, closing claim updated.
- Adversarial hardening set (10 hostile-input vectors) copied to `test-vectors/adversarial/` and documented with expected results generated by the reference verifier.
- Grove page images extracted to per-scene assets (43 MB → 5 MB served).
- Institutional attribution corrected (BibTeX publisher removed; "author and steward") and derivation-proof language tightened in the government and enterprise profiles and threat model.
- Related Work page added, comparing KNOBE to Git, C2PA, Verifiable Credentials, W3C PROV, RO-Crate, Dublin Core, and knowledge graphs.
- Licensing clarified: specification and prose CC BY 4.0; verifier code Apache-2.0 (`LICENSE-CODE`); test vectors CC0-1.0 (`test-vectors/LICENSE`). `CONTRIBUTING.md`, `GOVERNANCE.md`, and `SECURITY.md` added; `v1.0.0` tagged.

### 2026-06-27 – 2026-06-30

- Launch-readiness site pass: mobile navigation, skip links, pretty URLs, `sitemap.xml`, Lens corpus-count fix, About-page copy accuracy.
