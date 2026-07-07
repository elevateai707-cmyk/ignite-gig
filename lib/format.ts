import type { Country } from "./tax/types";

const FMT: Record<Country, Intl.NumberFormat> = {
  CA: new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }),
  US: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }),
};

const FMT_WHOLE: Record<Country, Intl.NumberFormat> = {
  CA: new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }),
  US: new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }),
};

export function money(amount: number, country: Country): string {
  return FMT[country].format(amount);
}

export function moneyWhole(amount: number, country: Country): string {
  return FMT_WHOLE[country].format(amount);
}

export function pct(rate: number): string {
  return `${(rate * 100).toFixed(1)}%`;
}

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function shortDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString("en-CA", { month: "short", day: "numeric" });
}
