import type { ContentBlock } from "@/types/article";

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function hashString(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash;
}

export function countWords(text: string) {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

export function blockText(block: ContentBlock): string {
  switch (block.type) {
    case "paragraph":
    case "heading":
    case "quote":
    case "callout":
    case "code":
      return block.content;
    case "list":
      return block.items.join(" ");
    case "image":
      return block.caption ?? "";
    case "link":
      return `${block.label} ${block.description ?? ""}`;
    default:
      return "";
  }
}

export function contentWordCount(blocks: ContentBlock[]) {
  return blocks.reduce((total, block) => total + countWords(blockText(block)), 0);
}

export function readingTime(blocks: ContentBlock[], wordsPerMinute = 230) {
  return Math.max(1, Math.round(contentWordCount(blocks) / wordsPerMinute));
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

const longDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

export function formatDate(iso: string, style: "short" | "long" = "short") {
  return (style === "long" ? longDateFormatter : dateFormatter).format(new Date(iso));
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

export function padRank(index: number) {
  return String(index + 1).padStart(2, "0");
}

export function createId(prefix = "id") {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
  }
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export function headingId(text: string) {
  return slugify(text) || "section";
}
