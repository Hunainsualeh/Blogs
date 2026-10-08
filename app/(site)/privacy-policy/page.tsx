import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getSettings } from "@/lib/blog";
import { siteConfig } from "@/config/site";
import { breadcrumbJsonLd, buildMetadata, JsonLd } from "@/lib/seo";
import { ProsePage } from "@/components/layout/ProsePage";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description: `How ${siteConfig.name} collects, uses and protects information, including cookies, Google AdSense advertising, article submissions and your privacy choices.`,
  path: "/privacy-policy",
});

async function ContactLine() {
  const settings = await getSettings();
  return <a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a>;
}

export default function PrivacyPolicyPage() {
  return (
    <ProsePage title="Privacy Policy" kicker="Legal" updated="October 8, 2026">
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Privacy Policy", path: "/privacy-policy" }])} />

      <p>
        This policy explains what information {siteConfig.name} (&ldquo;we&rdquo;, &ldquo;us&rdquo;) collects when you visit {siteConfig.url.replace(/^https?:\/\//, "")}, how we use it and the choices you have. By using the site you agree to this policy.
      </p>

      <h2>1. Information we collect</h2>
      <h3>Information you give us</h3>
      <ul>
        <li><strong>Article submissions:</strong> if you submit an article through our <Link href="/submit">submission editor</Link>, we collect your name, email address, short bio, optional website or profile link, and the article text, tags and images you upload.</li>
        <li><strong>Email messages:</strong> if you email us, we receive your email address and whatever you choose to include in your message.</li>
      </ul>
      <h3>Information collected automatically</h3>
      <ul>
        <li><strong>Server and hosting logs:</strong> like most websites, our hosting infrastructure records technical data such as IP address, browser type, device type, pages requested and the time of the request. We use this to keep the site secure and working.</li>
        <li><strong>Article view counts:</strong> when you open an article, your browser sends a request that increases an anonymous view counter for that article. The counter stores no personal information. To avoid counting repeat views, your browser remembers in its session storage that you have viewed the article.</li>
        <li><strong>Search:</strong> the words you type in the site search are used to return results. We do not link them to an identity.</li>
      </ul>

      <h2>2. Cookies and similar technologies</h2>
      <p>
        We do not set cookies on ordinary visitors for our own purposes. We use the following browser storage:
      </p>
      <ul>
        <li><strong>Draft storage:</strong> the submission editor saves your unsent draft in your browser&apos;s local storage so you do not lose it. This stays on your device until you submit or clear it.</li>
        <li><strong>Session storage:</strong> used for the anonymous view count described above.</li>
        <li><strong>Staff sign-in cookie:</strong> a security cookie is set only for our editors when they sign in to the administration area.</li>
        <li><strong>Third-party cookies:</strong> advertising partners may set cookies when advertising is enabled. See the section on advertising below.</li>
      </ul>
      <p>You can block or delete cookies and site data in your browser settings. Some parts of the site, such as saved drafts, may not work as expected if you do.</p>

      <h2>3. Analytics</h2>
      <p>
        We do not currently use a third-party analytics service on this site. If we add one in future, we will describe it here and, where the law requires, ask for your consent first.
      </p>

      <h2>4. Advertising and Google AdSense</h2>
      <p>
        We may display advertising on this site served by Google through Google AdSense. Advertising helps us fund the site, and ads are labelled as advertisements.
      </p>
      <ul>
        <li>Third-party vendors, including Google, use cookies to serve ads based on a user&apos;s prior visits to this website or other websites.</li>
        <li>Google&apos;s use of advertising cookies enables it and its partners to serve ads to you based on your visit to this site and/or other sites on the internet.</li>
        <li>Google and its partners may collect and use information such as your IP address, cookie identifiers and information about the pages you view, to show ads, measure their performance and prevent fraud.</li>
      </ul>
      <p>
        You can opt out of personalized advertising by visiting <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>. You can also opt out of some third-party vendors&apos; use of cookies for personalized advertising at <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer">www.aboutads.info</a>. To learn how Google uses information from sites that use its services, see <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">How Google uses information from sites or apps that use our services</a>.
      </p>

      <h2>5. Consent and your advertising choices</h2>
      <p>
        If you visit from the European Economic Area, the United Kingdom or Switzerland, we use a Google-certified consent management solution so that you can accept or decline cookies and similar technologies used for personalized advertising before they are used. Where advertising is active, a &ldquo;Privacy and ad choices&rdquo; link in the page footer lets you review or change your choice at any time. If you decline personalized ads, you may still see non-personalized ads.
      </p>

      <h2>6. How we use information</h2>
      <ul>
        <li>To review, edit, publish and credit contributor articles, and to contact contributors about their submissions.</li>
        <li>To respond to messages, corrections and privacy requests.</li>
        <li>To operate, secure and improve the site, and to prevent spam and abuse.</li>
        <li>To display advertising, as described above.</li>
        <li>To meet legal obligations.</li>
      </ul>

      <h2>7. Article submissions</h2>
      <p>
        Your email address is used only to contact you about your submission and is never published. If we publish your article, we publish your name, short bio and, if you provided one, your website or profile link, as your byline. Submissions we do not publish are kept while we review them and for a reasonable period afterwards, and we will delete a submission and the related personal information if you ask.
      </p>

      <h2>8. Sharing of information</h2>
      <p>
        We do not sell your personal information. We share information only with service providers that host and operate the site, with advertising partners as described above, and where required by law or to protect our rights and users.
      </p>

      <h2>9. Data retention and security</h2>
      <p>
        We keep personal information only as long as needed for the purposes in this policy or as required by law. We use reasonable technical and organisational measures to protect the information we hold, including restricted access to our administration area. No method of transmission or storage is completely secure, so we cannot guarantee absolute security.
      </p>

      <h2>10. External links and embedded media</h2>
      <p>
        Articles may link to other websites. We do not control those sites and are not responsible for their content or privacy practices. Video embeds, such as YouTube or Vimeo, load only after you choose to play them, and they are then subject to the provider&apos;s own privacy policy.
      </p>

      <h2>11. Children</h2>
      <p>
        The site is intended for a general audience and is not directed to children under 13. We do not knowingly collect personal information from children. If you believe a child has given us personal information, contact us and we will delete it.
      </p>

      <h2>12. Your privacy rights</h2>
      <p>
        Depending on where you live, you may have the right to access, correct or delete the personal information we hold about you, to object to or restrict certain processing, to withdraw consent, and to complain to your data protection authority. Residents of some US states have similar rights, including the right to know what is collected and to request deletion. To make a request, contact us at the address below and we will respond within the time required by law.
      </p>

      <h2>13. Changes to this policy</h2>
      <p>
        We may update this policy from time to time. The date at the top shows when it was last changed. Continued use of the site after a change means you accept the updated policy.
      </p>

      <h2>14. Contact us</h2>
      <p>
        Questions or requests about this policy can be sent to{" "}
        <Suspense fallback="our contact page">
          <ContactLine />
        </Suspense>{" "}
        or through our <Link href="/contact">contact page</Link>.
      </p>
    </ProsePage>
  );
}
