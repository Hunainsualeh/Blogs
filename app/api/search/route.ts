import { NextResponse, type NextRequest } from "next/server";
import { searchArticles } from "@/lib/blog";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import type { SearchSuggestion } from "@/types/search";

export async function GET(request: NextRequest) {
  if (!rateLimit(`search:${clientIp(request)}`, 120, 60 * 1000)) {
    return NextResponse.json({ query: "", results: [] }, { status: 429 });
  }
  const query = (request.nextUrl.searchParams.get("q") ?? "").slice(0, 100);
  const limit = Math.min(Number(request.nextUrl.searchParams.get("limit")) || 6, 20);
  const found = await searchArticles(query, limit);
  const results: SearchSuggestion[] = found.map((article) => ({
    slug: article.slug,
    title: article.title,
    categoryName: article.categoryInfo.name,
    authorName: article.author.name,
    image: article.featuredImage.src,
  }));
  return NextResponse.json({ query, results });
}
