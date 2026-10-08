import { requireAdminPage } from "@/lib/admin-auth";
import Link from "next/link";
import { adsRuntime, adsAreReady } from "@/lib/ads";
import { getAdminDashboard } from "@/lib/admin-data";
import { loadSettings } from "@/lib/content-store";
import { storageMode } from "@/lib/storage";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export default async function AdminDashboard() {
  await requireAdminPage();
  const [data, settings] = await Promise.all([getAdminDashboard(), loadSettings()]);
  const stats = [
    { label: "Published", value: data.published },
    { label: "Scheduled", value: data.scheduled },
    { label: "Drafts", value: data.drafts },
    { label: "Awaiting review", value: data.pending.length },
  ];
  const volatile = storageMode === "file" && Boolean(process.env.VERCEL);

  return (
    <div className="max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-[28px] font-semibold tracking-[-0.03em] text-ink">Dashboard</h1>
        <Button href="/admin/articles/new" size="sm">New article</Button>
      </div>

      {volatile ? (
        <p className="mt-6 rounded-md border border-danger/30 bg-[#FDF5F4] p-4 text-[14px] leading-relaxed text-danger" role="alert">
          Content is being saved to the local file system of a serverless host, which is erased between deployments. Connect an Upstash Redis database (UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN) so that articles, submissions and uploads are kept.
        </p>
      ) : null}

      <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-md border border-line bg-white p-5">
            <dt className="kicker text-ink-subtle">{stat.label}</dt>
            <dd className="mt-2 text-[32px] font-semibold tracking-tight text-ink">{stat.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-md border border-line bg-white p-5">
          <h2 className="text-[17px] font-semibold text-ink">Submissions to review</h2>
          {data.pending.length === 0 ? (
            <p className="mt-3 text-sm text-ink-muted">Nothing is waiting for review.</p>
          ) : (
            <ul className="mt-3 divide-y divide-line">
              {data.pending.slice(0, 6).map((item) => (
                <li key={item.id} className="py-3">
                  <Link href={`/admin/submissions/${item.id}`} className="text-[14.5px] font-medium text-ink hover:text-brand">{item.title}</Link>
                  <p className="text-[12.5px] text-ink-subtle">{item.author.name} · {formatDate(item.createdAt)}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="rounded-md border border-line bg-white p-5">
          <h2 className="text-[17px] font-semibold text-ink">Site status</h2>
          <ul className="mt-3 space-y-2 text-[14px] text-ink-muted">
            <li>Storage: <strong className="text-ink">{storageMode === "kv" ? "Upstash Redis" : "Local files"}</strong></li>
            <li>Sample articles: <strong className="text-ink">{data.samples}</strong> {settings.showSampleContent ? "(shown to visitors)" : "(hidden from visitors)"}</li>
            <li>
              Advertising: <strong className="text-ink">{adsAreReady(settings.ads) ? "Configured" : "Not active"}</strong> ({adsRuntime() === "live" ? "production" : adsRuntime() === "test" ? "test mode" : "ads never load in this environment"})
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
