"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { primaryNavigation, utilityNavigation } from "@/config/navigation";
import { Button } from "@/components/ui/Button";
import { PenIcon, SearchIcon } from "@/components/ui/Icons";
import { Logo } from "@/components/ui/Logo";
import { DesktopNavigation } from "./DesktopNavigation";
import { MenuButton } from "./MenuButton";
import { MobileNavigation } from "./MobileNavigation";
import { SearchOverlay } from "./SearchOverlay";

export type NavCategory = { slug: string; name: string };

export function HeaderClient({ categories }: { categories: NavCategory[] }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  const headerRef = useRef<HTMLElement>(null);

  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMenuOpen(false);
    setSearchOpen(false);
  }

  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  useEffect(() => {
    const element = headerRef.current;
    if (!element) return;
    const update = () => document.documentElement.style.setProperty("--header-height", `${element.getBoundingClientRect().height}px`);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
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
      <header ref={headerRef} className="sticky top-0 z-50 border-b border-line bg-white">
        <div className="container-site flex h-16 items-center justify-between gap-4">
          <Logo />
          <DesktopNavigation items={primaryNavigation} categories={categories} className="hidden lg:block" />
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="inline-flex h-10 items-center gap-2 rounded-md px-2.5 text-ink-muted hover:bg-surface-muted hover:text-ink"
              aria-label="Search articles"
            >
              <SearchIcon size={19} />
              <span className="hidden text-[13px] font-medium xl:inline">Search</span>
            </button>
            <Button href={utilityNavigation.writeForUs.href} size="sm" className="hidden md:inline-flex" icon={<PenIcon size={15} />} iconPosition="start">
              {utilityNavigation.writeForUs.label}
            </Button>
            <div className="lg:hidden">
              <MenuButton open={menuOpen} onClick={() => setMenuOpen((value) => !value)} controls={menuId} />
            </div>
          </div>
        </div>
        {menuOpen ? <MobileNavigation id={menuId} items={primaryNavigation} categories={categories} onNavigate={closeMenu} /> : null}
      </header>
      <SearchOverlay open={searchOpen} onClose={closeSearch} categories={categories} />
    </>
  );
}
