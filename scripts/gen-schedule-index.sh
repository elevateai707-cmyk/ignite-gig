#!/usr/bin/env bash
# Regenerates lib/tax/schedules/index.ts from the bundled JSON files.
set -euo pipefail
cd "$(dirname "$0")/../lib/tax/schedules"
{
  echo "// Auto-generated static index of bundled tax schedules. Regenerate with:"
  echo "//   bash scripts/gen-schedule-index.sh"
  echo "import type { ScheduleJson } from \"../types\";"
  for f in *_2025.json; do n="${f%.json}"; echo "import $n from \"./$f\";"; done
  echo ""
  echo "export const SCHEDULES: Record<string, ScheduleJson> = {"
  for f in *_2025.json; do n="${f%.json}"; echo "  ${n}: ${n} as ScheduleJson,"; done
  echo "};"
} > index.ts
echo "wrote index.ts ($(grep -c '^import' index.ts) imports)"
