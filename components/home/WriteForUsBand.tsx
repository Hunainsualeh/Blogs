import { Button } from "@/components/ui/Button";
import { ArrowRightIcon, PenIcon } from "@/components/ui/Icons";

const points = [
  { title: "Original ideas", body: "Fresh articles that have not been published elsewhere." },
  { title: "Useful to readers", body: "Clear, practical writing built on real knowledge." },
  { title: "Editor reviewed", body: "Every submission is read by our editors first." },
];

export function WriteForUsBand() {
  return (
    <section aria-labelledby="write-heading" className="rounded-sm bg-dark p-6 text-white sm:p-8">
      <p className="kicker mb-2 text-white/60">Contributors</p>
      <h2 id="write-heading" className="text-[26px] font-semibold leading-tight tracking-[-0.025em]">Write for Global Insights Daily</h2>
      <p className="mt-3 max-w-xl text-[15.5px] leading-relaxed text-white/75">
        We welcome original articles on technology, business, health, travel and more from writers who know their subject.
      </p>
      <ul className="mt-6 grid gap-3 sm:grid-cols-3">
        {points.map((point) => (
          <li key={point.title} className="rounded-sm border border-white/15 p-4">
            <p className="text-[15px] font-semibold">{point.title}</p>
            <p className="mt-1 text-[13.5px] leading-relaxed text-white/70">{point.body}</p>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button href="/write-for-us" icon={<ArrowRightIcon size={16} />}>Read the guidelines</Button>
        <Button href="/submit" variant="inverse" icon={<PenIcon size={16} />} iconPosition="start">Submit an article</Button>
      </div>
    </section>
  );
}
