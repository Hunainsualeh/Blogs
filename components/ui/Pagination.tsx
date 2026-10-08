import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "./Icons";

type PaginationProps = {
  page: number;
  totalPages: number;
  hrefForPage: (page: number) => string;
  className?: string;
};

function visiblePages(page: number, total: number) {
  const pages = new Set([1, total, page, page - 1, page + 1]);
  return [...pages].filter((value) => value >= 1 && value <= total).sort((a, b) => a - b);
}

export function Pagination({ page, totalPages, hrefForPage, className }: PaginationProps) {
  if (totalPages <= 1) return null;
  const pages = visiblePages(page, totalPages);
  const item = "inline-flex h-10 min-w-10 items-center justify-center rounded-sm border px-3 text-sm font-medium transition-colors";

  return (
    <nav aria-label="Pagination" className={cn("flex flex-wrap items-center justify-center gap-1.5", className)}>
      {page > 1 ? (
        <Link href={hrefForPage(page - 1)} rel="prev" aria-label="Previous page" className={cn(item, "border-line bg-white text-ink hover:border-brand hover:text-brand")}>
          <ChevronLeftIcon size={16} />
        </Link>
      ) : null}
      {pages.map((number, index) => (
        <span key={number} className="flex items-center gap-1.5">
          {index > 0 && number - pages[index - 1] > 1 ? <span className="px-1 text-ink-subtle" aria-hidden>…</span> : null}
          {number === page ? (
            <span aria-current="page" className={cn(item, "border-brand bg-brand text-white")}>{number}</span>
          ) : (
            <Link href={hrefForPage(number)} aria-label={`Page ${number}`} className={cn(item, "border-line bg-white text-ink hover:border-brand hover:text-brand")}>{number}</Link>
          )}
        </span>
      ))}
      {page < totalPages ? (
        <Link href={hrefForPage(page + 1)} rel="next" aria-label="Next page" className={cn(item, "border-line bg-white text-ink hover:border-brand hover:text-brand")}>
          <ChevronRightIcon size={16} />
        </Link>
      ) : null}
    </nav>
  );
}
