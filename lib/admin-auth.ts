import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";

export const ADMIN_COOKIE = "gid_admin";
const SESSION_SECONDS = 60 * 60 * 8;

const encoder = new TextEncoder();

export function adminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_PASSWORD.length >= 12);
}

function secret() {
  return process.env.ADMIN_SESSION_SECRET ?? `gid-session:${process.env.ADMIN_PASSWORD ?? ""}`;
}

function toHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function sign(payload: string) {
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret()), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return toHex(await crypto.subtle.sign("HMAC", key, encoder.encode(payload)));
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let index = 0; index < a.length; index += 1) diff |= a.charCodeAt(index) ^ b.charCodeAt(index);
  return diff === 0;
}

export async function passwordMatches(candidate: string) {
  const expected = process.env.ADMIN_PASSWORD ?? "";
  if (!adminConfigured()) return false;
  const [a, b] = await Promise.all([sign(`pw:${candidate}`), sign(`pw:${expected}`)]);
  return safeEqual(a, b);
}

export async function createSessionToken() {
  const expires = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  const nonce = crypto.randomUUID();
  const payload = `${expires}.${nonce}`;
  return `${payload}.${await sign(payload)}`;
}

export async function verifySessionToken(token: string | undefined) {
  if (!token || !adminConfigured()) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [expires, nonce, signature] = parts;
  if (Number(expires) < Math.floor(Date.now() / 1000)) return false;
  return safeEqual(signature, await sign(`${expires}.${nonce}`));
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "strict" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_SECONDS,
};

export async function isAdmin() {
  const store = await cookies();
  return verifySessionToken(store.get(ADMIN_COOKIE)?.value);
}

export async function requireAdminPage() {
  await connection();
  if (!(await isAdmin())) redirect("/admin/login");
}

export async function requireAdminRequest(request: Request) {
  const origin = request.headers.get("origin");
  if (origin) {
    const host = request.headers.get("host");
    if (!host || new URL(origin).host !== host) return false;
  }
  const header = request.headers.get("cookie") ?? "";
  const match = header.split(/;\s*/).find((part) => part.startsWith(`${ADMIN_COOKIE}=`));
  return verifySessionToken(match?.slice(ADMIN_COOKIE.length + 1));
}
