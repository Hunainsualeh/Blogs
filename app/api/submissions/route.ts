import { NextResponse } from "next/server";
import type { Submission, SubmissionDraft, SubmissionReceipt } from "@/types/submission";
import { memoryStore } from "@/lib/store";
import { validateSubmission } from "@/lib/validation";

function createSubmissionId() {
  const random = crypto.randomUUID().replace(/-/g, "").slice(0, 6).toUpperCase();
  return `NL-${random}`;
}

export async function POST(request: Request) {
  let draft: SubmissionDraft;
  try {
    draft = (await request.json()) as SubmissionDraft;
  } catch {
    return NextResponse.json({ ok: false, error: "The submission could not be read." }, { status: 400 });
  }

  if (!draft || typeof draft !== "object" || !Array.isArray(draft.content) || !draft.author) {
    return NextResponse.json({ ok: false, error: "The submission is incomplete." }, { status: 400 });
  }

  const errors = validateSubmission(draft);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, error: "Please fix the highlighted fields.", errors }, { status: 422 });
  }

  const now = new Date().toISOString();
  const submission: Submission = { ...draft, id: createSubmissionId(), status: "submitted", createdAt: now, updatedAt: now };
  memoryStore.submissions.set(submission.id, submission);

  const receipt: SubmissionReceipt = {
    id: submission.id,
    title: submission.title,
    status: submission.status,
    createdAt: submission.createdAt,
    persisted: "memory",
  };
  return NextResponse.json({ ok: true, receipt }, { status: 201 });
}
