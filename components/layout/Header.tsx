import { getNavCategories } from "@/lib/blog";
import { HeaderClient } from "./HeaderClient";

export async function Header() {
  const categories = await getNavCategories();
  return <HeaderClient categories={categories.map((category) => ({ slug: category.slug, name: category.name }))} />;
}
