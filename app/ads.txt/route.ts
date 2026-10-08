import { adsTxtLine } from "@/lib/ads";
import { getSettings } from "@/lib/blog";

export async function GET() {
  const settings = await getSettings();
  const line = adsTxtLine(settings.ads);
  if (!line) return new Response("Not found", { status: 404 });
  return new Response(`${line}\n`, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
