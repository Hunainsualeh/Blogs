import { getLatestPage } from "@/lib/blog";
import { latestHref } from "@/lib/routes";
import { breadcrumbJsonLd, collectionJsonLd, JsonLd } from "@/lib/seo";
import { ArchiveView } from "./ArchiveView";

export async function LatestView({ page }: { page: number }) {
  const feed = await getLatestPage(page);
  return (
    <>
      <JsonLd data={collectionJsonLd("Latest Articles | Global Insights Daily", "The newest articles from Global Insights Daily.", latestHref(page))} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Latest Articles", path: latestHref() }])} />
      <ArchiveView
        title="Latest Articles"
        kicker={`${feed.total} ${feed.total === 1 ? "article" : "articles"}`}
        description="Everything we have published recently, newest first."
        crumbs={[{ label: "Home", href: "/" }, { label: "Latest Articles" }]}
        articles={feed.items}
        page={feed.page}
        totalPages={feed.totalPages}
        hrefForPage={latestHref}
        emptyTitle="No articles yet"
        emptyDescription="Our editors are preparing the first stories. Check back soon."
      />
    </>
  );
}
