import { adsScriptConfig } from "@/lib/ads";
import { getSettings } from "@/lib/blog";
import { PrivacyChoicesButton } from "./PrivacyChoicesButton";

export async function AdChoices({ className }: { className?: string }) {
  const settings = await getSettings();
  if (!adsScriptConfig(settings.ads)) return null;
  return <PrivacyChoicesButton className={className} />;
}
