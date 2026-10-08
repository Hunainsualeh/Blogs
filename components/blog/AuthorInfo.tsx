import type { Author } from "@/types/user";
import { cn } from "@/lib/utils";

export function AuthorInfo({ author, className }: { author: Author; className?: string }) {
  return (
    <section aria-label="About the author" className={cn("flex flex-col gap-4 rounded-md border border-line p-5 sm:flex-row sm:p-6", className)}>
      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-soft text-lg font-semibold text-brand" aria-hidden>
        {author.name.slice(0, 1).toUpperCase()}
      </span>
      <div>
        <p className="kicker text-ink-subtle">Written by</p>
        <p className="mt-1 text-lg font-semibold tracking-tight text-ink">{author.name}</p>
        <p className="text-sm text-brand">{author.role}</p>
        <p className="mt-2.5 text-[14.5px] leading-relaxed text-ink-muted">{author.bio}</p>
        {author.profileUrl ? (
          <a href={author.profileUrl} target="_blank" rel="noopener noreferrer nofollow ugc" className="mt-3 inline-block text-sm font-medium text-brand hover:underline">
            Author website
          </a>
        ) : null}
      </div>
    </section>
  );
}
