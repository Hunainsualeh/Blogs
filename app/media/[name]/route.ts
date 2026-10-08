import { readMedia } from "@/lib/storage";

export async function GET(_request: Request, { params }: RouteContext<"/media/[name]">) {
  const { name } = await params;
  const media = await readMedia(name);
  if (!media) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(media.bytes), {
    headers: {
      "Content-Type": media.mime,
      "Content-Length": String(media.bytes.length),
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'; sandbox",
    },
  });
}
