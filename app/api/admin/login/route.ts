import { NextResponse } from "next/server";
import { ADMIN_COOKIE, adminConfigured, createSessionToken, passwordMatches, sessionCookieOptions } from "@/lib/admin-auth";
import { readJson } from "@/lib/admin-api";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  if (!adminConfigured()) {
    return NextResponse.json({ ok: false, error: "The admin area is not configured. Set ADMIN_PASSWORD to at least 12 characters." }, { status: 503 });
  }
  if (!rateLimit(`login:${clientIp(request)}`, 8, 15 * 60 * 1000)) {
    return NextResponse.json({ ok: false, error: "Too many attempts. Try again in a few minutes." }, { status: 429 });
  }
  const body = await readJson(request);
  const password = typeof body?.password === "string" ? body.password : "";
  if (!(await passwordMatches(password))) {
    return NextResponse.json({ ok: false, error: "That password is not correct." }, { status: 401 });
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, await createSessionToken(), sessionCookieOptions);
  return response;
}
