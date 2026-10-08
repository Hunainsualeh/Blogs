import type { ReactNode } from "react";
import { Breadcrumbs } from "./Breadcrumbs";

type ProsePageProps = {
  title: string;
  kicker?: string;
  intro?: string;
  children: ReactNode;
  updated?: string;
  banner?: ReactNode;
};

export function ProsePage({ title, intro, children, updated, banner }: ProsePageProps) {
  return (
    <div className="container-site pt-6 sm:pt-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: title }]} className="mb-5" />
      <h1 className="text-[36px] font-bold leading-[1.05] tracking-[-0.035em] text-ink sm:text-[56px]">{title}</h1>
      {banner ? <div className="mt-8">{banner}</div> : null}
      <div className="mx-auto mt-8 max-w-[820px]">
        {intro ? <p className="mb-6 text-[19px] leading-relaxed text-ink-muted">{intro}</p> : null}
        {updated ? <p className="mb-6 text-[13px] text-ink-subtle">Last updated {updated}</p> : null}
        <div className="prose-page">{children}</div>
      </div>
    </div>
  );
}
