import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mileage Log for Gig Drivers — CRA & IRS Rates | Ignite GIG",
  description:
    "Track business trips and calculate your mileage deduction automatically using CRA simplified rates or the IRS standard mileage rate.",
  alternates: {
    canonical: "/mileage",
  },
  openGraph: {
    title: "Mileage Log for Gig Drivers — CRA & IRS Rates | Ignite GIG",
    description:
      "Track business trips and calculate your mileage deduction automatically using CRA or IRS rates.",
    url: "/mileage",
  },
};

export default function MileageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
