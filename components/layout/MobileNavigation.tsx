"use client";

import Link from "next/link";
import type { NavItem } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { utilityNavigation } from "@/config/navigation";
import { articleHref, searchHref } from "@/lib/routes";
import { padRank } from "@/lib/utils";
import type { MenuData } from "@/types/navigation";
import { Button } from "@/components/ui/Button";
import { ArrowRightIcon, PenIcon } from "@/components/ui/Icons";

type MobileNavigationProps = {
  id: string;
  items: NavItem[];
  data: MenuData;
  onNavigate: () => void;
};

export function MobileNavigation({ id, items, data, onNavigate }: MobileNavigationProps) {
  return (
    <div id={id} className="fixed inset-x-0 bottom-0 top-[var(--header-height,64px)] z-40 overflow-y-auto border-t border-line bg-white [animation:fade-in_200ms_ease_both] lg:hidden">
      <div className="container-site flex flex-col gap-10 py-8">
        <Button href={utilityNavigation.writeForUs.href} onClick={onNavigate} icon={<PenIcon size={16} />} iconPosition="start">
          Write for Us
        </Button>

        <nav aria-label="All sections">
          <p className="kicker mb-3 text-ink-subtle">Sections</p>
          <ul className="divide-y divide-line border-y border-line">
            {items.map((item, index) => (
              <li key={item.href} className="reveal" style={{ animationDelay: `${index * 25}ms` }}>
                <Link href={item.href} onClick={onNavigate} className="flex items-center justify-between py-3.5 text-[22px] font-semibold tracking-tight text-ink active:text-brand">
                  {item.label}
                  <ArrowRightIcon size={18} className="text-ink-subtle" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="kicker mb-4 text-ink-subtle">Trending</p>
          <ol className="space-y-4">
            {data.trending.slice(0, 4).map((article, index) => (
              <li key={article.slug} className="flex gap-3">
                <span className="font-mono text-[13px] text-accent">{padRank(index)}</span>
                <Link href={articleHref(article.slug)} onClick={onNavigate} className="text-[16px] font-medium leading-snug text-ink">
                  {article.title}
                </Link>
              </li>
            ))}
          </ol>
        </div>

        <div>
          <p className="kicker mb-3 text-ink-subtle">Popular topics</p>
          <div className="flex flex-wrap gap-2">
            {data.topics.map((topic) => (
              <Link key={topic} href={searchHref(topic)} onClick={onNavigate} className="rounded-sm border border-line px-3 py-1.5 text-sm text-ink-muted">
                {topic}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-line pt-6 pb-4">
          {siteConfig.social.map((link) => (
            <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-ink-muted">
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
