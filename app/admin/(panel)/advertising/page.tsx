import { requireAdminPage } from "@/lib/admin-auth";
import { adsRuntime, adsScriptConfig, adsTxtLine } from "@/lib/ads";
import { loadSettings } from "@/lib/content-store";
import { AdSettingsForm } from "@/components/admin/AdSettingsForm";

export default async function AdvertisingPage() {
  await requireAdminPage();
  const settings = await loadSettings();
  return (
    <div>
      <h1 className="text-[28px] font-semibold tracking-[-0.03em] text-ink">Advertising</h1>
      <p className="mt-2 max-w-2xl text-sm text-ink-muted">Control Google AdSense and where ad units may appear. Nothing is shown until you enable advertising, add your publisher ID and give a placement a slot ID.</p>
      <AdSettingsForm initial={settings.ads} status={{ runtime: adsRuntime(), scriptActive: Boolean(adsScriptConfig(settings.ads)), adsTxt: adsTxtLine(settings.ads) }} />
    </div>
  );
}
