export type AdPlacementId =
  | "home-after-featured"
  | "home-between-categories"
  | "home-in-latest"
  | "article-top"
  | "article-in-content"
  | "article-sidebar"
  | "article-end"
  | "archive-between"
  | "archive-sidebar";

export type AdFormat = "auto" | "horizontal" | "rectangle" | "vertical";

export type AdPlacementSetting = {
  enabled: boolean;
  slotId: string;
  format: AdFormat;
};

export type AdSettings = {
  enabled: boolean;
  publisherId: string;
  autoAds: boolean;
  autoAdsExcludedPaths: string[];
  inContentAfterParagraphs: number;
  inContentMax: number;
  placements: Record<AdPlacementId, AdPlacementSetting>;
};

export type SiteSettings = {
  showSampleContent: boolean;
  contactEmail: string;
  contributorEmail: string;
  ads: AdSettings;
};
