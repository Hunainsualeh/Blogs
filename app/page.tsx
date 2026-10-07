import type { CategorySlug } from "@/types/category";
import { homepageCategoryOrder } from "@/config/navigation";
import { getArticlesByCategory, getCategory, getEditorsPicks, getFeaturedArticles, getLatestArticles, getPopularArticles, getTrendingArticles } from "@/lib/blog";
import { CategorySection, type CategorySectionLayout } from "@/components/home/CategorySection";
import { EditorsPicks } from "@/components/home/EditorsPicks";
import { Hero } from "@/components/home/Hero";
import { LatestArticles } from "@/components/home/LatestArticles";
import { Newsletter } from "@/components/home/Newsletter";
import { TrendingSection } from "@/components/home/TrendingSection";

const sectionLayouts: CategorySectionLayout[] = ["lead-left", "columns", "split", "overlay", "mosaic"];

export default function HomePage() {
  const featured = getFeaturedArticles(5);
  const [lead, ...secondary] = featured;
  const heroSlugs = featured.map((article) => article.slug);
  const latest = getLatestArticles(6, heroSlugs);

  return (
    <>
      <h1 className="sr-only">Northline: latest stories in tech, business, health, travel and more</h1>
      <Hero lead={lead} secondary={secondary} />
      <TrendingSection articles={getTrendingArticles(5)} />
      <LatestArticles articles={latest} popular={getPopularArticles(6)} />
      <EditorsPicks articles={getEditorsPicks(4)} />
      {homepageCategoryOrder.slice(0, 5).map((slug, index) => (
        <HomeCategory key={slug} slug={slug} layout={sectionLayouts[index % sectionLayouts.length]} />
      ))}
      <div className="container-site mt-24">
        <Newsletter />
      </div>
      {homepageCategoryOrder.slice(5).map((slug, index) => (
        <HomeCategory key={slug} slug={slug} layout={sectionLayouts[(index + 5) % sectionLayouts.length]} />
      ))}
    </>
  );
}

function HomeCategory({ slug, layout }: { slug: CategorySlug; layout: CategorySectionLayout }) {
  const category = getCategory(slug);
  if (!category) return null;
  return <CategorySection category={category} articles={getArticlesByCategory(slug)} layout={layout} />;
}
