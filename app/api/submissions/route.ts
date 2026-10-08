import { NextResponse } from "next/server";
import type { Submission, SubmissionDraft, SubmissionReceipt } from "@/types/submission";
import { loadCategories, addSubmission } from "@/lib/content-store";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { cleanImage, cleanLine, cleanText, cleanUrl, sanitizeBlocks, sanitizeTags } from "@/lib/sanitize";
import { storageMode } from "@/lib/storage";
import { isValidEmail, validateSubmission } from "@/lib/validation";

function createSubmissionId() {
  const random = crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase();
  return `GID-${random}`;
}

export async function POST(request: Request) {
  if (!rateLimit(`submit:${clientIp(request)}`, 5, 60 * 60 * 1000)) {
    return NextResponse.json({ ok: false, error: "Too many submissions from this connection. Please try again later." }, { status: 429 });
  }
  let raw: Record<string, unknown>;
  try {
    raw = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "The submission could not be read." }, { status: 400 });
  }
  if (!raw || typeof raw !== "object" || !Array.isArray(raw.content) || !raw.author || typeof raw.author !== "object") {
    return NextResponse.json({ ok: false, error: "The submission is incomplete." }, { status: 400 });
  }
  if (raw.agreed !== true) {
    return NextResponse.json({ ok: false, error: "Please confirm the originality statement before submitting.", errors: { agreed: "Please confirm the statement above before submitting." } }, { status: 422 });
  }
  if (typeof raw.website === "string" && raw.website.trim()) {
    return NextResponse.json({ ok: true, receipt: { id: createSubmissionId(), title: "Submission received", status: "submitted", createdAt: new Date().toISOString(), persisted: storageMode } }, { status: 201 });
  }

  const author = raw.author as Record<string, unknown>;
  const options = { allowExternalImages: false };
  const draft: SubmissionDraft = {
    title: cleanLine(raw.title, 200),
    excerpt: cleanLine(raw.excerpt, 400),
    category: cleanLine(raw.category, 80),
    tags: sanitizeTags(raw.tags),
    featuredImage: cleanImage(raw.featuredImage, options),
    content: sanitizeBlocks(raw.content, options),
    author: {
      name: cleanLine(author.name, 120),
      email: cleanLine(author.email, 200),
      bio: cleanText(author.bio, 600),
      profileUrl: cleanUrl(author.profileUrl),
    },
  };

  const categories = await loadCategories();
  const errors = validateSubmission(
    draft,
    categories.map((category) => category.slug),
  );
  if (!isValidEmail(draft.author.email)) errors.authorEmail = "Enter a valid email address.";
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, error: "Please fix the highlighted fields.", errors }, { status: 422 });
  }

  const now = new Date().toISOString();
  const submission: Submission = { ...draft, id: createSubmissionId(), status: "submitted", createdAt: now, updatedAt: now };
  await addSubmission(submission);

  const receipt: SubmissionReceipt = {
    id: submission.id,
    title: submission.title,
    status: submission.status,
    createdAt: submission.createdAt,
    persisted: storageMode,
  };
  return NextResponse.json({ ok: true, receipt }, { status: 201 });
}
