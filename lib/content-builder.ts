import type { Article, ContentBlock } from "@/types/article";
import type { ArticleSeed } from "@/data/seeds/types";
import { contentPools } from "@/data/content-pools";
import { getCategoryBySlug } from "@/data/category-lookup";
import { unsplash } from "./images";
import { categoryHref } from "./routes";
import { hashString, readingTime, slugify } from "./utils";

const ANCHOR_DATE = Date.UTC(2026, 9, 7, 0, 0, 0);
const DAY = 24 * 60 * 60 * 1000;
const HOUR = 60 * 60 * 1000;

const closingHeadings = ["The bottom line", "What comes next", "Where this leaves us"];

function pick<T>(items: T[], seed: number, offset = 0) {
  return items[(seed + offset) % items.length];
}

function rotate<T>(items: T[], seed: number, count: number) {
  return Array.from({ length: Math.min(count, items.length) }, (_, index) => items[(seed + index) % items.length]);
}

export function buildContent(seed: ArticleSeed, slug: string): ContentBlock[] {
  const pool = contentPools[seed.category];
  const category = getCategoryBySlug(seed.category);
  const hash = hashString(slug);
  let counter = 0;
  const id = () => `${slug}-${(counter += 1)}`;

  const blocks: ContentBlock[] = [
    { id: id(), type: "paragraph", content: seed.intro },
    { id: id(), type: "paragraph", content: pick(pool.paragraphs, hash) },
  ];

  seed.sections.forEach(([heading, body], index) => {
    blocks.push({ id: id(), type: "heading", level: 2, content: heading });
    blocks.push({ id: id(), type: "paragraph", content: body });

    if (index === 0) {
      const image = pick(pool.images, hash);
      blocks.push({
        id: id(),
        type: "image",
        src: unsplash(image.id),
        alt: image.alt,
        caption: image.caption,
        credit: "Unsplash",
      });
      blocks.push({ id: id(), type: "paragraph", content: pick(pool.paragraphs, hash, 1) });
    }

    if (index === 1) {
      const quote = pick(pool.quotes, hash);
      blocks.push({ id: id(), type: "quote", content: quote.content, attribution: quote.attribution });
      blocks.push({ id: id(), type: "heading", level: 3, content: "What to watch" });
      blocks.push({ id: id(), type: "list", style: "unordered", items: rotate(pool.watch, hash, 4) });
    }

    if (index === 2) {
      const code = pool.code ? pick(pool.code, hash) : undefined;
      if (code) {
        blocks.push({ id: id(), type: "paragraph", content: "A simplified example illustrates the pattern many teams are converging on:" });
        blocks.push({ id: id(), type: "code", language: code.language, content: code.content });
      }
      const tip = pick(pool.tips, hash);
      blocks.push({ id: id(), type: "callout", variant: tip.title.toLowerCase().includes("risk") ? "warning" : "info", title: tip.title, content: tip.content });
      blocks.push({ id: id(), type: "paragraph", content: pick(pool.paragraphs, hash, 2) });
    }
  });

  blocks.push({ id: id(), type: "divider" });
  blocks.push({ id: id(), type: "heading", level: 2, content: pick(closingHeadings, hash) });
  blocks.push({ id: id(), type: "paragraph", content: pick(pool.closers, hash) });
  blocks.push({ id: id(), type: "heading", level: 3, content: "Key takeaways" });
  blocks.push({ id: id(), type: "list", style: "ordered", items: seed.sections.map(([heading]) => heading) });
  blocks.push({
    id: id(),
    type: "link",
    href: categoryHref(seed.category),
    label: `More from ${category.name}`,
    description: category.description,
  });

  return blocks;
}

export function buildArticle(seed: ArticleSeed, index: number): Article {
  const slug = slugify(seed.title);
  const content = seed.content ?? buildContent(seed, slug);
  const published = ANCHOR_DATE - seed.age[0] * DAY + seed.age[1] * HOUR;
  const updated = seed.updatedAfterDays ? published + seed.updatedAfterDays * DAY : published + 3 * HOUR;
  const flags = new Set(seed.flags ?? []);

  return {
    id: `art-${String(index + 1).padStart(4, "0")}`,
    slug,
    title: seed.title,
    excerpt: seed.excerpt,
    content,
    category: seed.category,
    tags: seed.tags,
    authorId: `a-${seed.author}`,
    status: "published",
    createdAt: new Date(published - 2 * DAY).toISOString(),
    publishedAt: new Date(published).toISOString(),
    updatedAt: new Date(updated).toISOString(),
    readingTime: readingTime(content),
    featuredImage: {
      src: unsplash(seed.image),
      alt: seed.imageAlt,
      credit: "Unsplash",
    },
    featured: flags.has("featured"),
    trending: flags.has("trending"),
    editorsPick: flags.has("editorsPick"),
    views: seed.views,
  };
}
