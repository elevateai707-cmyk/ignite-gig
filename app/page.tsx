"use client";

import Link from "next/link";
import { useState } from "react";
import { Car, HandCoins, ReceiptText } from "lucide-react";
import AppShell from "@/components/AppShell";
import Onboarding from "@/components/Onboarding";
import { useStore } from "@/lib/store";
import { SCHEDULE_YEAR, useTaxEstimate, useYearTotals } from "@/lib/useEstimate";
import { money, moneyWhole, pct } from "@/lib/format";
import { distanceUnit } from "@/lib/tax/engine";
import { regionName } from "@/lib/tax/regions";
import { TAX_AGENCY } from "@/lib/categories";

export default function Home() {
  const { ready, data } = useStore();
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);

  const totals = useYearTotals(data, year, data.profile);
  const est = useTaxEstimate(totals, data.profile);

  if (!ready) return null;

  if (!data.profile) {
    return (
      <div className="mx-auto min-h-dvh w-full max-w-md px-5">
        <Onboarding />
      </div>
    );
  }

  const profile = data.profile;
  const unit = distanceUnit(profile.country);
  const seLabel = profile.country === "CA" ? "CPP (self-employed)" : "Self-employment tax";
  const regionalLabel = profile.country === "CA" ? "Provincial tax" : "State tax";
  const hasEntries = totals.incomeCount + totals.expenseCount + totals.tripCount > 0;
  const years = Array.from(
    new Set([
      currentYear,
      ...data.income.map((e) => Number(e.date.slice(0, 4))),
      ...data.expenses.map((e) => Number(e.date.slice(0, 4))),
      ...data.mileage.map((e) => Number(e.date.slice(0, 4))),
    ])
  ).sort((a, b) => b - a);

  return (
    <AppShell>
      <div className="mt-2 flex items-center justify-between">
        <p className="font-mono text-[11px] font-medium uppercase tracking-widest text-dim">
          {regionName(profile.country, profile.region)}
        </p>
        <select
          aria-label="Tax year"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="rounded border border-line bg-card px-2 py-1 font-mono text-[11px] uppercase tracking-widest text-body"
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {/* The one number the app exists for. */}
      <section className="mt-6 text-center" aria-label="Tax set-aside">
        <p className="font-mono text-[11px] font-medium uppercase tracking-widest text-volt">
          Set this aside for taxes
        </p>
        <p className="mt-2 font-mono text-6xl font-bold tabular tracking-tight">
          {est ? moneyWhole(est.totalTax, profile.country) : "—"}
        </p>
        <p className="mt-2 text-xs text-dim">
          {est && est.grossIncome > 0
            ? `${pct(est.effectiveRate)} of your ${money(est.grossIncome, profile.country)} gross so far`
            : "Log your first payout to see your number."}
        </p>
      </section>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-line bg-card p-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-dim">Per quarter</p>
          <p className="mt-1 font-mono text-xl font-medium tabular">
            {est ? moneyWhole(est.quarterlyEstimate, profile.country) : "—"}
          </p>
        </div>
        <div className="rounded-xl border border-line bg-card p-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-dim">
            Deductions found
          </p>
          <p className="mt-1 font-mono text-xl font-medium tabular text-volt">
            {est
              ? moneyWhole(totals.businessExpenses + totals.mileageDeduction, profile.country)
              : "—"}
          </p>
        </div>
      </div>

      {/* Receipt-style breakdown — the signature. */}
      {est && hasEntries && (
        <section className="mt-6" aria-label="Estimate breakdown">
          <div className="receipt rounded-t-xl px-5 pb-2 pt-4 font-mono text-[13px]">
            <p className="pb-2 text-center text-[11px] font-bold uppercase tracking-widest text-body">
              ✳ Ignite GIG · {year} estimate ✳
            </p>
            <div className="receipt-rule" />
            <div className="receipt-row">
              <span className="text-body">Gross income</span>
              <span className="tabular">{money(totals.grossIncome, profile.country)}</span>
            </div>
            <div className="receipt-row">
              <span className="text-body">Expenses ({totals.expenseCount})</span>
              <span className="tabular">−{money(totals.businessExpenses, profile.country)}</span>
            </div>
            <div className="receipt-row">
              <span className="text-body">
                Mileage · {totals.distance.toLocaleString()} {unit}
              </span>
              <span className="tabular">−{money(totals.mileageDeduction, profile.country)}</span>
            </div>
            <div className="receipt-row">
              <span className="text-body">
                {profile.country === "CA" ? "Basic personal amount" : "Standard deduction"}
              </span>
              <span className="tabular">
                −{money(est.deductions - totals.businessExpenses - totals.mileageDeduction, profile.country)}
              </span>
            </div>
            <div className="receipt-rule" />
            <div className="receipt-row">
              <span className="text-body">Taxable income</span>
              <span className="tabular">{money(est.taxableIncome, profile.country)}</span>
            </div>
            <div className="receipt-row">
              <span className="text-body">Federal tax</span>
              <span className="tabular">{money(est.federalTax, profile.country)}</span>
            </div>
            <div className="receipt-row">
              <span className="text-body">{regionalLabel}</span>
              <span className="tabular">{money(est.regionalTax, profile.country)}</span>
            </div>
            <div className="receipt-row">
              <span className="text-body">{seLabel}</span>
              <span className="tabular">{money(est.selfEmploymentTax, profile.country)}</span>
            </div>
            <div className="receipt-rule" />
            <div className="receipt-row text-sm font-bold">
              <span>Total set-aside</span>
              <span className="tabular text-volt">{money(est.totalTax, profile.country)}</span>
            </div>
            <p className="pb-1 pt-2 text-center text-[10px] uppercase tracking-widest text-dim">
              {TAX_AGENCY[profile.country]} {SCHEDULE_YEAR} rates · estimate only — not tax advice
            </p>
          </div>
          <div className="receipt-tear" />
        </section>
      )}

      <section className="mt-8" aria-label="Quick add">
        <p className="mb-3 font-mono text-[11px] font-medium uppercase tracking-widest text-dim">
          Log it now, thank yourself in April
        </p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { href: "/income", label: "Payout", icon: HandCoins },
            { href: "/expenses", label: "Expense", icon: ReceiptText },
            { href: "/mileage", label: "Trip", icon: Car },
          ].map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-2 rounded-xl border border-line bg-card py-4 transition-colors hover:border-volt-dim"
            >
              <Icon className="h-5 w-5 text-volt" aria-hidden strokeWidth={1.8} />
              <span className="font-display text-sm font-bold uppercase tracking-wide">
                + {label}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
