"use client";

import { useEffect, useRef } from "react";
import type { AdFormat } from "@/types/settings";
import { cn } from "@/lib/utils";

type AdUnitProps = {
  publisherId: string;
  slotId: string;
  format: AdFormat;
  testMode: boolean;
  placement: string;
  className?: string;
};

export function AdUnit({ publisherId, slotId, format, testMode, placement, className }: AdUnitProps) {
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    pushed.current = true;
    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch {
      pushed.current = false;
    }
  }, []);

  return (
    <aside className={cn("ad-slot", className)} data-format={format} data-placement={placement} aria-label="Advertisement">
      <p className="ad-label">Advertisement</p>
      <div className="ad-box">
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={publisherId}
          data-ad-slot={slotId}
          data-ad-format={format === "auto" ? "auto" : format}
          data-full-width-responsive="true"
          {...(testMode ? { "data-adtest": "on" } : {})}
        />
      </div>
    </aside>
  );
}
