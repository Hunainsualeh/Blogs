import { categoryNavigation, primaryNavigation } from "@/config/navigation";
import { getFeaturedArticles, getPopularTopics, getTrendingArticles } from "@/lib/blog";
import type { ArticleWithRelations } from "@/types/article";
import type { MenuArticle, MenuData } from "@/types/navigation";
import { HeaderClient } from "./HeaderClient";

function toMenuArticle(article: ArticleWithRelations): MenuArticle {
  return {
    slug: article.slug,
    title: article.title,
    categoryName: article.categoryInfo.name,
    image: article.featuredImage.src,
    imageAlt: article.featuredImage.alt,
    excerpt: article.excerpt,
    readingTime: article.readingTime,
  };
}

export function Header() {
  const featured = getFeaturedArticles(1)[0];
  const menuData: MenuData = {
    trending: getTrendingArticles(5).map(toMenuArticle),
    featured: featured ? toMenuArticle(featured) : null,
    topics: getPopularTopics(10),
  };
  return <HeaderClient navigation={primaryNavigation} categories={categoryNavigation} menuData={menuData} />;
}
