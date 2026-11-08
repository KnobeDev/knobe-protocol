# Security policy

## Scope — what counts as a vulnerability

- Any input that causes `lens.py`, `knobe-core.js`, the browser Lens, or the `knobe-mcp` server to report **`verified` when the payload has been altered** (verification bypass).
- Any ambiguity in the canonical hash rule (spec §5) that lets two conforming implementations compute **different hashes for the same payload**.
- Crashes or unsafe behavior in a reference verifier, `knobe-core.js`, or the `knobe-mcp` server on hostile input — it must fail to `unreadable`, never execute content or misreport.
- Flaws in multi-block or body-hash handling that let tampering evade the defined verification states.
- Output-rendering hazards: payload strings that can spoof verifier output if echoed unescaped (see `test-vectors/adversarial/control-character-title.knobe.md`).

## Out of scope — by design, per the threat model

- A sealed file containing false, misattributed, or harmful content. The seal proves integrity, not truth, authorship, or safety.
- Identity forgery. v1 attribution is declared; the verifier cannot and does not authenticate identity.
- Deletion or non-use of KNOBE structure by systems that do not verify.

See the full [threat model](https://knobe.org/threat-model) for the boundary between the two lists.

## Reporting

Email **david@knobe.org** with subject line `KNOBE SECURITY`. Please do not open a public issue for verification-bypass reports until a fix or advisory is published.

- Acknowledgment within 7 days.
- Coordinated disclosure target: 90 days.
- Reporters are credited in the advisory unless they prefer otherwise.
