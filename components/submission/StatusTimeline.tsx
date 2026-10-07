import type { ArticleStatus } from "@/types/article";
import { STATUS_FLOW, STATUS_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { CheckIcon } from "@/components/ui/Icons";

export function StatusTimeline({ status }: { status: ArticleStatus }) {
  const currentIndex = STATUS_FLOW.indexOf(status as (typeof STATUS_FLOW)[number]);
  return (
    <ol className="grid gap-3 sm:grid-cols-5 sm:gap-0">
      {STATUS_FLOW.map((step, index) => {
        const done = index < currentIndex;
        const current = index === currentIndex;
        return (
          <li key={step} className="flex items-center gap-3 sm:flex-col sm:items-start sm:gap-2">
            <div className="flex items-center sm:w-full">
              <span className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold", done ? "border-brand bg-brand text-white" : current ? "border-brand bg-white text-brand" : "border-line-strong bg-white text-ink-subtle")}>
                {done ? <CheckIcon size={14} /> : index + 1}
              </span>
              {index < STATUS_FLOW.length - 1 ? <span className={cn("hidden h-0.5 flex-1 sm:block", done ? "bg-brand" : "bg-line")} /> : null}
            </div>
            <span className={cn("text-[13px]", current ? "font-semibold text-brand" : done ? "text-ink" : "text-ink-subtle")}>{STATUS_LABELS[step]}</span>
          </li>
        );
      })}
    </ol>
  );
}
