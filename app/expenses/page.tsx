"use client";

import { useState } from "react";
import AppShell from "@/components/AppShell";
import { EmptyState, EntryRow, Field, inputClass, PageTitle, SubmitButton } from "@/components/ui";
import { EXPENSE_CATEGORIES, TAX_FORM } from "@/lib/categories";
import { money, shortDate, todayIso } from "@/lib/format";
import { useStore } from "@/lib/store";

export default function ExpensesPage() {
  const { ready, data, addExpense, remove } = useStore();
  const country = data.profile?.country ?? "CA";
  const categories = EXPENSE_CATEGORIES[country];

  const [date, setDate] = useState(todayIso());
  const [amount, setAmount] = useState("");
  const [merchant, setMerchant] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [notes, setNotes] = useState("");

  if (!ready) return null;

  return (
    <AppShell>
      <PageTitle
        title="Expenses"
        subtitle={`Categorized to ${TAX_FORM[country]} lines, so records match the form.`}
      />

      <form
        className="space-y-4 rounded-xl border border-line bg-surface p-4"
        onSubmit={(e) => {
          e.preventDefault();
          const amt = parseFloat(amount);
          if (!Number.isFinite(amt) || amt <= 0) return;
          addExpense({ date, amount: amt, merchant: merchant || "Unknown", category, notes });
          setAmount("");
          setMerchant("");
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
        <Field label="Merchant">
          <input
            type="text"
            placeholder="e.g. Canadian Tire"
            value={merchant}
            onChange={(e) => setMerchant(e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Category">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={inputClass}
          >
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </Field>
        <Field label="Notes (optional)">
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className={inputClass}
          />
        </Field>
        <SubmitButton>Add expense</SubmitButton>
      </form>

      <section className="mt-6" aria-label="Logged expenses">
        {data.expenses.length === 0 ? (
          <EmptyState text="No expenses yet. That coffee on a delivery run? Probably not. The phone mount? Definitely." />
        ) : (
          <ul>
            {data.expenses.map((e) => (
              <EntryRow
                key={e.id}
                primary={e.merchant}
                secondary={`${shortDate(e.date)} · ${e.category}`}
                amount={money(e.amount, country)}
                onDelete={() => remove("expenses", e.id)}
              />
            ))}
          </ul>
        )}
      </section>
    </AppShell>
  );
}
