import Link from "next/link";
import { footerNavigation } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { Logo } from "@/components/ui/Logo";
import { ArrowUpRightIcon } from "@/components/ui/Icons";

export function Footer() {
  return (
    <footer className="mt-20 bg-brand text-white sm:mt-28">
      <div className="container-site py-14 sm:py-16">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          <div className="max-w-sm">
            <Logo inverse />
            <p className="mt-5 text-[15px] leading-relaxed text-white/70">{siteConfig.tagline}</p>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
              {siteConfig.social.map((link) => (
                <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-medium text-white/80 hover:text-white">
                  {link.label} <ArrowUpRightIcon size={13} />
                </a>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
            {footerNavigation.map((group) => (
              <div key={group.title}>
                <p className="kicker mb-4 text-white/50">{group.title}</p>
                <ul className="space-y-2.5">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-[14.5px] text-white/85 hover:text-white hover:underline">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-14 flex flex-col gap-3 border-t border-white/15 pt-6 text-[13px] text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {siteConfig.foundingYear}-{siteConfig.copyrightYear} {siteConfig.name} Media. Independent and reader supported.
          </p>
          <p>
            Contact <a href={`mailto:${siteConfig.contact.editorial}`} className="text-white/80 hover:text-white">{siteConfig.contact.editorial}</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
