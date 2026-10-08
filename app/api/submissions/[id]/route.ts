import { NextResponse } from "next/server";
import { loadSubmissions } from "@/lib/content-store";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export async function GET(request: Request, { params }: RouteContext<"/api/submissions/[id]">) {
  if (!rateLimit(`status:${clientIp(request)}`, 30, 60 * 60 * 1000)) {
    return NextResponse.json({ ok: false, error: "Too many requests." }, { status: 429 });
  }
  const { id } = await params;
  const submission = (await loadSubmissions()).find((item) => item.id === id);
  if (!submission) {
    return NextResponse.json({ ok: false, error: "Submission not found." }, { status: 404 });
  }
  return NextResponse.json({
    ok: true,
    submission: { id: submission.id, title: submission.title, status: submission.status, createdAt: submission.createdAt, updatedAt: submission.updatedAt },
  });
}
