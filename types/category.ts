export type CategorySlug = string;

export type Category = {
  slug: CategorySlug;
  name: string;
  shortName: string;
  description: string;
  tagline: string;
  topics: string[];
  order: number;
  showOnHome: boolean;
  showInNav: boolean;
};
