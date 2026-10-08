"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/forms/Input";
import { Button } from "@/components/ui/Button";
import { adminRequest } from "./api";

type Props = { showSampleContent: boolean; contactEmail: string; contributorEmail: string; sampleCount: number; storage: string };

export function SiteSettingsForm({ showSampleContent, contactEmail, contributorEmail, sampleCount, storage }: Props) {
  const router = useRouter();
  const [sample, setSample] = useState(showSampleContent);
  const [contact, setContact] = useState(contactEmail);
  const [contributor, setContributor] = useState(contributorEmail);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(null);

  async function save() {
    setBusy(true);
    setMessage(null);
    const result = await adminRequest("PUT", "/api/admin/settings", { showSampleContent: sample, contactEmail: contact, contributorEmail: contributor });
    setBusy(false);
    setErrors(result.errors ?? {});
    if (!result.ok) {
      setMessage({ tone: "error", text: result.error ?? "The settings could not be saved." });
      return;
    }
    setMessage({ tone: "ok", text: "Settings saved." });
    router.refresh();
  }

  return (
    <div className="mt-6 max-w-2xl space-y-6">
      <section className="space-y-4 rounded-md border border-line bg-white p-5">
        <h2 className="text-[16px] font-semibold text-ink">Sample content</h2>
        <p className="text-sm leading-relaxed text-ink-muted">The site ships with {sampleCount} placeholder articles so the layout can be reviewed. Hide them before you apply for AdSense and publish your own original work.</p>
        <label className="flex items-center gap-2 text-sm text-ink"><input type="checkbox" checked={sample} onChange={(event) => setSample(event.target.checked)} /> Show sample articles to visitors</label>
      </section>
      <section className="space-y-4 rounded-md border border-line bg-white p-5">
        <h2 className="text-[16px] font-semibold text-ink">Contact addresses</h2>
        <Input id="contact-email" type="email" label="General contact email" value={contact} onChange={(event) => setContact(event.target.value)} error={errors.contactEmail} />
        <Input id="contributor-email" type="email" label="Contributor email" value={contributor} onChange={(event) => setContributor(event.target.value)} error={errors.contributorEmail} />
      </section>
      <p className="text-sm text-ink-muted">Storage in use: <strong className="text-ink">{storage}</strong></p>
      <div className="flex flex-wrap items-center gap-3">
        <Button size="sm" disabled={busy} onClick={save}>{busy ? "Saving..." : "Save settings"}</Button>
        {message ? <p role={message.tone === "error" ? "alert" : "status"} className={message.tone === "error" ? "text-sm text-danger" : "text-sm text-success"}>{message.text}</p> : null}
      </div>
    </div>
  );
}
