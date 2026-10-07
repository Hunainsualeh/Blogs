import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getAllCategories, getCategory, getCategoryPageCount } from "@/lib/blog";
import { categoryHref } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";
import { CategoryView } from "@/components/category/CategoryView";

export function generateStaticParams() {
  return getAllCategories().flatMap((category) => {
    const pages = getCategoryPageCount(category.slug);
    return Array.from({ length: Math.max(0, pages - 1) }, (_, index) => ({ slug: category.slug, page: String(index + 2) }));
  });
}

export async function generateMetadata({ params }: PageProps<"/category/[slug]/page/[page]">): Promise<Metadata> {
  const { slug, page } = await params;
  const category = getCategory(slug);
  if (!category) return { title: "Section not found" };
  return buildMetadata({
    title: `${category.name}, page ${page}`,
    description: category.description,
    path: categoryHref(category.slug, Number(page)),
  });
}

export default async function CategoryPaginatedPage({ params }: PageProps<"/category/[slug]/page/[page]">) {
  const { slug, page } = await params;
  const category = getCategory(slug);
  const pageNumber = Number(page);
  if (!category || !Number.isInteger(pageNumber) || pageNumber < 1) notFound();
  if (pageNumber === 1) redirect(categoryHref(category.slug));
  if (pageNumber > getCategoryPageCount(category.slug)) notFound();
  return <CategoryView category={category} page={pageNumber} />;
}
