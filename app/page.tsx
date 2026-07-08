import type { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: "Ignite GIG — Tax Set-Aside Calculator for Gig Workers (Canada + USA)",
  description:
    "See exactly how much of every gig payout to set aside for taxes, updated in real time as you log income, expenses, and mileage against CRA T2125 or IRS Schedule C. Free, private, works offline.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Ignite GIG — Tax Set-Aside Calculator for Gig Workers",
    description:
      "See exactly how much of every gig payout to set aside for taxes, updated in real time. Canada + USA. Free, private, offline.",
    url: "/",
  },
};

export default function Page() {
  return <HomeClient />;
}
