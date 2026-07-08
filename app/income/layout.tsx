import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log Gig Income & Payouts | Ignite GIG",
  description:
    "Track every gig payout — Uber, DoorDash, Instacart, and more — the day it lands, so your real-time tax set-aside estimate stays accurate all year.",
  alternates: {
    canonical: "/income",
  },
  openGraph: {
    title: "Log Gig Income & Payouts | Ignite GIG",
    description:
      "Track every gig payout the day it lands, so your tax set-aside estimate stays accurate all year.",
    url: "/income",
  },
};

export default function IncomeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
