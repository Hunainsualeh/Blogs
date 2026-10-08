"use client";

import Link from "next/link";
import { categoryHref } from "@/lib/routes";
import { Modal } from "@/components/ui/Modal";
import { SearchInput } from "@/components/ui/SearchInput";
import { CloseIcon } from "@/components/ui/Icons";

export function SearchOverlay({ open, onClose, categories }: { open: boolean; onClose: () => void; categories: { slug: string; name: string }[] }) {
  return (
    <Modal open={open} onClose={onClose} title="Search" hideTitle placement="top" className="border-b border-line">
      <div className="container-site py-6 sm:py-10">
        <div className="mb-6 flex items-center justify-between">
          <p className="kicker text-ink-subtle">Search Global Insights Daily</p>
          <button type="button" onClick={onClose} className="-mr-2 inline-flex items-center gap-2 rounded-md p-2 text-sm text-ink-muted hover:text-ink" aria-label="Close search">
            <span className="hidden sm:inline">Esc</span>
            <CloseIcon />
          </button>
        </div>
        <SearchInput size="lg" autoFocus onNavigate={onClose} />
        <div className="mt-8">
          <p className="kicker mb-3 text-ink-subtle">Browse by category</p>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Link key={category.slug} href={categoryHref(category.slug)} onClick={onClose} className="rounded-sm border border-line px-3 py-1.5 text-sm text-ink-muted hover:border-brand hover:text-brand">
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
