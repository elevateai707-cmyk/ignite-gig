import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings & CSV Export | Ignite GIG",
  description:
    "Set your country, province or state, and filing status. Export income, expenses, and mileage as CSV for your accountant. Install Ignite GIG as an app.",
  alternates: {
    canonical: "/settings",
  },
  openGraph: {
    title: "Settings & CSV Export | Ignite GIG",
    description:
      "Set your country, province or state, and filing status. Export your records as CSV for your accountant.",
    url: "/settings",
  },
};

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
