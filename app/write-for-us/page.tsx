import type { Metadata } from "next";
import Image from "next/image";
import { getAllCategories } from "@/lib/blog";
import { SUBMISSION_LIMITS } from "@/lib/constants";
import { unsplash } from "@/lib/images";
import { buildMetadata } from "@/lib/seo";
import { Button } from "@/components/ui/Button";
import { ArrowRightIcon, CheckIcon, PenIcon } from "@/components/ui/Icons";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = buildMetadata({
  title: "Write for Us",
  description: "Pitch and submit original articles to Northline. Read our guidelines, image requirements and editorial review process.",
  path: "/write-for-us",
});

const guidelines = [
  { title: "Original and unpublished", body: "Your article must be your own work and not published anywhere else, including your own blog. AI-generated drafts are not accepted." },
  { title: "Useful and specific", body: "Teach readers something, share real experience or offer a clear argument. Practical examples beat general advice." },
  { title: "Well structured", body: "Use a strong introduction, clear section headings and short paragraphs. Our editor gives you ready-made templates." },
  { title: "Accurate and sourced", body: "Link to credible sources for facts and figures. We fact-check every submission before it is published." },
];

const requirements = [
  `At least ${SUBMISSION_LIMITS.minWords} words, ideally 800 to 2,000`,
  `A clear title of ${SUBMISSION_LIMITS.titleMin} to ${SUBMISSION_LIMITS.titleMax} characters`,
  "A short description that summarizes the article",
  `Up to ${SUBMISSION_LIMITS.maxTags} relevant tags`,
  "A short author bio and a valid email address",
  "No promotional content or paid links",
];

const imageRules = [
  "A featured image is required for every article",
  "JPG, PNG or WebP, up to 4 MB each",
  "Landscape images of at least 1600 pixels wide look best",
  "You must own the image or have the right to use it",
  "Every image needs descriptive alt text",
];

const process = [
  { step: "01", title: "Write and preview", body: "Use our editor to build your article with text, headings, images and quotes. Preview exactly how it will look." },
  { step: "02", title: "Submit for review", body: "Your article is checked automatically for completeness, then sent to our editors with a submission ID." },
  { step: "03", title: "Editorial review", body: "An editor reads every submission within 5 to 7 working days and may suggest edits or request changes." },
  { step: "04", title: "Publication", body: "Approved articles are scheduled and published with your byline, bio and profile link." },
];

export default function WriteForUsPage() {
  const categories = getAllCategories();
  return (
    <div>
      <section className="container-site grid gap-10 pt-10 sm:pt-14 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-16">
        <div>
          <p className="kicker mb-4 text-brand">Contributors</p>
          <h1 className="text-[40px] font-semibold leading-[1.02] tracking-[-0.045em] text-ink sm:text-[60px]">Write for Northline</h1>
          <p className="mt-5 max-w-xl font-serif text-[19px] leading-relaxed text-ink-muted sm:text-[21px]">
            We publish original, useful writing from people who know their subject. Share your expertise with readers across tech, business, health, travel and more.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/submit" size="lg" icon={<PenIcon size={18} />} iconPosition="start">Start Writing</Button>
            <Button href="#guidelines" size="lg" variant="outline">Read the guidelines</Button>
          </div>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-surface-muted">
          <Image src={unsplash("1455390582262-044cdead277a")} alt="Fountain pen writing on paper" fill priority sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
        </div>
      </section>

      <section id="guidelines" className="container-site mt-20 scroll-mt-32">
        <SectionHeading title="What we look for" eyebrow="Writing guidelines" />
        <div className="grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2">
          {guidelines.map((item) => (
            <div key={item.title} className="bg-white p-6 sm:p-8">
              <h3 className="text-[19px] font-semibold tracking-tight text-ink">{item.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-site mt-20 grid gap-12 lg:grid-cols-2">
        <div>
          <SectionHeading title="Minimum requirements" as="h2" />
          <ul className="space-y-3">
            {requirements.map((item) => (
              <li key={item} className="flex gap-3 text-[15.5px] text-ink">
                <CheckIcon size={18} className="mt-0.5 shrink-0 text-success" /> {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <SectionHeading title="Image requirements" as="h2" />
          <ul className="space-y-3">
            {imageRules.map((item) => (
              <li key={item} className="flex gap-3 text-[15.5px] text-ink">
                <CheckIcon size={18} className="mt-0.5 shrink-0 text-success" /> {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-site mt-20">
        <SectionHeading title="Categories we accept" eyebrow="Where your article can appear" />
        <div className="grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <div key={category.slug} className="bg-white p-5">
              <p className="text-[17px] font-semibold tracking-tight text-ink">{category.name}</p>
              <p className="mt-1 text-[13.5px] leading-snug text-ink-subtle">{category.tagline}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-20 bg-surface-muted py-16">
        <div className="container-site">
          <SectionHeading title="How the review process works" eyebrow="From draft to published" />
          <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((item) => (
              <li key={item.step}>
                <span className="font-mono text-[28px] font-medium text-brand">{item.step}</span>
                <h3 className="mt-3 text-[18px] font-semibold tracking-tight text-ink">{item.title}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-ink-muted">{item.body}</p>
              </li>
            ))}
          </ol>
          <p className="mt-10 max-w-2xl text-[14.5px] leading-relaxed text-ink-muted">
            Publishing expectations: we may edit for clarity, length and house style, and we will share major changes with you before publication. Published articles remain on Northline and may be updated for accuracy.
          </p>
        </div>
      </section>

      <section className="container-site mt-20">
        <div className="flex flex-col items-start gap-6 rounded-md bg-brand p-8 text-white sm:p-12 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-[30px] font-semibold leading-tight tracking-[-0.035em] sm:text-[38px]">Ready to share your story?</h2>
            <p className="mt-2 max-w-xl text-[16px] text-white/75">Open the editor, pick a template and start writing. Your draft saves automatically in your browser.</p>
          </div>
          <Button href="/submit" size="lg" variant="inverse" icon={<ArrowRightIcon size={18} />}>Start Writing</Button>
        </div>
      </section>
    </div>
  );
}
