import { NextResponse } from "next/server";
import { memoryStore } from "@/lib/store";

export async function GET(_request: Request, { params }: RouteContext<"/api/submissions/[id]">) {
  const { id } = await params;
  const submission = memoryStore.submissions.get(id);
  if (!submission) {
    return NextResponse.json({ ok: false, error: "Submission not found." }, { status: 404 });
  }
  return NextResponse.json({
    ok: true,
    submission: { id: submission.id, title: submission.title, status: submission.status, createdAt: submission.createdAt, updatedAt: submission.updatedAt },
  });
}
