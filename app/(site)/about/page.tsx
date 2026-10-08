import type { Metadata } from "next";
import Link from "next/link";
import { getAllCategories } from "@/lib/blog";
import { categoryHref } from "@/lib/routes";
import { siteConfig } from "@/config/site";
import { breadcrumbJsonLd, buildMetadata, JsonLd } from "@/lib/seo";
import { ProsePage } from "@/components/layout/ProsePage";

export const metadata: Metadata = buildMetadata({
  title: "About Us",
  description: `Learn about ${siteConfig.name}: our mission, the topics we cover, how we work with contributors and the editorial standards behind every article.`,
  path: "/about",
});

export default async function AboutPage() {
  const categories = await getAllCategories();
  return (
    <ProsePage
      title="About Us"
      kicker="About"
      intro={`${siteConfig.name} is an online magazine that publishes clear, useful articles on the subjects people search for every day.`}
    >
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "About Us", path: "/about" }])} />

      <h2>Who we are</h2>
      <p>
        {siteConfig.name} is an independent publication built around readable, well-organised articles. We publish work written by our own editorial team and by contributors who bring first-hand knowledge of their subject.
      </p>
      <p>
        We built the site for readers who want a straight answer without wading through filler. Each article is structured with a clear introduction, descriptive headings and a conclusion, so you can scan it or read it end to end.
      </p>

      <h2>Our mission</h2>
      <p>
        Our purpose is to help readers understand a topic, make a decision or learn something new. We aim to publish information that is accurate, original and written for people first, rather than for search engines.
      </p>

      <h2>What we cover</h2>
      <p>Our editorial focus spans the following categories:</p>
      <ul>
        {categories.map((category) => (
          <li key={category.slug}>
            <Link href={categoryHref(category.slug)}>{category.name}</Link>: {category.tagline}
          </li>
        ))}
      </ul>

      <h2>Our commitment to original content</h2>
      <p>
        Every article we publish must be written for {siteConfig.name} and must not appear elsewhere. We do not publish copied, spun or mass-produced text. Contributors confirm that their work is their own, and we do not accept articles whose main purpose is to promote a product, a brand or a link.
      </p>

      <h2 id="contributors">How our contributor model works</h2>
      <p>
        Alongside our editors we welcome articles from outside writers through our <Link href="/write-for-us">Write for Us</Link> program. Writers submit a complete article through our online editor, and our editors decide whether it fits the site. Nothing a contributor submits is published automatically. A submission is only published after an editor has reviewed and approved it.
      </p>
      <p>
        Contributors are credited with a byline and a short bio. Links to a writer&apos;s own website or profile appear only in that bio and are marked so that they do not pass search ranking credit.
      </p>

      <h2 id="standards">Editorial review and quality standards</h2>
      <p>Before an article goes live, an editor checks that it meets these standards:</p>
      <ul>
        <li>The piece is original, useful and written for readers rather than for rankings.</li>
        <li>Facts, figures and claims are supported, and sources are linked where they help the reader.</li>
        <li>The article is well structured, with clear headings, short paragraphs and descriptive image text.</li>
        <li>It contains no spam, undisclosed promotion or irrelevant outbound links.</li>
        <li>Images are used with the right to publish them and are credited where required.</li>
      </ul>
      <p>
        We may edit submissions for clarity, length and style, and we may decline articles that do not meet these standards. If you spot an error in something we have published, please <Link href="/contact">contact us</Link> and we will review it and correct it where needed.
      </p>

      <h2>Advertising</h2>
      <p>
        We may fund the site through advertising, including ads served by Google AdSense. Advertising is always labelled and kept separate from our articles, and advertisers have no influence over what we publish. You can read more about how advertising affects your data in our <Link href="/privacy-policy">Privacy Policy</Link>.
      </p>

      <h2>Get in touch</h2>
      <p>
        Questions, corrections and partnership enquiries are welcome through our <Link href="/contact">contact page</Link>. If you would like to write for us, start with the <Link href="/write-for-us">contributor guidelines</Link>.
      </p>
    </ProsePage>
  );
}
