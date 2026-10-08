import { NextResponse } from "next/server";
import type { Category } from "@/types/category";
import { badRequest, guard, readJson, refreshContent } from "@/lib/admin-api";
import { loadAllArticles, saveCategories } from "@/lib/content-store";
import { cleanLine, cleanText } from "@/lib/sanitize";
import { slugify } from "@/lib/utils";

export async function PUT(request: Request) {
  const denied = await guard(request);
  if (denied) return denied;
  const body = await readJson(request);
  if (!body || !Array.isArray(body.categories)) return badRequest("The categories could not be read.");

  const seen = new Set<string>();
  const next: Category[] = [];
  for (const [index, entry] of body.categories.slice(0, 60).entries()) {
    const raw = (entry ?? {}) as Record<string, unknown>;
    const name = cleanLine(raw.name, 60);
    const slug = slugify(cleanLine(raw.slug, 80) || name);
    if (!name || !slug) return badRequest(`Category ${index + 1} needs a name.`);
    if (seen.has(slug)) return badRequest(`The URL "${slug}" is used twice.`);
    seen.add(slug);
    next.push({
      slug,
      name,
      shortName: cleanLine(raw.shortName, 30) || name,
      tagline: cleanLine(raw.tagline, 160),
      description: cleanText(raw.description, 400),
      topics: Array.isArray(raw.topics) ? raw.topics.slice(0, 10).map((topic) => cleanLine(topic, 40)).filter(Boolean) : [],
      order: index,
      showOnHome: raw.showOnHome !== false,
      showInNav: raw.showInNav !== false,
    });
  }
  if (next.length === 0) return badRequest("Keep at least one category.");

  const articles = await loadAllArticles();
  const used = new Set(articles.map((article) => article.category));
  const missing = [...used].filter((slug) => !seen.has(slug));
  if (missing.length > 0) return badRequest(`These categories still contain articles and cannot be removed or renamed: ${missing.join(", ")}.`);

  await saveCategories(next);
  refreshContent();
  return NextResponse.json({ ok: true });
}
