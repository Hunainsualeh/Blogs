"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/Logo";
import { adminRequest } from "./api";

const items = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/articles", label: "Articles" },
  { href: "/admin/submissions", label: "Submissions" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/advertising", label: "Advertising" },
  { href: "/admin/settings", label: "Settings" },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    await adminRequest("POST", "/api/admin/logout");
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <aside className="border-b border-line bg-white lg:min-h-screen lg:border-b-0 lg:border-r">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 px-4 py-4 lg:block lg:p-6">
        <Logo />
        <nav aria-label="Admin" className="flex flex-wrap gap-1 lg:mt-8 lg:flex-col">
          {items.map((item) => {
            const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} className={cn("rounded-md px-3 py-2 text-[14px] font-medium", active ? "bg-brand-soft text-brand" : "text-ink-muted hover:bg-surface-muted hover:text-ink")}>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex gap-4 text-[13px] lg:mt-8 lg:flex-col lg:gap-2">
          <Link href="/" target="_blank" className="text-ink-muted hover:text-ink">View site</Link>
          <button type="button" onClick={signOut} className="text-left text-ink-muted hover:text-danger">Sign out</button>
        </div>
      </div>
    </aside>
  );
}
