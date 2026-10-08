import { cn, formatDate } from "@/lib/utils";
import { ClockIcon } from "@/components/ui/Icons";

type ArticleMetaProps = {
  authorName?: string;
  publishedAt?: string;
  readingTime?: number;
  inverse?: boolean;
  size?: "sm" | "md";
  className?: string;
};

export function ArticleMeta({ authorName, publishedAt, readingTime, inverse = false, size = "sm", className }: ArticleMetaProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-x-3 gap-y-1", size === "sm" ? "text-[12.5px]" : "text-[13.5px]", inverse ? "text-white/85" : "text-ink-subtle", className)}>
      {authorName ? <span className={cn("font-medium", inverse ? "text-white" : "text-ink-muted")}>{authorName}</span> : null}
      {publishedAt ? (
        <span className="inline-flex items-center gap-1">
          <ClockIcon size={13} />
          <time dateTime={publishedAt}>{formatDate(publishedAt)}</time>
        </span>
      ) : null}
      {readingTime ? <span>{readingTime} min read</span> : null}
    </div>
  );
}
