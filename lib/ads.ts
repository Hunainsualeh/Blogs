import type { AdPlacementId, AdSettings } from "@/types/settings";

export const PUBLISHER_ID_PATTERN = /^ca-pub-\d{10,20}$/;
export const SLOT_ID_PATTERN = /^\d{6,20}$/;

export type AdsRuntime = "live" | "test" | "off";

export function adsRuntime(): AdsRuntime {
  const production = process.env.NODE_ENV === "production" && (!process.env.VERCEL_ENV || process.env.VERCEL_ENV === "production");
  if (production) return "live";
  if (process.env.ADSENSE_ALLOW_TEST === "true") return "test";
  return "off";
}

export function isPublisherIdValid(value: string) {
  return PUBLISHER_ID_PATTERN.test(value.trim());
}

export function isSlotIdValid(value: string) {
  return SLOT_ID_PATTERN.test(value.trim());
}

export function adsAreReady(ads: AdSettings) {
  return ads.enabled && isPublisherIdValid(ads.publisherId) && adsRuntime() !== "off";
}

export function isPathExcluded(ads: AdSettings, pathname: string) {
  return ads.autoAdsExcludedPaths.some((rule) => {
    const normalized = rule.trim();
    if (!normalized) return false;
    if (normalized.endsWith("*")) return pathname.startsWith(normalized.slice(0, -1));
    return pathname === normalized || pathname.startsWith(`${normalized}/`);
  });
}

export function resolvePlacement(ads: AdSettings, id: AdPlacementId) {
  if (!adsAreReady(ads)) return null;
  const placement = ads.placements[id];
  if (!placement?.enabled || !isSlotIdValid(placement.slotId)) return null;
  return { publisherId: ads.publisherId.trim(), slotId: placement.slotId.trim(), format: placement.format, testMode: adsRuntime() === "test" };
}

export function adsScriptConfig(ads: AdSettings) {
  if (!adsAreReady(ads)) return null;
  const hasManual = Object.values(ads.placements).some((placement) => placement.enabled && isSlotIdValid(placement.slotId));
  if (!ads.autoAds && !hasManual) return null;
  return { publisherId: ads.publisherId.trim(), autoAds: ads.autoAds, testMode: adsRuntime() === "test" };
}

export function adsTxtLine(ads: AdSettings) {
  if (!isPublisherIdValid(ads.publisherId)) return null;
  return `google.com, ${ads.publisherId.trim().replace(/^ca-/, "")}, DIRECT, f08c47fec0942fa0`;
}
