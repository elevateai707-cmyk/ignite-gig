"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Country, FilingStatus } from "./tax/types";

/**
 * Local-first persistence. Everything lives in localStorage under one
 * versioned key — no accounts, no server, data never leaves the device.
 */

const STORAGE_KEY = "ignitegig.v1";

export interface Profile {
  country: Country;
  region: string;
  filingStatus: FilingStatus;
}

export interface IncomeEntry {
  id: string;
  date: string; // ISO yyyy-mm-dd
  amount: number;
  source: string;
  notes: string;
}

export interface ExpenseEntry {
  id: string;
  date: string;
  amount: number;
  category: string;
  merchant: string;
  notes: string;
}

export interface MileageEntry {
  id: string;
  date: string;
  distance: number;
  purpose: string;
}

export interface AppData {
  profile: Profile | null;
  income: IncomeEntry[];
  expenses: ExpenseEntry[];
  mileage: MileageEntry[];
}

const EMPTY: AppData = { profile: null, income: [], expenses: [], mileage: [] };

function load(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<AppData>;
    return {
      profile: parsed.profile ?? null,
      income: parsed.income ?? [],
      expenses: parsed.expenses ?? [],
      mileage: parsed.mileage ?? [],
    };
  } catch {
    return EMPTY;
  }
}

interface StoreValue {
  ready: boolean;
  data: AppData;
  setProfile: (p: Profile) => void;
  addIncome: (e: Omit<IncomeEntry, "id">) => void;
  addExpense: (e: Omit<ExpenseEntry, "id">) => void;
  addMileage: (e: Omit<MileageEntry, "id">) => void;
  remove: (kind: "income" | "expenses" | "mileage", id: string) => void;
  resetAll: () => void;
}

const StoreContext = createContext<StoreValue | null>(null);

function newId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [data, setData] = useState<AppData>(EMPTY);

  useEffect(() => {
    // localStorage is only readable after mount; the first client render
    // must match the server HTML, so hydrate here rather than in useState.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setData(load());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Storage full or blocked — the in-memory session still works.
    }
  }, [data, ready]);

  const setProfile = useCallback((profile: Profile) => {
    setData((d) => ({ ...d, profile }));
  }, []);

  const addIncome = useCallback((e: Omit<IncomeEntry, "id">) => {
    setData((d) => ({ ...d, income: [{ ...e, id: newId() }, ...d.income] }));
  }, []);

  const addExpense = useCallback((e: Omit<ExpenseEntry, "id">) => {
    setData((d) => ({ ...d, expenses: [{ ...e, id: newId() }, ...d.expenses] }));
  }, []);

  const addMileage = useCallback((e: Omit<MileageEntry, "id">) => {
    setData((d) => ({ ...d, mileage: [{ ...e, id: newId() }, ...d.mileage] }));
  }, []);

  const remove = useCallback((kind: "income" | "expenses" | "mileage", id: string) => {
    setData((d) => ({ ...d, [kind]: d[kind].filter((e) => e.id !== id) }));
  }, []);

  const resetAll = useCallback(() => {
    setData(EMPTY);
  }, []);

  const value = useMemo(
    () => ({ ready, data, setProfile, addIncome, addExpense, addMileage, remove, resetAll }),
    [ready, data, setProfile, addIncome, addExpense, addMileage, remove, resetAll]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}
