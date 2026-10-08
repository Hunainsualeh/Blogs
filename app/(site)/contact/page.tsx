import type { Metadata } from "next";
import { Suspense } from "react";
import { getSettings } from "@/lib/blog";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import { ProsePage } from "@/components/layout/ProsePage";

export const metadata: Metadata = buildMetadata({
  title: "Contact Us",
  description: `Contact the ${siteConfig.name} team about corrections, partnerships, privacy requests or contributing an article.`,
  path: "/contact",
});

async function ContactDetails() {
  const settings = await getSettings();
  return (
    <>
      <h2>General enquiries</h2>
      <p>
        For questions, corrections, partnership requests or privacy requests, email <a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a>.
      </p>
      <h2>Contributors</h2>
      <p>
        If you would like to write for us, read the <a href="/write-for-us">contributor guidelines</a> and send your article through the <a href="/submit">submission editor</a>. Questions about a submission can be sent to <a href={`mailto:${settings.contributorEmail}`}>{settings.contributorEmail}</a>.
      </p>
    </>
  );
}

export default function ContactPage() {
  return (
    <ProsePage title="Contact Us" kicker="Contact" intro="We read every message and reply as quickly as we can.">
      <Suspense>
        <ContactDetails />
      </Suspense>
      <h2>Reporting a problem</h2>
      <p>If you believe an article contains an error or infringes your rights, tell us which page it is and what needs to change so we can look into it.</p>
    </ProsePage>
  );
}
