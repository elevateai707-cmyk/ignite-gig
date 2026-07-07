"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Car, Gauge, HandCoins, ReceiptText, Settings } from "lucide-react";
import { useStore } from "@/lib/store";

const TABS = [
  { href: "/", label: "Dashboard", icon: Gauge },
  { href: "/income", label: "Income", icon: HandCoins },
  { href: "/expenses", label: "Expenses", icon: ReceiptText },
  { href: "/mileage", label: "Mileage", icon: Car },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data } = useStore();
  const country = data.profile?.country;

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col md:my-6 md:min-h-[calc(100dvh-3rem)] md:rounded-2xl md:border md:border-line md:bg-surface/40">
      <header className="flex items-center justify-between px-5 pb-3 pt-5">
        <Link href="/" className="font-display text-2xl font-bold uppercase tracking-wide">
          Ignite<span className="text-volt">GIG</span>
        </Link>
        {country && (
          <span className="rounded-full border border-line px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-widest text-dim">
            {country === "CA" ? "🇨🇦 Canada" : "🇺🇸 USA"}
          </span>
        )}
      </header>

      <main className="flex-1 px-5 pb-28">{children}</main>

      <nav
        aria-label="Main"
        className="fixed inset-x-0 bottom-0 z-10 mx-auto w-full max-w-md border-t border-line bg-ink/95 backdrop-blur md:rounded-b-2xl"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <ul className="flex">
          {TABS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <li key={href} className="flex-1">
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`flex flex-col items-center gap-1 py-3 text-[10px] font-medium uppercase tracking-widest transition-colors ${
                    active ? "text-volt" : "text-dim hover:text-body"
                  }`}
                >
                  <Icon className="h-5 w-5" aria-hidden strokeWidth={active ? 2.2 : 1.6} />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
