import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllCategories, getCategory } from "@/lib/blog";
import { categoryHref } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";
import { CategoryView } from "@/components/category/CategoryView";

export function generateStaticParams() {
  return getAllCategories().map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: PageProps<"/category/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return { title: "Section not found" };
  return buildMetadata({ title: `${category.name} news and analysis`, description: category.description, path: categoryHref(category.slug) });
}

export default async function CategoryPage({ params }: PageProps<"/category/[slug]">) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();
  return <CategoryView category={category} page={1} />;
}
