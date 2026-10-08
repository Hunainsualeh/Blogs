import { Button } from "@/components/ui/Button";
import { ArrowRightIcon, PenIcon } from "@/components/ui/Icons";

const points = [
  { title: "Original ideas", body: "Fresh articles that have not been published elsewhere." },
  { title: "Useful to readers", body: "Clear, practical writing built on real knowledge and experience." },
  { title: "Editor reviewed", body: "Every submission is read by our editors before anything is published." },
];

export function WriteForUsBand() {
  return (
    <section aria-labelledby="write-heading" className="container-site">
      <div className="grid gap-8 rounded-md border border-line bg-surface-muted p-6 sm:p-10 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-12">
        <div>
          <p className="kicker mb-3 text-brand">Contributors</p>
          <h2 id="write-heading" className="text-[28px] font-semibold leading-tight tracking-[-0.03em] text-ink sm:text-[34px]">Write for Global Insights Daily</h2>
          <p className="mt-3 max-w-xl text-[16px] leading-relaxed text-ink-muted">
            We welcome original articles on technology, business, health, travel and more from writers who know their subject. Read our guidelines and send us your draft.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button href="/write-for-us" icon={<ArrowRightIcon size={16} />}>Read the guidelines</Button>
            <Button href="/submit" variant="outline" icon={<PenIcon size={16} />} iconPosition="start">Submit an article</Button>
          </div>
        </div>
        <ul className="grid gap-4">
          {points.map((point) => (
            <li key={point.title} className="rounded-sm border border-line bg-white p-4">
              <p className="text-[15.5px] font-semibold text-ink">{point.title}</p>
              <p className="mt-1 text-[14px] leading-relaxed text-ink-muted">{point.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
