import { describe, expect, it } from "vitest";
import {
  applyBrackets,
  cppSelfEmployed,
  estimate,
  mileageDeductionFor,
  selfEmploymentTax,
} from "../lib/tax/engine";
import { availableRegions, federalSchedule, regionalSchedule } from "../lib/tax/schedules";
import { parseFilingStatus, type TaxSchedule } from "../lib/tax/types";

// Same fixture as the Android TaxEngineTest (US 2025 single filer).
const us2025Single: TaxSchedule = {
  country: "US",
  region: "",
  year: 2025,
  filingStatus: "SINGLE",
  brackets: [
    { lowerBound: 0, upperBound: 11925, rate: 0.1 },
    { lowerBound: 11925, upperBound: 48475, rate: 0.12 },
    { lowerBound: 48475, upperBound: 103350, rate: 0.22 },
    { lowerBound: 103350, upperBound: 197300, rate: 0.24 },
    { lowerBound: 197300, upperBound: 250525, rate: 0.32 },
    { lowerBound: 250525, upperBound: 626350, rate: 0.35 },
    { lowerBound: 626350, upperBound: null, rate: 0.37 },
  ],
  standardDeduction: 15000,
};

describe("applyBrackets (ported from TaxEngineTest)", () => {
  it("zero income owes zero tax", () => {
    expect(applyBrackets(0, us2025Single.brackets)).toBeCloseTo(0, 4);
  });

  it("income below first bracket ceiling stays in 10% bracket", () => {
    expect(applyBrackets(10_000, us2025Single.brackets)).toBeCloseTo(1_000, 2);
  });

  it("income spanning multiple brackets is correctly stacked", () => {
    // 10% of 11,925 + 12% of 36,550 + 22% of 1,525 = 5,914.00
    expect(applyBrackets(50_000, us2025Single.brackets)).toBeCloseTo(5_914, 2);
  });
});

describe("US self-employment tax (ported from TaxEngineTest)", () => {
  it("matches IRS simplified formula", () => {
    // 50,000 * 0.9235 = 46,175 → 12.4% + 2.9% = 7,064.775
    expect(selfEmploymentTax(50_000)).toBeCloseTo(7_064.775, 2);
  });

  it("caps the Social Security portion at the wage base", () => {
    // Original Kotlin test used the 2024 base of 168,600 — pass explicitly.
    expect(selfEmploymentTax(200_000, 168_600)).toBeCloseTo(26_262.7, 2);
  });
});

describe("CA CPP self-employed (web-version upgrade)", () => {
  it("owes nothing at or below the $3,500 exemption", () => {
    expect(cppSelfEmployed(3_500)).toBe(0);
  });

  it("applies 11.9% above the exemption", () => {
    // (50,000 - 3,500) * 0.119 = 5,533.50
    expect(cppSelfEmployed(50_000)).toBeCloseTo(5_533.5, 2);
  });

  it("caps base CPP at YMPE and adds CPP2 up to YAMPE", () => {
    // Base: (71,300 - 3,500) * 0.119 = 8,068.20
    // CPP2: (81,200 - 71,300) * 0.08 = 792.00
    expect(cppSelfEmployed(100_000)).toBeCloseTo(8_860.2, 2);
  });
});

describe("estimate (ported from TaxEngineTest)", () => {
  it("combines federal, regional and SE tax for the US", () => {
    const est = estimate({
      country: "US",
      grossIncome: 80_000,
      businessExpenses: 5_000,
      mileageDeduction: 7_000,
      federalSchedule: us2025Single,
      regionalSchedule: null,
    });
    expect(est.deductions).toBeCloseTo(27_000, 4);
    expect(est.taxableIncome).toBeCloseTo(53_000, 4);
    expect(est.federalTax).toBeCloseTo(6_574, 2);
    expect(est.regionalTax).toBeCloseTo(0, 4);
    // SE tax on 68k net: 68,000 * 0.9235 * 0.153 ≈ 9,608.10
    expect(est.selfEmploymentTax).toBeCloseTo(9_608.1, 1);
    expect(est.totalTax).toBeCloseTo(est.federalTax + est.regionalTax + est.selfEmploymentTax, 4);
    expect(est.quarterlyEstimate).toBeCloseTo(est.totalTax / 4, 4);
    expect(est.effectiveRate).toBeGreaterThan(0);
  });

  it("uses CPP instead of US SE tax for Canada", () => {
    const fed = federalSchedule("CA", 2025, "SINGLE")!;
    const est = estimate({
      country: "CA",
      grossIncome: 60_000,
      businessExpenses: 10_000,
      mileageDeduction: 0,
      federalSchedule: fed,
      regionalSchedule: regionalSchedule("CA", "AB", 2025, "SINGLE"),
    });
    // net SE = 50,000 → CPP = 5,533.50 (not the ~7k US SE figure)
    expect(est.selfEmploymentTax).toBeCloseTo(5_533.5, 2);
    expect(est.regionalTax).toBeGreaterThan(0);
  });
});

describe("bundled schedules", () => {
  it("loads CA and US federal schedules", () => {
    expect(federalSchedule("CA", 2025, "SINGLE")?.brackets.length).toBeGreaterThan(0);
    expect(federalSchedule("US", 2025, "MARRIED_JOINT")?.standardDeduction).toBeGreaterThan(0);
  });

  it("bundles all 13 CA provinces/territories and 51 US regions", () => {
    expect(availableRegions("CA", 2025)).toHaveLength(13);
    expect(availableRegions("US", 2025)).toHaveLength(51);
  });

  it("returns null for unknown regions instead of throwing", () => {
    expect(regionalSchedule("CA", "XX", 2025, "SINGLE")).toBeNull();
  });
});

describe("mileage", () => {
  it("US: miles × IRS 2025 rate", () => {
    expect(mileageDeductionFor("US", 10_000)).toBeCloseTo(7_000, 2);
  });

  it("CA: tiered CRA rate — 72¢ first 5,000 km, 66¢ after", () => {
    // 5,000 * 0.72 + 5,000 * 0.66 = 6,900
    expect(mileageDeductionFor("CA", 10_000)).toBeCloseTo(6_900, 2);
  });
});

describe("filing status parser (ported)", () => {
  it("accepts variants and defaults safely", () => {
    expect(parseFilingStatus("MARRIED_JOINT")).toBe("MARRIED_JOINT");
    expect(parseFilingStatus("head_of_household")).toBe("HEAD_OF_HOUSEHOLD");
    expect(parseFilingStatus(null)).toBe("SINGLE");
    expect(parseFilingStatus("nonsense")).toBe("SINGLE");
  });
});
