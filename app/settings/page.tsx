"use client";

import { useState } from "react";
import { Download, Share, SquarePlus } from "lucide-react";
import AppShell from "@/components/AppShell";
import { Field, inputClass, PageTitle } from "@/components/ui";
import { downloadCsv, expensesCsv, incomeCsv, mileageCsv } from "@/lib/csv";
import { useStore } from "@/lib/store";
import { distanceUnit } from "@/lib/tax/engine";
import { regionName } from "@/lib/tax/regions";
import { availableRegions } from "@/lib/tax/schedules";
import { SCHEDULE_YEAR } from "@/lib/useEstimate";
import type { Country, FilingStatus } from "@/lib/tax/types";

const FILING_OPTIONS: { value: FilingStatus; label: string }[] = [
  { value: "SINGLE", label: "Single" },
  { value: "MARRIED_JOINT", label: "Married filing jointly" },
  { value: "MARRIED_SEPARATE", label: "Married filing separately" },
  { value: "HEAD_OF_HOUSEHOLD", label: "Head of household" },
];

export default function SettingsPage() {
  const { ready, data, setProfile, resetAll } = useStore();
  const [confirmReset, setConfirmReset] = useState(false);

  if (!ready || !data.profile) {
    return (
      <AppShell>
        <PageTitle title="Settings" subtitle="Finish onboarding on the dashboard first." />
      </AppShell>
    );
  }

  const profile = data.profile;
  const regions = availableRegions(profile.country, SCHEDULE_YEAR);
  const unit = distanceUnit(profile.country);

  const setCountry = (country: Country) => {
    if (country === profile.country) return;
    const first = availableRegions(country, SCHEDULE_YEAR)[0] ?? "";
    setProfile({ country, region: first, filingStatus: "SINGLE" });
  };

  return (
    <AppShell>
      <PageTitle title="Settings" />

      <section className="space-y-4 rounded-xl border border-line bg-surface p-4">
        <div role="group" aria-label="Country">
          <span className="mb-1.5 block font-mono text-[11px] font-medium uppercase tracking-widest text-dim">
            Country
          </span>
          <div className="grid grid-cols-2 gap-3">
            {(["CA", "US"] as Country[]).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCountry(c)}
                aria-pressed={profile.country === c}
                className={`rounded-lg border py-3 font-display text-base font-bold uppercase tracking-wide transition-colors ${
                  profile.country === c
                    ? "border-volt bg-volt text-ink"
                    : "border-line bg-card text-body hover:border-volt-dim"
                }`}
              >
                {c === "CA" ? "🇨🇦 Canada" : "🇺🇸 USA"}
              </button>
            ))}
          </div>
        </div>

        <Field label={profile.country === "CA" ? "Province / territory" : "State"}>
          <select
            value={profile.region}
            onChange={(e) => setProfile({ ...profile, region: e.target.value })}
            className={inputClass}
          >
            {regions.map((r) => (
              <option key={r} value={r}>
                {regionName(profile.country, r)}
              </option>
            ))}
          </select>
        </Field>

        {profile.country === "US" && (
          <Field label="Filing status">
            <select
              value={profile.filingStatus}
              onChange={(e) => setProfile({ ...profile, filingStatus: e.target.value as FilingStatus })}
              className={inputClass}
            >
              {FILING_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>
        )}
      </section>

      <section className="mt-6" aria-label="Export">
        <p className="mb-3 font-mono text-[11px] font-medium uppercase tracking-widest text-dim">
          Export — hand your accountant a file, not a shoebox
        </p>
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              label: "Income",
              count: data.income.length,
              onClick: () => downloadCsv("ignitegig-income.csv", incomeCsv(data.income)),
            },
            {
              label: "Expenses",
              count: data.expenses.length,
              onClick: () => downloadCsv("ignitegig-expenses.csv", expensesCsv(data.expenses)),
            },
            {
              label: "Mileage",
              count: data.mileage.length,
              onClick: () => downloadCsv("ignitegig-mileage.csv", mileageCsv(data.mileage, unit)),
            },
          ].map(({ label, count, onClick }) => (
            <button
              key={label}
              type="button"
              onClick={onClick}
              disabled={count === 0}
              className="flex flex-col items-center gap-1.5 rounded-xl border border-line bg-card py-4 transition-colors hover:border-volt-dim disabled:opacity-40"
            >
              <Download className="h-4 w-4 text-volt" aria-hidden />
              <span className="font-display text-sm font-bold uppercase">{label}</span>
              <span className="font-mono text-[10px] text-dim">{count} rows</span>
            </button>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-line bg-card p-4" aria-label="Install">
        <p className="font-mono text-[11px] font-medium uppercase tracking-widest text-volt">
          Put it on your phone
        </p>
        <ul className="mt-3 space-y-2 text-sm text-body">
          <li className="flex items-start gap-2">
            <Share className="mt-0.5 h-4 w-4 shrink-0 text-dim" aria-hidden />
            <span>
              <strong className="text-paper">iPhone:</strong> open in Safari → Share →{" "}
              <strong className="text-paper">Add to Home Screen</strong>. Runs full-screen and
              offline, like any app.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <SquarePlus className="mt-0.5 h-4 w-4 shrink-0 text-dim" aria-hidden />
            <span>
              <strong className="text-paper">Android:</strong> Chrome menu →{" "}
              <strong className="text-paper">Add to Home screen</strong> (or the install prompt).
            </span>
          </li>
        </ul>
      </section>

      <section className="mt-6" aria-label="Data">
        {confirmReset ? (
          <div className="rounded-xl border border-danger/40 bg-card p-4">
            <p className="text-sm text-body">
              Delete all entries and your profile from this device? There is no undo — export your
              CSVs first.
            </p>
            <div className="mt-3 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  resetAll();
                  setConfirmReset(false);
                }}
                className="flex-1 rounded-lg bg-danger py-2.5 font-display text-sm font-bold uppercase tracking-wide text-ink"
              >
                Delete everything
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="flex-1 rounded-lg border border-line py-2.5 font-display text-sm font-bold uppercase tracking-wide text-body"
              >
                Keep my data
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            className="w-full rounded-xl border border-line py-3 font-mono text-[11px] uppercase tracking-widest text-dim transition-colors hover:border-danger/50 hover:text-danger"
          >
            Erase all data on this device
          </button>
        )}
      </section>

      <footer className="mt-8 space-y-2 text-center">
        <p className="text-[11px] leading-relaxed text-dim">
          All data stays in this browser — nothing is uploaded, ever. Estimates use {SCHEDULE_YEAR}{" "}
          rates and are not a substitute for a licensed tax professional.
        </p>
        <p className="font-mono text-[10px] uppercase tracking-widest text-dim">
          Ignite GIG · a{" "}
          <a
            href="https://buildwithdb.ca"
            className="text-volt-dim underline-offset-2 hover:underline"
          >
            Build With DB
          </a>{" "}
          project
        </p>
      </footer>
    </AppShell>
  );
}
