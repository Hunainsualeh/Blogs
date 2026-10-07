import Image from "next/image";
import type { ReactNode } from "react";
import type { Category } from "@/types/category";
import { categoryHref } from "@/lib/routes";
import { cn, formatDate } from "@/lib/utils";
import { CategoryLabel } from "@/components/ui/Badge";
import { ClockIcon } from "@/components/ui/Icons";

type ArticleHeaderProps = {
  title: string;
  excerpt: string;
  category?: Category;
  author: { name: string; role?: string; avatar?: string };
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
      <div className="mx-auto max-w-[860px] text-left sm:text-center">
        {breadcrumbs}
        {category ? (
          <div className="mb-5 flex sm:justify-center">
            <CategoryLabel name={category.name} href={linkCategory ? categoryHref(category.slug) : undefined} />
          </div>
        ) : null}
        <h1 className={cn("text-[34px] font-semibold leading-[1.06] tracking-[-0.04em] text-ink sm:text-[48px] lg:text-[56px]", !title && "text-ink-subtle")}>
          {title || "Untitled article"}
        </h1>
        {excerpt ? <p className="mx-auto mt-5 max-w-[720px] font-serif text-[19px] leading-relaxed text-ink-muted sm:text-[22px]">{excerpt}</p> : null}
        <div className="mt-8 flex flex-col gap-5 border-y border-line py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 text-left">
            <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-brand-soft">
              {author.avatar ? (
                <Image src={author.avatar} alt="" fill sizes="44px" className="object-cover" />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-sm font-semibold text-brand">{(author.name || "?").slice(0, 1).toUpperCase()}</span>
              )}
            </span>
            <div>
              <p className="text-[15px] font-semibold text-ink">{author.name || "Author name"}</p>
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
      </div>
      {image?.src ? (
        <figure className="mx-auto mt-10 max-w-[1120px]">
          <div className="relative aspect-[16/9] overflow-hidden rounded-sm bg-surface-muted">
            <Image src={image.src} alt={image.alt} fill priority sizes="(min-width: 1200px) 1120px, 100vw" className="object-cover" />
          </div>
          {image.caption || image.credit ? (
            <figcaption className="mt-3 text-[13px] text-ink-subtle">
              {image.caption} {image.credit ? <span className="kicker !text-[10px]">Photo: {image.credit}</span> : null}
            </figcaption>
          ) : null}
        </figure>
      ) : null}
    </header>
  );
}
