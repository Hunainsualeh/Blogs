export const SUBMISSION_LIMITS = {
  titleMin: 10,
  titleMax: 120,
  excerptMin: 40,
  excerptMax: 280,
  bioMin: 20,
  bioMax: 400,
  maxTags: 5,
  tagMaxLength: 30,
  minWords: 600,
  maxImageBytes: 4 * 1024 * 1024,
  maxImages: 12,
  maxBlocks: 400,
  maxBlockChars: 20000,
  acceptedImageTypes: ["image/jpeg", "image/png", "image/webp"],
} as const;

export const STATUS_LABELS = {
  draft: "Draft",
  submitted: "Submitted",
  "under-review": "Under review",
  approved: "Approved",
  rejected: "Rejected",
  published: "Published",
} as const;

export const STATUS_FLOW = ["draft", "submitted", "under-review", "approved", "published"] as const;

export const DRAFT_STORAGE_KEY = "gid:submission-draft:v1";

export const ARTICLES_PER_PAGE = 12;
