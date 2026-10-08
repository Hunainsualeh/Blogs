import type { AdPlacementId } from "@/types/settings";
import { resolvePlacement } from "@/lib/ads";
import { getSettings } from "@/lib/blog";
import { AdUnit } from "./AdUnit";

export async function AdSlot({ placement, className }: { placement: AdPlacementId; className?: string }) {
  const settings = await getSettings();
  const resolved = resolvePlacement(settings.ads, placement);
  if (!resolved) return null;
  return <AdUnit {...resolved} placement={placement} className={className} />;
}
