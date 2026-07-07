import type { Country, TaxBracket, TaxEstimate, TaxSchedule } from "./types";

/**
 * Pure-function tax math, ported from the Android app's TaxEngine.kt.
 *
 * US self-employment tax: 15.3% of 92.35% of net SE earnings up to the
 * Social Security wage base, then 2.9% Medicare above it. Simplified —
 * accurate within a few dollars for typical gig incomes and conservative
 * (rounds toward over-saving).
 *
 * CA (web-version upgrade over the Android engine): CPP self-employed
 * contributions instead of US SE tax — 11.9% of pensionable earnings
 * between the $3,500 exemption and the YMPE, plus CPP2 at 8% between
 * the YMPE and YAMPE. Quebec's QPP differs slightly; CPP is used as a
 * close, conservative approximation.
 */

// US constants (tax year 2025)
export const SS_WAGE_BASE_2025 = 176_100;
const SE_INCOME_FACTOR = 0.9235;
const SS_RATE = 0.124;
const MEDICARE_RATE = 0.029;

// CA CPP constants (tax year 2025)
const CPP_EXEMPTION_2025 = 3_500;
const CPP_YMPE_2025 = 71_300;
const CPP_YAMPE_2025 = 81_200;
const CPP_SELF_EMPLOYED_RATE = 0.119;
const CPP2_SELF_EMPLOYED_RATE = 0.08;

/** Apply a progressive bracket schedule to income. */
export function applyBrackets(income: number, brackets: TaxBracket[]): number {
  if (income <= 0 || brackets.length === 0) return 0;
  let owed = 0;
  for (const b of brackets) {
    if (income <= b.lowerBound) break;
    const upper = b.upperBound ?? Number.MAX_VALUE;
    const taxableInBracket = Math.min(income, upper) - b.lowerBound;
    if (taxableInBracket > 0) owed += taxableInBracket * b.rate;
  }
  return owed;
}

/** US self-employment tax (Social Security + Medicare) on net SE income. */
export function selfEmploymentTax(
  netSeEarnings: number,
  ssWageBase: number = SS_WAGE_BASE_2025
): number {
  if (netSeEarnings <= 0) return 0;
  const taxableSe = netSeEarnings * SE_INCOME_FACTOR;
  const ssPortion = Math.min(taxableSe, ssWageBase) * SS_RATE;
  const medicarePortion = taxableSe * MEDICARE_RATE;
  return ssPortion + medicarePortion;
}

/** CA CPP contributions for the self-employed (both employer + employee shares). */
export function cppSelfEmployed(netSeEarnings: number): number {
  if (netSeEarnings <= CPP_EXEMPTION_2025) return 0;
  const base =
    (Math.min(netSeEarnings, CPP_YMPE_2025) - CPP_EXEMPTION_2025) * CPP_SELF_EMPLOYED_RATE;
  const cpp2 =
    Math.max(0, Math.min(netSeEarnings, CPP_YAMPE_2025) - CPP_YMPE_2025) *
    CPP2_SELF_EMPLOYED_RATE;
  return base + cpp2;
}

export interface EstimateInput {
  country: Country;
  grossIncome: number;
  businessExpenses: number;
  mileageDeduction: number;
  federalSchedule: TaxSchedule;
  regionalSchedule: TaxSchedule | null;
}

/** Full estimate. Mirrors TaxEngine.estimate() with country-aware payroll tax. */
export function estimate(input: EstimateInput): TaxEstimate {
  const { country, grossIncome, businessExpenses, mileageDeduction, federalSchedule, regionalSchedule } =
    input;
  const deductions = businessExpenses + mileageDeduction + federalSchedule.standardDeduction;
  const taxableIncome = Math.max(0, grossIncome - deductions);
  const federal = applyBrackets(taxableIncome, federalSchedule.brackets);
  const regional = regionalSchedule
    ? applyBrackets(taxableIncome, regionalSchedule.brackets)
    : 0;
  const netSe = grossIncome - businessExpenses - mileageDeduction;
  const seTax = country === "CA" ? cppSelfEmployed(netSe) : selfEmploymentTax(netSe);
  const total = federal + regional + seTax;
  return {
    grossIncome,
    deductions,
    taxableIncome,
    federalTax: federal,
    regionalTax: regional,
    selfEmploymentTax: seTax,
    totalTax: total,
    effectiveRate: grossIncome > 0 ? total / grossIncome : 0,
    quarterlyEstimate: total / 4,
    mileageDeduction,
  };
}

// ── Mileage ──────────────────────────────────────────────────────────────────

/** IRS standard business mileage rate, USD per mile (2025, Rev. Proc. 2024-46). */
export const US_MILEAGE_RATE_2025 = 0.7;
/** CRA per-km allowance rates, 2025: 72¢ first 5,000 km, 66¢ after. */
export const CA_KM_RATE_FIRST_5000 = 0.72;
export const CA_KM_RATE_AFTER = 0.66;
const CA_KM_TIER = 5_000;

/**
 * Simplified business mileage deduction for the year.
 * US: total miles × IRS rate. CA: tiered CRA per-km allowance rate,
 * applied to year-to-date km (a simplified estimate of the actual
 * vehicle-expense method — flagged as such in the UI).
 */
export function mileageDeductionFor(country: Country, distance: number): number {
  if (distance <= 0) return 0;
  if (country === "US") return distance * US_MILEAGE_RATE_2025;
  const firstTier = Math.min(distance, CA_KM_TIER) * CA_KM_RATE_FIRST_5000;
  const rest = Math.max(0, distance - CA_KM_TIER) * CA_KM_RATE_AFTER;
  return firstTier + rest;
}

/** Unit label for the country's mileage entry. */
export function distanceUnit(country: Country): "km" | "mi" {
  return country === "CA" ? "km" : "mi";
}
