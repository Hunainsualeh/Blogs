import Image from "next/image";
import { cn, formatDate } from "@/lib/utils";

type ArticleMetaProps = {
  authorName?: string;
  authorAvatar?: string;
  publishedAt?: string;
  readingTime?: number;
  inverse?: boolean;
  size?: "sm" | "md";
  className?: string;
};

export function ArticleMeta({ authorName, authorAvatar, publishedAt, readingTime, inverse = false, size = "sm", className }: ArticleMetaProps) {
  const items: string[] = [];
  if (publishedAt) items.push(formatDate(publishedAt));
  if (readingTime) items.push(`${readingTime} min read`);

  return (
    <div className={cn("flex flex-wrap items-center gap-x-2 gap-y-1", size === "sm" ? "text-[13px]" : "text-sm", inverse ? "text-white/80" : "text-ink-subtle", className)}>
      {authorAvatar ? (
        <span className="relative h-6 w-6 overflow-hidden rounded-full bg-surface-muted">
          <Image src={authorAvatar} alt="" fill sizes="24px" className="object-cover" />
        </span>
      ) : null}
      {authorName ? <span className={cn("font-medium", inverse ? "text-white" : "text-ink")}>{authorName}</span> : null}
      {items.map((item) => (
        <span key={item} className="flex items-center gap-2">
          <span aria-hidden className={cn("h-0.5 w-0.5 rounded-full", inverse ? "bg-white/60" : "bg-ink-subtle")} />
          {item}
        </span>
      ))}
    </div>
  );
}
