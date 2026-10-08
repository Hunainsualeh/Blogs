"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ArticleStatus } from "@/types/article";
import { Textarea } from "@/components/forms/Textarea";
import { Button } from "@/components/ui/Button";
import { adminRequest } from "./api";

export function SubmissionActions({ id, status, articleId }: { id: string; status: ArticleStatus; articleId?: string }) {
  const router = useRouter();
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function act(action: "start-review" | "approve" | "reject") {
    setBusy(true);
    setMessage(null);
    const result = await adminRequest<{ articleId?: string }>("PATCH", `/api/admin/submissions/${id}`, { action, note });
    setBusy(false);
    if (!result.ok) {
      setMessage(`${result.error ?? "Action failed."} ${result.errors ? Object.values(result.errors).join(" ") : ""}`);
      return;
    }
    if (action === "approve" && result.data?.articleId) {
      router.push(`/admin/articles/${result.data.articleId}`);
      return;
    }
    router.refresh();
  }

  const closed = status === "rejected" || status === "published" || Boolean(articleId);

  return (
    <section className="mt-6 rounded-md border border-line bg-white p-5">
      <h2 className="text-[16px] font-semibold text-ink">Editorial decision</h2>
      {articleId ? (
        <p className="mt-3 text-sm text-ink-muted">
          A draft article was created from this submission. <Link href={`/admin/articles/${articleId}`} className="text-brand underline">Open the draft</Link> to edit and publish it.
        </p>
      ) : closed ? (
        <p className="mt-3 text-sm text-ink-muted">This submission has been closed.</p>
      ) : (
        <div className="mt-4 space-y-4">
          <Textarea id="review-note" label="Note to keep with this decision" optional rows={3} value={note} onChange={(event) => setNote(event.target.value)} />
          <div className="flex flex-wrap gap-3">
            {status === "submitted" ? <Button variant="outline" size="sm" disabled={busy} onClick={() => act("start-review")}>Start review</Button> : null}
            <Button size="sm" disabled={busy} onClick={() => act("approve")}>Approve and create draft</Button>
            <Button variant="danger" size="sm" disabled={busy} onClick={() => act("reject")}>Reject</Button>
          </div>
          <p className="text-[12.5px] text-ink-subtle">Approving never publishes the article. It creates a draft for you to edit and publish.</p>
        </div>
      )}
      {message ? <p className="mt-3 text-sm text-danger" role="alert">{message}</p> : null}
    </section>
  );
}
