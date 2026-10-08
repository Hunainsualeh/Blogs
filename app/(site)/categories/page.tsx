import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAllCategories, getArticlesByCategory, getCategoryCounts } from "@/lib/blog";
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
  const covers = await Promise.all(categories.map(async (category) => (await getArticlesByCategory(category.slug, 1))[0]));
  return (
    <div className="container-site pt-6 sm:pt-8">
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Categories", path: "/categories" }])} />
      <header className="mb-8 rounded-sm border border-line bg-surface-muted p-5 sm:p-7">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Categories" }]} className="mb-3" />
        <h1 className="text-[30px] font-semibold leading-tight tracking-[-0.03em] text-ink sm:text-[38px]">Categories</h1>
        <p className="mt-2 max-w-3xl text-[16px] leading-relaxed text-ink-muted">Pick a topic to see every article we have published on it.</p>
      </header>
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category, index) => {
          const cover = covers[index];
          return (
            <li key={category.slug}>
              <Link href={categoryHref(category.slug)} className="group block h-full overflow-hidden rounded-sm border border-line bg-white transition-shadow hover:shadow-[0_8px_24px_-12px_rgba(0,0,0,0.25)]">
                <span className="relative block aspect-[16/9] bg-surface-muted">
                  {cover ? <Image src={cover.featuredImage.src} alt="" fill sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, 100vw" className="object-cover" /> : null}
                  <span className="absolute right-3 top-3 rounded-sm bg-brand px-2.5 py-1 text-[12px] font-medium text-white">{counts[category.slug] ?? 0} articles</span>
                </span>
                <span className="block p-4">
                  <span className="block text-[19px] font-semibold tracking-tight text-ink group-hover:text-brand">{category.name}</span>
                  <span className="mt-1.5 block text-[14px] leading-snug text-ink-muted">{category.tagline}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
