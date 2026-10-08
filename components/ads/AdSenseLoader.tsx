"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

type AdSenseLoaderProps = {
  publisherId: string;
  autoAds: boolean;
  excludedPaths: string[];
};

function excluded(paths: string[], pathname: string) {
  return paths.some((rule) => {
    if (!rule) return false;
    if (rule.endsWith("*")) return pathname.startsWith(rule.slice(0, -1));
    return pathname === rule || pathname.startsWith(`${rule}/`);
  });
}

export function AdSenseLoader({ publisherId, autoAds, excludedPaths }: AdSenseLoaderProps) {
  const pathname = usePathname();
  const isExcluded = excluded(excludedPaths, pathname);
  const loadedOnce = useRef(false);

  useEffect(() => {
    if (!isExcluded) {
      loadedOnce.current = true;
      return;
    }
    if (loadedOnce.current && autoAds) window.location.reload();
  }, [isExcluded, autoAds]);

  if (isExcluded) return null;
  return (
    <Script
      id="adsense-loader"
      async
      strategy="afterInteractive"
      crossOrigin="anonymous"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`}
    />
  );
}
