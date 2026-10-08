import { adsScriptConfig } from "@/lib/ads";
import { getSettings } from "@/lib/blog";
import { AdSenseLoader } from "./AdSenseLoader";

export async function AdSenseScript() {
  const settings = await getSettings();
  const config = adsScriptConfig(settings.ads);
  if (!config) return null;
  return <AdSenseLoader publisherId={config.publisherId} autoAds={config.autoAds} excludedPaths={settings.ads.autoAdsExcludedPaths} />;
}
