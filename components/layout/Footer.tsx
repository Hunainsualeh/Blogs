import Link from "next/link";
import { footerCompanyLinks } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { getAllCategories } from "@/lib/blog";
import { categoryHref } from "@/lib/routes";
import { AdChoices } from "@/components/ads/AdChoices";
import { Logo } from "@/components/ui/Logo";

export async function Footer() {
  const categories = await getAllCategories();
  return (
    <footer className="mt-20 bg-brand text-white sm:mt-24">
      <div className="container-site py-12 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1.6fr_1fr]">
          <div className="max-w-sm">
            <Logo inverse />
            <p className="mt-4 text-[14.5px] leading-relaxed text-white/75">{siteConfig.tagline}</p>
          </div>
          <nav aria-label="Categories">
            <p className="kicker mb-4 text-white/55">Categories</p>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5 sm:grid-cols-3">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link href={categoryHref(category.slug)} className="text-[14.5px] text-white/85 hover:text-white hover:underline">
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Company">
            <p className="kicker mb-4 text-white/55">Global Insights Daily</p>
            <ul className="space-y-2.5">
              {footerCompanyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[14.5px] text-white/85 hover:text-white hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-white/15 pt-6 text-[13px] text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {siteConfig.copyrightYear} {siteConfig.name}. All rights reserved.
          </p>
          <p className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/sitemap.xml" className="hover:text-white">Sitemap</Link>
            <AdChoices className="hover:text-white" />
          </p>
        </div>
      </div>
    </footer>
  );
}
