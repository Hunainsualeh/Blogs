"use client";

import type { Category } from "@/types/category";
import type { SubmissionDraft } from "@/types/submission";
import { readingTime } from "@/lib/utils";
import { ArticleBody } from "@/components/blog/ArticleBody";
import { ArticleHeader } from "@/components/blog/ArticleHeader";
import { EyeIcon } from "@/components/ui/Icons";

export function PreviewPanel({ draft, category }: { draft: SubmissionDraft; category?: Category }) {
  return (
    <div>
      <p className="mb-8 flex items-center gap-2 rounded-md bg-brand-soft px-4 py-3 text-[13.5px] text-brand">
        <EyeIcon size={16} /> This is exactly how your article will look when published. Empty blocks are hidden.
      </p>
      <ArticleHeader
        title={draft.title}
        excerpt={draft.excerpt}
        category={category}
        author={{ name: draft.author.name || "Your name" }}
        readingTime={readingTime(draft.content)}
        image={draft.featuredImage}
        linkCategory={false}
      />
      <ArticleBody blocks={draft.content} className="mt-12" />
    </div>
  );
}
