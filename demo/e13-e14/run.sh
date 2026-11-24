#!/usr/bin/env bash
# Run every demo file through each available engine and print one table.
#
#   demo/e13-e14/run.sh                     (from the repository root)
#
# lens.py and knobe-core.js come from this repository. Add other engines
# as NAME=PATH arguments; each must take `verify --json FILE` (knobe-rs)
# or `--json FILE` (knobe-go), set with a trailing ":verify" for the first:
#
#   demo/e13-e14/run.sh knobe-go=/path/knobe-verify knobe-rs=/path/knobe:verify
#
# Each cell is status · body_verified · conformance · exit code.
set -euo pipefail
cd "$(dirname "$0")/../.."
DIR=demo/e13-e14

# Each engine is a program plus the arguments that go before the file.
engines=("lens.py" "knobe-core.js")
progs=("python3" "node")
preargs=("lens.py --json" "$DIR/verify-core.mjs")
for spec in "$@"; do
  name=${spec%%=*}; path=${spec#*=}
  if [[ $path == *:verify ]]; then progs+=("${path%:verify}"); preargs+=("verify --json")
  else progs+=("$path"); preargs+=("--json"); fi
  engines+=("$name")
done

cell() {  # cell PROG "PREARGS" FILE; PREARGS hold no spaces inside a word
  local out code args
  read -r -a args <<< "$2"
  set +e; out=$("$1" "${args[@]}" "$3" 2>/dev/null); code=$?; set -e
  python3 -c '
import json, sys
try:
    r = json.loads(sys.argv[1])
except Exception:
    print("no JSON · exit " + sys.argv[2]); sys.exit()
st = r.get("status") or r.get("state")
# Unreadable files omit body_verified; JSON may spell that null or "omitted" (E11).
bv = "—" if st == "unreadable" else (r.get("body_verified") or "omitted")
print(" · ".join([str(st), bv, str(r.get("conformance")), sys.argv[2]]))' "$out" "$code"
}

printf '| file |'; for e in "${engines[@]}"; do printf ' %s |' "$e"; done; echo
printf '|---|'; for _ in "${engines[@]}"; do printf -- '---|'; done; echo
for f in "$DIR"/*.knobe.md; do
  printf '| `%s` |' "$(basename "$f")"
  for i in "${!engines[@]}"; do printf ' %s |' "$(cell "${progs[$i]}" "${preargs[$i]}" "$f")"; done
  echo
done
