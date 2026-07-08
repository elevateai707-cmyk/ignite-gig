import type { NextConfig } from "next";

// Ignite GIG is a local-first PWA: no backend API, no Supabase, no third-party
// scripts or analytics. Fonts are self-hosted at build time via next/font, so
// no external font/script origins are needed. worker-src is required for the
// offline service worker (public/sw.js) and manifest-src for the PWA manifest.
// script-src/style-src need 'unsafe-inline' because the Next.js App Router
// emits inline hydration/RSC payload scripts and Tailwind's inline styles;
// tightening further would require per-request nonces via middleware, which
// is out of scope for the static headers() config used here.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "worker-src 'self'",
  "manifest-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
].join("; ");

const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Content-Security-Policy", value: csp },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      { source: "/(.*)", headers: securityHeaders },
      // The service worker must always be revalidated so app updates ship.
      {
        source: "/sw.js",
        headers: [{ key: "Cache-Control", value: "no-cache, no-store, must-revalidate" }],
      },
    ];
  },
};

export default nextConfig;
