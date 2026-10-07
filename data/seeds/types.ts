import type { ContentBlock } from "@/types/article";
import type { CategorySlug } from "@/types/category";

export type ArticleFlag = "featured" | "trending" | "editorsPick";

export type ArticleSeed = {
  title: string;
  excerpt: string;
  category: CategorySlug;
  tags: string[];
  author: string;
  image: string;
  imageAlt: string;
  age: [days: number, hour: number];
  updatedAfterDays?: number;
  flags?: ArticleFlag[];
  views: number;
  intro: string;
  sections: [heading: string, body: string][];
  content?: ContentBlock[];
};
