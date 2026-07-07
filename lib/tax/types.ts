/**
 * Domain models for the local tax engine. Pure types — ported 1:1 from
 * the Android app's TaxModels.kt so the two engines stay in sync.
 */

export type Country = "CA" | "US";

export type FilingStatus =
  | "SINGLE"
  | "MARRIED_JOINT"
  | "MARRIED_SEPARATE"
  | "HEAD_OF_HOUSEHOLD";

export function parseFilingStatus(s: string | null | undefined): FilingStatus {
  switch (s?.toLowerCase()) {
    case "married_joint":
      return "MARRIED_JOINT";
    case "married_separate":
      return "MARRIED_SEPARATE";
    case "head_of_household":
      return "HEAD_OF_HOUSEHOLD";
    default:
      return "SINGLE";
  }
}

/** upperBound null means "and above". */
export interface TaxBracket {
  lowerBound: number;
  upperBound: number | null;
  rate: number;
}

export interface TaxSchedule {
  country: Country;
  region: string;
  year: number;
  filingStatus: FilingStatus;
  brackets: TaxBracket[];
  standardDeduction: number;
}

export interface TaxEstimate {
  grossIncome: number;
  deductions: number;
  taxableIncome: number;
  federalTax: number;
  regionalTax: number;
  /** US: SE tax (Social Security + Medicare). CA: CPP self-employed contributions. */
  selfEmploymentTax: number;
  totalTax: number;
  effectiveRate: number;
  quarterlyEstimate: number;
  mileageDeduction: number;
}

/** Raw shape of the bundled schedule JSON files. */
export interface ScheduleJson {
  country: string;
  region?: string;
  year: number;
  currency: string;
  standardDeductions: Record<string, number>;
  brackets: Record<string, { lower: number; upper: number | null; rate: number }[]>;
}
