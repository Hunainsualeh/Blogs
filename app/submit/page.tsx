import type { Metadata } from "next";
import { getAllCategories } from "@/lib/blog";
import { buildMetadata } from "@/lib/seo";
import { BlogEditor } from "@/components/editor/BlogEditor";

export const metadata: Metadata = buildMetadata({
  title: "Write your article",
  description: "Write, preview and submit your article to the Northline editorial team.",
  path: "/submit",
  noIndex: true,
});

export default function SubmitPage() {
  return (
    <div className="container-site pt-2">
      <h1 className="sr-only">Write and submit your article</h1>
      <BlogEditor categories={getAllCategories()} />
    </div>
  );
}
