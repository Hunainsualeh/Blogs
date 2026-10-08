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
  const [recent, popular] = await Promise.all([getLatestArticles(5, excludeSlug ? [excludeSlug] : []), getPopularArticles(6)]);
  const popularList = popular.filter((article) => article.slug !== excludeSlug).slice(0, 5);
  return (
    <aside aria-label="Sidebar" className={className}>
      <div className="flex flex-col gap-9">
        <SidebarWidget title={variant === "archive" ? "Trending Now" : "Popular Posts"}>
          <PostList articles={popularList} ranked />
        </SidebarWidget>
        <AdSlot placement={variant === "article" ? "article-sidebar" : "archive-sidebar"} className="!my-0" />
        <SidebarWidget title="Recent Posts">
          <PostList articles={recent} />
        </SidebarWidget>
        <CategoriesWidget activeSlug={activeCategory} />
        {variant === "archive" ? <WriteForUsCard /> : null}
      </div>
    </aside>
  );
}
