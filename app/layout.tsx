import type { Metadata, Viewport } from "next";
import { Barlow, Barlow_Condensed, JetBrains_Mono } from "next/font/google";
import { StoreProvider } from "@/lib/store";
import RegisterSw from "@/components/RegisterSw";
import "./globals.css";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-barlow",
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-barlow-condensed",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-jetbrains",
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://ignite-gig.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: "Ignite GIG — Gig-Worker Tax Tracker (Canada + USA)",
  description:
    "Know exactly how much of every payout to set aside for taxes. Track gig income, expenses, and mileage against CRA T2125 or IRS Schedule C — free, private, works offline. Your data never leaves your device.",
  applicationName: "Ignite GIG",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Ignite GIG",
  },
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/apple-touch-icon.png",
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Ignite GIG — Gig-Worker Tax Tracker",
    description:
      "Track gig income, expenses, and mileage. See your tax set-aside in real time. Canada + USA. Free, private, offline.",
    url: APP_URL,
    siteName: "Ignite GIG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ignite GIG — Gig-Worker Tax Tracker",
    description:
      "Track gig income, expenses, and mileage. See your tax set-aside in real time. Canada + USA. Free, private, offline.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Ignite GIG",
  url: APP_URL,
  description:
    "Track gig income, expenses, and mileage to see how much to set aside for taxes against CRA T2125 or IRS Schedule C — free, private, works offline.",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires a modern browser with JavaScript enabled.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Real-time tax set-aside estimate",
    "Income and payout tracking",
    "Business expense tracking by CRA/IRS category",
    "Mileage tracking with CRA and IRS deduction rates",
    "CSV export for accountants",
    "Offline-capable installable PWA",
    "Canada and USA tax support",
  ],
  isAccessibleForFree: true,
  countriesSupported: ["CA", "US"],
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${barlow.variable} ${barlowCondensed.variable} ${jetbrains.variable} min-h-dvh`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <StoreProvider>{children}</StoreProvider>
        <RegisterSw />
      </body>
    </html>
  );
}
