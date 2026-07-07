"use client";

import { Trash2 } from "lucide-react";
import type { ReactNode } from "react";

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-[11px] font-medium uppercase tracking-widest text-dim">
        {label}
      </span>
      {children}
    </label>
  );
}

export const inputClass =
  "w-full rounded-lg border border-line bg-card px-3.5 py-3 text-base text-paper placeholder:text-dim focus:border-volt-dim";

export function SubmitButton({ children }: { children: ReactNode }) {
  return (
    <button
      type="submit"
      className="w-full rounded-lg bg-volt py-3.5 font-display text-lg font-bold uppercase tracking-wide text-ink transition-colors hover:bg-volt-dim"
    >
      {children}
    </button>
  );
}

export function PageTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-5 mt-2">
      <h1 className="font-display text-3xl font-bold uppercase tracking-wide">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-body">{subtitle}</p>}
    </div>
  );
}

export function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-dashed border-edge p-8 text-center text-sm text-dim">
      {text}
    </div>
  );
}

export function EntryRow({
  primary,
  secondary,
  amount,
  onDelete,
}: {
  primary: string;
  secondary: string;
  amount: string;
  onDelete: () => void;
}) {
  return (
    <li className="flex items-center gap-3 border-b border-line py-3 last:border-0">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-paper">{primary}</p>
        <p className="truncate text-xs text-dim">{secondary}</p>
      </div>
      <span className="font-mono text-sm font-medium tabular">{amount}</span>
      <button
        type="button"
        onClick={onDelete}
        aria-label={`Delete ${primary}`}
        className="rounded p-1.5 text-dim transition-colors hover:text-danger"
      >
        <Trash2 className="h-4 w-4" aria-hidden />
      </button>
    </li>
  );
}
