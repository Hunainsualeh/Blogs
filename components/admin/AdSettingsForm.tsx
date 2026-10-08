"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { AdPlacementId, AdSettings } from "@/types/settings";
import { adPlacementCatalog } from "@/lib/settings-defaults";
import { Input } from "@/components/forms/Input";
import { Select } from "@/components/forms/Select";
import { Textarea } from "@/components/forms/Textarea";
import { Button } from "@/components/ui/Button";
import { adminRequest } from "./api";

type Status = { runtime: "live" | "test" | "off"; scriptActive: boolean; adsTxt: string | null };

export function AdSettingsForm({ initial, status }: { initial: AdSettings; status: Status }) {
  const router = useRouter();
  const [ads, setAds] = useState(initial);
  const [excluded, setExcluded] = useState(initial.autoAdsExcludedPaths.join("\n"));
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(null);

  function setPlacement(id: AdPlacementId, patch: Partial<AdSettings["placements"][AdPlacementId]>) {
    setAds((current) => ({ ...current, placements: { ...current.placements, [id]: { ...current.placements[id], ...patch } } }));
  }

  async function save() {
    setBusy(true);
    setMessage(null);
    setErrors({});
    const result = await adminRequest("PUT", "/api/admin/settings", { ads: { ...ads, autoAdsExcludedPaths: excluded.split("\n").map((line) => line.trim()).filter(Boolean) } });
    setBusy(false);
    if (!result.ok) {
      setErrors(result.errors ?? {});
      setMessage({ tone: "error", text: result.error ?? "The settings could not be saved." });
      return;
    }
    setMessage({ tone: "ok", text: "Advertising settings saved." });
    router.refresh();
  }

  const runtimeText = {
    live: "Production. Enabled placements will load ads for visitors.",
    test: "Test mode. Ads load with the AdSense test attribute so no real impressions are counted.",
    off: "Development or preview. Ads never load here, even when enabled below.",
  }[status.runtime];

  return (
    <div className="mt-6 max-w-4xl space-y-6">
      <section className="rounded-md border border-line bg-white p-5 text-sm leading-relaxed text-ink-muted">
        <p><strong className="text-ink">This environment:</strong> {runtimeText}</p>
        <p className="mt-2"><strong className="text-ink">AdSense script:</strong> {status.scriptActive ? "will be loaded on eligible pages" : "will not be loaded"}</p>
        <p className="mt-2"><strong className="text-ink">ads.txt:</strong> {status.adsTxt ? <code className="rounded-sm bg-surface-muted px-1.5 py-0.5 text-ink">{status.adsTxt}</code> : "not published until a valid publisher ID is saved"}</p>
        <p className="mt-3">Placements that are switched off, or that have no valid slot ID, render nothing. No empty ad boxes are shown to visitors.</p>
      </section>

      <section className="space-y-5 rounded-md border border-line bg-white p-5">
        <h2 className="text-[16px] font-semibold text-ink">AdSense account</h2>
        <label className="flex items-center gap-2 text-sm text-ink"><input type="checkbox" checked={ads.enabled} onChange={(event) => setAds({ ...ads, enabled: event.target.checked })} /> Enable advertising on this site</label>
        <Input id="publisher-id" label="Publisher ID" placeholder="ca-pub-0000000000000000" value={ads.publisherId} onChange={(event) => setAds({ ...ads, publisherId: event.target.value })} error={errors.publisherId} hint="Copy this from your AdSense account after your site is approved." />
        <label className="flex items-center gap-2 text-sm text-ink"><input type="checkbox" checked={ads.autoAds} onChange={(event) => setAds({ ...ads, autoAds: event.target.checked })} /> Allow Google Auto ads (configure formats and density in AdSense)</label>
        <Textarea id="excluded" label="Pages excluded from ads" rows={5} value={excluded} onChange={(event) => setExcluded(event.target.value)} hint="One path per line, for example /contact or /category/*. The AdSense script is not loaded on these pages. Excluding regions within a page is configured in your AdSense account." />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input id="after-paragraphs" type="number" min={3} max={12} label="In-article ad after every N paragraphs" value={String(ads.inContentAfterParagraphs)} onChange={(event) => setAds({ ...ads, inContentAfterParagraphs: Number(event.target.value) })} />
          <Input id="in-content-max" type="number" min={0} max={3} label="Maximum in-article ads" value={String(ads.inContentMax)} onChange={(event) => setAds({ ...ads, inContentMax: Number(event.target.value) })} />
        </div>
      </section>

      <section className="rounded-md border border-line bg-white p-5">
        <h2 className="text-[16px] font-semibold text-ink">Placements</h2>
        <ul className="mt-4 divide-y divide-line">
          {adPlacementCatalog.map((entry) => {
            const placement = ads.placements[entry.id];
            return (
              <li key={entry.id} className="grid gap-4 py-5 sm:grid-cols-[1fr_180px_140px] sm:items-start">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-ink">
                    <input type="checkbox" checked={placement.enabled} onChange={(event) => setPlacement(entry.id, { enabled: event.target.checked })} />
                    {entry.label}
                  </label>
                  <p className="mt-1 pl-6 text-[13px] text-ink-subtle">{entry.description}</p>
                </div>
                <Input id={`slot-${entry.id}`} label="Ad slot ID" value={placement.slotId} onChange={(event) => setPlacement(entry.id, { slotId: event.target.value })} error={errors[`slot:${entry.id}`]} inputMode="numeric" />
                <Select id={`format-${entry.id}`} label="Format" value={placement.format} onChange={(event) => setPlacement(entry.id, { format: event.target.value as typeof placement.format })} options={[{ value: "auto", label: "Responsive" }, { value: "horizontal", label: "Horizontal" }, { value: "rectangle", label: "Rectangle" }, { value: "vertical", label: "Vertical" }]} />
              </li>
            );
          })}
        </ul>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <Button size="sm" disabled={busy} onClick={save}>{busy ? "Saving..." : "Save advertising settings"}</Button>
        {message ? <p role={message.tone === "error" ? "alert" : "status"} className={message.tone === "error" ? "text-sm text-danger" : "text-sm text-success"}>{message.text}</p> : null}
      </div>
    </div>
  );
}
