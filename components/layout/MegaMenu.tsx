"use client";

import Image from "next/image";
import Link from "next/link";
import type { NavItem } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { utilityNavigation } from "@/config/navigation";
import { articleHref, searchHref } from "@/lib/routes";
import { padRank } from "@/lib/utils";
import type { MenuData } from "@/types/navigation";
import { Button } from "@/components/ui/Button";
import { ArrowRightIcon, ArrowUpRightIcon, PenIcon } from "@/components/ui/Icons";

type MegaMenuProps = {
  id: string;
  categories: NavItem[];
  data: MenuData;
  onNavigate: () => void;
};

export function MegaMenu({ id, categories, data, onNavigate }: MegaMenuProps) {
  return (
    <div id={id} className="absolute inset-x-0 top-full hidden border-t border-line bg-white shadow-[0_24px_48px_-24px_rgba(0,27,61,0.28)] [animation:slide-down_260ms_cubic-bezier(0.2,0.7,0.2,1)_both] lg:block">
      <div className="container-site grid grid-cols-12 gap-10 py-10">
        <div className="col-span-5">
          <p className="kicker mb-5 text-ink-subtle">Sections</p>
          <ul className="grid grid-cols-2 gap-x-8 gap-y-1">
            {categories.map((category) => (
              <li key={category.href}>
                <Link href={category.href} onClick={onNavigate} className="group block rounded-md py-2.5">
                  <span className="flex items-center gap-2 text-[17px] font-semibold tracking-tight text-ink group-hover:text-brand">
                    {category.label}
                    <ArrowRightIcon size={14} className="-translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                  </span>
                  {category.description ? <span className="mt-0.5 block text-[13px] leading-snug text-ink-subtle">{category.description}</span> : null}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-3 border-l border-line pl-10">
          <p className="kicker mb-5 text-ink-subtle">Trending now</p>
          <ol className="space-y-5">
            {data.trending.map((article, index) => (
              <li key={article.slug} className="flex gap-3">
                <span className="font-mono text-[13px] text-accent">{padRank(index)}</span>
                <Link href={articleHref(article.slug)} onClick={onNavigate} className="text-[15px] font-medium leading-snug text-ink hover:text-brand">
                  {article.title}
                </Link>
              </li>
            ))}
          </ol>
          <p className="kicker mt-8 mb-3 text-ink-subtle">Popular topics</p>
          <div className="flex flex-wrap gap-2">
            {data.topics.map((topic) => (
              <Link key={topic} href={searchHref(topic)} onClick={onNavigate} className="rounded-sm border border-line px-2.5 py-1 text-[13px] text-ink-muted hover:border-brand hover:text-brand">
                {topic}
              </Link>
            ))}
          </div>
        </div>

        <div className="col-span-4 border-l border-line pl-10">
          {data.featured ? (
            <Link href={articleHref(data.featured.slug)} onClick={onNavigate} className="group block">
              <p className="kicker mb-4 text-ink-subtle">Featured</p>
              <div className="relative aspect-[16/10] overflow-hidden rounded-sm bg-surface-muted">
                <Image src={data.featured.image} alt={data.featured.imageAlt} fill sizes="380px" className="img-zoom object-cover" />
              </div>
              <p className="kicker mt-4 text-brand">{data.featured.categoryName}</p>
              <p className="mt-2 text-[19px] font-semibold leading-snug tracking-tight text-ink group-hover:text-brand">{data.featured.title}</p>
            </Link>
          ) : null}
          <div className="mt-8 rounded-md bg-brand p-5 text-white">
            <p className="text-[17px] font-semibold tracking-tight">Have a story worth telling?</p>
            <p className="mt-1 text-[13.5px] leading-relaxed text-white/75">Pitch or submit an original article to our editors.</p>
            <Button href={utilityNavigation.writeForUs.href} onClick={onNavigate} variant="inverse" size="sm" className="mt-4" icon={<PenIcon size={15} />} iconPosition="start">
              {utilityNavigation.writeForUs.label}
            </Button>
          </div>
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
            {siteConfig.social.map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[13px] font-medium text-ink-muted hover:text-brand">
                {link.label} <ArrowUpRightIcon size={13} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
