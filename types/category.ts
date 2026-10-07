export type CategorySlug =
  | "tech"
  | "business"
  | "fashion"
  | "health"
  | "digital-marketing"
  | "lifestyle"
  | "travel"
  | "education"
  | "real-estate"
  | "food-recipe"
  | "sports";

export type Category = {
  slug: CategorySlug;
  name: string;
  shortName: string;
  description: string;
  tagline: string;
  topics: string[];
};
