import { categories } from "@/data/categories";
import { categoryHref } from "@/lib/routes";

export type NavItem = {
  label: string;
  href: string;
  description?: string;
};

export const primaryNavigation: NavItem[] = [
  { label: "Home", href: "/" },
  ...categories.map((category) => ({
    label: category.name,
    href: categoryHref(category.slug),
    description: category.tagline,
  })),
];

export const categoryNavigation: NavItem[] = primaryNavigation.slice(1);

export const utilityNavigation = {
  search: { label: "Search", href: "/search" },
  writeForUs: { label: "Write for Us", href: "/write-for-us" },
  submit: { label: "Start writing", href: "/submit" },
} as const;

export const homepageCategoryOrder = [
  "tech",
  "business",
  "health",
  "travel",
  "food-recipe",
  "fashion",
  "sports",
  "lifestyle",
  "real-estate",
  "education",
  "digital-marketing",
] as const;

export const trendingSearches = [
  "AI tools",
  "Capsule wardrobe",
  "Sleep",
  "Kyoto",
  "Pasta recipe",
  "First home",
];

export const footerNavigation: { title: string; links: NavItem[] }[] = [
  {
    title: "Sections",
    links: categoryNavigation.slice(0, 6),
  },
  {
    title: "More",
    links: categoryNavigation.slice(6),
  },
  {
    title: "Contribute",
    links: [
      { label: "Write for Us", href: "/write-for-us" },
      { label: "Submit an article", href: "/submit" },
      { label: "Editorial standards", href: "/about#standards" },
    ],
  },
  {
    title: "Northline",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/about#contact" },
      { label: "Search", href: "/search" },
      { label: "Sitemap", href: "/sitemap.xml" },
    ],
  },
];
