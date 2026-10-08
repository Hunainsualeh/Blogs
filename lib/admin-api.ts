import "server-only";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { requireAdminRequest } from "./admin-auth";

export async function guard(request: Request) {
  if (!(await requireAdminRequest(request))) {
    return NextResponse.json({ ok: false, error: "You are not signed in." }, { status: 401 });
  }
  return null;
}

export async function readJson(request: Request): Promise<Record<string, unknown> | null> {
  try {
    const body = await request.json();
    return body && typeof body === "object" && !Array.isArray(body) ? (body as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

export function refreshContent() {
  revalidateTag("content", { expire: 0 });
}

export function badRequest(message: string, errors?: Record<string, string>) {
  return NextResponse.json({ ok: false, error: message, errors }, { status: 422 });
}
