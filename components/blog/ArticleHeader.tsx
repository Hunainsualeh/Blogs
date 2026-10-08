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
      {breadcrumbs}
      {category ? (
        <div className="mb-4">
          <CategoryLabel name={category.name} href={linkCategory ? categoryHref(category.slug) : undefined} />
        </div>
      ) : null}
      <h1 className="text-[32px] font-semibold leading-[1.1] tracking-[-0.035em] text-ink sm:text-[42px] lg:text-[46px]">{title || "Untitled article"}</h1>
      {excerpt ? <p className="mt-4 font-serif text-[18px] leading-relaxed text-ink-muted sm:text-[20px]">{excerpt}</p> : null}
      <div className="mt-6 flex flex-col gap-4 border-y border-line py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-soft text-sm font-semibold text-brand" aria-hidden>
            {(author.name || "?").slice(0, 1).toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="truncate text-[14.5px] font-semibold text-ink">
              <span className="font-normal text-ink-subtle">By </span>
              {author.name || "Author name"}
            </p>
            <p className="text-[13px] text-ink-subtle">
              {publishedAt ? <time dateTime={publishedAt}>{formatDate(publishedAt, "long")}</time> : "Not yet published"}
              {showUpdated ? (
                <>
                  {" "}· Updated <time dateTime={updatedAt}>{formatDate(updatedAt)}</time>
                </>
              ) : null}
              <span className="inline-flex items-center gap-1 pl-2 align-middle">
                <ClockIcon size={13} /> {readingTime} min read
              </span>
            </p>
          </div>
        </div>
        {actions}
      </div>
      {image?.src ? (
        <figure className="mt-6">
          <div className="relative aspect-[16/9] overflow-hidden rounded-sm bg-surface-muted">
            <Image src={image.src} alt={image.alt} fill priority sizes="(min-width: 1320px) 860px, (min-width: 1024px) 66vw, 100vw" className="object-cover" />
          </div>
          {image.caption || image.credit ? (
            <figcaption className="mt-2.5 text-[13px] text-ink-subtle">
              {image.caption} {image.credit ? <span className="kicker !text-[10px]">Photo: {image.credit}</span> : null}
            </figcaption>
          ) : null}
        </figure>
      ) : null}
    </header>
  );
}
