# Changelog

The protocol itself is frozen at v1.0 (see [GOVERNANCE.md](GOVERNANCE.md)); entries after the freeze are documentation, site, and tooling updates that do not alter v1 semantics.

## v1.0.0 — 2026-06-21

- KNOBE Protocol v1.0 specification frozen: three-layer file format, ten required payload fields, canonical hash rule (§5), optional body hash, four verification states with independent `body_verified` and `conformance` dimensions, versioning contract.
- Public release: 2026-06-28 (the date cited in `CITATION.cff` and the README BibTeX).
- Reference verifier `lens.py` published — single file, Python standard library only.
- Nine conformance test vectors with expected results.
- Sealed examples: white paper, education chain, government record + FOIA release lineage, enterprise synthesis chain.

## Post-freeze updates (non-normative)

### 2026-11-23

- E13 and E14 (#22): five interpretation vectors, the E13 check, and
  BOM and trailing-CR tolerance in body location.
  - `interpretation/frontmatter-no-spec-version.knobe.md` (verified ·
    omitted · invalid) pins E13: the frontmatter must declare a
    non-empty `spec_version`, written as a bare key.
    `interpretation/body-after-preamble.knobe.md` (unreadable · — ·
    invalid) pins E14: the opening delimiter is line 1 and nowhere else.
    `interpretation/body-horizontal-rules.knobe.md` (verified · yes ·
    valid) is E14's positive control: `---` rules in the body are body
    content. `interpretation/leading-bom-body-hash.knobe.md` and
    `interpretation/opening-delimiter-trailing-cr.knobe.md` (both
    verified · yes · valid) pin the tolerance ruled with E14.
  - `lens.py`, `knobe-core.js` (all three copies) and the browser Lens
    report a frontmatter that does not declare `spec_version` as one
    conformance issue, `YAML frontmatter does not declare spec_version
    (spec §3.1)`. A missing line, an empty or whitespace-only value
    (quoted or not) and a quoted key all count as not declared, with no
    E5 mismatch warning on top. The browser Lens now strips every
    surrounding quote character from the value, as `lens.py` and
    `knobe-core.js` do. Only conformance changes, so such a file stays `verified`
    but exits 1 instead of 0. No published vector or sealed example
    changes verdict (checked across all 137 tracked `.knobe.md` files).
    E14's line-1 rule needs no engine change: the reference engines
    already locate the body from line 1.
  - Body location in `lens.py`, `knobe-core.js` and the browser Lens now
    applies the frontmatter check's test: one leading U+FEFF is skipped
    and trailing CRs on the opening line are ignored. A file that seals
    a `body_hash` and starts with a byte-order mark, or has `---` plus
    CRs on line 1, is no longer unreadable. The browser Lens also strips
    every trailing CR from delimiter lines, as the other two do. Across
    all 140 tracked `.knobe.md` files this changes only the two demo
    files made for it; no published vector or sealed example changes.
  - `demo/e13-e14/`: eleven demo files showing each case where the
    engines disagreed, the scripts that build them and the vectors, and
    a table of results across `lens.py`, `knobe-core.js`, knobe-go and
    knobe-rs.
  - The cross-language corpus grows to 50 files; counts on the README,
    `/lens`, `/implementations`, `/test-vectors` and `/mcp` updated.

### 2026-11-21

- Site and documentation wording, and site tooling. No engine, verdict
  or vector changes.
  - Verdict labels: the home and docs demos, Studio's Verify view and
    KNOBE Lens's notes on each state use one wording for the two
    verified states. A verified file "matches its seal". A file whose readable text changed reads "Verified, text
    changed: the record matches its seal, but the readable text changed
    after sealing." The home and docs demos now show that state as a
    warning ("!", amber), as Studio and Lens do, not with the green
    check. Lens's introduction and the label tables on the education,
    enterprise and government profiles also say a verified file matches
    its seal, where they said the record was "intact".
  - Seal wording on other pages. KNOBE Lens's "What the verdict means"
    says a green check shows the sealed record matches the seal it
    carries, and that anyone who edits a file can seal it again, so the
    check means most when you already hold the hash. /why-context's box
    reads "A verified seal shows" and "It does not show", and adds that
    a seal does not show it is the first seal. /threat-model says a
    forged file "matches its seal", its boundary headings say what
    `status: verified` shows and does not show, and the sealed fields
    are "as the sealer declared them", where it said "intact as the
    author wrote them".
  - The home and docs demos now load `knobe-demo.knobe.md`, a short
    file made for the demo and sealed with `knobe-core.js`. It is
    served from the site only and is not in `examples/`. Its text says
    what Verify, Tamper and an edit to the readable text each show, and
    that anyone who edits a file can seal it again. `lens.py` and
    `knobe-core.js` both report it verified, body yes, conformance
    valid. The plain-language summary is still on the Downloads page.
  - CI: the parity workflow checks `site/knobe-demo.knobe.md` with
    `lens.py` and fails unless it reports verified, body yes,
    conformance valid, because the home and docs demos depend on it.
  - /white-paper has an editor's note between the byline and the
    Abstract, signed by David Kyle. It says how to read the paper's
    "proves" wording about the seal, that the fields travel only with
    copies that keep the payload, that the "documented field test" is
    an incident observed in June 2026 that the paper and the seed file
    describe, with no published transcript or log, and that an
    implementation now also has to pass the 33 test vectors and follow
    the rulings in `ERRATA.md`. The sealed white paper, its `.knobe.md`
    and its PDF are unchanged.
  - The Grove's theme music (`site/grove/assets/grove-theme.mp3`) is
    removed while the Grove rests. No page linked it.
  - Studio, page script only (`site/studio/index.html`; `knobe-core.js`
    is unchanged): the Verify view uses the labels above; its note uses
    the seal wording above; and its body tag says "text not sealed" or
    "not checked" where it said "omitted". The page description says
    Studio checks whether a file matches its seal.
  - Studio's cohort check, page script only: its scoring (the
    `chAnomalyScore` sort) now ranks rows by integrity first, so failed
    and unreadable files come first, then files whose text changed
    after sealing, then verified files, with unlinked files ahead of
    linked ones at each level. The summary line and the sealed cohort
    receipt count text-changed files on their own. The receipt adds
    `body_modified_count`, and its `verified_count` no longer includes
    files whose text changed after sealing (it still includes verified
    files that sealed no text hash). Receipts sealed before this change
    have no `body_modified_count`, and their `verified_count` includes
    files whose text changed after sealing.
  - The TA guide in the instructor kit (the page, its Markdown copy and
    the copy in `knobe-instructor-kit.zip`) describes the new sort
    order, explains `verified-body-modified`, and lists it among the
    rows that start a conversation, not a verdict, alongside `failed`
    and `unreadable` (often an essay that was never sealed).
  - KNOBE Lens now names the text-changed result "Verified, text changed",
    like Studio and the demos. Amber warning text in Studio and Lens is
    darker (#6b3f0d) so it meets WCAG 2.1 AA contrast; amber borders are
    unchanged. The threat model says a seal shows the context declared
    at the most recent sealing, and the home and docs pages say "hold the
    hash" like the other pages.

### 2026-11-20

- Site and documentation corrections, wording only. No engine, verdict
  or vector changes.
  - Integrity wording on the home and docs pages and in the notes on
    the profile pages: a verified seal shows the record matches the
    seal it carries; it does not prove the record is true.
  - Re-sealing: the threat model now says that anyone who edits a file
    can seal it again, and that only a receiver who already holds the
    original hash can detect it. `SECURITY.md` lists re-sealing after
    an edit as out of scope, and also digest differences caused by
    verifiers using different Unicode data (issue #33), a recorded
    known limit.
  - Known limits: /threat-model has a new "Known limits" section for
    issue #33 (verifiers on different Unicode data can disagree). /mcp
    and `mcp/README.md` have one for issues #42 and #44: `knobe_permits`
    is advisory and has open cases where it allows more than the
    license does. The homepage links both sections.
  - The Grove is resting, so links to it are removed from the home,
    docs, Lens and Make pages, the README and the sitemap.
  - The Technical Intro Deck PDF is removed from the site and from the
    Downloads page. knobe.org/KNOBE-Technical-Intro-Deck.pdf now returns
    404.
  - The demos on the home and docs pages now load the protocol's
    plain-language summary (`knobe-v1-plain-language-summary.knobe.md`)
    instead of the education reading example.
  - `ERRATA.md` (both copies) now links `GOVERNANCE.md` and the
    interpretation vectors by absolute URL, so the links work when the
    file is read on knobe.org.
  - The TA guide in the instructor kit (the page, its Markdown copy and
    the copy in `knobe-instructor-kit.zip`) no longer says an AI agent
    leaves privacy unchanged: student text the agent reads goes to its
    model's provider. It also says `verified` means the file matches
    the seal it carries; to confirm it is the file that was submitted,
    compare its payload hash with the one recorded when it was
    submitted. The instructor quick start, the accessibility guide and
    the one-page loop (pages, Markdown copies and zip copies) get the
    same integrity corrections.
  - Pilot wording: the homepage status row now reads "Institutional
    adoption: None active", and the accessibility and education pages
    say no instructional pilots are active.
  - README: the adversarial and interpretation vector counts are
    corrected to seventeen and seven.
  - `mcp/README.md`, for the next `knobe-mcp` release: "after install"
    is added to the no-network statement, the `knobe_transform` row
    matches /mcp, the example resources are called illustrative, and
    the vector resources are counted exactly.
  - knobe.org/implementations: the knobe-go entry now cites its
    maintainer's README, which reports all 33 vectors at `fd75d2d` as of
    v0.1.3; this is not yet confirmed in the listing request (#14).
  - Other wording: the profile pages label their examples
    "Illustrative, fictional"; the government profile no longer calls a
    record certified; the threat model, the research profile and
    `docs/signet-design.md` say "layer" where they said "tier", and the
    research profile cites the DOI; Studio's transform help and the
    accessibility guide say that a source whose text changed after
    sealing is accepted and flagged, and that the derivative names the
    sealed version; /mcp says "after install" in its no-network
    statements.

### 2026-11-19

- Homepage hero, wording only: the headline says what a KNOBE is for
  and invites visitors to make one, and the lede says what a KNOBE
  records (who made it, how it may be used, what it cannot tell you)
  and that the record travels with it and with its adaptations. Title,
  meta, URLs and the scenes are unchanged.
- knobe.org/grove is resting. Several of the Grove's photographs were
  never properly sourced or credited, and its seed export still writes
  a pre-v1 file. Until both are fixed, /grove/ shows a short page that
  keeps the URL working, points visitors to Studio and Lens, and states
  the Grove's authorship and the CC BY 4.0 license of its text. The
  photographs are no longer deployed; the full Grove stays in the
  repository history.

### 2026-11-17

- Site status corrections, wording only. No engine, verdict or vector
  changes.
  - Homepage and build page: nine core vectors plus twenty-four more
    that probe hostile input or pin errata rulings (33 in all), not
    sixteen more. The homepage's stewardship row no longer says
    "Independent": it says there is a single steward for now, links
    the published triggers for shared governance, and says KNOBE is not
    an institutional project.
  - knobe.org/implementations: knobe-rs shows its maintainer's report
    of all 33 vectors at `4f66885`; knobe-go says it has not yet
    reported results for the 33; KNOBE Studio for Obsidian uses
    Joshua's wording from #16 for its built-in teaching guide and
    installs from Obsidian's community directory.

### 2026-11-15

- `knobe-core.selftest.mjs`: the lookbehind check added on 2026-11-10
  now reads the folders below `site/` as well. It had read only the
  files directly in `site/`, so a lookbehind in a page such as
  `site/studio/index.html` would have passed. No file under `site/`
  has one. Nothing else changes: no engine, verdict or page.

### 2026-11-10

- `knobe-core.js` (all three copies) and the browser Lens no longer use
  a regex lookbehind. Where `String.prototype.isWellFormed` is missing,
  the unpaired-surrogate check falls back to a regex, and that regex
  had a lookbehind. Safari before 16.4 has neither, so on iOS before
  16.4 the regex could not be parsed and the whole script failed to
  load. The new regex matches exactly the same strings. Where
  `isWellFormed` exists, nothing runs differently.
  `knobe-core.selftest.mjs` now fails if `knobe-core.js` or any script
  or page under `site/` contains a lookbehind, and runs the fallback
  with `isWellFormed` removed on payloads with and without unpaired
  surrogates.
- PR #40, "Related work: add EPUB and W3C Web Annotation; answer the
  one-steward objection": the related-work page gains entries for W3C
  Web Annotation and EPUB, and a section, "A new protocol, with one
  steward", that separates what need not be taken on trust (the frozen
  format, irrevocable open licenses, the right to fork) from what is a
  public commitment (the `GOVERNANCE.md` transition triggers, quoted
  exactly) and says none of the triggers has been met as of November
  2026. The About page's stewardship line
  now matches `GOVERNANCE.md` and links to that section. Wording only:
  no engine, verdict or vector changes.

### 2026-11-09

- PR #36, the Obsidian plugin listings: the implementations page lists
  two Obsidian plugins (listing requests #16 and #17; their names are
  under discussion there). Each entry is self-reported, names the
  commit its vector run used, and keeps its authors' own words on
  provenance.
- PR #37, "Licensing: name CC0 in CITATION.cff and mcp/ in
  CONTRIBUTING": `CITATION.cff` now names CC0-1.0, which covers the
  test vectors, and the licensing table in `CONTRIBUTING.md` now lists
  the `knobe-mcp` package (Apache-2.0, `mcp/LICENSE`). Both now match
  `LICENSING.md`; no license terms changed.
- PR #38, keep application-layer work off the protocol pages: the
  threat model presents ledger anchoring only as a generic composition
  option outside the protocol. The teaching and accessibility pages and
  `docs/signet-design.md` keep hardware-credential work at the
  application layer without naming anyone. The implementations page
  says "this page lists" where it said "this registry lists". The
  frozen spec page is unchanged.

### 2026-11-08

- PR #27, "mcp: update locked dependencies to clear security
  advisories": `npm audit fix` within the existing semver ranges, in
  `mcp/package-lock.json` only. `npm audit` goes from 9 vulnerable
  packages to 0. The ranges in `mcp/package.json` are unchanged, so a
  fresh install of the published `knobe-mcp` 0.1.2 already resolves
  these versions. The server uses the stdio transport only.
- PR #28, "Disclose that the July 2026 Go verifier was
  steward-commissioned": `ERRATA.md`, both test-vector READMEs, this
  changelog and three site pages now say that the Go verifier behind
  the July 2026 questions was built with an AI coding agent at the
  steward's direction, with `lens.py` consulted for edge cases. No
  ruling changes. Root and `site/` copies stay identical.
- PR #29, "Agent page: separate Cursor and VS Code setup tabs": the
  single "Cursor or VS Code" tab showed an `mcpServers` block, which
  VS Code ignores without an error. Cursor now has its own tab
  (`.cursor/mcp.json`, `mcpServers`) and VS Code its own
  (`.vscode/mcp.json`, a top-level `servers` key with
  `"type": "stdio"`).
- **Expected-results change.** PR #30, "test-vectors: publish expected
  body_verified for the core nine": the core tables in
  `test-vectors/README.md` (and its `site/` copy) gain an
  `expected body_verified` column; they had published only status and
  conformance. The values are the ones both reference engines already
  reported, so no verdict changes, but a verifier checked against the
  core nine must now match `body_verified` as well.
  `knobe-core.selftest.mjs` enforces the column, as it already did for
  the adversarial and interpretation sets.
- **Behavior change.** PR #34, "Sealer refuses code points unassigned
  in its Unicode tables (#33)": `knobe-core.js` (all three copies) now
  refuses to seal a payload with a string, key or value that contains
  a code point unassigned in the engine's own Unicode data, and says
  why in a plain message. NFC of such a code point can change in a
  later Unicode version, so the same payload could hash differently in
  another verifier (issue #33). Studio loads `/knobe-core.js`, so
  Studio refuses too. Verification is unchanged. `knobe-mcp` 0.1.2 on
  npm was published before this change and does not include it; the
  `mcp/` copy in this repository does.
- PR #35, "Implementations page: list knobe-rs, knobe-go and KNOBE
  Verify for VS Code": listing requests #13, #14 and #15. Each entry is
  self-reported, names the commit its vector run used, and keeps its
  authors' own words on provenance.

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
  a third verifier (Go), built with an AI coding agent at the
  steward's direction from the specification text, with lens.py consulted
  for ambiguous edge cases; running it
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

### 2026-07-03

- Root `spec.html` deleted (`2bbf088`): it had gone stale, and
  `site/spec.html`, served at knobe.org/spec, is the canonical spec
  page. The README's references now point there.

### 2026-07-01

- Root `spec.html` brought to parity with the deployed spec: conformance count corrected (six → nine), "Integrity, not truth," "For implementers," and "For agent builders" sections restored, closing claim updated.
- Adversarial hardening set (10 hostile-input vectors) copied to `test-vectors/adversarial/` and documented with expected results generated by the reference verifier.
- Grove page images extracted to per-scene assets (43 MB → 5 MB served).
- Institutional attribution corrected (BibTeX publisher removed; "author and steward") and derivation-proof language tightened in the government and enterprise profiles and threat model.
- Related Work page added, comparing KNOBE to Git, C2PA, Verifiable Credentials, W3C PROV, RO-Crate, Dublin Core, and knowledge graphs.
- Licensing clarified: specification and prose CC BY 4.0; verifier code Apache-2.0 (`LICENSE-CODE`); test vectors CC0-1.0 (`test-vectors/LICENSE`). `CONTRIBUTING.md`, `GOVERNANCE.md`, and `SECURITY.md` added; `v1.0.0` tagged.

### 2026-06-27 – 2026-06-30

- Launch-readiness site pass: mobile navigation, skip links, pretty URLs, `sitemap.xml`, Lens corpus-count fix, About-page copy accuracy.
