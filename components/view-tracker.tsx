"use client";

import { useEffect } from "react";

export function ViewTracker({ path }: { path: string }) {
  useEffect(() => {
    const key = `viewed:${path}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      // Continue without session storage.
    }

    const controller = new AbortController();
    fetch("/api/track", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ path, referrer: document.referrer || null }),
      signal: controller.signal,
      keepalive: true,
    }).catch(() => {});

    return () => controller.abort();
  }, [path]);

  return null;
}
