import { requireAdminPage } from "@/lib/admin-auth";
import { loadAllArticles, loadSettings } from "@/lib/content-store";
import { storageMode } from "@/lib/storage";
import { SiteSettingsForm } from "@/components/admin/SiteSettingsForm";

export default async function AdminSettingsPage() {
  await requireAdminPage();
  const [settings, articles] = await Promise.all([loadSettings(), loadAllArticles()]);
  return (
    <div>
      <h1 className="text-[28px] font-semibold tracking-[-0.03em] text-ink">Settings</h1>
      <SiteSettingsForm
        showSampleContent={settings.showSampleContent}
        contactEmail={settings.contactEmail}
        contributorEmail={settings.contributorEmail}
        sampleCount={articles.filter((article) => article.source === "sample").length}
        storage={storageMode === "kv" ? "Upstash Redis" : "Local files"}
      />
    </div>
  );
}
