import Link from "next/link";
import { footerCompanyLinks } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { getAllCategories, getPopularArticles, getSettings } from "@/lib/blog";
import { articleHref, categoryHref } from "@/lib/routes";
import { AdChoices } from "@/components/ads/AdChoices";
import { Logo } from "@/components/ui/Logo";

export async function Footer() {
  const [categories, popular, settings] = await Promise.all([getAllCategories(), getPopularArticles(4), getSettings()]);
  return (
    <footer className="mt-16 bg-dark text-white">
      <div className="container-site py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_0.8fr]">
          <div>
            <h2 className="mb-4 text-[16px] font-semibold">About Us</h2>
            <Logo size="sm" inverse className="mb-3" />
            <p className="text-[14px] leading-relaxed text-white/70">{siteConfig.tagline} We publish original articles from our editors and contributors.</p>
            <p className="mt-3 text-[14px] text-white/70">
              Questions? Email <a href={`mailto:${settings.contactEmail}`} className="text-white underline underline-offset-2">{settings.contactEmail}</a>
            </p>
          </div>
          <nav aria-label="Popular posts">
            <h2 className="mb-4 text-[16px] font-semibold">Popular Posts</h2>
            <ol className="space-y-3.5">
              {popular.map((article, index) => (
                <li key={article.id} className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-[12px] font-semibold" aria-hidden>{index + 1}</span>
                  <Link href={articleHref(article.slug)} className="line-clamp-3 text-[14px] leading-snug text-white/85 hover:text-white hover:underline">
                    {article.title}
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
          <nav aria-label="Categories">
            <h2 className="mb-4 text-[16px] font-semibold">Categories</h2>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link href={categoryHref(category.slug)} className="text-[14px] text-white/80 hover:text-white hover:underline">
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Company">
            <h2 className="mb-4 text-[16px] font-semibold">Quick Links</h2>
            <ul className="space-y-2.5">
              {footerCompanyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[14px] text-white/80 hover:text-white hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-site flex flex-col gap-3 py-5 text-[13px] text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {siteConfig.copyrightYear} {siteConfig.name}. All rights reserved.</p>
          <p className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href="/" className="hover:text-white">Home</Link>
            <Link href="/about" className="hover:text-white">About Us</Link>
            <Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/sitemap.xml" className="hover:text-white">Sitemap</Link>
            <Link href="/contact" className="hover:text-white">Contact Us</Link>
            <AdChoices className="hover:text-white" />
          </p>
        </div>
      </div>
    </footer>
  );
}
