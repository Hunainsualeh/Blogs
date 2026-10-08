import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { getCategory, getCategoryPageCount } from "@/lib/blog";
import { categoryHref } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";
import { CategoryView } from "@/components/category/CategoryView";
import { ArticleListSkeleton } from "@/components/ui/Skeleton";

export async function generateMetadata({ params }: PageProps<"/category/[slug]/page/[page]">): Promise<Metadata> {
  const { slug, page } = await params;
  const category = await getCategory(slug);
  if (!category) return { title: "Category not found", robots: { index: false } };
  return buildMetadata({
    title: `${category.name} Articles, Page ${page}`,
    description: category.description,
    path: categoryHref(category.slug, Number(page)),
  });
}

export default function CategoryPaginatedPage({ params }: PageProps<"/category/[slug]/page/[page]">) {
  return (
    <Suspense fallback={<div className="container-site pt-10"><ArticleListSkeleton count={4} /></div>}>
      <PaginatedContent params={params} />
    </Suspense>
  );
}

async function PaginatedContent({ params }: { params: PageProps<"/category/[slug]/page/[page]">["params"] }) {
  const { slug, page } = await params;
  const category = await getCategory(slug);
  const pageNumber = Number(page);
  if (!category || !Number.isInteger(pageNumber) || pageNumber < 1) notFound();
  if (pageNumber === 1) redirect(categoryHref(category.slug));
  if (pageNumber > (await getCategoryPageCount(category.slug))) notFound();
  return <CategoryView category={category} page={pageNumber} />;
}
