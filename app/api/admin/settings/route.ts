import { NextResponse } from "next/server";
import type { AdFormat, SiteSettings } from "@/types/settings";
import { badRequest, guard, readJson, refreshContent } from "@/lib/admin-api";
import { isPublisherIdValid, isSlotIdValid } from "@/lib/ads";
import { loadSettings, saveSettings } from "@/lib/content-store";
import { isValidEmail } from "@/lib/validation";
import { cleanLine } from "@/lib/sanitize";

const formats: AdFormat[] = ["auto", "horizontal", "rectangle", "vertical"];

export async function PUT(request: Request) {
  const denied = await guard(request);
  if (denied) return denied;
  const body = await readJson(request);
  if (!body) return badRequest("The settings could not be read.");
  const current = await loadSettings();
  const next: SiteSettings = { ...current, ads: { ...current.ads, placements: { ...current.ads.placements } } };
  const errors: Record<string, string> = {};

  if (typeof body.showSampleContent === "boolean") next.showSampleContent = body.showSampleContent;
  if (typeof body.contactEmail === "string") {
    const email = cleanLine(body.contactEmail, 200);
    if (!isValidEmail(email)) errors.contactEmail = "Enter a valid email address.";
    else next.contactEmail = email;
  }
  if (typeof body.contributorEmail === "string") {
    const email = cleanLine(body.contributorEmail, 200);
    if (!isValidEmail(email)) errors.contributorEmail = "Enter a valid email address.";
    else next.contributorEmail = email;
  }

  const ads = body.ads as Record<string, unknown> | undefined;
  if (ads && typeof ads === "object") {
    if (typeof ads.publisherId === "string") {
      const publisherId = cleanLine(ads.publisherId, 40);
      if (publisherId && !isPublisherIdValid(publisherId)) errors.publisherId = "Use the format ca-pub-0000000000000000.";
      else next.ads.publisherId = publisherId;
    }
    if (typeof ads.enabled === "boolean") next.ads.enabled = ads.enabled;
    if (typeof ads.autoAds === "boolean") next.ads.autoAds = ads.autoAds;
    if (Array.isArray(ads.autoAdsExcludedPaths)) {
      next.ads.autoAdsExcludedPaths = ads.autoAdsExcludedPaths
        .slice(0, 50)
        .map((entry) => cleanLine(entry, 120))
        .filter((entry) => entry.startsWith("/"));
    }
    if (typeof ads.inContentAfterParagraphs === "number") next.ads.inContentAfterParagraphs = Math.max(3, Math.min(12, Math.round(ads.inContentAfterParagraphs)));
    if (typeof ads.inContentMax === "number") next.ads.inContentMax = Math.max(0, Math.min(3, Math.round(ads.inContentMax)));
    const placements = ads.placements as Record<string, Record<string, unknown>> | undefined;
    if (placements && typeof placements === "object") {
      for (const id of Object.keys(next.ads.placements) as (keyof typeof next.ads.placements)[]) {
        const incoming = placements[id];
        if (!incoming) continue;
        const slotId = cleanLine(incoming.slotId, 30);
        if (slotId && !isSlotIdValid(slotId)) {
          errors[`slot:${id}`] = "Slot IDs contain digits only.";
          continue;
        }
        const enabled = Boolean(incoming.enabled);
        if (enabled && !slotId) {
          errors[`slot:${id}`] = "Add a slot ID before enabling this placement.";
          continue;
        }
        next.ads.placements[id] = {
          enabled,
          slotId,
          format: formats.includes(incoming.format as AdFormat) ? (incoming.format as AdFormat) : next.ads.placements[id].format,
        };
      }
    }
    if (next.ads.enabled && !isPublisherIdValid(next.ads.publisherId)) errors.publisherId = "Add a valid publisher ID before enabling ads.";
  }

  if (Object.keys(errors).length > 0) return badRequest("Please fix the highlighted fields.", errors);
  await saveSettings(next);
  refreshContent();
  return NextResponse.json({ ok: true });
}
