import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { LatestView } from "@/components/archive/LatestView";
import { getLatestPage } from "@/lib/blog";
import { latestHref } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";
import { ArticleListSkeleton } from "@/components/ui/Skeleton";

export async function generateStaticParams() {
  const { totalPages } = await getLatestPage(1);
  return Array.from({ length: Math.max(0, totalPages - 1) }, (_, index) => ({ page: String(index + 2) }));
}

export async function generateMetadata({ params }: PageProps<"/latest/page/[page]">): Promise<Metadata> {
  const { page } = await params;
  return buildMetadata({
    title: `Latest Articles, Page ${page}`,
    description: "The newest articles from Global Insights Daily across technology, business, health, travel, lifestyle and more.",
    path: latestHref(Number(page)),
  });
}

export default function LatestPaginatedPage({ params }: PageProps<"/latest/page/[page]">) {
  return (
    <Suspense fallback={<div className="container-site pt-10"><ArticleListSkeleton count={4} /></div>}>
      <LatestContent params={params} />
    </Suspense>
  );
}

async function LatestContent({ params }: { params: PageProps<"/latest/page/[page]">["params"] }) {
  const { page } = await params;
  const pageNumber = Number(page);
  if (!Number.isInteger(pageNumber) || pageNumber < 1) notFound();
  if (pageNumber === 1) redirect(latestHref());
  const { totalPages } = await getLatestPage(pageNumber);
  if (pageNumber > totalPages) notFound();
  return <LatestView page={pageNumber} />;
}
