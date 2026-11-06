# KNOBE Agent-First Technical Design

Status: adopted 2026-08-28, under docs/repositioning-2026.md. Design and
planning document; nothing here modifies frozen v1 semantics. Each item is
labeled: shipping (exists now), v1.x-safe (additive, no breaking change),
or v2-territory (breaking, waits for a v2.0 declaration).

## Architecture in one paragraph

A KNOBE is a plain-text artifact carrying its own sealed context. The agent
runtime is the enforcement surface: an agent that touches an artifact calls
a detector, a verifier, and a policy gate before acting, and produces
derivatives that either carry the provenance chain forward or explicitly
declare its loss. The protocol stays inert (files never execute); the
runtime is where obligations become behavior. Nothing forces an agent to
call the tools; the design goal is that calling them is cheaper than not
(one MCP tool call) and that skipping them is visible downstream (a
derivative with no chain declares nothing, and a stripped seal fails
verification).

## Why KNOBE is not prompt injection

The resemblance is superficial (both attach text to content that an AI will
read); the mechanics are opposite.

Prompt injection smuggles imperative natural-language commands into context
hoping the model executes them, bypassing the model's policy stack. A KNOBE
payload is declarative structured data (claims and conditions, not
commands), parseable without a model, hash-sealed so tampering is
detectable, evaluated by a deterministic policy layer (permits()) before
any model reasons about it, and subordinate by design to system, developer,
institutional, legal, and user policy. The shipped engine already treats it
this way: permits() returns facts with a basis trail (this file is
unreviewed; training use is not permitted; integrity failed; attribution
must be preserved), and the caller's policy stack decides what to do. A
use_conditions clause can request; it cannot override. The remaining honest
caveat: field values are still text an LLM may eventually read, so runtime
implementations must pass payload content to models as quoted data, never
concatenated as instructions, and the reference tools do.

## Why sealed metadata is not just metadata

Ordinary metadata (PDF properties, Word fields, YAML alone, XMP, database
rows) can be stripped, edited, or separated from content with no visible
failure. KNOBE's difference is the verifiable context boundary: KNOBE
cannot prevent someone from stripping context. It can make stripping
detectable. Once the sealed payload is removed, altered, or separated, the
object no longer verifies as the same KNOBE. The break becomes visible.
That is the entire claim; it is narrow, and it is the one ordinary
metadata cannot make.

## Discovery (agent-readable)

- File extension .knobe.md: shipping.
- Payload detector: the parser already finds the fenced B64 block;
  exposing it as a dedicated knobe_detect MCP tool (input: text or path;
  output: knobe / plain-markdown / malformed, with marker positions) is
  v1.x-safe and recommended as the first new tool.
- Fallback behavior: shipping semantics already cover it. No payload means
  the file is ordinary markdown (fail-open: still readable, claims
  nothing); a malformed or altered payload yields unreadable or failed,
  and permits() then permits nothing.
- MIME type: text/markdown works today. Registering a dedicated type is
  speculative benefit for real registry cost; deferred until an
  implementer actually needs it.

## Verification model

- Canonicalization, hash scope, verification states: shipping and frozen
  (spec sections 5 and 7); nothing to add.
- Parent/child hash chains: shipping. parents[].payload_hash binds a
  derivative to exact source bytes; the corpus demonstrates it (the
  plain-language summary binds the white paper's hash).
- Degraded-context flag: not a new state. The existing verification states
  plus a fidelity_limits declaration ("chain broken at this hop") cover
  partial context honestly; inventing a fifth integrity state is
  v2-territory and currently unjustified.
- Multi-seal (co-signers): v2-territory. One sealer per object in v1.

## Policy gate: permits()

Shipping verbs: redistribute, distribute, publish, share, train, integrate
(distribution class); transform, adapt, remix, summarize, translate,
excerpt, annotate (derivative class). Integrity gate first: failed or
unreadable seals permit nothing. Namespaced extension obligations are
surfaced verbatim for the caller to honor or explicitly decline.

- Add embed and archive as recognized verbs: v1.x-safe (engine vocabulary,
  not spec).
- quote: already served by excerpt; alias only if implementers stumble.
- grade and evaluate: declined deliberately. They are verbs about judging
  work in an institutional relationship, which is exactly the
  person-adjacent territory the doctrine walls off. An agent asked to
  grade should consult its institution's policy, not this protocol.
- Return vocabulary: shipping is allow / conditional-with-obligations /
  deny. "Needs human review" is expressed today as conditional plus an
  explicit obligation string; a fourth enum value would break existing
  callers for no added information. v1.x tooling should standardize the
  obligation phrasing instead.

## Agent runtime (MCP)

Shipping tools: knobe_verify, knobe_read, knobe_create, knobe_transform,
knobe_permits. Planned, v1.x-safe: knobe_detect (above);
knobe_create_derivative as a convenience wrapper over knobe_transform that
enforces parent-hash carriage and writes the transformation_history entry.
Runtime rule, restated from the profile: inspect before transforming;
carry the chain or declare its loss.

## Privacy and misuse resistance

Normative for tooling in this repository; see
docs/education-safety-profile.md for the education-specific rules.

- Never stored: learner identity, disability or accommodation data,
  behavioral telemetry, per-person aggregates.
- Optional means optional: profiles state minimum field sets; tools do not
  nag for more.
- Redaction is a recorded transformation, not a violation; pseudonymous and
  role-based attribution are first-class.
- Retention: hashes may outlive deleted content (a hash is not recoverable
  content); person-identifying data does not.

## Interoperability

The public comparison lives at knobe.org/related-work (C2PA, W3C PROV,
RO-Crate, BagIt, Dublin Core, knowledge graphs, JSON-LD, XMP, llms.txt,
each verified against primary sources). Rows added here for completeness:

| Neighbor | Relationship | Mapping posture |
|---|---|---|
| C2PA | Complement (media/document signing) | Wrap: a C2PA-signed asset can travel beside a KNOBE describing the knowledge object; do not reimplement signing. |
| W3C PROV | Complement (provenance vocabulary) | Export: parents and transformation_history map to a small PROV subset; a mapping profile is future work. |
| RO-Crate | Complement (research bundles) | Embed: a crate can contain KNOBEs; a KNOBE can cite a crate in parents. |
| BagIt | Complement (fixity for collections) | Wrap: seal objects, bag the collection. |
| Dublin Core | Complement (field names) | Map: keep KNOBE vocabulary mappable; never compete on naming. |
| DataCite / DOI / Crossref / ORCID | Complement (identifiers, citation) | Reference: canonical_url and parents carry DOIs; ORCID belongs in attribution entries when the maker wants it. The white paper's own DOI (10.5281/zenodo.21298913) is the worked example. |
| schema.org / JSON-LD | Complement (web discoverability) | Namespaced extension fields carry JSON-LD-shaped terms today (see related-work); the seal does not need to understand RDF. |
| Model Cards / Dataset Cards | Complement (model/dataset transparency) | Analogy, not overlap: they document models and datasets; KNOBE documents arbitrary knowledge objects and their transformations. A card could itself be sealed as a KNOBE. |
| LMS and accessibility standards (LTI, Caliper, xAPI, QTI, EPUB a11y, PDF/UA) | Frictions and complements | Interoperate at the artifact level only. Caliper and xAPI are person-level telemetry rails; the doctrine forbids feeding them from KNOBE data. PDF/UA and EPUB accessibility metadata describe rendering accessibility; KNOBE describes the adaptation's provenance and terms. Both can be true of one artifact. |
| MCP and agent protocols | Runtime, not competitor | This is the enforcement layer; the shipped server is the reference. |

## Minimal reference implementation plan

Mostly consolidation; the engine and server exist.

- CLI (v1.x-safe, thin wrappers over knobe-core.js / lens.py):
  knobe detect FILE; knobe verify FILE [--json]; knobe permits FILE ACTION;
  knobe adapt SOURCE --type TYPE (creates a profile-conforming derivative,
  parent hash bound); knobe check-profile FILE --profile accessibility-v0.1.
- MCP: the five shipping tools plus knobe_detect and
  knobe_create_derivative as specified above.
- JSON schema: publish a machine-readable schema for the v1 payload plus a
  profile overlay for accessibility-v0.1 (warn-level rules 1 through 6 from
  the profile).
- Test fixtures: the two shipped adaptation examples as positive cases; new
  negative fixtures for stripped payload (reads as plain markdown), altered
  payload (failed), profile violations (learner-identifying field present,
  missing parent explanation), and a permits() matrix run over the
  adaptation examples for summarize, translate, train, redistribute, embed.
- All fixtures verify against both engines before publication, per the
  existing parity discipline (currently 45 of 45 files agree).

## Sequencing

1. knobe_detect tool plus detector fixtures.
2. Profile checker (check-profile) with the accessibility-v0.1 rules.
3. embed and archive verbs in permits(), with tests in both engines.
4. knobe_create_derivative wrapper enforcing chain carriage.
5. PROV and Dublin Core mapping notes (documentation only).

Each step is v1.x-safe, independently shippable, and none blocks the
others.
