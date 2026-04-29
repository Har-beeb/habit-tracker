"use client";

import { useEffect } from "react";

export function ServiceWorkerRegister() {
  useEffect(() => {
    // This runs safely in the background only on the client side
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch((err) => {
        console.error("Service Worker registration failed:", err);
      });
    }
  }, []);

  // Return null so Next.js doesn't complain about illegal <script> tags!
  return null;
}
