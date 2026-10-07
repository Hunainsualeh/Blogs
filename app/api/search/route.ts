import { NextResponse, type NextRequest } from "next/server";
import { searchArticles } from "@/lib/blog";
import type { SearchSuggestion } from "@/types/search";

export async function GET(request: NextRequest) {
  const query = (request.nextUrl.searchParams.get("q") ?? "").slice(0, 100);
  const limit = Math.min(Number(request.nextUrl.searchParams.get("limit")) || 6, 20);
  const results: SearchSuggestion[] = searchArticles(query, limit).map((article) => ({
    slug: article.slug,
    title: article.title,
    categoryName: article.categoryInfo.name,
    authorName: article.author.name,
    image: article.featuredImage.src,
  }));
  return NextResponse.json({ query, results });
}
