"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { availableRegions } from "@/lib/tax/schedules";
import { regionName } from "@/lib/tax/regions";
import { SCHEDULE_YEAR } from "@/lib/useEstimate";
import { TAX_AGENCY, TAX_FORM } from "@/lib/categories";
import { useStore } from "@/lib/store";
import type { Country, FilingStatus } from "@/lib/tax/types";
import { Field, inputClass, SubmitButton } from "@/components/ui";

const FILING_OPTIONS: { value: FilingStatus; label: string }[] = [
  { value: "SINGLE", label: "Single" },
  { value: "MARRIED_JOINT", label: "Married filing jointly" },
  { value: "MARRIED_SEPARATE", label: "Married filing separately" },
  { value: "HEAD_OF_HOUSEHOLD", label: "Head of household" },
];

export default function Onboarding() {
  const { setProfile } = useStore();
  const [country, setCountry] = useState<Country | null>(null);
  const [region, setRegion] = useState("");
  const [filing, setFiling] = useState<FilingStatus>("SINGLE");

  if (!country) {
    return (
      <div className="flex min-h-[70dvh] flex-col justify-center">
        <p className="font-mono text-[11px] font-medium uppercase tracking-widest text-volt">
          Free · Private · Works offline
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold uppercase leading-tight tracking-wide">
          Know what to set aside. Every payout.
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-body">
          Track gig income, expenses, and mileage — and see your tax set-aside in real time.
          Everything stays on this device.
        </p>
        <p className="mt-8 font-mono text-[11px] font-medium uppercase tracking-widest text-dim">
          Where do you pay taxes?
        </p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {(
            [
              { c: "CA" as Country, flag: "🇨🇦", name: "Canada", form: "CRA · T2125" },
              { c: "US" as Country, flag: "🇺🇸", name: "USA", form: "IRS · Schedule C" },
            ]
          ).map(({ c, flag, name, form }) => (
            <button
              key={c}
              type="button"
              onClick={() => setCountry(c)}
              className="rounded-xl border border-line bg-card p-5 text-left transition-colors hover:border-volt-dim"
            >
              <span className="text-3xl">{flag}</span>
              <span className="mt-2 block font-display text-xl font-bold uppercase tracking-wide">
                {name}
              </span>
              <span className="mt-1 block font-mono text-[11px] uppercase tracking-widest text-dim">
                {form}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const regions = availableRegions(country, SCHEDULE_YEAR);

  return (
    <form
      className="flex min-h-[70dvh] flex-col justify-center gap-5"
      onSubmit={(e) => {
        e.preventDefault();
        if (!region) return;
        setProfile({ country, region, filingStatus: country === "US" ? filing : "SINGLE" });
      }}
    >
      <div>
        <button
          type="button"
          onClick={() => setCountry(null)}
          className="font-mono text-[11px] uppercase tracking-widest text-dim hover:text-body"
        >
          ← {country === "CA" ? "Canada" : "USA"}
        </button>
        <h1 className="mt-2 font-display text-3xl font-bold uppercase tracking-wide">
          Your {country === "CA" ? "province" : "state"}
        </h1>
        <p className="mt-1 text-sm text-body">
          Sets the {country === "CA" ? "provincial" : "state"} rates on top of{" "}
          {TAX_AGENCY[country]} federal brackets ({TAX_FORM[country]}).
        </p>
      </div>

      <Field label={country === "CA" ? "Province / territory" : "State"}>
        <select
          required
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className={inputClass}
        >
          <option value="" disabled>
            Choose…
          </option>
          {regions.map((r) => (
            <option key={r} value={r}>
              {regionName(country, r)}
            </option>
          ))}
        </select>
      </Field>

      {country === "US" && (
        <Field label="Filing status">
          <select
            value={filing}
            onChange={(e) => setFiling(e.target.value as FilingStatus)}
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

      <SubmitButton>
        Start tracking <ArrowRight className="mb-0.5 inline h-4 w-4" aria-hidden />
      </SubmitButton>
    </form>
  );
}
