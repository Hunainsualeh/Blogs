"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { primaryNavigation, utilityNavigation } from "@/config/navigation";
import { Button } from "@/components/ui/Button";
import { BoltIcon, PenIcon, SearchIcon } from "@/components/ui/Icons";
import { Logo } from "@/components/ui/Logo";
import { CategoryBar } from "./CategoryBar";
import { DesktopNavigation } from "./DesktopNavigation";
import { MenuButton } from "./MenuButton";
import { MobileNavigation } from "./MobileNavigation";
import { SearchOverlay } from "./SearchOverlay";

export type NavCategory = { slug: string; name: string };

const dateFormatter = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

function subscribeNothing() {
  return () => undefined;
}

function readToday() {
  return dateFormatter.format(new Date());
}

export function HeaderClient({ categories, breaking }: { categories: NavCategory[]; breaking: { title: string; href: string } | null }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  const [stuck, setStuck] = useState(false);
  const today = useSyncExternalStore(subscribeNothing, readToday, () => "");
  const stickyRef = useRef<HTMLDivElement>(null);

  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMenuOpen(false);
    setSearchOpen(false);
  }

  useEffect(() => {
    if (!menuOpen) return;
    const bottom = stickyRef.current?.getBoundingClientRect().bottom ?? 96;
    document.documentElement.style.setProperty("--menu-top", `${bottom}px`);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  useEffect(() => {
    const element = stickyRef.current;
    if (!element) return;
    const update = () => document.documentElement.style.setProperty("--header-height", `${element.getBoundingClientRect().height}px`);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const element = stickyRef.current;
    if (!element) return;
    function onScroll() {
      const top = element?.getBoundingClientRect().top ?? 1;
      setStuck(top <= 0.5);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const menuId = "site-menu";

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-brand focus:px-4 focus:py-2 focus:text-white">
        Skip to content
      </a>
      <div className="border-b border-line bg-white">
        <div className="container-site flex h-10 items-center gap-4 text-[13px]">
          <span className="hidden shrink-0 text-ink-muted md:block md:min-w-[190px]" suppressHydrationWarning>{today}</span>
          {breaking ? (
            <div className="flex min-w-0 flex-1 items-center">
              <span className="flex h-10 shrink-0 items-center gap-1.5 bg-brand px-3 text-[12px] font-medium text-white">
                <BoltIcon size={14} />
                <span className="hidden sm:inline">Breaking News</span>
              </span>
              <Link href={breaking.href} className="truncate pl-3 text-ink hover:text-brand">{breaking.title}</Link>
            </div>
          ) : null}
        </div>
      </div>

      <div className="hidden bg-white py-6 text-center lg:block">
        <Logo size="lg" />
      </div>

      <div ref={stickyRef} className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${stuck ? "shadow-[0_8px_18px_-12px_rgba(0,0,0,0.35)]" : ""}`}>
        <div className="flex h-14 items-center justify-between border-b border-line px-4 lg:hidden">
          <MenuButton open={menuOpen} onClick={() => setMenuOpen((value) => !value)} controls={menuId} />
          <Logo size="sm" />
          <button type="button" onClick={() => setSearchOpen(true)} className="inline-flex h-10 w-10 items-center justify-center text-ink hover:text-brand" aria-label="Search articles">
            <SearchIcon size={20} />
          </button>
        </div>
        <div className="container-site hidden lg:block">
          <div className="flex items-stretch justify-between bg-dark">
            <DesktopNavigation items={primaryNavigation} />
            <div className="flex items-center gap-3 pr-3">
              <button type="button" onClick={() => setSearchOpen(true)} className="flex h-9 w-[200px] items-center justify-between rounded-full bg-white/10 px-4 text-[13px] text-white/70 hover:bg-white/15" aria-label="Search articles">
                Search for
                <SearchIcon size={16} />
              </button>
              <Button href={utilityNavigation.writeForUs.href} size="sm" className="!h-9 !rounded-full !border-white !px-4 shadow-[0_0_0_3px_rgba(255,255,255,0.14)]" icon={<PenIcon size={14} />} iconPosition="start">
                {utilityNavigation.writeForUs.label}
              </Button>
            </div>
          </div>
        </div>
        <div className="border-b border-line bg-white lg:border-b-0 lg:bg-transparent">
          <div className="container-site !px-0 lg:!px-10">
            <CategoryBar categories={categories} className="lg:border-x lg:border-b lg:border-line lg:bg-white" />
          </div>
        </div>
        {menuOpen ? <MobileNavigation id={menuId} items={primaryNavigation} categories={categories} onNavigate={closeMenu} /> : null}
      </div>
      <SearchOverlay open={searchOpen} onClose={closeSearch} categories={categories} />
    </>
  );
}
