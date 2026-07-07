"use client";

import { useMemo } from "react";
import { estimate, mileageDeductionFor } from "./tax/engine";
import { federalSchedule, regionalSchedule } from "./tax/schedules";
import type { AppData, Profile } from "./store";
import type { TaxEstimate } from "./tax/types";

/** Bundled schedules are for tax year 2025 — the latest published set. */
export const SCHEDULE_YEAR = 2025;

export interface YearTotals {
  grossIncome: number;
  businessExpenses: number;
  distance: number;
  mileageDeduction: number;
  incomeCount: number;
  expenseCount: number;
  tripCount: number;
}

function inYear(date: string, year: number): boolean {
  return date.startsWith(`${year}-`);
}

export function useYearTotals(data: AppData, year: number, profile: Profile | null): YearTotals {
  return useMemo(() => {
    const income = data.income.filter((e) => inYear(e.date, year));
    const expenses = data.expenses.filter((e) => inYear(e.date, year));
    const trips = data.mileage.filter((e) => inYear(e.date, year));
    const distance = trips.reduce((s, e) => s + e.distance, 0);
    return {
      grossIncome: income.reduce((s, e) => s + e.amount, 0),
      businessExpenses: expenses.reduce((s, e) => s + e.amount, 0),
      distance,
      mileageDeduction: profile ? mileageDeductionFor(profile.country, distance) : 0,
      incomeCount: income.length,
      expenseCount: expenses.length,
      tripCount: trips.length,
    };
  }, [data, year, profile]);
}

export function useTaxEstimate(
  totals: YearTotals,
  profile: Profile | null
): TaxEstimate | null {
  return useMemo(() => {
    if (!profile) return null;
    const fed = federalSchedule(profile.country, SCHEDULE_YEAR, profile.filingStatus);
    if (!fed) return null;
    return estimate({
      country: profile.country,
      grossIncome: totals.grossIncome,
      businessExpenses: totals.businessExpenses,
      mileageDeduction: totals.mileageDeduction,
      federalSchedule: fed,
      regionalSchedule: regionalSchedule(
        profile.country,
        profile.region,
        SCHEDULE_YEAR,
        profile.filingStatus
      ),
    });
  }, [totals, profile]);
}
