import type { ArticleImage, CalloutVariant, ContentBlock, EmbedBlock } from "@/types/article";
import { SUBMISSION_LIMITS } from "./constants";
import { createId } from "./utils";

const MEDIA_PATH = /^\/media\/[a-z0-9][a-z0-9._-]{0,120}$/i;
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

export type SanitizeOptions = {
  allowExternalImages: boolean;
};

export function cleanText(value: unknown, max: number) {
  if (typeof value !== "string") return "";
  return value.replace(CONTROL_CHARS, "").replace(/\r\n/g, "\n").trim().slice(0, max);
}

export function cleanLine(value: unknown, max: number) {
  return cleanText(value, max).replace(/\s+/g, " ");
}

export function cleanUrl(value: unknown, options: { allowRelative?: boolean } = {}) {
  const text = cleanLine(value, 2000);
  if (!text) return "";
  if (options.allowRelative && /^\/(?!\/)/.test(text)) return text;
  try {
    const url = new URL(text);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : "";
  } catch {
    return "";
  }
}

export function cleanImageSrc(value: unknown, options: SanitizeOptions) {
  const text = cleanLine(value, 2000);
  if (!text) return "";
  if (MEDIA_PATH.test(text)) return text;
  if (!options.allowExternalImages) return "";
  return cleanUrl(text);
}

export function cleanImage(value: unknown, options: SanitizeOptions): ArticleImage | null {
  if (!value || typeof value !== "object") return null;
  const raw = value as Record<string, unknown>;
  const src = cleanImageSrc(raw.src, options);
  if (!src) return null;
  const image: ArticleImage = { src, alt: cleanLine(raw.alt, 200) };
  const caption = cleanLine(raw.caption, 300);
  const credit = cleanLine(raw.credit, 120);
  if (caption) image.caption = caption;
  if (credit) image.credit = credit;
  return image;
}

function embedProvider(url: string): EmbedBlock["provider"] {
  if (/(^|\.)youtube(-nocookie)?\.com|youtu\.be/i.test(url)) return "youtube";
  if (/vimeo\.com/i.test(url)) return "vimeo";
  if (/(^|\/\/|\.)(twitter|x)\.com/i.test(url)) return "x";
  return "other";
}

export function sanitizeBlocks(input: unknown, options: SanitizeOptions): ContentBlock[] {
  if (!Array.isArray(input)) return [];
  const blocks: ContentBlock[] = [];
  const max = SUBMISSION_LIMITS.maxBlockChars;
  for (const item of input.slice(0, SUBMISSION_LIMITS.maxBlocks)) {
    if (!item || typeof item !== "object") continue;
    const raw = item as Record<string, unknown>;
    const id = cleanLine(raw.id, 60).replace(/[^a-z0-9_-]/gi, "") || createId("blk");
    switch (raw.type) {
      case "paragraph":
        blocks.push({ id, type: "paragraph", content: cleanText(raw.content, max) });
        break;
      case "heading":
        blocks.push({ id, type: "heading", level: raw.level === 3 ? 3 : 2, content: cleanLine(raw.content, 200) });
        break;
      case "image":
        blocks.push({
          id,
          type: "image",
          src: cleanImageSrc(raw.src, options),
          alt: cleanLine(raw.alt, 200),
          caption: cleanLine(raw.caption, 300),
          credit: cleanLine(raw.credit, 120),
        });
        break;
      case "quote":
        blocks.push({ id, type: "quote", content: cleanText(raw.content, 1000), attribution: cleanLine(raw.attribution, 120) });
        break;
      case "list": {
        const items = Array.isArray(raw.items) ? raw.items.slice(0, 60).map((entry) => cleanLine(entry, 500)) : [];
        blocks.push({ id, type: "list", style: raw.style === "ordered" ? "ordered" : "unordered", items });
        break;
      }
      case "code":
        blocks.push({ id, type: "code", language: cleanLine(raw.language, 30), content: cleanText(raw.content, max) });
        break;
      case "callout": {
        const variant: CalloutVariant = raw.variant === "tip" || raw.variant === "warning" ? raw.variant : "info";
        blocks.push({ id, type: "callout", variant, title: cleanLine(raw.title, 80), content: cleanText(raw.content, 1500) });
        break;
      }
      case "divider":
        blocks.push({ id, type: "divider" });
        break;
      case "link":
        blocks.push({
          id,
          type: "link",
          href: cleanUrl(raw.href, { allowRelative: true }),
          label: cleanLine(raw.label, 120),
          description: cleanLine(raw.description, 240),
        });
        break;
      case "embed": {
        const url = cleanUrl(raw.url);
        blocks.push({ id, type: "embed", url, provider: embedProvider(url), title: cleanLine(raw.title, 120) });
        break;
      }
      default:
        break;
    }
  }
  return blocks;
}

export function sanitizeTags(input: unknown) {
  if (!Array.isArray(input)) return [];
  const seen = new Set<string>();
  const tags: string[] = [];
  for (const entry of input) {
    const tag = cleanLine(entry, SUBMISSION_LIMITS.tagMaxLength);
    const key = tag.toLowerCase();
    if (!tag || seen.has(key)) continue;
    seen.add(key);
    tags.push(tag);
    if (tags.length >= SUBMISSION_LIMITS.maxTags) break;
  }
  return tags;
}
