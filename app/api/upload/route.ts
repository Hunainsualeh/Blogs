import { NextResponse } from "next/server";
import { SUBMISSION_LIMITS } from "@/lib/constants";
import { detectImageType } from "@/lib/image-bytes";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { saveMedia } from "@/lib/storage";

export async function POST(request: Request) {
  if (!rateLimit(`upload:${clientIp(request)}`, 40, 60 * 60 * 1000)) {
    return NextResponse.json({ ok: false, error: "Too many uploads. Please try again later." }, { status: 429 });
  }
  const declared = Number(request.headers.get("content-length") ?? 0);
  if (declared > SUBMISSION_LIMITS.maxImageBytes + 64 * 1024) {
    return NextResponse.json({ ok: false, error: "That image is too large." }, { status: 413 });
  }
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "The upload could not be read." }, { status: 400 });
  }
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "No image was provided." }, { status: 400 });
  }
  if (file.size > SUBMISSION_LIMITS.maxImageBytes) {
    return NextResponse.json({ ok: false, error: "Images must be smaller than 4 MB." }, { status: 413 });
  }
  const bytes = new Uint8Array(await file.arrayBuffer());
  const type = detectImageType(bytes);
  if (!type) {
    return NextResponse.json({ ok: false, error: "Use a JPG, PNG or WebP image." }, { status: 415 });
  }
  const name = `${crypto.randomUUID().replace(/-/g, "")}.${type.ext}`;
  await saveMedia(name, type.mime, bytes);
  return NextResponse.json({ ok: true, url: `/media/${name}` }, { status: 201 });
}
