import Image from "next/image";
import type { Author } from "@/types/user";
import { cn } from "@/lib/utils";

export function AuthorInfo({ author, className }: { author: Author; className?: string }) {
  return (
    <section aria-label="About the author" className={cn("flex flex-col gap-5 rounded-md border border-line p-6 sm:flex-row sm:p-8", className)}>
      <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-surface-muted">
        <Image src={author.avatar} alt={author.name} fill sizes="64px" className="object-cover" />
      </span>
      <div>
        <p className="kicker text-ink-subtle">Written by</p>
        <p className="mt-1 text-xl font-semibold tracking-tight text-ink">{author.name}</p>
        <p className="text-sm text-brand">{author.role}{author.location ? ` · ${author.location}` : ""}</p>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">{author.bio}</p>
        {author.social?.length ? (
          <div className="mt-4 flex gap-4">
            {author.social.map((link) => (
              <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-brand hover:underline">
                {link.label}
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
