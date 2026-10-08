import Image from "next/image";
import type { ReactNode } from "react";
import type { Category } from "@/types/category";
import { categoryHref } from "@/lib/routes";
import { formatDate } from "@/lib/utils";
import { CategoryLabel } from "@/components/ui/Badge";
import { ClockIcon } from "@/components/ui/Icons";

type ArticleHeaderProps = {
  title: string;
  excerpt: string;
  category?: Category;
  author: { name: string; role?: string };
  publishedAt?: string;
  updatedAt?: string;
  readingTime: number;
  image?: { src: string; alt: string; caption?: string; credit?: string } | null;
  breadcrumbs?: ReactNode;
  actions?: ReactNode;
  linkCategory?: boolean;
};

export function ArticleHeader({ title, excerpt, category, author, publishedAt, updatedAt, readingTime, image, breadcrumbs, actions, linkCategory = true }: ArticleHeaderProps) {
  const showUpdated = updatedAt && publishedAt && formatDate(updatedAt) !== formatDate(publishedAt);
  return (
    <header>
      {image?.src ? (
        <figure>
          <div className="relative aspect-[16/10] overflow-hidden bg-surface-muted">
            <Image src={image.src} alt={image.alt} fill priority sizes="(min-width: 1200px) 820px, (min-width: 1024px) 66vw, 100vw" className="object-cover" />
          </div>
          {image.caption || image.credit ? (
            <figcaption className="mt-2 text-[12.5px] text-ink-subtle">
              {image.caption} {image.credit ? <span>Photo: {image.credit}</span> : null}
            </figcaption>
          ) : null}
        </figure>
      ) : null}
      <div className="mt-5">{breadcrumbs}</div>
      {category ? (
        <div className="mb-3">
          <CategoryLabel name={category.name} href={linkCategory ? categoryHref(category.slug) : undefined} />
        </div>
      ) : null}
      <h1 className="text-[30px] font-medium leading-[1.2] tracking-[-0.025em] text-ink sm:text-[38px]">{title || "Untitled article"}</h1>
      {excerpt ? <p className="mt-3 text-[17px] leading-relaxed text-ink-muted">{excerpt}</p> : null}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-[13px] text-ink-subtle">
        <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1.5">
          <span className="flex items-center gap-2 font-semibold text-ink">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-dark text-[13px] text-white" aria-hidden>
              {(author.name || "?").slice(0, 1).toUpperCase()}
            </span>
            {author.name || "Author name"}
          </span>
          {publishedAt ? <time dateTime={publishedAt}>{formatDate(publishedAt, "long")}</time> : <span>Not yet published</span>}
          {showUpdated ? (
            <span>
              Last updated: <time dateTime={updatedAt}>{formatDate(updatedAt, "long")}</time>
            </span>
          ) : null}
        </div>
        <span className="inline-flex items-center gap-1.5">
          <ClockIcon size={14} /> {readingTime} minutes read
        </span>
      </div>
      {actions ? <div className="mt-4">{actions}</div> : null}
    </header>
  );
}
