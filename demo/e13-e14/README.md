# Demo files for the proposed rulings E13 and E14

Eleven small `.knobe.md` files that show, one case each, where KNOBE verifiers
disagree today on the questions in
[#22](https://github.com/KnobeOne/knobe-protocol/issues/22): whether the
frontmatter must declare `spec_version` (E13), where the body starts (E14),
and the related byte-order-mark and trailing-CR question.

These are demo files, not test vectors. They are not part of any
compatibility bar, and no expected result is published for them.

The pinning vectors for E13 and E14 are in
[`test-vectors/interpretation/`](../../test-vectors/interpretation/README.md):
`frontmatter-no-spec-version`, `body-after-preamble`, the positive control
`body-horizontal-rules`, and `leading-bom-body-hash` and
`opening-delimiter-trailing-cr` for the tolerance ruled with E14.
`make-vectors.mjs` rebuilds them, byte for byte,
into both `test-vectors/` and its `site/` mirror.

The table below records the engines before the rulings were implemented
in `lens.py` and `knobe-core.js`. With them, the four E13 rows read
verified · yes · invalid · 1 in both reference engines, as in knobe-rs,
and `bom-with-body-hash` and `cr-cr-opening-delimiter` read
verified · yes · valid · 0. No other row changes. knobe-go and knobe-rs
still give the results shown until they adopt the rulings.

## How the files were made

`make-demo.mjs` seals each file with this repository's own `createKnobe()`,
then makes one edit after sealing: the kind of change a person or a tool
makes to a file that already carries a seal. Each file's sealed body says
what that edit was. Regenerate them, byte for byte, from the repository root:

```bash
node demo/e13-e14/make-demo.mjs
```

The body of every file except `bom-without-body-hash` holds two `---`
horizontal rules and is covered by a sealed `body_hash`. A verifier that
finds the body in the right place reports it unchanged.

## Results today

Each cell is status · body_verified · conformance · exit code. Run on
2026-11-23 with `lens.py` and `knobe-core.js` at knobe-protocol `61c36b2`,
knobe-go `eedc180` (origin/main), knobe-rs `226a511` (origin/main), and
knobe-rs PR [KnobeDev/knobe-rs#1](https://github.com/KnobeDev/knobe-rs/pull/1)
at `22ac022`, which implements the E13 and E14 proposals and nothing for the
BOM / trailing-CR question.

| file | lens.py | knobe-core.js | knobe-go | knobe-rs main | knobe-rs PR #1 |
|---|---|---|---|---|---|
| `control-rules-in-body` | verified · yes · valid · 0 | verified · yes · valid · 0 | verified · yes · valid · 0 | verified · yes · valid · 0 | verified · yes · valid · 0 |
| `e13-no-spec-version` | verified · yes · valid · 0 | verified · yes · valid · 0 | verified · yes · valid · 0 | verified · yes · **invalid** · 1 | verified · yes · invalid · 1 |
| `e13-empty-spec-version` | verified · yes · warnings · 0 | verified · yes · warnings · 0 | verified · yes · warnings · 0 | verified · yes · **invalid** · 1 | verified · yes · invalid · 1 |
| `e13-blank-spec-version` | verified · yes · warnings · 0 | verified · yes · warnings · 0 | verified · yes · warnings · 0 | verified · yes · **invalid** · 1 | verified · yes · invalid · 1 |
| `e13-quoted-key` | verified · yes · valid · 0 | verified · yes · valid · 0 | verified · yes · valid · 0 | verified · yes · **invalid** · 1 | verified · yes · invalid · 1 |
| `e13-control-single-quoted` | verified · yes · valid · 0 | verified · yes · valid · 0 | verified · yes · valid · 0 | verified · yes · valid · 0 | verified · yes · valid · 0 |
| `e14-preamble-line` | unreadable · — · invalid · 2 | unreadable · — · invalid · 2 | unreadable · — · invalid · 2 | **verified · yes** · invalid · 1 | unreadable · — · invalid · 2 |
| `e14-no-frontmatter` | unreadable · — · invalid · 2 | unreadable · — · invalid · 2 | unreadable · — · invalid · 2 | **verified-body-modified · modified** · invalid · 1 | unreadable · — · invalid · 2 |
| `bom-with-body-hash` | unreadable · — · invalid · 2 | unreadable · — · invalid · 2 | unreadable · — · invalid · 2 | **verified-body-modified · modified · valid · 0** | unreadable · — · invalid · 2 |
| `bom-without-body-hash` | verified · omitted · valid · 0 | verified · omitted · valid · 0 | verified · omitted · valid · 0 | verified · omitted · valid · 0 | verified · omitted · valid · 0 |
| `cr-cr-opening-delimiter` | unreadable · — · invalid · 2 | unreadable · — · invalid · 2 | unreadable · — · invalid · 2 | **verified · yes · valid · 0** | unreadable · — · invalid · 2 |

Bold marks where knobe-rs main differs from the other three engines.

## What each file shows

**Controls.** `control-rules-in-body` is the positive control asked for in
#22: a clean file with `---` rules in its body, verified by every engine.
`e13-control-single-quoted` (`spec_version: '1.0'`) is valid everywhere,
because quotes around the value are stripped.

**E13: the frontmatter must declare `spec_version`.**

- `e13-no-spec-version`: the line was deleted. §3.1 and §10 require it, but
  `lens.py`, `knobe-core.js` and knobe-go report `valid` with no issue.
- `e13-empty-spec-version` (`spec_version: ""`) and `e13-blank-spec-version`
  (the key followed only by spaces): those three engines report an E5
  mismatch warning, `frontmatter spec_version '' does not match sealed
  payload spec_version '1.0'`, which points the author at the wrong problem.
  knobe-rs reports one issue: `YAML frontmatter does not declare
  spec_version (spec §3.1)`.
- `e13-quoted-key` (`"spec_version": "1.0"`): valid YAML, `valid` in three
  engines, `invalid` in knobe-rs. The proposed ruling says the key must be
  written bare.

In every E13 file only conformance changes. Status and body_verified agree
across all engines, but the exit code moves from 0 to 1 with conformance.

**E14: the body starts after the frontmatter that begins on line 1.**

- `e14-preamble-line`: one line of text above the opening `---`. knobe-rs
  counts `---` lines from wherever they appear, finds the frontmatter, and
  verifies the body. The other engines see no frontmatter on line 1 and,
  because a `body_hash` is sealed, report `unreadable`.
- `e14-no-frontmatter`: the frontmatter was deleted. knobe-rs takes the
  body's two horizontal rules for the frontmatter's delimiters and reports
  the body as modified when nobody changed it.

**The byte-order mark and trailing CRs.** These two show why E14 and this
question are being ruled together.

- `bom-with-body-hash`: a UTF-8 BOM before line 1. knobe-rs reports a false
  `verified-body-modified` and exits 0. The other three report `unreadable`.
- `bom-without-body-hash`: the same edit on a file with no `body_hash`. Every
  engine reports verified and valid. Inside `lens.py` itself the frontmatter
  check skips the BOM but body location does not, so the same edit verifies
  or is unreadable depending on whether a body hash is sealed.
- `cr-cr-opening-delimiter`: line 1 is `---` followed by CR CR. knobe-rs
  reports verified · yes, which is the true state of the body. The other
  three report `unreadable`.

The last column shows the effect of E14 alone. With knobe-rs PR #1, both
`bom-with-body-hash` and `cr-cr-opening-delimiter` become `unreadable`: the
first moves from a wrong answer to `unreadable`, the second from a right
answer to `unreadable`. The tolerance proposed in #22 (skip one leading BOM
and trailing CRs on delimiter lines in body location too) would make both
verified · yes · valid in every engine.

## Run it yourself

```bash
demo/e13-e14/run.sh
```

prints the table for `lens.py` and `knobe-core.js`. Add other engines as
`NAME=PATH`; add `:verify` after the path for a `knobe verify` style CLI:

```bash
demo/e13-e14/run.sh knobe-go=/path/to/knobe-verify "knobe-rs=/path/to/knobe:verify"
```

`.gitattributes` keeps every `*.knobe.md` byte-exact, which
`cr-cr-opening-delimiter` and the BOM files depend on.

Demo files and scripts: CC0 1.0, like the test vectors.
