import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getAllCategories, getCategory } from "@/lib/blog";
import { categoryHref } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";
import { CategoryView } from "@/components/category/CategoryView";
import { ArticleListSkeleton } from "@/components/ui/Skeleton";

export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: PageProps<"/category/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) return { title: "Category not found", robots: { index: false } };
  return buildMetadata({ title: `${category.name} Articles and Guides`, description: category.description, path: categoryHref(category.slug) });
}

export default function CategoryPage({ params }: PageProps<"/category/[slug]">) {
  return (
    <Suspense fallback={<div className="container-site pt-10"><ArticleListSkeleton count={4} /></div>}>
      <CategoryContent params={params} />
    </Suspense>
  );
}

async function CategoryContent({ params }: { params: PageProps<"/category/[slug]">["params"] }) {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) notFound();
  return <CategoryView category={category} page={1} />;
}
