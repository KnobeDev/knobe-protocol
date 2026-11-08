# Errata and Documented Interpretations

KNOBE Protocol v1 is frozen: nothing here changes the file format, the required fields, the canonical hash rule, or the verification semantics. Under [GOVERNANCE.md](GOVERNANCE.md), the steward may publish errata, meaning clarifications that do not change the behavior of any conforming file or verifier. This document is that record.

Each entry states a question raised in real implementation work, the authoritative answer, and where the answer is pinned by a published test vector. The questions behind E1 to E11 came from a verifier in Go built in July 2026 with an AI coding agent at the steward's direction, from the specification text, with lens.py consulted for ambiguous edge cases. It is steward-commissioned work, so not independent as GOVERNANCE.md defines independence. The questions were reported by the steward, and several were confirmed or refined by running that implementation against the reference verifiers. E12 was proposed in PR #12. Where a ruling is pinned by a vector in [`test-vectors/interpretation/`](test-vectors/interpretation/), both reference implementations (`lens.py` and `knobe-core.js`) produced the expected result in agreement before the vector was published.

The rulings below are authoritative for v1. The published test vectors and their expected results are the arbiter of conformance. Where they leave a detail undecided, `lens.py` is canonical for serialization ambiguity under spec §5, and rulings for everything else are documented here; where observed reference behavior conflicts with explicit normative text, the ruling follows the specification and records the conflict.

---

## E1. Bare numeric values still hash

**Question:** Spec §5 requires all numeric payload values to be JSON strings. When a payload violates this with a bare number, can the integrity check still be computed, and how is the bare number serialized in the canonical form?

**Ruling:** Yes, for the integer case the vector pins: the bare number is a conformance violation (`invalid`), and the canonical hash is still computed with the integer serialized in its plain decimal form, no decimal point. Bare floats are not pinned, deliberately: divergent float serialization across languages is the reason §5 requires strings in the first place. An implementation that cannot guarantee the reference serialization may decline to issue a hash verdict on bare-numeric payloads and say so explicitly, as the browser Lens documents, rather than guess.

**Pinned by:** `test-vectors/numeric-violation.knobe.md` (expected: verified · invalid).

## E2. Payload markers are line-anchored

**Question:** Must `-----BEGIN KNOBE B64-----` and `-----END KNOBE B64-----` begin a line, or does the marker text count anywhere in a line?

**Ruling:** A BEGIN marker is recognized only when the marker text constitutes the entire line, immediately followed by a line break (the start of the file counts as a line start). Marker text appearing mid-line is ordinary body content, covered by the sealed `body_hash` like any other body text. The reference engines additionally tolerate trailing text after an END marker; that laxity is observed behavior, not a license, and conforming files keep both markers on lines of their own.

**Pinned by:** `test-vectors/interpretation/begin-marker-mid-line.knobe.md` (expected: verified · yes · valid) for the mid-line case. Trailing text after a marker is not pinned by a vector.

## E3. Multiple payload blocks suppress body verification

**Question:** When more than one payload block is present, §3.3 says to evaluate the last block and §6 calls body extraction ambiguous. How do the two rules interact?

**Ruling:** The verifier evaluates the last block, surfaces a warning (`conformance: warnings`), and reports `body_verified: omitted` regardless of whether the evaluated payload seals a `body_hash`. Ambiguous body extraction is never silently resolved.

**Pinned by:** `test-vectors/multi-block.knobe.md` and `test-vectors/adversarial/multi-block-warning.knobe.md`.

## E4. Conformance is evaluated on the payload as it stands

**Question:** Does a failed integrity check affect the conformance verdict?

**Ruling:** No. Conformance evaluates the decoded payload's structure (field presence, types, formats) exactly as it stands. A tampered payload with all required fields in correct form is `failed` for integrity and `valid` for conformance, and both are reported.

**Pinned by:** `test-vectors/payload-modified.knobe.md` (expected: failed · valid).

## E5. Frontmatter and payload `spec_version` disagreement is a warning

**Question:** The frontmatter and the sealed payload both carry `spec_version`. What happens when they differ?

**Ruling:** The sealed payload value is authoritative for verification semantics. The disagreement is a soft deviation: `conformance: warnings`, with an issue naming both values. It is not an error, and it does not affect integrity.

**Pinned by:** `test-vectors/interpretation/spec-version-frontmatter-mismatch.knobe.md` (expected: verified · warnings).

## E6. Booleans and null are not numbers

**Question:** Does the §5 numeric restriction (all numeric values as strings) catch `true`, `false`, or `null`?

**Answer (confirmation, not a new ruling):** No, and the specification says so directly: "JSON `true`, `false`, and `null` are permitted scalar values; this restriction applies only to numeric values" (§5). The vector exists to pin the part §5 does not spell out: all three serialize literally in the canonical form, so they participate in the hash as the bare tokens `true`, `false`, and `null`.

**Pinned by:** `test-vectors/interpretation/boolean-null-values.knobe.md` (expected: verified · valid).

## E7. Base64 padding is required

**Question:** §3.3 references RFC 4648 §4 (standard Base64). Must a verifier accept a payload block whose trailing `=` padding is missing?

**Ruling:** No. Standard Base64 with padding is the encoding; a block that does not decode under it makes the file `unreadable`. Verifiers must not repair missing padding.

**Pinned by:** `test-vectors/interpretation/base64-unpadded.knobe.md` (expected: unreadable · invalid).

## E8. Unicode escapes are for control characters only

**Question:** The canonical form forbids `\uXXXX` escapes for characters that can be represented directly. Which characters cannot be?

**Ruling:** Only control characters U+0000 through U+001F are escaped (along with JSON's mandatory `\\` and `\"`). Everything else, including code points above U+FFFF, is written as literal UTF-8 bytes. Surrogate-pair escapes never appear in the canonical form. The escape form matters to the hash: the five control characters with two-character JSON escapes use them (`\b`, `\t`, `\n`, `\f`, `\r`), and the remaining controls use lowercase-hex `\u00xx`, matching both reference serializers.

**Pinned by:** `test-vectors/interpretation/astral-unicode-literal.knobe.md` (expected: verified · valid) and `test-vectors/adversarial/control-character-title.knobe.md`.

## E9. A wholly missing `attribution` is one issue

**Question:** `attribution` is required and must contain a `sources` array. When `attribution` is entirely absent, does the verifier report one missing field or two?

**Ruling:** One: `required field missing: attribution`. Checks on `attribution.sources` apply only when `attribution` is present. Issue reporting names the outermost missing requirement rather than cascading.

**Pinned by:** `test-vectors/interpretation/attribution-missing.knobe.md` (expected: verified · invalid, one issue).

## E10. Unreadable files are nonconforming

**Question:** When a file is `unreadable`, field-level conformance checks cannot run. What is the conformance verdict?

**Ruling:** `invalid`, always, with a specific issue naming the actual reason. The issue text is implementation-defined: the reference emits `payload could not be decoded or parsed` for the generic no-decode case and a targeted message for each rejection (duplicate key, NFC key collision, payload not an object, unsupported `spec_version`). Note that the `unsupported-spec-version` case is a refusal to interpret, not a parse failure: the payload decodes fine, and a v1 verifier refuses rather than guesses.

**Pinned by:** `test-vectors/unreadable.knobe.md` and the adversarial set's unreadable cases (`duplicate-key`, `nfc-key-collision`, `payload-array`, `unsupported-spec-version`), which pin the verdicts; the issue strings are not pinned.

## E11. Spelling `omitted` in machine output for failed and unreadable files

**Question:** Spec §7 requires `body_verified` to be `omitted` when status is `failed` or `unreadable`. In machine-readable JSON output, is that the string `"omitted"` or `null`?

**Ruling:** Either spelling is conforming. The mandated value under §7 is `omitted`; JSON output may spell it as the string `"omitted"` or as `null`, and tables may write a dash. The reference itself uses both spellings: `lens.py --json` emits `"omitted"` for `failed` files and `null` for `unreadable` files, two spellings of the same §7 mandate. A consumer of machine output must treat `null` and `"omitted"` as equivalent in this position.

**Origin note:** this entry exists because the steward's Go verifier, following §7's text, emitted the string `"omitted"` for unreadable files, while the reference's JSON output emits `null` there. Cross-implementation testing surfaced the reference's own inconsistent spelling. Both readings follow the specification; this ruling records that both are conforming so the next implementer does not have to guess. This is exactly the kind of gap independent implementation work exists to catch.
## E12. Value formats and block whitespace are ASCII-strict

**Question:** `lens.py` accepted a trailing newline inside date and hash
strings (Python's `$`), accepted non-ASCII digits (`\d`), and stripped any
Unicode whitespace from a payload block before base64 decoding;
`knobe-core.js` did none of the first two and stripped a different
whitespace set. The same file could verify under one reference engine and
be unreadable under the other.

**Ruling:** Strict readings govern. A date is exactly ten ASCII characters
matching `[0-9]{4}-[0-9]{2}-[0-9]{2}` with nothing following; a hash is
exactly 64 lowercase ASCII hex characters with nothing following. Only
ASCII space, tab, CR and LF may be stripped from a payload block; any
other character inside the block makes the base64 invalid and the file
unreadable. No published vector or canonical artifact changes verdict
under this ruling, checked across all 37 published files.

**Pinned by:** `test-vectors/interpretation/nel-block-whitespace.knobe.md`
(expected: unreadable · invalid).

---

Questions about an entry, or a new ambiguity to report: open an issue, or write to david@knobe.org. A reported ambiguity that survives scrutiny gets a ruling and, where practical, a pinning vector, with credit to the reporter.

KNOBE Protocol v1 · Errata: CC BY 4.0 · David Kyle (UC Davis)
