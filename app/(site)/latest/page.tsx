import type { Metadata } from "next";
import { LatestView } from "@/components/archive/LatestView";
import { latestHref } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Latest Articles",
  description: "The newest articles from Global Insights Daily across technology, business, health, travel, lifestyle and more.",
  path: latestHref(),
});

export default function LatestPage() {
  return <LatestView page={1} />;
}
