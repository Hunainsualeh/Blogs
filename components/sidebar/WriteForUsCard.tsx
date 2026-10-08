import { Button } from "@/components/ui/Button";
import { PenIcon } from "@/components/ui/Icons";

export function WriteForUsCard() {
  return (
    <section aria-label="Write for Us" className="rounded-sm bg-dark p-6 text-white">
      <p className="kicker text-white/60">Contributors</p>
      <h2 className="mt-2 text-[21px] font-semibold leading-tight tracking-[-0.02em]">Write for Global Insights Daily</h2>
      <p className="mt-3 text-[14.5px] leading-relaxed text-white/75">Share original, well-researched articles with our readers. Every submission is reviewed by our editors.</p>
      <Button href="/write-for-us" size="sm" className="mt-5" icon={<PenIcon size={15} />} iconPosition="start">
        Write for Us
      </Button>
    </section>
  );
}
