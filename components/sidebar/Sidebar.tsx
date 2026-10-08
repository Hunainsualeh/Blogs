import { getLatestArticles, getPopularArticles } from "@/lib/blog";
import { AdSlot } from "@/components/ads/AdSlot";
import { CategoriesWidget } from "./CategoriesWidget";
import { PostList } from "./PostList";
import { SidebarWidget } from "./SidebarWidget";
import { WriteForUsCard } from "./WriteForUsCard";

type SidebarProps = {
  variant: "article" | "archive";
  excludeSlug?: string;
  activeCategory?: string;
  className?: string;
};

export async function Sidebar({ variant, excludeSlug, activeCategory, className }: SidebarProps) {
  const [recent, popular] = await Promise.all([
    getLatestArticles(5, excludeSlug ? [excludeSlug] : []),
    getPopularArticles(excludeSlug ? 6 : 5),
  ]);
  const popularList = popular.filter((article) => article.slug !== excludeSlug).slice(0, 5);
  return (
    <aside aria-label="Sidebar" className={className}>
      <div className="flex flex-col gap-8">
        <SidebarWidget title="Recent Posts">
          <PostList articles={recent} />
        </SidebarWidget>
        <SidebarWidget title="Popular Posts">
          <PostList articles={popularList} ranked />
        </SidebarWidget>
        <CategoriesWidget activeSlug={activeCategory} />
        <AdSlot placement={variant === "article" ? "article-sidebar" : "archive-sidebar"} className="!my-0 hidden lg:block" />
        {variant === "archive" ? <WriteForUsCard /> : null}
      </div>
    </aside>
  );
}
