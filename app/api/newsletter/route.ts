import { NextResponse } from "next/server";
import { memoryStore } from "@/lib/store";
import { isValidEmail } from "@/lib/validation";

export async function POST(request: Request) {
  let email = "";
  try {
    const body = (await request.json()) as { email?: unknown };
    email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ ok: false, error: "Enter a valid email address." }, { status: 422 });
  }
  const alreadySubscribed = memoryStore.subscribers.has(email);
  memoryStore.subscribers.add(email);
  return NextResponse.json({ ok: true, alreadySubscribed });
}
