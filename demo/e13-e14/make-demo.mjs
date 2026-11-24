// Builds the E13 / E14 demo files in this folder.
//
// Each file is sealed by knobe-core.js's own createKnobe(), then gets one
// edit after sealing: the kind of change a person or a tool makes to a file
// that already carries a seal. The edit is the point of the file, so it is
// never resealed afterwards.
//
//   node demo/e13-e14/make-demo.mjs        (from the repository root)
//
// The output is deterministic: created_date is fixed, and createKnobe's
// other defaults do not depend on the clock.

import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createKnobe } from "../../knobe-core.js";

const HERE = dirname(fileURLToPath(import.meta.url));
const DATE = "2026-11-23";
const AUTHOR = "Joshua Hori";
const BOM = "﻿";

// A body with two `---` horizontal rules. A verifier that counts `---`
// lines from anywhere other than line 1 takes these for the frontmatter's
// delimiters.
function bodyWithRules(title, what, edit) {
  return [
    `# ${title}`,
    "",
    what,
    "",
    "---",
    "",
    "## The edit made after sealing",
    "",
    edit,
    "",
    "---",
    "",
    "## Why it is here",
    "",
    "This file demonstrates a case in the proposed rulings E13 and E14",
    "(KnobeOne/knobe-protocol#22). The text above was sealed with a body_hash,",
    "so a verifier that finds the body in the right place reports it as",
    "unchanged. The two horizontal rules are part of the sealed body.",
  ].join("\n");
}

// Replace exactly one occurrence of `from` with `to`, or stop.
function replaceOnce(text, from, to) {
  const at = text.indexOf(from);
  if (at === -1 || text.indexOf(from, at + 1) !== -1) {
    throw new Error(`expected exactly one ${JSON.stringify(from)}`);
  }
  return text.slice(0, at) + to + text.slice(at + from.length);
}

const SPEC_LINE = 'spec_version: "1.0"\n';

const CASES = [
  {
    file: "control-rules-in-body.knobe.md",
    title: "Control: horizontal rules in the body",
    what: "A clean sealed file whose body holds `---` horizontal rules. Every engine should verify it.",
    edit: "None. This is the positive control the steward asked for in #22.",
    apply: (t) => t,
  },
  {
    file: "e13-no-spec-version.knobe.md",
    title: "E13: frontmatter without spec_version",
    what: "The frontmatter does not declare spec_version, which §3.1 and §10 require.",
    edit: "The `spec_version` line was deleted from the frontmatter.",
    apply: (t) => replaceOnce(t, SPEC_LINE, ""),
  },
  {
    file: "e13-empty-spec-version.knobe.md",
    title: "E13: empty spec_version",
    what: "The frontmatter declares spec_version with an empty string.",
    edit: 'The frontmatter value was changed to `spec_version: ""`.',
    apply: (t) => replaceOnce(t, SPEC_LINE, 'spec_version: ""\n'),
  },
  {
    file: "e13-blank-spec-version.knobe.md",
    title: "E13: spec_version followed only by spaces",
    what: "The frontmatter has a spec_version key with no value, only trailing spaces.",
    edit: "The frontmatter line was changed to `spec_version:` followed by three spaces.",
    apply: (t) => replaceOnce(t, SPEC_LINE, "spec_version:   \n"),
  },
  {
    file: "e13-quoted-key.knobe.md",
    title: "E13: quoted spec_version key",
    what: "The frontmatter writes the key in quotes. That is valid YAML, but the proposed ruling says the key must be written bare.",
    edit: 'The frontmatter line was changed to `"spec_version": "1.0"`.',
    apply: (t) => replaceOnce(t, SPEC_LINE, '"spec_version": "1.0"\n'),
  },
  {
    file: "e13-control-single-quoted.knobe.md",
    title: "E13 control: single-quoted spec_version",
    what: "The frontmatter value uses single quotes. Quotes around the value are stripped, so this declares 1.0.",
    edit: "The frontmatter line was changed to `spec_version: '1.0'`.",
    apply: (t) => replaceOnce(t, SPEC_LINE, "spec_version: '1.0'\n"),
  },
  {
    file: "e14-preamble-line.knobe.md",
    title: "E14: a line before the frontmatter",
    what: "A line of text sits above the opening `---`, so line 1 is not the frontmatter's opening delimiter.",
    edit: "One line of text was added before line 1.",
    apply: (t) => "Forwarded from the course site. Please read before class.\n" + t,
  },
  {
    file: "e14-no-frontmatter.knobe.md",
    title: "E14: frontmatter removed",
    what: "The frontmatter block is gone. The body's own `---` rules are the only `---` lines left.",
    edit: "The frontmatter block, both delimiters included, was deleted.",
    apply: (t) => {
      if (!t.startsWith("---\n")) throw new Error("no frontmatter to remove");
      const close = t.indexOf("\n---\n", 3);
      return t.slice(close + "\n---\n".length);
    },
  },
  {
    file: "bom-with-body-hash.knobe.md",
    title: "BOM: byte-order mark, body_hash sealed",
    what: "A UTF-8 byte-order mark precedes the opening `---`, as some Windows editors save files.",
    edit: "A UTF-8 byte-order mark (EF BB BF) was added before line 1.",
    apply: (t) => BOM + t,
  },
  {
    file: "bom-without-body-hash.knobe.md",
    title: "BOM: byte-order mark, no body_hash",
    noBody: true,
    summary: "A UTF-8 byte-order mark was added before line 1 after sealing. This file seals no body_hash, unlike bom-with-body-hash.knobe.md.",
    apply: (t) => BOM + t,
  },
  {
    file: "cr-cr-opening-delimiter.knobe.md",
    title: "Trailing CRs on the opening delimiter",
    what: "The opening delimiter line ends in two carriage returns before its line feed.",
    edit: "Line 1 was changed from `---` to `---` followed by CR CR.",
    apply: (t) => {
      if (!t.startsWith("---\n")) throw new Error("line 1 is not ---");
      return "---\r\r\n" + t.slice(4);
    },
  },
];

for (const c of CASES) {
  const fields = {
    title: c.title,
    summary: c.summary ?? `${c.what} Demo file for the proposed rulings E13 and E14.`,
    created_date: DATE,
    license: "CC0 1.0",
    content_type: "original",
  };
  const body = c.noBody ? "" : bodyWithRules(c.title, c.what, c.edit);
  const { text } = await createKnobe({ fields, body, author: AUTHOR });
  const out = c.apply(text);
  writeFileSync(join(HERE, c.file), out);
  console.log(c.file);
}
