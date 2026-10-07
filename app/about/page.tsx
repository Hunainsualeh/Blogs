import type { Metadata } from "next";
import Image from "next/image";
import { authors } from "@/data/authors";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = buildMetadata({
  title: "About",
  description: `About ${siteConfig.name}, our editorial standards and the team behind the stories.`,
  path: "/about",
});

const standards = [
  "We verify facts and link to primary sources wherever possible.",
  "We clearly separate reporting, analysis and opinion.",
  "We correct mistakes quickly and note every correction.",
  "Sponsors and advertisers never influence our coverage.",
];

export default function AboutPage() {
  return (
    <div className="container-site pt-10 sm:pt-14">
      <header className="max-w-3xl">
        <p className="kicker mb-4 text-brand">About</p>
        <h1 className="text-[40px] font-semibold leading-[1.04] tracking-[-0.045em] text-ink sm:text-[58px]">Clear stories about the way we live and work.</h1>
        <p className="mt-5 font-serif text-[19px] leading-relaxed text-ink-muted sm:text-[21px]">{siteConfig.description}</p>
      </header>

      <section id="standards" className="mt-20 scroll-mt-32">
        <SectionHeading title="Editorial standards" />
        <ul className="grid gap-4 sm:grid-cols-2">
          {standards.map((item) => (
            <li key={item} className="rounded-md border border-line p-5 text-[15.5px] leading-relaxed text-ink">{item}</li>
          ))}
        </ul>
      </section>

      <section className="mt-20">
        <SectionHeading title="Our team" />
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {authors.map((author) => (
            <div key={author.id} id={author.slug} className="flex gap-4 scroll-mt-32">
              <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-surface-muted">
                <Image src={author.avatar} alt={author.name} fill sizes="64px" className="object-cover" />
              </span>
              <div>
                <p className="text-[17px] font-semibold tracking-tight text-ink">{author.name}</p>
                <p className="text-[13px] text-brand">{author.role}</p>
                <p className="mt-2 text-[14px] leading-relaxed text-ink-muted">{author.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="mt-20 scroll-mt-32">
        <SectionHeading title="Contact" />
        <dl className="grid gap-6 sm:grid-cols-3">
          <div><dt className="kicker text-ink-subtle">Editorial</dt><dd className="mt-1"><a className="text-brand hover:underline" href={`mailto:${siteConfig.contact.editorial}`}>{siteConfig.contact.editorial}</a></dd></div>
          <div><dt className="kicker text-ink-subtle">Contributors</dt><dd className="mt-1"><a className="text-brand hover:underline" href={`mailto:${siteConfig.contact.contributors}`}>{siteConfig.contact.contributors}</a></dd></div>
          <div><dt className="kicker text-ink-subtle">Address</dt><dd className="mt-1 text-ink">{siteConfig.contact.address}</dd></div>
        </dl>
      </section>
    </div>
  );
}
