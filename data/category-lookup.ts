import type { Category, CategorySlug } from "@/types/category";
import { categories } from "./categories";

const categoryMap = new Map<string, Category>(categories.map((category) => [category.slug, category]));

export function getCategoryBySlug(slug: CategorySlug): Category;
export function getCategoryBySlug(slug: string): Category | undefined;
export function getCategoryBySlug(slug: string) {
  return categoryMap.get(slug);
}

export function isCategorySlug(value: string): value is CategorySlug {
  return categoryMap.has(value);
}
