import type { Category, CategorySlug } from "./category";
import type { Author } from "./user";

export type ArticleImage = {
  src: string;
  alt: string;
  caption?: string;
  credit?: string;
};

export type ParagraphBlock = {
  id: string;
  type: "paragraph";
  content: string;
};

export type HeadingBlock = {
  id: string;
  type: "heading";
  level: 2 | 3;
  content: string;
};

export type ImageBlock = {
  id: string;
  type: "image";
  src: string;
  alt: string;
  caption?: string;
  credit?: string;
};

export type QuoteBlock = {
  id: string;
  type: "quote";
  content: string;
  attribution?: string;
};

export type ListBlock = {
  id: string;
  type: "list";
  style: "ordered" | "unordered";
  items: string[];
};

export type CodeBlock = {
  id: string;
  type: "code";
  language: string;
  content: string;
};

export type CalloutVariant = "info" | "tip" | "warning";

export type CalloutBlock = {
  id: string;
  type: "callout";
  variant: CalloutVariant;
  title?: string;
  content: string;
};

export type DividerBlock = {
  id: string;
  type: "divider";
};

export type LinkBlock = {
  id: string;
  type: "link";
  href: string;
  label: string;
  description?: string;
};

export type EmbedProvider = "youtube" | "vimeo" | "x" | "other";

export type EmbedBlock = {
  id: string;
  type: "embed";
  url: string;
  provider: EmbedProvider;
  title?: string;
};

export type ContentBlock =
  | ParagraphBlock
  | HeadingBlock
  | ImageBlock
  | QuoteBlock
  | ListBlock
  | CodeBlock
  | CalloutBlock
  | DividerBlock
  | LinkBlock
  | EmbedBlock;

export type ContentBlockType = ContentBlock["type"];

export type ArticleStatus =
  | "draft"
  | "submitted"
  | "under-review"
  | "approved"
  | "rejected"
  | "published";

export type Article = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: ContentBlock[];
  category: CategorySlug;
  tags: string[];
  authorId: string;
  status: ArticleStatus;
  createdAt: string;
  publishedAt: string;
  updatedAt: string;
  readingTime: number;
  featuredImage: ArticleImage;
  featured: boolean;
  trending: boolean;
  editorsPick: boolean;
  views: number;
};

export type ArticleWithRelations = Article & {
  author: Author;
  categoryInfo: Category;
};

export type ArticleSummary = Pick<
  Article,
  "id" | "slug" | "title" | "excerpt" | "category" | "publishedAt" | "readingTime" | "featuredImage" | "tags"
> & {
  authorName: string;
  categoryName: string;
};

export type TocItem = {
  id: string;
  text: string;
  level: 2 | 3;
};
