import type { ArticleStatus, ContentBlock, ArticleImage } from "./article";
import type { CategorySlug } from "./category";
import type { ContributorProfile } from "./user";

export type SubmissionDraft = {
  title: string;
  excerpt: string;
  category: CategorySlug | "";
  tags: string[];
  featuredImage: ArticleImage | null;
  content: ContentBlock[];
  author: ContributorProfile;
};

export type Submission = SubmissionDraft & {
  id: string;
  status: ArticleStatus;
  createdAt: string;
  updatedAt: string;
  reviewNote?: string;
  articleId?: string;
};

export type SubmissionReceipt = {
  id: string;
  title: string;
  status: ArticleStatus;
  createdAt: string;
  persisted: "file" | "kv";
};

export type FieldErrors = Partial<Record<string, string>>;
