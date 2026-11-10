# Contributing to KNOBE Protocol v1

Thank you for your interest. KNOBE is small on purpose; contributions that keep it small are the most valuable kind.

## What we're looking for

- **Errata**: errors or ambiguities in the specification text.
- **Test vectors**: especially hostile cases: canonicalization edge cases, Unicode normalization traps, malformed payloads that should fail cleanly.
- **Independent implementations**: verifiers in any language. An implementation that reproduces all published test-vector results is the single most useful contribution KNOBE can receive. Open an issue so it can be listed.
- **Applications and integrations**: tools that build on the protocol (editors, plugins, pipelines, agents). To be listed on the implementations page: a named maintainer, public source, test-vector results if it verifies, and a plain statement of what it does and does not do. Open a listing-request issue.
- **Vocabulary proposals**: new canonical values for the open vocabularies (`content_type`, `quarantine_status`, `privacy_level`), with namespace-prefixed use in the wild preferred as evidence.
- **Profile feedback**: corrections and additions to the Education, Government, Enterprise, and Accessibility profiles from practitioners in those fields.

## What will not change

KNOBE Protocol v1 is frozen. The file format, required fields, canonical hash rule, and verification semantics will not change in any v1.x release. Issues proposing changes to frozen elements will be tagged `v2-discussion` and kept open for the record, not acted on in v1.x. See [GOVERNANCE.md](GOVERNANCE.md) for the full contract.

## Process

1. **Open an issue first** for anything affecting the spec, test vectors, or verifier behavior. Small prose fixes can go straight to a pull request.
2. Spec-affecting proposals get a public comment window of at least 14 days before any decision.
3. Decisions are recorded in the issue and in [CHANGELOG.md](CHANGELOG.md).

## Licensing of contributions

By contributing, you agree your contribution is licensed under the project's terms for that material:

| Material | License |
|----------|---------|
| Specification and prose (including profiles and site copy) | [CC BY 4.0](LICENSE) |
| Verifier code (`lens.py`, `knobe-core.js`, `knobe-core.selftest.mjs`, the browser Lens in `site/lens.html`) | [Apache-2.0](LICENSE-CODE) |
| The `knobe-mcp` package (`mcp/`) | [Apache-2.0](mcp/LICENSE) |
| Test vectors (`test-vectors/`) | [CC0-1.0](test-vectors/LICENSE) |

## Sign-off (DCO)

All pull-request commits must be signed off (`git commit -s`), certifying the [Developer Certificate of Origin](https://developercertificate.org/): that you wrote the contribution or otherwise have the right to submit it under these licenses. No CLA is required.

## AI assistance in commits

Commits in this repository are written with AI assistance, directed and reviewed by the steward. From July 2026 they carry an `Assisted-By:` trailer naming the model. That trailer is a disclosure of assistance, not an authorship claim: authorship and responsibility remain with the named human author, the same distinction the sealed white paper draws for the protocol itself. Commits before that date carry `Co-Authored-By:` trailers, the default convention of the tooling then in use; read those the same way. Contributors are welcome to disclose their own AI assistance with the same trailer.

## One integrity rule

Sealed `.knobe.md` files are never edited in place: a sealed file whose payload changes is, by definition, a different object. To update a sealed example, produce and seal a new file and update references.

## Conduct

Be direct about the work, generous with people. Reports of unacceptable behavior go to the steward (contact in [README](README.md)).
