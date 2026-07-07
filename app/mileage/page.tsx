"use client";

import { useState } from "react";
import AppShell from "@/components/AppShell";
import { EmptyState, EntryRow, Field, inputClass, PageTitle, SubmitButton } from "@/components/ui";
import { money, shortDate, todayIso } from "@/lib/format";
import { useStore } from "@/lib/store";
import {
  CA_KM_RATE_AFTER,
  CA_KM_RATE_FIRST_5000,
  distanceUnit,
  mileageDeductionFor,
  US_MILEAGE_RATE_2025,
} from "@/lib/tax/engine";

export default function MileagePage() {
  const { ready, data, addMileage, remove } = useStore();
  const [date, setDate] = useState(todayIso());
  const [distance, setDistance] = useState("");
  const [purpose, setPurpose] = useState("");

  if (!ready) return null;
  const country = data.profile?.country ?? "CA";
  const unit = distanceUnit(country);
  const rateNote =
    country === "CA"
      ? `CRA simplified rate: $${CA_KM_RATE_FIRST_5000.toFixed(2)}/km first 5,000 km, $${CA_KM_RATE_AFTER.toFixed(2)}/km after`
      : `IRS standard rate: $${US_MILEAGE_RATE_2025.toFixed(2)}/mile`;

  return (
    <AppShell>
      <PageTitle title="Mileage" subtitle="Business trips only — the logbook the auditor asks for." />

      <form
        className="space-y-4 rounded-xl border border-line bg-surface p-4"
        onSubmit={(e) => {
          e.preventDefault();
          const dist = parseFloat(distance);
          if (!Number.isFinite(dist) || dist <= 0) return;
          addMileage({ date, distance: dist, purpose: purpose || "Business trip" });
          setDistance("");
          setPurpose("");
        }}
      >
        <div className="grid grid-cols-2 gap-3">
          <Field label={`Distance (${unit})`}>
            <input
              required
              type="number"
              inputMode="decimal"
              step="0.1"
              min="0.1"
              placeholder="0.0"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Date">
            <input
              required
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>
        <Field label="Purpose">
          <input
            type="text"
            placeholder="e.g. Friday dinner-rush deliveries"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            className={inputClass}
          />
        </Field>
        <SubmitButton>Add trip</SubmitButton>
        <p className="text-center font-mono text-[10px] uppercase tracking-widest text-dim">
          {rateNote}
        </p>
      </form>

      <section className="mt-6" aria-label="Logged trips">
        {data.mileage.length === 0 ? (
          <EmptyState text="No trips yet. Log distance right after you park — future-you forgets." />
        ) : (
          <ul>
            {data.mileage.map((e) => (
              <EntryRow
                key={e.id}
                primary={e.purpose}
                secondary={`${shortDate(e.date)} · ${e.distance.toLocaleString()} ${unit}`}
                amount={money(mileageDeductionFor(country, e.distance), country)}
                onDelete={() => remove("mileage", e.id)}
              />
            ))}
          </ul>
        )}
      </section>
    </AppShell>
  );
}
