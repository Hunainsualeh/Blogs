import { requireAdminPage } from "@/lib/admin-auth";
import Link from "next/link";
import { notFound } from "next/navigation";
import { loadCategories, loadSubmissions } from "@/lib/content-store";
import { STATUS_LABELS } from "@/lib/constants";
import { contentWordCount, formatDate, readingTime } from "@/lib/utils";
import { SubmissionActions } from "@/components/admin/SubmissionActions";
import { ArticleBody } from "@/components/blog/ArticleBody";
import { ArticleHeader } from "@/components/blog/ArticleHeader";
import { Badge } from "@/components/ui/Badge";

export default async function SubmissionDetailPage({ params }: PageProps<"/admin/submissions/[id]">) {
  await requireAdminPage();
  const { id } = await params;
  const [submissions, categories] = await Promise.all([loadSubmissions(), loadCategories()]);
  const submission = submissions.find((item) => item.id === id);
  if (!submission) notFound();
  const category = categories.find((item) => item.slug === submission.category);

  return (
    <div className="max-w-5xl">
      <Link href="/admin/submissions" className="text-sm text-ink-muted hover:text-ink">Back to submissions</Link>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <h1 className="text-[26px] font-semibold tracking-[-0.03em] text-ink">{submission.title}</h1>
        <Badge tone="brand">{STATUS_LABELS[submission.status]}</Badge>
      </div>
      <dl className="mt-5 grid gap-4 rounded-md border border-line bg-white p-5 text-sm sm:grid-cols-2">
        <div><dt className="kicker text-ink-subtle">Contributor</dt><dd className="mt-1 text-ink">{submission.author.name}</dd></div>
        <div><dt className="kicker text-ink-subtle">Email (private)</dt><dd className="mt-1"><a className="text-brand" href={`mailto:${submission.author.email}`}>{submission.author.email}</a></dd></div>
        <div><dt className="kicker text-ink-subtle">Website or profile</dt><dd className="mt-1 break-all text-ink">{submission.author.profileUrl || "None"}</dd></div>
        <div><dt className="kicker text-ink-subtle">Received</dt><dd className="mt-1 text-ink">{formatDate(submission.createdAt, "long")}</dd></div>
        <div><dt className="kicker text-ink-subtle">Words</dt><dd className="mt-1 text-ink">{contentWordCount(submission.content)}</dd></div>
        <div><dt className="kicker text-ink-subtle">Tags</dt><dd className="mt-1 text-ink">{submission.tags.join(", ")}</dd></div>
        <div className="sm:col-span-2"><dt className="kicker text-ink-subtle">Bio</dt><dd className="mt-1 text-ink">{submission.author.bio}</dd></div>
        {submission.reviewNote ? <div className="sm:col-span-2"><dt className="kicker text-ink-subtle">Review note</dt><dd className="mt-1 text-ink">{submission.reviewNote}</dd></div> : null}
      </dl>

      <SubmissionActions id={submission.id} status={submission.status} articleId={submission.articleId} />

      <div className="mt-8 rounded-md border border-line bg-white p-6 sm:p-10">
        <ArticleHeader title={submission.title} excerpt={submission.excerpt} category={category} author={{ name: submission.author.name }} readingTime={readingTime(submission.content)} image={submission.featuredImage} linkCategory={false} />
        <ArticleBody blocks={submission.content} className="mt-8" />
      </div>
    </div>
  );
}
