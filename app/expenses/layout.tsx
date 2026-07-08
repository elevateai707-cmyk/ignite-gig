import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Track Business Expenses for CRA T2125 / IRS Schedule C | Ignite GIG",
  description:
    "Log gig-work expenses by category, matched to CRA T2125 or IRS Schedule C lines, so your deductions are ready when you file.",
  alternates: {
    canonical: "/expenses",
  },
  openGraph: {
    title: "Track Business Expenses for CRA T2125 / IRS Schedule C | Ignite GIG",
    description:
      "Log gig-work expenses by category, matched to CRA T2125 or IRS Schedule C lines.",
    url: "/expenses",
  },
};

export default function ExpensesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
