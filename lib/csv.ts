import type { ExpenseEntry, IncomeEntry, MileageEntry } from "./store";

/** CSV export — same column style as the Android app's CsvExporter.kt. */

function esc(v: string | number): string {
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function toCsv(header: string[], rows: (string | number)[][]): string {
  return [header, ...rows].map((r) => r.map(esc).join(",")).join("\n") + "\n";
}

export function incomeCsv(entries: IncomeEntry[]): string {
  return toCsv(
    ["id", "date", "amount", "source", "notes"],
    entries.map((e) => [e.id, e.date, e.amount, e.source, e.notes])
  );
}

export function expensesCsv(entries: ExpenseEntry[]): string {
  return toCsv(
    ["id", "date", "merchant", "amount", "category", "notes"],
    entries.map((e) => [e.id, e.date, e.merchant, e.amount, e.category, e.notes])
  );
}

export function mileageCsv(entries: MileageEntry[], unit: "km" | "mi"): string {
  return toCsv(
    ["id", "date", `distance_${unit}`, "purpose"],
    entries.map((e) => [e.id, e.date, e.distance, e.purpose])
  );
}

export function downloadCsv(filename: string, csv: string): void {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
