import { getLatestArticles, getNavCategories } from "@/lib/blog";
import { articleHref } from "@/lib/routes";
import { HeaderClient } from "./HeaderClient";

export async function Header() {
  const [categories, latest] = await Promise.all([getNavCategories(), getLatestArticles(1)]);
  const newest = latest[0];
  return (
    <HeaderClient
      categories={categories.map((category) => ({ slug: category.slug, name: category.name }))}
      breaking={newest ? { title: newest.title, href: articleHref(newest.slug) } : null}
    />
  );
}
