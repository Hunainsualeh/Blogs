import type { Metadata } from "next";
import { Suspense } from "react";
import { getAllCategories } from "@/lib/blog";
import { buildMetadata } from "@/lib/seo";
import { BlogEditor } from "@/components/editor/BlogEditor";

export const metadata: Metadata = buildMetadata({
  title: "Submit an Article",
  description: "Write, preview and submit your article to the Global Insights Daily editorial team.",
  path: "/submit",
  noIndex: true,
});

async function Editor() {
  return <BlogEditor categories={await getAllCategories()} />;
}

export default function SubmitPage() {
  return (
    <Suspense>
      <Editor />
    </Suspense>
  );
}
