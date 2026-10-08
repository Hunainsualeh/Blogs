import { NextResponse } from "next/server";
import { getArticleBySlug } from "@/lib/blog";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { incrementCounter } from "@/lib/storage";
import { VIEWS } from "@/lib/content-store";

export async function POST(request: Request) {
  if (!rateLimit(`views:${clientIp(request)}`, 120, 60 * 60 * 1000)) {
    return new NextResponse(null, { status: 204 });
  }
  let slug = "";
  try {
    const body = (await request.json()) as { slug?: unknown };
    slug = typeof body.slug === "string" ? body.slug.slice(0, 160) : "";
  } catch {
    return new NextResponse(null, { status: 204 });
  }
  const article = slug ? await getArticleBySlug(slug) : undefined;
  if (article) await incrementCounter(VIEWS, article.id);
  return new NextResponse(null, { status: 204 });
}
