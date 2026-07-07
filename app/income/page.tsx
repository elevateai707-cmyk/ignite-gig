"use client";

import { useState } from "react";
import AppShell from "@/components/AppShell";
import { EmptyState, EntryRow, Field, inputClass, PageTitle, SubmitButton } from "@/components/ui";
import { INCOME_SOURCES } from "@/lib/categories";
import { money, shortDate, todayIso } from "@/lib/format";
import { useStore } from "@/lib/store";

export default function IncomePage() {
  const { ready, data, addIncome, remove } = useStore();
  const [date, setDate] = useState(todayIso());
  const [amount, setAmount] = useState("");
  const [source, setSource] = useState(INCOME_SOURCES[0]);
  const [notes, setNotes] = useState("");

  if (!ready) return null;
  const country = data.profile?.country ?? "CA";

  return (
    <AppShell>
      <PageTitle title="Income" subtitle="Every payout, the day it lands." />

      <form
        className="space-y-4 rounded-xl border border-line bg-surface p-4"
        onSubmit={(e) => {
          e.preventDefault();
          const amt = parseFloat(amount);
          if (!Number.isFinite(amt) || amt <= 0) return;
          addIncome({ date, amount: amt, source, notes });
          setAmount("");
          setNotes("");
        }}
      >
        <div className="grid grid-cols-2 gap-3">
          <Field label="Amount">
            <input
              required
              type="number"
              inputMode="decimal"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
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
        <Field label="Source">
          <select value={source} onChange={(e) => setSource(e.target.value)} className={inputClass}>
            {INCOME_SOURCES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </Field>
        <Field label="Notes (optional)">
          <input
            type="text"
            placeholder="e.g. Uber weekly payout"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className={inputClass}
          />
        </Field>
        <SubmitButton>Add payout</SubmitButton>
      </form>

      <section className="mt-6" aria-label="Logged income">
        {data.income.length === 0 ? (
          <EmptyState text="No payouts yet. Log the next one the day it hits your account." />
        ) : (
          <ul>
            {data.income.map((e) => (
              <EntryRow
                key={e.id}
                primary={e.source}
                secondary={`${shortDate(e.date)}${e.notes ? ` · ${e.notes}` : ""}`}
                amount={money(e.amount, country)}
                onDelete={() => remove("income", e.id)}
              />
            ))}
          </ul>
        )}
      </section>
    </AppShell>
  );
}
