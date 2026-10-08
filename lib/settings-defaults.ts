import { siteConfig } from "@/config/site";
import type { AdPlacementId, AdPlacementSetting, SiteSettings } from "@/types/settings";

export const adPlacementCatalog: { id: AdPlacementId; label: string; description: string; defaultFormat: AdPlacementSetting["format"] }[] = [
  { id: "home-after-featured", label: "Homepage: after featured articles", description: "One horizontal unit between the featured block and the latest articles.", defaultFormat: "horizontal" },
  { id: "home-in-latest", label: "Homepage: inside the latest list", description: "One unit after the first group of latest articles.", defaultFormat: "horizontal" },
  { id: "home-between-categories", label: "Homepage: between category sections", description: "A unit after every second category section.", defaultFormat: "horizontal" },
  { id: "article-top", label: "Article: before the content", description: "Placed below the featured image and clear of navigation and share buttons.", defaultFormat: "horizontal" },
  { id: "article-in-content", label: "Article: inside the content", description: "Inserted between paragraphs on longer articles only.", defaultFormat: "rectangle" },
  { id: "article-sidebar", label: "Article: sidebar", description: "Desktop sidebar unit, separate from Recent Posts, Popular Posts and Categories.", defaultFormat: "vertical" },
  { id: "article-end", label: "Article: after the content", description: "Placed before the related articles.", defaultFormat: "horizontal" },
  { id: "archive-between", label: "Category and archive pages: between article groups", description: "A unit after every group of article cards.", defaultFormat: "horizontal" },
  { id: "archive-sidebar", label: "Category and archive pages: sidebar", description: "Desktop sidebar unit.", defaultFormat: "vertical" },
];

export function defaultAdSettings(): SiteSettings["ads"] {
  const placements = {} as SiteSettings["ads"]["placements"];
  for (const entry of adPlacementCatalog) {
    placements[entry.id] = { enabled: false, slotId: "", format: entry.defaultFormat };
  }
  return {
    enabled: false,
    publisherId: "",
    autoAds: false,
    autoAdsExcludedPaths: ["/search", "/submit", "/contact", "/privacy-policy"],
    inContentAfterParagraphs: 4,
    inContentMax: 2,
    placements,
  };
}

export function defaultSettings(): SiteSettings {
  return {
    showSampleContent: true,
    contactEmail: siteConfig.contact.general,
    contributorEmail: siteConfig.contact.contributors,
    ads: defaultAdSettings(),
  };
}

export function mergeSettings(stored: Partial<SiteSettings> | null | undefined): SiteSettings {
  const base = defaultSettings();
  if (!stored) return base;
  return {
    ...base,
    ...stored,
    ads: {
      ...base.ads,
      ...(stored.ads ?? {}),
      placements: { ...base.ads.placements, ...(stored.ads?.placements ?? {}) },
    },
  };
}
