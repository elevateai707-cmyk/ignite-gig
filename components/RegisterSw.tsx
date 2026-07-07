"use client";

import { useEffect } from "react";

/** Registers the offline service worker once the page is interactive. */
export default function RegisterSw() {
  useEffect(() => {
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Offline support is progressive — the app works without it.
      });
    }
  }, []);
  return null;
}
