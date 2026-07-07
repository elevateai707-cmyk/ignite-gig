import { SCHEDULES } from "./schedules/index";
import type { Country, FilingStatus, ScheduleJson, TaxSchedule } from "./types";

/**
 * Schedule lookup over the bundled JSON — the web equivalent of the
 * Android app's TaxScheduleProvider (which read the same files from
 * assets/tax/). Everything is statically imported, so lookups are
 * synchronous and work offline.
 */

function build(
  json: ScheduleJson,
  country: Country,
  region: string,
  year: number,
  filing: FilingStatus
): TaxSchedule | null {
  const brackets = json.brackets[filing];
  if (!brackets) return null;
  return {
    country,
    region,
    year,
    filingStatus: filing,
    brackets: brackets.map((b) => ({
      lowerBound: b.lower,
      upperBound: b.upper,
      rate: b.rate,
    })),
    standardDeduction: json.standardDeductions?.[filing] ?? 0,
  };
}

export function federalSchedule(
  country: Country,
  year: number,
  filing: FilingStatus
): TaxSchedule | null {
  const json = SCHEDULES[`${country.toLowerCase()}_federal_${year}`];
  return json ? build(json, country, "", year, filing) : null;
}

/** Regional (state / province) schedule; null means "no regional tax bundled". */
export function regionalSchedule(
  country: Country,
  region: string,
  year: number,
  filing: FilingStatus
): TaxSchedule | null {
  if (!region) return null;
  const json = SCHEDULES[`${country.toLowerCase()}_${region.toLowerCase()}_${year}`];
  return json ? build(json, country, region.toUpperCase(), year, filing) : null;
}

/** Sorted 2-letter region codes with a bundled schedule for country+year. */
export function availableRegions(country: Country, year: number): string[] {
  const prefix = `${country.toLowerCase()}_`;
  const suffix = `_${year}`;
  return Object.keys(SCHEDULES)
    .filter((k) => k.startsWith(prefix) && k.endsWith(suffix))
    .map((k) => k.slice(prefix.length, -suffix.length).toUpperCase())
    .filter((r) => r !== "FEDERAL")
    .sort();
}
