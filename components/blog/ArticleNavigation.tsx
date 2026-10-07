import Link from "next/link";
import type { ArticleWithRelations } from "@/types/article";
import { articleHref } from "@/lib/routes";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/ui/Icons";

export function ArticleNavigation({ previous, next }: { previous?: ArticleWithRelations; next?: ArticleWithRelations }) {
  if (!previous && !next) return null;
  return (
    <nav aria-label="More in this section" className="grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2">
      {previous ? (
        <Link href={articleHref(previous.slug)} className="group flex flex-col gap-2 bg-white p-6 hover:bg-surface-muted">
          <span className="kicker flex items-center gap-2 text-ink-subtle"><ArrowLeftIcon size={14} /> Previous</span>
          <span className="text-[17px] font-semibold leading-snug tracking-tight text-ink group-hover:text-brand">{previous.title}</span>
        </Link>
      ) : <span className="hidden bg-white sm:block" />}
      {next ? (
        <Link href={articleHref(next.slug)} className="group flex flex-col gap-2 bg-white p-6 text-right hover:bg-surface-muted">
          <span className="kicker flex items-center justify-end gap-2 text-ink-subtle">Next <ArrowRightIcon size={14} /></span>
          <span className="text-[17px] font-semibold leading-snug tracking-tight text-ink group-hover:text-brand">{next.title}</span>
        </Link>
      ) : <span className="hidden bg-white sm:block" />}
    </nav>
  );
}
