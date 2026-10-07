export type MenuArticle = {
  slug: string;
  title: string;
  categoryName: string;
  image: string;
  imageAlt: string;
  excerpt: string;
  readingTime: number;
};

export type MenuData = {
  trending: MenuArticle[];
  featured: MenuArticle | null;
  topics: string[];
};
