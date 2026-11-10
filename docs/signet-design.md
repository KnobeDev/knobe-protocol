# The signet: continuity-of-authorship signatures for KNOBE files

Status: DEFERRED INDEFINITELY as of 2026-08-28 under
docs/repositioning-2026.md. Person-bound key continuity, even opt-in, sits
on the wrong side of the artifact-level-not-person-level principle for the
education context this was designed for. The charter remains as a design
record; no build proceeds under current doctrine. Original status follows.

Status: design charter, non-normative. Nothing here changes KNOBE Protocol v1;
everything rides on ordinary payload fields, which the specification requires
verifiers to preserve (spec §4.3). The specification reserves
`identity_status: "signed"` as a forward placeholder (spec §8); the signet is
an application-layer step toward it, and files carrying signet fields keep
`identity_status: "declared"` until a normative signing tier exists.

## The problem this addresses

A sealed KNOBE proves its content is intact, not who authored it. In
coursework, the practical question is usually narrower than legal identity:
is this the same person who submitted the earlier work? The signet answers
that question with continuity: every submission in a chain is signed by the
same locally held key, and one anchoring event binds that key to a person.

## When to use it, and when not to

The signet is for high-assurance settings: comprehensive exams, dissertations,
professional certifications, and any course whose stakes justify a key
ceremony. It is not a default for every section. Students lose key files, and
every loss means a re-enrollment event that costs real staff time; at the
scale of a 500-seat course, that cost is the dominant design constraint. Most
courses get what they need from the time sandwich and the cohort receipt, and
should start there.

## What it is

- Studio generates an ECDSA P-256 keypair with WebCrypto, in the page,
  offline. The private key is exported as a JWK file the student downloads
  and keeps ("the signet file"). No server, no account, no custody by anyone
  but the student.
- At sealing time, Studio computes the canonical payload with all `identity:`
  namespaced fields removed, hashes it (the pre-signature hash), signs that
  hash with the signet, then inserts three fields and seals:
  - `identity:signature`: the signature, base64url
  - `identity:pubkey`: the public key, JWK
  - `identity:signet`: the public key's SHA-256 fingerprint, hex
  The final payload hash therefore covers the signature; nothing about the
  file's ordinary verification changes.
- Verification (in Studio, or any tool): recompute the pre-signature hash by
  removing the `identity:` fields, then check the signature against
  `identity:pubkey` and confirm the fingerprint matches `identity:signet`.
  Report the result alongside, never instead of, the integrity verdict.

## Enrollment: binding a signet to a roster

The signature proves key continuity, not identity. One anchoring event closes
the gap, at whatever strength the stakes demand:

- **Course scale.** The first cohort receipt of the term records each
  submission's `identity:signet` fingerprint next to its file name. The
  instructor's attestation that week one submissions came from enrolled
  students (Canvas login plus ordinary course contact) becomes the roster
  binding; every later submission signed by the same key inherits it.
- **High stakes** (comprehensive exams, dissertations, certifications): the
  student states their fingerprint in person, or signs a challenge phrase in
  a proctored setting, and the record of that event is itself sealed.

## What it does and does not prove

Proves: the holder of the signet's private key produced every signature in
the chain, and the signed content is exactly what was sealed.

Does not prove: legal identity (that comes only from the anchoring event and
is only as strong as that event); sole authorship (a key holder can sign work
they did not write, exactly as they can submit it through their Canvas
login); when the signature was made (see the ledger-anchoring pathway in the
threat model, and the cohort receipt as its zero-infrastructure interim).

## Failure modes, stated plainly

- **Key sharing** is credential sharing. It defeats the signet the same way
  sharing a Canvas password defeats Canvas, and it is handled the same way:
  policy, not cryptography.
- **Key loss.** The student generates a new signet and re-anchors; the next
  cohort receipt records the rotation. Continuity restarts; history signed by
  the old key remains valid and attributed to it.
- **Key theft.** Revocation is a recorded statement (sealed, ideally in a
  receipt) that a fingerprint is no longer trusted after a date. There is no
  central authority to do this automatically, and this document does not
  pretend otherwise.

## Implementation notes for the build

- WebCrypto: `crypto.subtle.generateKey({name: "ECDSA", namedCurve: "P-256"},
  true, ["sign", "verify"])`; sign with SHA-256. All operations exist in the
  engine's existing environment (Studio already requires `crypto.subtle`).
- The pre-signature hash must use the engine's own canonicalization
  (`canonicalize()` in knobe-core.js) on the payload minus `identity:` fields,
  so signatures are as deterministic as sealing itself.
- Studio surfaces: a "signet" section in Create (generate, load, sign);
  signature status in Verify's report; fingerprints in the cohort receipt.
- The `identity:` prefix follows the namespaced-field precedent
  (`research:` in the research profile, `education:` in the cohort receipt);
  `permits()` already surfaces such fields as obligations.
- lens.py is untouched. A file with signet fields verifies identically
  everywhere; only signet-aware tools evaluate the signature.

## Relationship to the published posture

The threat model names three composition pathways: application-tier identity,
ledger anchoring, and credentialed authoring environments. The signet is the
smallest possible application-tier identity step: no institution required, no
server, one keypair per person, one anchoring event per binding. It is
designed to compose with the other two rather than substitute for them.
