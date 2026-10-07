import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "./Icons";

type PaginationProps = {
  page: number;
  totalPages: number;
  hrefForPage: (page: number) => string;
  className?: string;
};

export function Pagination({ page, totalPages, hrefForPage, className }: PaginationProps) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
  const itemBase = "inline-flex h-10 min-w-10 items-center justify-center rounded-md border px-3 text-sm font-medium transition-colors";

  return (
    <nav aria-label="Pagination" className={cn("flex items-center justify-between gap-4 border-t border-line pt-6", className)}>
      {page > 1 ? (
        <Link href={hrefForPage(page - 1)} className={cn(itemBase, "gap-1 border-line hover:border-ink")} rel="prev">
          <ChevronLeftIcon size={16} /> Newer
        </Link>
      ) : (
        <span className={cn(itemBase, "gap-1 border-line text-ink-subtle opacity-50")} aria-hidden>
          <ChevronLeftIcon size={16} /> Newer
        </span>
      )}
      <ol className="flex items-center gap-1.5">
        {pages.map((number) => (
          <li key={number}>
            {number === page ? (
              <span aria-current="page" className={cn(itemBase, "border-brand bg-brand text-white")}>
                {number}
              </span>
            ) : (
              <Link href={hrefForPage(number)} className={cn(itemBase, "border-line hover:border-ink")} aria-label={`Page ${number}`}>
                {number}
              </Link>
            )}
          </li>
        ))}
      </ol>
      {page < totalPages ? (
        <Link href={hrefForPage(page + 1)} className={cn(itemBase, "gap-1 border-line hover:border-ink")} rel="next">
          Older <ChevronRightIcon size={16} />
        </Link>
      ) : (
        <span className={cn(itemBase, "gap-1 border-line text-ink-subtle opacity-50")} aria-hidden>
          Older <ChevronRightIcon size={16} />
        </span>
      )}
    </nav>
  );
}
