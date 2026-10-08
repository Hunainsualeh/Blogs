import type { Metadata } from "next";
import Link from "next/link";
import { getAllCategories, getCategoryCounts } from "@/lib/blog";
import { categoryHref } from "@/lib/routes";
import { breadcrumbJsonLd, buildMetadata, JsonLd } from "@/lib/seo";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export const metadata: Metadata = buildMetadata({
  title: "Categories",
  description: "Browse Global Insights Daily by category: technology, business, fashion, health, digital marketing, lifestyle, travel, education, real estate, food and sports.",
  path: "/categories",
});

export default async function CategoriesPage() {
  const [categories, counts] = await Promise.all([getAllCategories(), getCategoryCounts()]);
  return (
    <div className="container-site pt-6 sm:pt-8">
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Categories", path: "/categories" }])} />
      <header className="border-b border-ink pb-6">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Categories" }]} className="mb-4" />
        <h1 className="text-[36px] font-semibold leading-none tracking-[-0.04em] text-ink sm:text-[48px]">Categories</h1>
        <p className="mt-3 max-w-3xl font-serif text-[18px] leading-relaxed text-ink-muted">Pick a topic to see every article we have published on it.</p>
      </header>
      <ul className="mt-8 grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <li key={category.slug} className="bg-white">
            <Link href={categoryHref(category.slug)} className="group block h-full p-5 hover:bg-surface-muted">
              <span className="flex items-baseline justify-between gap-3">
                <span className="text-[19px] font-semibold tracking-tight text-ink group-hover:text-brand">{category.name}</span>
                <span className="font-mono text-[12px] text-ink-subtle">{counts[category.slug] ?? 0}</span>
              </span>
              <span className="mt-1.5 block text-[14px] leading-snug text-ink-muted">{category.tagline}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
