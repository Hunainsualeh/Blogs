import { Fragment, Suspense } from "react";
import { getArticlesByCategory, getFeaturedArticles, getHomeCategories, getLatestPage } from "@/lib/blog";
import { siteConfig } from "@/config/site";
import { AdSlot } from "@/components/ads/AdSlot";
import { CategorySection } from "@/components/home/CategorySection";
import { HeroMosaic } from "@/components/home/HeroMosaic";
import { LatestSection } from "@/components/home/LatestSection";
import { WriteForUsBand } from "@/components/home/WriteForUsBand";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { EmptyState } from "@/components/ui/EmptyState";

export default async function HomePage() {
  const featured = await getFeaturedArticles(4);
  if (featured.length === 0) {
    return (
      <div className="container-site pt-16">
        <h1 className="sr-only">{siteConfig.name}</h1>
        <EmptyState title="Articles are on the way" description="Our editors are preparing the first stories. Please check back soon." />
      </div>
    );
  }
  const latest = await getLatestPage(1, 6, featured.map((article) => article.slug));
  const homeCategories = await getHomeCategories();
  const bandIndex = Math.min(3, homeCategories.length - 1);

  return (
    <>
      <h1 className="sr-only">{siteConfig.name}: {siteConfig.tagline}</h1>
      <HeroMosaic articles={featured} />
      <div className="container-site">
        <AdSlot placement="home-after-featured" />
      </div>

      <div className="container-site mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-10">
        <div className="min-w-0 space-y-12">
          <LatestSection articles={latest.items} hasMore={latest.totalPages > 1} />
          {homeCategories.map((category, index) => (
            <Fragment key={category.slug}>
              <Suspense>
                <HomeCategory slug={category.slug} />
              </Suspense>
              {index % 2 === 1 && index < homeCategories.length - 1 ? <AdSlot placement="home-between-categories" className="!my-0" /> : null}
              {index === bandIndex ? <WriteForUsBand /> : null}
            </Fragment>
          ))}
        </div>
        <Suspense>
          <Sidebar variant="archive" />
        </Suspense>
      </div>
    </>
  );
}

async function HomeCategory({ slug }: { slug: string }) {
  const [homeCategories, articles] = await Promise.all([getHomeCategories(), getArticlesByCategory(slug, 5)]);
  const category = homeCategories.find((item) => item.slug === slug);
  if (!category) return null;
  return <CategorySection category={category} articles={articles} />;
}
