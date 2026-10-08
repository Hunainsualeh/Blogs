import type { Author } from "@/types/user";
import { categories } from "@/data/categories";

export const editorialAuthor: Author = {
  id: "a-editorial-team",
  slug: "editorial-team",
  name: "Global Insights Daily Editorial",
  role: "Editorial team",
  bio: "Articles from the Global Insights Daily editorial team. Every piece is reviewed against our editorial standards before it is published.",
  kind: "desk",
};

export const deskAuthors: Author[] = categories.map((category) => ({
  id: `a-${category.slug}-desk`,
  slug: `${category.slug}-desk`,
  name: `${category.name} Desk`,
  role: "Editorial desk",
  bio: `Articles from the ${category.name} desk at Global Insights Daily, reviewed by our editors before publication.`,
  kind: "desk",
}));

export const seedAuthors: Author[] = [editorialAuthor, ...deskAuthors];
