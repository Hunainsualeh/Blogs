import type { ReactNode } from "react";
import { Breadcrumbs } from "./Breadcrumbs";

type ProsePageProps = {
  title: string;
  kicker?: string;
  intro?: string;
  children: ReactNode;
  updated?: string;
};

export function ProsePage({ title, kicker, intro, children, updated }: ProsePageProps) {
  return (
    <div className="container-site pt-6 sm:pt-8">
      <div className="mx-auto max-w-3xl">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: title }]} className="mb-4" />
        <header className="border-b border-ink pb-6">
          {kicker ? <p className="kicker mb-2 text-brand">{kicker}</p> : null}
          <h1 className="text-[34px] font-semibold leading-[1.08] tracking-[-0.035em] text-ink sm:text-[44px]">{title}</h1>
          {intro ? <p className="mt-4 font-serif text-[19px] leading-relaxed text-ink-muted">{intro}</p> : null}
          {updated ? <p className="mt-3 text-[13px] text-ink-subtle">Last updated {updated}</p> : null}
        </header>
        <div className="prose-page mt-8">{children}</div>
      </div>
    </div>
  );
}
