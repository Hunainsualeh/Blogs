"use client";

import { useEffect } from "react";

export function ViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    if (navigator.webdriver) return;
    const key = `gid:viewed:${slug}`;
    try {
      if (window.sessionStorage.getItem(key)) return;
      window.sessionStorage.setItem(key, "1");
    } catch {
      return;
    }
    const body = JSON.stringify({ slug });
    if (!navigator.sendBeacon?.("/api/views", new Blob([body], { type: "application/json" }))) {
      fetch("/api/views", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true }).catch(() => undefined);
    }
  }, [slug]);
  return null;
}
