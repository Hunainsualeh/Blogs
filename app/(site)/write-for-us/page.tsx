import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAllCategories, getSettings } from "@/lib/blog";
import { SUBMISSION_LIMITS } from "@/lib/constants";
import { categoryHref } from "@/lib/routes";
import { unsplash } from "@/lib/images";
import { siteConfig } from "@/config/site";
import { breadcrumbJsonLd, buildMetadata, JsonLd } from "@/lib/seo";
import { ProsePage } from "@/components/layout/ProsePage";
import { Button } from "@/components/ui/Button";
import { PenIcon } from "@/components/ui/Icons";

export const metadata: Metadata = buildMetadata({
  title: "Write for Us",
  description: `Write for ${siteConfig.name}. Read our contributor guidelines, accepted topics, article requirements and editorial review process, then submit your original article.`,
  path: "/write-for-us",
});

const contents = [
  { href: "#guidelines", label: "Submission Guidelines" },
  { href: "#links", label: "Links and Promotion" },
  { href: "#benefits", label: "Benefits For Contributors" },
  { href: "#how-to-submit", label: "How to Submit" },
];

export default async function WriteForUsPage() {
  const [categories, settings] = await Promise.all([getAllCategories(), getSettings()]);
  const topicList = categories.map((category) => category.name).join(", ");
  return (
    <ProsePage
      title="Write for Us"
      banner={
        <div className="relative aspect-[16/6] overflow-hidden rounded-[28px] bg-surface-muted">
          <Image src={unsplash("1455390582262-044cdead277a")} alt="A pen resting on a notebook beside a keyboard" fill priority sizes="(min-width: 1200px) 1120px, 100vw" className="object-cover" />
        </div>
      }
    >
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Write for Us", path: "/write-for-us" }])} />

      <h2 className="!mt-0">Write for Us in Our Magazine: {topicList}</h2>

      <details open className="w-fit min-w-[240px] rounded-sm border border-line bg-surface-muted px-5 py-4 text-[15px] leading-normal">
        <summary className="cursor-pointer font-semibold text-ink">Contents</summary>
        <ol className="mt-3 space-y-1.5">
          {contents.map((item) => (
            <li key={item.href}>
              <a href={item.href}>{item.label}</a>
            </li>
          ))}
        </ol>
      </details>

      <p>
        When you write for us, choose your topic carefully. We welcome well-written articles from guest writers on the subjects our readers care about. Your article should be fresh and must not have been published anywhere else on the internet, including your own website.
      </p>
      <p>
        We add every contributor&apos;s name and short bio to their article, along with a link to their own website or profile. If you would like to write for {siteConfig.name}, read the guidelines below and send your article through our{" "}
        <Link href="/submit">submission editor</Link>.
      </p>
      <p>We look forward to hearing from you.</p>

      <h2 id="guidelines">Submission Guidelines:</h2>
      <p><strong>– Original Article:</strong> Please submit only original, non-plagiarized articles. We do not accept articles that have been published or submitted anywhere else online, including personal blogs and social media, or that you plan to distribute to other websites. Please do not send advertorials or articles that promote a specific brand or product.</p>
      <p>
        <strong>– Topics:</strong> The topic must be directly related to one of our categories. We are currently accepting submissions in:{" "}
        {categories.map((category, index) => (
          <span key={category.slug}>
            <Link href={categoryHref(category.slug)}>{category.name}</Link>
            {index < categories.length - 1 ? ", " : "."}
          </span>
        ))}
      </p>
      <p><strong>– Recommended Article Length:</strong> 800 to 2,000 words. We require at least {SUBMISSION_LIMITS.minWords} words.</p>
      <p><strong>– Formatting:</strong> Give readers a clear takeaway or lesson. Use headings, subheadings and numbered or bulleted lists to structure your writing. Our editor includes ready-made templates.</p>
      <p><strong>– Short Paragraphs:</strong> Use short paragraphs of no more than 3 to 4 sentences each.</p>
      <p><strong>– Accuracy:</strong> Include facts, research, sources or personal experience to support your points, and link to credible sources where it helps the reader.</p>
      <p><strong>– Multimedia:</strong> Add a featured image and descriptive alt text for every image. You must own the image or have the right to use it. If an image is under a license, give an image credit. JPG, PNG or WebP up to 4 MB.</p>
      <p><strong>– Editorial Rights:</strong> We reserve the right to edit articles for clarity, length and style, and to decline articles that do not meet our standards. You accept that our editorial team may edit your work.</p>

      <h2 id="links">Links and Promotion:</h2>
      <p><strong>– Linking Out:</strong> Link to credible sources that help the reader. We do not allow links to commercial websites inside articles, and we do not accept paid, affiliate or irrelevant links.</p>
      <p><strong>– Internal Linking:</strong> Link to related {siteConfig.name} articles where it is helpful to the reader.</p>
      <p><strong>– What We Do Not Accept:</strong> Spam, sponsored posts, copied or spun content, unedited AI-generated text, thin or repetitive articles, and illegal, hateful, adult, gambling or misleading health and financial content.</p>

      <h2 id="benefits">Benefits For Contributors:</h2>
      <p>• <strong>Build your reputation.</strong> Your name and bio appear on every article we publish for you.</p>
      <p>• A link to your personal website or social profile in your author bio. The link is marked so that it does not pass search ranking credit.</p>
      <p>• Editorial feedback from our team before your article goes live.</p>

      <h2 id="how-to-submit">How to Submit:</h2>
      <p>Write your article in our online editor. Your draft saves automatically in your browser while you work.</p>
      <p>Add your title, a short description, a category, tags and a featured image, then give us your name, email address and a short author bio of up to {SUBMISSION_LIMITS.bioMax} characters. Your email is seen only by our editors and is never published.</p>
      <p>When you submit, you receive a submission ID. An editor reads each submission, checks it against our <Link href="/about#standards">editorial standards</Link> and decides whether to approve it, ask for changes or decline it. We aim to reply within 5 to 7 working days. Submitting does not guarantee publication, and nothing is published until an editor approves it.</p>
      <p className="!mt-6">
        <Button href="/submit" icon={<PenIcon size={16} />} iconPosition="start" className="!text-white !no-underline">Submit an article</Button>
      </p>
      <p>
        If you have a question before you write, email <a href={`mailto:${settings.contributorEmail}`}>{settings.contributorEmail}</a>.
      </p>
    </ProsePage>
  );
}
