"use client";

import Link from "next/link";
import { trendingSearches } from "@/config/navigation";
import { articleHref, searchHref } from "@/lib/routes";
import type { MenuData } from "@/types/navigation";
import { Modal } from "@/components/ui/Modal";
import { SearchInput } from "@/components/ui/SearchInput";
import { CloseIcon, TrendingIcon } from "@/components/ui/Icons";

export function SearchOverlay({ open, onClose, data }: { open: boolean; onClose: () => void; data: MenuData }) {
  return (
    <Modal open={open} onClose={onClose} title="Search" hideTitle placement="top" className="border-b border-line">
      <div className="container-site py-6 sm:py-10">
        <div className="mb-6 flex items-center justify-between">
          <p className="kicker text-ink-subtle">Search Northline</p>
          <button type="button" onClick={onClose} className="-mr-2 inline-flex items-center gap-2 rounded-md p-2 text-sm text-ink-muted hover:text-ink" aria-label="Close search">
            <span className="hidden sm:inline">Esc</span>
            <CloseIcon />
          </button>
        </div>
        <SearchInput size="lg" autoFocus onNavigate={onClose} />
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <div>
            <p className="kicker mb-3 flex items-center gap-2 text-ink-subtle"><TrendingIcon size={14} /> Trending searches</p>
            <div className="flex flex-wrap gap-2">
              {trendingSearches.map((term) => (
                <Link key={term} href={searchHref(term)} onClick={onClose} className="rounded-sm border border-line px-3 py-1.5 text-sm text-ink-muted hover:border-brand hover:text-brand">
                  {term}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="kicker mb-3 text-ink-subtle">Popular right now</p>
            <ul className="space-y-2.5">
              {data.trending.slice(0, 3).map((article) => (
                <li key={article.slug}>
                  <Link href={articleHref(article.slug)} onClick={onClose} className="text-[15px] font-medium leading-snug text-ink hover:text-brand">
                    {article.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Modal>
  );
}
