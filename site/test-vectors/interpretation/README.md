# KNOBE Protocol v1 — Interpretation Set

Twelve additional `.knobe.md` files pinning the documented interpretations in [ERRATA.md](../../ERRATA.md): places where the specification text left a genuine ambiguity (six raised by building the steward-commissioned Go verifier from the specification text, with lens.py consulted for ambiguous edge cases; one, E12, proposed in PR #12; five, E13 and E14, proposed in issue #22), and the steward has ruled which reading is authoritative. These are **not** part of the canonical-compatibility bar (an implementation is canonically compatible if it reproduces the nine core results in the parent directory), but a verifier that matches the reference on all twelve is following the published rulings, and each ruling cites its vector here.

Every expected result below was produced by both reference implementations (`lens.py` and `knobe-core.js`) in agreement before publication. Verify each from the repository root with:

```
python3 lens.py test-vectors/interpretation/<file>
```

## Expected results

| file | expected status | body_verified | conformance | ruling it pins |
|------|----------------|---------------|-------------|----------------|
| `boolean-null-values.knobe.md` | verified | omitted | valid | `true`, `false`, and `null` are lawful scalar values; the numeric restriction of spec §5 applies to numbers only ([E6](../../ERRATA.md)) |
| `spec-version-frontmatter-mismatch.knobe.md` | verified | omitted | warnings | frontmatter `spec_version` disagreeing with the sealed payload is a warning; the sealed value is authoritative. Issue text: `frontmatter spec_version '1.1' does not match sealed payload spec_version '1.0'` ([E5](../../ERRATA.md)) |
| `begin-marker-mid-line.knobe.md` | verified | yes | valid | payload markers are line-anchored; marker text mid-line is ordinary body content, covered by the sealed `body_hash` ([E2](../../ERRATA.md)) |
| `base64-unpadded.knobe.md` | unreadable | — | invalid | RFC 4648 §4 padding is required; a payload block whose trailing `=` characters are missing cannot be decoded and the file is unreadable ([E7](../../ERRATA.md)) |
| `attribution-missing.knobe.md` | verified | omitted | invalid | a wholly absent `attribution` reports exactly one issue (`required field missing: attribution`), not a cascade into `attribution.sources` ([E9](../../ERRATA.md)) |
| `astral-unicode-literal.knobe.md` | verified | omitted | valid | code points above U+FFFF serialize as literal UTF-8 in the canonical form, never as `\uXXXX` escape pairs ([E8](../../ERRATA.md)) |
| `nel-block-whitespace.knobe.md` | unreadable | — | invalid | only ASCII space, tab, CR and LF may be stripped from a payload block; U+0085 (NEXT LINE) inside the block makes the Base64 invalid and the file unreadable, though the same block without it verifies ([E12](../../ERRATA.md)) |
| `frontmatter-no-spec-version.knobe.md` | verified | omitted | invalid | the frontmatter must declare a non-empty `spec_version`, written as a bare key; a missing line, an empty or whitespace-only value, or a quoted key is reported once, with no E5 warning on top. Integrity is unaffected and the sealed value stays authoritative. Issue text: `YAML frontmatter does not declare spec_version (spec §3.1)` ([E13](../../ERRATA.md)) |
| `body-after-preamble.knobe.md` | unreadable | — | invalid | the opening frontmatter delimiter is line 1 and the closing one is the next line that is exactly `---`; no verifier searches elsewhere. With a line of text above the opening `---` the file has no frontmatter, and because the payload seals a `body_hash` it is unreadable. Horizontal rules in the body are never taken for delimiters ([E14](../../ERRATA.md)) |
| `body-horizontal-rules.knobe.md` | verified | yes | valid | positive control for E14: with the frontmatter on line 1, later `---` horizontal rules are ordinary body content covered by the sealed `body_hash` ([E14](../../ERRATA.md)) |
| `leading-bom-body-hash.knobe.md` | verified | yes | valid | one leading UTF-8 byte-order mark is skipped when locating the body, as it is when checking for frontmatter, so a sealed `body_hash` still verifies ([E14](../../ERRATA.md)) |
| `opening-delimiter-trailing-cr.knobe.md` | verified | yes | valid | trailing carriage returns on a delimiter line are ignored when locating the body, as they are when checking for frontmatter; here line 1 is `---` followed by CR CR ([E14](../../ERRATA.md)) |

A `—` in the body_verified column is the mandated `omitted` of spec §7 for unreadable files, which machine output may spell as the string `omitted` or as JSON `null`; either spelling is conforming (see [E11](../../ERRATA.md)).

KNOBE Protocol v1 · Test vectors: [CC0-1.0](../LICENSE) (public domain, no attribution required) · David Kyle (UC Davis)
