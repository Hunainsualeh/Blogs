import type { ArticleWithRelations } from "@/types/article";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PopularStories } from "./PopularStories";

export function LatestArticles({ articles, popular }: { articles: ArticleWithRelations[]; popular: ArticleWithRelations[] }) {
  return (
    <section aria-label="Latest stories" className="container-site mt-20">
      <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-14">
        <div>
          <SectionHeading title="Latest" eyebrow="Fresh from the newsroom" href="/search" linkLabel="Browse all stories" />
          <div className="divide-y divide-line">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} variant="horizontal" className="py-6 first:pt-0" />
            ))}
          </div>
        </div>
        <aside className="lg:sticky lg:top-[calc(var(--header-height,120px)+24px)] lg:self-start">
          <PopularStories articles={popular} />
        </aside>
      </div>
    </section>
  );
}
