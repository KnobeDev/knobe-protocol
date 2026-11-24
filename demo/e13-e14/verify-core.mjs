// Verify one file with knobe-core.js and print the report as JSON, with
// lens.py's exit codes, so run.sh can treat it like the other engines.
import { readFileSync } from "node:fs";
import { verify } from "../../knobe-core.js";

const file = process.argv[2];
if (!file) {
  console.error("usage: node verify-core.mjs FILE.knobe.md");
  process.exit(2);
}
const r = await verify(readFileSync(file)); // bytes, as the browser Lens reads them
const { state, body_verified, conformance, conformance_issues } = r;
console.log(JSON.stringify({ status: state, body_verified, conformance, conformance_issues }));
if (state === "unreadable") process.exit(2);
const ok = (state === "verified" || state === "verified-body-modified")
  && (conformance === "valid" || conformance === "warnings");
process.exit(ok ? 0 : 1);
